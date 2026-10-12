import test from 'node:test';
import assert from 'node:assert/strict';
import { CALCULATOR_VERSION, DOSE_UNITS, calculateMedication, formatMedicationNumber } from '../medication-calculator.mjs';

// These are synthetic arithmetic cases, not suggested clinical orders.
const bolus = Object.freeze({
  delivery: 'Bolus', dose: 2, doseUnit: 'mg', perKg: false,
  concentrationAmount: 5, concentrationUnit: 'mg', concentrationVolume: 1
});
function calculate(patch = {}) {
  const result = calculateMedication({ ...bolus, ...patch });
  assert.equal(result.ok, true, JSON.stringify(result.errors));
  assert.deepEqual(result.errors, []);
  return result;
}
function rejects(patch, pattern) {
  const result = calculateMedication({ ...bolus, ...patch });
  assert.equal(result.ok, false, `Expected rejection for ${String(patch.dose ?? patch.delivery ?? pattern)}`);
  assert.ok(result.errors.length > 0);
  assert.ok(result.errors.every(error => typeof error === 'string' && error.length));
  if (pattern) assert.match(result.errors.join(' '), pattern);
  assert.deepEqual(Object.keys(result).sort(), ['errors', 'ok']);
  return result;
}

test('public unit list and successful result contract are explicit and stable', () => {
  assert.equal(typeof CALCULATOR_VERSION, 'string');
  assert.ok(CALCULATOR_VERSION.length);
  assert.deepEqual(DOSE_UNITS, ['g', 'mg', 'micrograms', 'units', 'mEq', 'mmol', 'mL']);
  const result = calculate();
  assert.deepEqual(Object.keys(result).sort(), [
    'ok', 'errors', 'delivery', 'doseAmount', 'doseUnit', 'dosePerHour',
    'volumeMl', 'rateMlHour', 'concentrationPerMl', 'concentrationUnit',
    'weightKg', 'weightBasis', 'orderText', 'resolvedDoseText',
    'concentrationText', 'steps', 'warnings'
  ].sort());
  assert.ok(result.steps.length > 0);
  assert.ok(result.steps.every(step => typeof step === 'string'));
  assert.ok(result.warnings.every(warning => typeof warning === 'string'));
  for (const key of ['orderText', 'resolvedDoseText', 'concentrationText']) assert.equal(typeof result[key], 'string');
});

test('80 kg, 0.1 micrograms/kg/min, 4 mg in final 250 mL gives 30 mL/hour', () => {
  const r = calculate({
    delivery: 'Infusion', dose: '0.1', doseUnit: 'micrograms', perKg: true,
    timeUnit: 'min', weightKg: '80', weightBasis: 'Measured',
    concentrationAmount: '4', concentrationUnit: 'mg', concentrationVolume: '250'
  });
  assert.equal(r.doseAmount, 8);
  assert.equal(r.dosePerHour, 480);
  assert.equal(r.rateMlHour, 30);
  assert.equal(r.volumeMl, null);
  assert.equal(r.concentrationPerMl, 0.016);
  assert.equal(r.concentrationUnit, 'mg');
  assert.equal(r.weightKg, 80);
  assert.equal(r.weightBasis, 'Measured');
  assert.equal(r.orderText, '0.1 micrograms/kg/min');
  assert.match(r.concentrationText, /250 mL final volume/);
  assert.match(r.steps.join(' '), /0\.001 mg\/micrograms/);
});

test('20 kg, 0.1 mg/kg and 5 mg/mL gives a 2 mg dose in 0.4 mL', () => {
  const r = calculate({ dose: 0.1, perKg: true, weightKg: 20, weightBasis: 'Measured' });
  assert.equal(r.doseAmount, 2);
  assert.equal(r.volumeMl, 0.4);
  assert.equal(r.dosePerHour, null);
  assert.equal(r.rateMlHour, null);
});

