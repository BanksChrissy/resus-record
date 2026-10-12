// Arithmetic for an explicitly entered order. This module selects no clinical dose,
// concentration, route, maximum, or administration-device rounding.
export const CALCULATOR_VERSION = '1.0.0';
export const DOSE_UNITS = Object.freeze(['g', 'mg', 'micrograms', 'units', 'mEq', 'mmol', 'mL']);

const DELIVERIES = new Set(['Bolus', 'Infusion', 'Timed infusion']);
const MASS_EXPONENTS = Object.freeze({ g: 6, mg: 3, micrograms: 0 });
const DECIMAL = /^\+?(\d+(?:\.\d*)?|\.\d+)(?:[eE]([+-]?\d+))?$/;
const ONE = Object.freeze({ n: 1n, d: 1n });
const SIXTY = Object.freeze({ n: 60n, d: 1n });
const MAX_FINITE_INTEGER = (1n << 1024n) - (1n << 971n);

/** Round-trippable digits expanded to plain decimal, without device rounding. */
export function formatMedicationNumber(value) {
  if (typeof value !== 'number' || !Number.isFinite(value)) return '—';
  if (value === 0) return '0';
  return `${value < 0 ? '-' : ''}${decimalText(parseDecimal(String(Math.abs(value))))}`;
}

function gcd(a, b) {
  while (b) [a, b] = [b, a % b];
  return a;
}

function multiply(a, b) {
  // Cancel before multiplying so large concentrations can cancel large orders.
  const left = gcd(a.n, b.d);
  const right = gcd(b.n, a.d);
  return { n: (a.n / left) * (b.n / right), d: (a.d / right) * (b.d / left) };
}

function divide(a, b) {
  return multiply(a, { n: b.d, d: b.n });
}

function powerOfTen(exponent) {
  return exponent >= 0
    ? { n: 10n ** BigInt(exponent), d: 1n }
    : { n: 1n, d: 10n ** BigInt(-exponent) };
}

function parseDecimal(text) {
  const [, mantissa, exponentText = '0'] = DECIMAL.exec(text);
  const [whole, fraction = ''] = mantissa.split('.');
  let digits = (whole + fraction).replace(/^0+/, '');
  let exponent = Number(exponentText) - fraction.length;
  const shortened = digits.replace(/0+$/, '');
  exponent += digits.length - shortened.length;
  digits = shortened;
  return { digits, exponent, ratio: multiply({ n: BigInt(digits), d: 1n }, powerOfTen(exponent)) };
}

function decimalText({ digits, exponent }) {
  const position = digits.length + exponent;
  if (position <= 0) return '0.' + '0'.repeat(-position) + digits;
  return position >= digits.length
    ? digits + '0'.repeat(position - digits.length)
    : digits.slice(0, position) + '.' + digits.slice(position);
}

function numericRangeError(ratio) {
  if (ratio.n > MAX_FINITE_INTEGER * ratio.d) return 'is too large to represent safely (overflow)';
  if ((ratio.n << 1074n) < ratio.d) return 'is too small to represent safely (underflow)';
  return null;
}

function readPositive(input, label, errors) {
  if (typeof input !== 'number' && typeof input !== 'string') {
    errors.push(`${label} must be a positive decimal number.`);
    return null;
  }
  const text = typeof input === 'string' ? input.trim() : String(input);
  const match = DECIMAL.exec(text);
  if (!text || !match) {
    errors.push(`${label} must be a positive decimal number.`);
    return null;
  }
  if (!/[1-9]/.test(match[1])) {
    errors.push(`${label} must be greater than zero.`);
    return null;
  }
  const value = Number(text);
  if (!Number.isFinite(value)) {
    errors.push(`${label} is outside the finite numeric range (overflow).`);
    return null;
  }
  if (value === 0) {
    errors.push(`${label} is too small to represent safely (underflow).`);
    return null;
  }
  const decimal = parseDecimal(text);
  const rangeError = numericRangeError(decimal.ratio);
  if (rangeError) {
    errors.push(`${label} ${rangeError}.`);
    return null;
  }
  return { ...decimal, value, text: decimalText(decimal) };
}

function roundedQuotient(n, d) {
  const q = n / d;
  const remainder = n % d;
  const twice = remainder * 2n;
  return twice > d || (twice === d && q % 2n !== 0n) ? q + 1n : q;
}

