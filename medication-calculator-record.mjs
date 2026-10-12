import {calculateMedication, CALCULATOR_VERSION, formatMedicationNumber} from './medication-calculator.mjs';
import {medicationOptions} from './med-catalog.mjs';

const text = value => typeof value === 'string' ? value.trim() : '';

// Recalculate from the committed patient weight at the documentation boundary.
// Opening this seed records nothing and leaves actual administration fields empty.
export function medicationCalculatorSeed(draft, patient = {}) {
  if (!draft || typeof draft !== 'object' || Array.isArray(draft)) throw Error('Enter a medication calculation first.');
  const custom = draft.medication === 'Other medication';
  const name = custom ? text(draft.customMedication) : text(draft.medication);
  if (!name || (!custom && !medicationOptions.includes(name))) throw Error('Select the medication or enter its name.');
  const result = calculateMedication({...draft, weightKg:patient.weightKg, weightBasis:patient.weightBasis});
  if (!result.ok) throw Error(result.errors.join(' '));
  const data = {
    'Calculation version': CALCULATOR_VERSION,
    'Calculation status': 'Entered order calculated; administration documented separately',
    'Calculation ordered dose / rate': result.orderText,
    'Calculation resolved dose / rate': result.resolvedDoseText,
    'Calculation preparation': result.concentrationText,
    'Calculation patient mode': patient.mode || 'Not entered',
    'Calculation weight (kg)': result.weightKg === null ? 'Not used for this order' : String(result.weightKg),
    'Calculation weight basis': result.weightBasis || 'Not used for this order',
    'Calculation arithmetic': result.steps.join('\n'),
    'Calculation limits': 'No clinical dose limits or device rounding evaluated'
  };
  if (result.concentrationPerMl !== null) {
    data['Preparation drug amount'] = `${draft.concentrationAmount} ${draft.concentrationUnit}`;
    data['Preparation final total volume (mL)'] = String(draft.concentrationVolume);
  }
  if (result.volumeMl !== null) data[result.delivery === 'Bolus' ? 'Calculated bolus volume (mL)' : 'Calculated total infusion volume (mL)'] = String(result.volumeMl);
  if (result.rateMlHour !== null) data['Calculated infusion rate (mL/hour)'] = String(result.rateMlHour);
  if (result.delivery === 'Timed infusion') data['Ordered infusion duration (min)'] = String(draft.durationMinutes);
  if (text(draft.orderSource)) data['Calculation order source / instruction'] = text(draft.orderSource);
  const seed = {
    Context:'Cause-specific / fluids',
    Drug:custom ? 'Other' : name,
    'Other drug / fluid':custom ? name : '',
    Status:'Select status',
    Delivery:result.delivery === 'Bolus' ? 'Bolus' : 'Infusion start',
    'Ordered dose / rate':result.orderText,
    'Actual dose / rate':'',
    'Dose units':result.delivery === 'Bolus' ? result.doseUnit : 'mL/hour',
    Concentration:result.concentrationPerMl === null ? '' : String(result.concentrationPerMl),
    'Concentration units':result.concentrationUnit ? `${result.concentrationUnit}/mL` : 'mg/mL',
    'Administered volume (mL)':'',
    Route:'Select route',
    'Indication / reason withheld':text(draft.indication),
    'Protocol version':'Entered order / selected local protocol'
  };
  seed._calculator = {
    data,
    patient:{weightKg:patient.weightKg, weightBasis:patient.weightBasis, mode:patient.mode},
    usesWeight:result.weightKg !== null,
    match:Object.fromEntries(['Context','Drug','Other drug / fluid','Delivery','Ordered dose / rate','Concentration','Concentration units'].map(key => [key,seed[key]])),
    summary:[result.orderText, result.resolvedDoseText, result.concentrationText,
      result.volumeMl === null ? '' : `${formatMedicationNumber(result.volumeMl)} mL calculated volume`,
      result.rateMlHour === null ? '' : `${formatMedicationNumber(result.rateMlHour)} mL/hour calculated rate`,
      result.weightKg === null ? '' : `${formatMedicationNumber(result.weightKg)} kg (${result.weightBasis}) used`
    ].filter(Boolean)
  };
  return seed;
}

// A changed order/preparation cannot retain a result from the previous inputs.
// Actual dose/rate/volume do not alter this ORDER snapshot and are never inferred.
export function matchingCalculatorSnapshot(seed, formData, patient = {}) {
  const snapshot = seed?._calculator;
  if (!snapshot || !formData) return null;
  for (const [key,value] of Object.entries(snapshot.match)) {
    if (key === 'Concentration' && value !== '' && formData[key] !== '') {
      if (Number(formData[key]) !== Number(value)) return null;
    } else if (String(formData[key] ?? '') !== String(value ?? '')) return null;
  }
  if (snapshot.patient.mode !== patient.mode) return null;
  if (snapshot.usesWeight && (Number(snapshot.patient.weightKg) !== Number(patient.weightKg) || snapshot.patient.weightBasis !== patient.weightBasis)) return null;
  return snapshot;
}