test('mass conversion works in both directions without changing the selected dose unit', () => {
  const cases = [
    { dose: 1.5, doseUnit: 'g', concentrationAmount: 300, concentrationUnit: 'mg', concentrationVolume: 2, volume: 10 },
    { dose: 500, doseUnit: 'mg', concentrationAmount: 1, concentrationUnit: 'g', concentrationVolume: 10, volume: 5 },
    { dose: 2.5, doseUnit: 'micrograms', concentrationAmount: 0.05, concentrationUnit: 'mg', concentrationVolume: 1, volume: 0.05 },
    { dose: 0.002, doseUnit: 'mg', concentrationAmount: 4, concentrationUnit: 'micrograms', concentrationVolume: 1, volume: 0.5 }
  ];
  for (const { volume, ...input } of cases) {
    const r = calculate(input);
    assert.equal(r.volumeMl, volume);
    assert.equal(r.doseAmount, input.dose);
    assert.equal(r.doseUnit, input.doseUnit);
  }
});

test('units, mEq and mmol are independent dimensions with same-unit calculations', () => {
  const units = calculate({
    delivery: 'Infusion', dose: 12, doseUnit: 'units', timeUnit: 'hour',
    concentrationAmount: 100, concentrationUnit: 'units', concentrationVolume: 250
  });
  assert.equal(units.dosePerHour, 12);
  assert.equal(units.rateMlHour, 30);
  const equivalents = calculate({ dose: 10, doseUnit: 'mEq', concentrationAmount: 20, concentrationUnit: 'mEq', concentrationVolume: 10 });
  assert.equal(equivalents.volumeMl, 5);
  const molar = calculate({ dose: 2.5, doseUnit: 'mmol', concentrationAmount: 10, concentrationUnit: 'mmol', concentrationVolume: 50 });
  assert.equal(molar.volumeMl, 12.5);
});

test('incompatible dimensions are rejected even when numerically convertible for some drugs', () => {
  for (const [doseUnit, concentrationUnit] of [
    ['units', 'mg'], ['mg', 'units'], ['units', 'mmol'], ['mEq', 'mmol'],
    ['mmol', 'mEq'], ['mEq', 'mg'], ['micrograms', 'mmol']
  ]) rejects({ doseUnit, concentrationUnit }, /units must match/);
});

test('per-hour infusion orders do not receive a second factor of 60', () => {
  const r = calculate({
    delivery: 'Infusion', dose: 0.5, doseUnit: 'mg', perKg: true, timeUnit: 'hour',
    weightKg: 30, weightBasis: 'Measured', concentrationAmount: 3, concentrationVolume: 50
  });
  assert.equal(r.doseAmount, 15);
  assert.equal(r.dosePerHour, 15);
  assert.equal(r.rateMlHour, 250);
  assert.equal(r.volumeMl, null);
});

test('timed infusion reports total dose/volume separately from hourly dose/rate', () => {
  const r = calculate({
    delivery: 'Timed infusion', dose: 500, durationMinutes: 30,
    concentrationAmount: 1, concentrationUnit: 'g', concentrationVolume: 100
  });
  assert.equal(r.doseAmount, 500);
  assert.equal(r.volumeMl, 50);
  assert.equal(r.dosePerHour, 1000);
  assert.equal(r.rateMlHour, 100);
  assert.equal(r.orderText, '500 mg over 30 min');
  assert.match(r.resolvedDoseText, /500 mg total over 30 min/);
});

test('mL orders bypass concentration for all delivery types', () => {
  const ignored = { doseUnit: 'mL', concentrationAmount: 'bad', concentrationUnit: 'bad', concentrationVolume: 0 };
  const total = calculate({ ...ignored, dose: 12.5 });
  assert.equal(total.volumeMl, 12.5);
  assert.equal(total.concentrationPerMl, null);
  assert.equal(total.concentrationUnit, null);
  const continuous = calculate({ ...ignored, delivery: 'Infusion', dose: 2, timeUnit: 'min' });
  assert.equal(continuous.rateMlHour, 120);
  assert.equal(continuous.dosePerHour, 120);
  assert.equal(continuous.volumeMl, null);
  const hourly = calculate({ ...ignored, delivery: 'Infusion', dose: 2, timeUnit: 'hour' });
  assert.equal(hourly.rateMlHour, 2);
  const timed = calculate({ ...ignored, delivery: 'Timed infusion', dose: 100, durationMinutes: 20 });
  assert.equal(timed.volumeMl, 100);
  assert.equal(timed.rateMlHour, 300);
});

test('mL/kg order uses explicit weight and does not derive a drug mass', () => {
  const r = calculate({ dose: 2, doseUnit: 'mL', perKg: true, weightKg: 20, weightBasis: 'Estimated' });
  assert.equal(r.volumeMl, 40);
  assert.equal(r.doseAmount, 40);
  assert.equal(r.doseUnit, 'mL');
  assert.equal(r.concentrationPerMl, null);
  assert.match(r.warnings.join(' '), /estimated weight of 20 kg/i);
});