function toNumber(ratio) {
  // Round the exact rational once to IEEE-754, including subnormal values.
  // Converting numerator/denominator separately could overflow or underflow first.
  let exponent = ratio.n.toString(2).length - ratio.d.toString(2).length;
  if (exponent >= 0 ? ratio.n < (ratio.d << BigInt(exponent)) : (ratio.n << BigInt(-exponent)) < ratio.d) exponent--;
  if (exponent < -1022) return Number(roundedQuotient(ratio.n << 1074n, ratio.d)) * Number.MIN_VALUE;
  const shift = 52 - exponent;
  const significand = shift >= 0
    ? roundedQuotient(ratio.n << BigInt(shift), ratio.d)
    : roundedQuotient(ratio.n, ratio.d << BigInt(-shift));
  return Number(significand) * 2 ** (exponent - 52);
}

function sameValue(a, b) {
  return a.n * b.d === b.n * a.d;
}

function displayedExactly(ratio, value) {
  return sameValue(ratio, parseDecimal(formatMedicationNumber(value)).ratio);
}

/**
 * Required numeric fields accept a finite positive number or strict decimal string.
 * Scientific decimal notation is accepted; hex, separators, coercions and units in
 * numeric fields are not. Fields irrelevant to the chosen order are ignored.
 */