test('fixed orders require neither weight nor basis and ignore unused values', () => {
  for (const weightKg of [undefined, '', 0, 501, NaN, { value: 20 }]) {
    const r = calculate({ weightKg, weightBasis: 'Unknown' });
    assert.equal(r.doseAmount, 2);
    assert.equal(r.volumeMl, 0.4);
    assert.equal(r.weightKg, null);
    assert.equal(r.weightBasis, null);
    assert.deepEqual(r.warnings, []);
  }
});

test('weighted orders require a positive weight at most 500 and an explicit accepted basis', () => {
  const weighted = { perKg: true, weightKg: 20, weightBasis: 'Measured' };
  for (const weightKg of [undefined, '', 0, -1, 501, Infinity, 'bad', true, '500.0000000000000000001']) {
    rejects({ ...weighted, weightKg }, /Weight/);
  }
  for (const weightBasis of [undefined, '', 'Unknown', 'measured', 1, true]) {
    rejects({ ...weighted, weightBasis }, /weight basis/);
  }
  const accepted = calculate({ ...weighted, dose: 100, weightKg: 500, concentrationAmount: 1 });
  assert.equal(accepted.doseAmount, 50000); // No inferred clinical maximum.
});

test('required numeric values reject blanks, coercions, negative, zero and nonfinite inputs', () => {
  const invalid = [undefined, null, '', ' ', '\t\n', 0, -0, -1, NaN, Infinity, -Infinity,
    true, false, [], [1], {}, 1n, '1mg', '0x10', '1_000', '1,000', '1/2', 'NaN', 'Infinity', '1e'];
  for (const field of ['dose', 'concentrationAmount', 'concentrationVolume']) {
    for (const value of invalid) rejects({ [field]: value });
  }
  for (const durationMinutes of invalid) rejects({ delivery: 'Timed infusion', durationMinutes });
});

test('delivery, units, perKg and continuous time unit are never inferred or coerced', () => {
  for (const delivery of [undefined, '', 'bolus', 'Infusion start', 1, true]) rejects({ delivery });
  for (const doseUnit of [undefined, '', 'mcg', 'μg', 'MG', 'mg/kg', 'mg/min', 1]) rejects({ doseUnit });
  for (const concentrationUnit of [undefined, '', 'mL', 'mg/mL', 'units/mL', 1]) rejects({ concentrationUnit });
  for (const perKg of [undefined, '', 'false', 'true', 0, 1, null]) rejects({ perKg });
  for (const timeUnit of [undefined, '', 'minutes', 'hours', 'sec', 60]) rejects({ delivery: 'Infusion', timeUnit });
});

test('invalid root input returns a structured error rather than throwing', () => {
  for (const input of [undefined, null, '', 2, false, [], () => {}]) {
    const r = calculateMedication(input);
    assert.equal(r.ok, false);
    assert.ok(r.errors.length > 0);
  }
});

test('strict decimal strings accept decimal/scientific notation and preserve the entered order', () => {
  for (const dose of [' .1000 ', '+0.1', '1e-1', '1.0E-1']) {
    const r = calculate({ dose, perKg: true, weightKg: '3.0', weightBasis: 'Measured', concentrationAmount: '1.' });
    assert.equal(r.doseAmount, 0.3);
    assert.equal(r.volumeMl, 0.3);
    assert.equal(r.orderText, '0.1 mg/kg');
    assert.ok(!r.steps.join(' ').includes('0.30000000000000004'));
  }
});

test('result overflow and underflow fail instead of returning Infinity or zero', () => {
  rejects({ dose: '1e309' }, /overflow/);
  rejects({ dose: '1e-400' }, /underflow/);
  rejects({ dose: '1e308', perKg: true, weightKg: 500, weightBasis: 'Measured', concentrationAmount: '1e308' }, /Resolved dose.*overflow/);
  rejects({ dose: 1, concentrationAmount: '1e308', concentrationVolume: '1e-308' }, /Concentration per mL.*overflow/);
  rejects({ dose: '1e-300', concentrationAmount: '1e100' }, /Volume.*underflow/);
  rejects({ delivery: 'Infusion', timeUnit: 'min', dose: '1e308', concentrationAmount: '1e308' }, /Hourly dose.*overflow/);
  rejects({ delivery: 'Timed infusion', dose: '1e-308', durationMinutes: '1e308', concentrationAmount: 1 }, /Hourly dose.*underflow/);
  rejects({ dose: Number.MIN_VALUE, perKg: true, weightKg: 0.5, weightBasis: 'Measured', concentrationAmount: 1 }, /underflow/);
});

test('cancellation avoids intermediate overflow when every reported result is representable', () => {
  const r = calculate({ dose: '1e308', doseUnit: 'g', concentrationAmount: '1e308', concentrationUnit: 'micrograms', concentrationVolume: 1 });
  assert.equal(r.doseAmount, 1e308);
  assert.equal(r.concentrationPerMl, 1e308);
  assert.equal(r.volumeMl, 1e6);
});

test('repeating results keep numeric precision and show an approximation without device rounding', () => {
  const r = calculate({ dose: 1, concentrationAmount: 3 });
  assert.equal(r.volumeMl, 1 / 3);
  assert.match(r.steps.join(' '), /≈ 0\.3333333333333333 mL/);
  assert.match(r.warnings.join(' '), /No administration-device rounding/);
  const concentration = calculate({ dose: 1, concentrationAmount: 1, concentrationVolume: 3 });
  assert.equal(concentration.volumeMl, 3);
  assert.match(concentration.steps.find(step => step.startsWith('Total volume:')), /≈ 3 mL/);
});

test('plain decimal formatting preserves tiny and large finite numbers without changing significant digits', () => {
  assert.equal(formatMedicationNumber(1e-7), '0.0000001');
  assert.equal(formatMedicationNumber(0.00004), '0.00004');
  assert.equal(formatMedicationNumber(1.2345678901234567e-7), '0.00000012345678901234566');
  assert.equal(formatMedicationNumber(1e21), '1000000000000000000000');
  assert.equal(formatMedicationNumber(-1e-7), '-0.0000001');
  assert.equal(formatMedicationNumber(1.2300), '1.23');
  assert.equal(formatMedicationNumber(0), '0');
  assert.equal(formatMedicationNumber(-0), '0');
  for (const value of [Number.MIN_VALUE, 1e-300, 1e-7, 1.2345678901234567e-7, 0.30000000000000004, 1e21, 1.2345678901234568e30, Number.MAX_VALUE]) {
    const text = formatMedicationNumber(value);
    assert.ok(!/[eE]/.test(text));
    assert.ok(text !== '0');
    assert.equal(Number(text), value);
  }
  for (const value of [NaN, Infinity, -Infinity, '1', null, undefined]) assert.equal(formatMedicationNumber(value), '—');
});

test('scientific dose, weight and concentration inputs are displayed as plain decimals', () => {
  const small = calculate({ dose: '1e-7', perKg: true, weightKg: '1e-7', weightBasis: 'Estimated', concentrationAmount: '1e-7', concentrationVolume: 1 });
  assert.equal(small.doseAmount, 1e-14);
  assert.equal(small.volumeMl, 1e-7);
  assert.equal(small.orderText, '0.0000001 mg/kg');
  assert.match(small.warnings.join(' '), /estimated weight of 0\.0000001 kg/);
  assert.match(small.concentrationText, /0\.0000001 mg/);
  const large = calculate({ dose: '1e21', concentrationAmount: '1e21', concentrationVolume: 1 });
  assert.equal(large.orderText, '1000000000000000000000 mg');
  assert.equal(large.volumeMl, 1);
  for (const r of [small, large]) {
    const displayed = [r.orderText, r.resolvedDoseText, r.concentrationText, ...r.steps, ...r.warnings].join(' ');
    assert.ok(!/\d[eE][+-]?\d/.test(displayed));
  }
});

test('calculation does not mutate input or use unrelated medication/catalog metadata', () => {
  const input = Object.freeze({ ...bolus, medication: 'Unspecified test medication', customMedication: '', indication: 'arithmetic test', orderSource: 'synthetic' });
  const before = { ...input };
  const r = calculateMedication(input);
  assert.equal(r.ok, true);
  assert.deepEqual(input, before);
  assert.equal(r.volumeMl, 0.4);
  assert.ok(!Object.hasOwn(r, 'medication'));
});