export function calculateMedication(input) {
  const errors = [];
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return { ok: false, errors: ['Provide a medication calculation input object.'] };
  }

  const { delivery, doseUnit, perKg, timeUnit } = input;
  if (!DELIVERIES.has(delivery)) errors.push('Choose Bolus, Infusion, or Timed infusion.');
  if (!DOSE_UNITS.includes(doseUnit)) errors.push('Choose a supported dose unit.');
  if (typeof perKg !== 'boolean') errors.push('Specify whether the order is per kilogram.');
  const dose = readPositive(input.dose, 'Dose', errors);

  let weight = null;
  if (perKg === true) {
    weight = readPositive(input.weightKg, 'Weight in kilograms', errors);
    if (weight && weight.ratio.n > 500n * weight.ratio.d) errors.push('Weight must be 500 kg or less.');
    if (input.weightBasis !== 'Measured' && input.weightBasis !== 'Estimated') errors.push('Choose Measured or Estimated for the weight basis.');
  }
  if (delivery === 'Infusion' && timeUnit !== 'min' && timeUnit !== 'hour') errors.push('Choose min or hour for the infusion order.');
  const duration = delivery === 'Timed infusion' ? readPositive(input.durationMinutes, 'Duration in minutes', errors) : null;

  let concentrationAmount = null;
  let concentrationVolume = null;
  let conversion = ONE;
  const concentrationUnit = doseUnit === 'mL' ? null : input.concentrationUnit;
  if (DOSE_UNITS.includes(doseUnit) && doseUnit !== 'mL') {
    concentrationAmount = readPositive(input.concentrationAmount, 'Concentration amount', errors);
    concentrationVolume = readPositive(input.concentrationVolume, 'Final concentration volume in mL', errors);
    if (!DOSE_UNITS.includes(concentrationUnit) || concentrationUnit === 'mL') {
      errors.push('Choose a supported concentration amount unit other than mL.');
    } else if (doseUnit !== concentrationUnit) {
      if (Object.hasOwn(MASS_EXPONENTS, doseUnit) && Object.hasOwn(MASS_EXPONENTS, concentrationUnit)) {
        conversion = powerOfTen(MASS_EXPONENTS[doseUnit] - MASS_EXPONENTS[concentrationUnit]);
      } else {
        errors.push('Dose and concentration units must match; only g, mg, and micrograms can be converted.');
      }
    }
  }
  if (errors.length) return { ok: false, errors };

  const doseRatio = perKg ? multiply(dose.ratio, weight.ratio) : dose.ratio;
  const concentrationRatio = doseUnit === 'mL' ? null : divide(concentrationAmount.ratio, concentrationVolume.ratio);
  const volumeFromDose = amount => concentrationRatio ? divide(multiply(amount, conversion), concentrationRatio) : amount;
  const hourlyRatio = delivery === 'Infusion'
    ? multiply(doseRatio, timeUnit === 'min' ? SIXTY : ONE)
    : delivery === 'Timed infusion' ? divide(multiply(doseRatio, SIXTY), duration.ratio) : null;
  const ratios = {
    doseAmount: doseRatio,
    dosePerHour: hourlyRatio,
    volumeMl: delivery === 'Infusion' ? null : volumeFromDose(doseRatio),
    rateMlHour: hourlyRatio ? volumeFromDose(hourlyRatio) : null,
    concentrationPerMl: concentrationRatio
  };
  const labels = { doseAmount: 'Resolved dose', dosePerHour: 'Hourly dose', volumeMl: 'Volume', rateMlHour: 'Pump rate', concentrationPerMl: 'Concentration per mL' };
  const results = {};
  const approximate = new Set();
  for (const [key, ratio] of Object.entries(ratios)) {
    if (!ratio) { results[key] = null; continue; }
    const rangeError = numericRangeError(ratio);
    if (rangeError) { errors.push(`${labels[key]} ${rangeError}; revise the inputs.`); continue; }
    results[key] = toNumber(ratio);
    if (!Number.isFinite(results[key]) || results[key] <= 0) {
      errors.push(`${labels[key]} cannot be represented as a finite positive number; revise the inputs.`);
    } else if (!displayedExactly(ratio, results[key])) approximate.add(key);
  }
  if (errors.length) return { ok: false, errors };

  const number = key => formatMedicationNumber(results[key]);
  const equals = (...keys) => keys.some(key => approximate.has(key)) ? '≈' : '=';
  const resolved = key => `${approximate.has(key) ? '≈ ' : ''}${number(key)}`;
  const timeSuffix = delivery === 'Infusion' ? `/${timeUnit}` : '';
  const orderedUnits = `${doseUnit}${perKg ? '/kg' : ''}${timeSuffix}`;
  const orderText = `${dose.text} ${orderedUnits}${duration ? ` over ${duration.text} min` : ''}`;
  const resolvedDoseText = delivery === 'Bolus'
    ? `${resolved('doseAmount')} ${doseUnit} total`
    : delivery === 'Infusion'
      ? `${resolved('doseAmount')} ${doseUnit}/${timeUnit} (${resolved('dosePerHour')} ${doseUnit}/hour)`
      : `${resolved('doseAmount')} ${doseUnit} total over ${duration.text} min (${resolved('dosePerHour')} ${doseUnit}/hour)`;
  const concentrationText = concentrationRatio
    ? `${concentrationAmount.text} ${concentrationUnit} in ${concentrationVolume.text} mL final volume ${equals('concentrationPerMl')} ${number('concentrationPerMl')} ${concentrationUnit}/mL`
    : 'Concentration is not used for an mL order.';
  const steps = [perKg
    ? `Absolute dose: ${dose.text} ${orderedUnits} × ${weight.text} kg ${equals('doseAmount')} ${number('doseAmount')} ${doseUnit}${timeSuffix}.`
    : `Entered dose: ${dose.text} ${doseUnit}${timeSuffix}.`];
  if (delivery === 'Infusion' && timeUnit === 'min') {
    steps.push(`Hourly dose: ${number('doseAmount')} ${doseUnit}/min × 60 min/hour ${equals('dosePerHour', 'doseAmount')} ${number('dosePerHour')} ${doseUnit}/hour.`);
  }
  if (concentrationRatio) steps.push(`Concentration: ${concentrationText}.`);
  const conversionText = doseUnit !== 'mL' && doseUnit !== concentrationUnit
    ? ` × ${formatMedicationNumber(toNumber(conversion))} ${concentrationUnit}/${doseUnit}` : '';
  if (conversionText) steps.push(`Mass conversion: 1 ${doseUnit} = ${formatMedicationNumber(toNumber(conversion))} ${concentrationUnit}.`);
  if (delivery === 'Infusion') {
    steps.push(concentrationRatio
      ? `Pump rate: ${number('dosePerHour')} ${doseUnit}/hour${conversionText} ÷ ${number('concentrationPerMl')} ${concentrationUnit}/mL ${equals('rateMlHour', 'dosePerHour', 'concentrationPerMl')} ${number('rateMlHour')} mL/hour.`
      : `Volume rate: ${number('dosePerHour')} mL/hour. No concentration conversion is needed.`);
  } else {
    steps.push(concentrationRatio
      ? `Total volume: ${number('doseAmount')} ${doseUnit}${conversionText} ÷ ${number('concentrationPerMl')} ${concentrationUnit}/mL ${equals('volumeMl', 'doseAmount', 'concentrationPerMl')} ${number('volumeMl')} mL.`
      : `Total volume: ${number('volumeMl')} mL. No concentration conversion is needed.`);
    if (duration) steps.push(`Pump rate: ${number('volumeMl')} mL × 60 min/hour ÷ ${duration.text} min ${equals('rateMlHour', 'volumeMl')} ${number('rateMlHour')} mL/hour.`);
  }
  const warnings = [];
  if (perKg && input.weightBasis === 'Estimated') warnings.push(`The calculation uses an estimated weight of ${weight.text} kg.`);
  if (approximate.size) warnings.push('The approximation sign (≈) marks results beyond exact decimal display precision. No administration-device rounding is applied.');

  return {
    ok: true, errors: [], delivery, ...results, doseUnit,
    concentrationUnit,
    weightKg: perKg ? weight.value : null,
    weightBasis: perKg ? input.weightBasis : null,
    orderText, resolvedDoseText, concentrationText, steps, warnings
  };
}
