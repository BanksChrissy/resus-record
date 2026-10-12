import {CALCULATOR_VERSION, DOSE_UNITS, calculateMedication, formatMedicationNumber} from './medication-calculator.mjs';
import {medicationCatalog, medicationReferences} from './med-catalog.mjs';

const esc = value => String(value ?? '').replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));
const deliveries = ['Bolus', 'Infusion', 'Timed infusion'];
const catalogNames = medicationCatalog.map(item => item.name);
const concentrationUnits = DOSE_UNITS.filter(unit => unit !== 'mL');
const identityFields = ['medication','customMedication','indication','orderSource'];
const numericFields = ['dose','concentrationAmount','concentrationVolume','durationMinutes'];
const fieldNames = [...identityFields, ...numericFields, 'delivery','doseUnit','perKg','timeUnit','concentrationUnit'];
const defaults = () => ({medication:'', customMedication:'', indication:'', orderSource:'', delivery:'Bolus', dose:'', doseUnit:'', perKg:false, timeUnit:'', concentrationAmount:'', concentrationUnit:'', concentrationVolume:'', durationMinutes:'', referenceOpen:false, methodOpen:false});
const inputValue = value => typeof value === 'string' || typeof value === 'number' ? String(value) : '';
let liveRoot = null;
let restoreSnapshot = null;

function normalizeDraft(value) {
  const source = value && typeof value === 'object' && !Array.isArray(value) ? value : {};
  const draft = defaults();
  for (const name of identityFields) draft[name] = typeof source[name] === 'string' ? source[name] : '';
  if (![...catalogNames, 'Other medication'].includes(draft.medication)) draft.medication = '';
  for (const name of numericFields) draft[name] = inputValue(source[name]);
  draft.delivery = source.delivery === undefined ? 'Bolus' : deliveries.includes(source.delivery) ? source.delivery : '';
  draft.doseUnit = DOSE_UNITS.includes(source.doseUnit) ? source.doseUnit : '';
  draft.concentrationUnit = concentrationUnits.includes(source.concentrationUnit) ? source.concentrationUnit : '';
  draft.timeUnit = ['min','hour'].includes(source.timeUnit) ? source.timeUnit : '';
  // An invalid saved basis must not silently become a valid absolute dose.
  draft.perKg = source.perKg === undefined ? false : typeof source.perKg === 'boolean' ? source.perKg : null;
  draft.referenceOpen = source.referenceOpen === true;
  draft.methodOpen = source.methodOpen === true;
  return draft;
}

function normalizePatient(value) {
  const patient = value && typeof value === 'object' ? value : {};
  return {weightKg:inputValue(patient.weightKg), weightBasis:['Measured','Estimated'].includes(patient.weightBasis) ? patient.weightBasis : 'Unknown', mode:patient.mode === 'Pediatric' ? 'Pediatric' : 'Adult'};
}

function normalizeWeightDraft(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  return {weight:inputValue(value.weight), basis:['Measured','Estimated'].includes(value.basis) ? value.basis : 'Unknown'};
}

function medicationName(draft) {
  return draft.medication === 'Other medication' ? draft.customMedication.trim() : catalogNames.includes(draft.medication) ? draft.medication : '';
}

function safeURL(value) {
  try { const url = new URL(String(value)); return url.protocol === 'https:' && !url.username && !url.password ? url.href : ''; }
  catch { return ''; }
}

function sourceLink(label, url) {
  const safe = safeURL(url);
  return safe ? `<a href="${esc(safe)}" target="_blank" rel="noopener noreferrer">${esc(label)} <span aria-hidden="true">↗</span></a>` : esc(label);
}

function optionsHTML(options, value, emptyLabel) {
  return `<option value="">${esc(emptyLabel)}</option>${options.map(option => `<option value="${esc(option)}" ${value === option ? 'selected' : ''}>${esc(option)}</option>`).join('')}`;
}

function textField(name, label, value, extra = '') {
  return `<label class="mc-field"><span>${esc(label)}</span><input type="text" data-mc-field="${name}" data-mc-focus="${name}" value="${esc(value)}" ${extra}></label>`;
}

function numberField(name, label, value, extra = '') {
  return `<label class="mc-field"><span data-mc-label="${name}">${esc(label)}</span><input type="number" step="any" min="0" inputmode="decimal" data-mc-field="${name}" data-mc-focus="${name}" value="${esc(value)}" autocomplete="off" ${extra}></label>`;
}

function evaluate(draft, patient, weightDraft, closed) {
  if (weightDraft && !closed && draft.perKg === true) return {ok:false, errors:['Apply the pending patient weight before calculating a weight-based order.'], pendingWeight:true};
  return calculateMedication({...draft, weightKg:patient.weightKg, weightBasis:patient.weightBasis});
}

function hasOrderInput(draft) {
  return !!(draft.dose || draft.doseUnit || draft.concentrationAmount || draft.concentrationUnit || draft.concentrationVolume || draft.durationMinutes || draft.perKg === true);
}

function weightStatusHTML(patient, weightDraft, closed) {
  const saved = patient.weightKg ? `${patient.weightKg} kg · ${patient.weightBasis.toLowerCase()}` : 'No saved patient weight';
  if (closed) return `<strong>Closed run · saved weight used for calculations.</strong><span>${esc(saved)}${weightDraft ? '. The unapplied weight draft below is not used.' : ''}</span>`;
  if (weightDraft) return `<strong>Weight change not yet applied.</strong><span>Use patient weight to update the shared run. Weight-based calculations and record review wait for this step.</span>`;
  return `<strong>${esc(saved)}</strong><span>Shared with the medication reference and record.</span>`;
}

function resultHTML(draft, patient, weightDraft, closed) {
  const result = evaluate(draft, patient, weightDraft, closed);
  const hasInput = hasOrderInput(draft);
  if (!result.ok) {
    const errors = Array.isArray(result.errors) ? result.errors : ['Check the order and preparation.'];
    return `<div class="mc-result-empty ${hasInput || result.pendingWeight ? 'mc-needs-input' : ''}"><h3>${result.pendingWeight ? 'Apply the patient weight' : hasInput ? 'Calculation needs attention' : 'Ready for the selected order'}</h3>${hasInput || result.pendingWeight ? `<ul>${errors.map(error => `<li>${esc(error)}</li>`).join('')}</ul>` : '<p>Choose the dose unit and basis, then enter the ordered amount. Add the final preparation for drug-amount orders.</p>'}</div>`;
  }
  const amount = number => esc(formatMedicationNumber(number));
  const metrics = [];
  if (result.volumeMl !== null && result.volumeMl !== undefined) metrics.push(`<div><span>${result.delivery === 'Timed infusion' ? 'Calculated total infusion volume' : 'Calculated volume'}</span><strong>${amount(result.volumeMl)} <small>mL</small></strong></div>`);
  if (result.rateMlHour !== null && result.rateMlHour !== undefined) metrics.push(`<div><span>Calculated infusion rate</span><strong>${amount(result.rateMlHour)} <small>mL/hour</small></strong></div>`);
  return `<div class="mc-result-success"><div class="mc-result-heading"><h3>Calculated order</h3><span>Arithmetic only</span></div><div class="mc-result-metrics">${metrics.join('')}</div><dl class="mc-result-facts"><div><dt>Entered order</dt><dd>${esc(result.orderText)}</dd></div><div><dt>Resolved dose / rate</dt><dd>${esc(result.resolvedDoseText)}</dd></div>${result.concentrationText ? `<div><dt>Final preparation</dt><dd>${esc(result.concentrationText)}</dd></div>` : ''}<div><dt>Weight used</dt><dd>${result.weightKg !== null && result.weightKg !== undefined ? `${amount(result.weightKg)} kg · ${esc(result.weightBasis)}` : 'Not used for this order'}</dd></div></dl><h4>Calculation</h4><ol class="mc-calculation-steps">${(Array.isArray(result.steps) ? result.steps : []).map(step => `<li>${esc(step)}</li>`).join('')}</ol><p class="mc-no-limit"><strong>No dose limit evaluated for the entered order.</strong></p>${Array.isArray(result.warnings) && result.warnings.length ? `<ul class="mc-calculation-warnings">${result.warnings.map(warning => `<li>${esc(warning)}</li>`).join('')}</ul>` : ''}</div>`;
}

function referenceHTML(draft, patient, weightDraft, closed) {
  if (!catalogNames.includes(draft.medication)) return '<p>Select a catalog medication to see its existing reference.</p>';
  const references = medicationReferences(draft.medication, patient.mode, patient.weightKg, patient.weightBasis);
  const pending = !!weightDraft && !closed;
  return `<p class="mc-reference-context">${esc(patient.mode)} · ${patient.weightKg ? `saved weight ${esc(patient.weightKg)} kg (${esc(patient.weightBasis)})` : 'weight not entered'}</p><p class="mc-reference-separation">These references already include any displayed weight calculation. They do not populate or validate the entered order.</p>${references.map(reference => {
    const blocked = pending && reference.weighted;
    return `<article class="mc-reference-row"><h4>${esc(reference.label)}</h4><strong>${blocked ? 'Apply pending weight to show this weight-based reference' : esc(reference.display)}</strong>${reference.routes?.length ? `<p>${esc(reference.routes.join(' / '))}</p>` : ''}${reference.formula && !blocked ? `<p class="mc-reference-formula">${esc(reference.formula)}</p>` : ''}${reference.note ? `<p>${esc(reference.note)}</p>` : ''}${reference.concentration && !blocked ? `<p class="mc-reference-preparation">Reference preparation: ${esc(reference.concentration)} ${esc(reference.unit)}/mL${reference.volume ? ` · ${esc(reference.volume)}` : ''}. Confirm the actual final preparation separately.</p>` : ''}${reference.source ? `<p class="mc-reference-source">${sourceLink(reference.source, reference.url)}</p>` : ''}</article>`;
  }).join('')}`;
}

function handoffStatus(draft, result, weightDraft, closed) {
  if (closed) return 'Run closed. Calculations remain available; reopen the run to review a new medication record.';
  if (weightDraft) return 'Apply the pending shared weight before reviewing a medication record.';
  if (!result.ok) return 'Complete a valid calculation to review the medication record.';
  if (!medicationName(draft)) return 'Identify the medication before reviewing its record.';
  return 'Review the order in the medication form. Actual administration stays blank until you document it.';
}

function canDocument(draft, result, weightDraft, closed) {
  return !!(result.ok && medicationName(draft) && !weightDraft && !closed);
}

function methodHTML() {
  return `<p>The calculator resolves a per-kilogram order using the saved shared patient weight, converts compatible units, and divides by the concentration in the final preparation.</p><ul><li>Bolus volume = absolute dose ÷ concentration.</li><li>Continuous pump rate = absolute dose per hour ÷ concentration.</li><li>Timed-infusion pump rate = calculated volume × 60 ÷ duration in minutes.</li><li>For an order already expressed in mL, no concentration is needed.</li></ul><p>Use the same drug/substance basis for the order and label (for example, salt versus elemental amount). Confirm whether the order requires actual, ideal or adjusted dosing weight; measured/estimated describes how the entered weight was obtained.</p><p>Use the final prepared total volume, including the effect of dilution or reconstitution. Confirm bag overfill, measurable volume, pump units and device precision against the preparation and local process.</p><ul class="mc-method-sources"><li>${sourceLink('FDA · medication strength and units', 'https://www.fda.gov/drugs/electronic-drug-registration-and-listing-system-edrls/strength-conversion-drug-listing')}</li><li>${sourceLink('FDA · infusion pump verification', 'https://www.fda.gov/medical-devices/infusion-pumps/infusion-pump-risk-reduction-strategies-clinicians')}</li><li>${sourceLink('ISMP Canada · final volume and IV overfill', 'https://www.ismp-canada.org/download/safetyBulletins/2013/ISMPCSB2013-07_ManagingOverfillIntravenousMedications.pdf')}</li></ul><p class="mc-version">${esc(CALCULATOR_VERSION)} · Source links open online.</p>`;
}

function captureFocus(root) {
  if (!root?.isConnected) return null;
  const active = root.ownerDocument.activeElement;
  if (!active || !root.contains(active)) return null;
  const key = active.getAttribute('data-mc-focus');
  return key ? {key,start:typeof active.selectionStart === 'number' ? active.selectionStart : null,end:typeof active.selectionEnd === 'number' ? active.selectionEnd : null,x:root.ownerDocument.defaultView?.scrollX || 0,y:root.ownerDocument.defaultView?.scrollY || 0} : null;
}

export function medicationCalculatorHTML({draft = {}, patient = {}, weightDraft = null, closed = false} = {}) {
  if (liveRoot?.isConnected) restoreSnapshot = captureFocus(liveRoot);
  const current = normalizeDraft(draft);
  const saved = normalizePatient(patient);
  const pending = normalizeWeightDraft(weightDraft);
  const weight = pending || {weight:saved.weightKg,basis:saved.weightBasis};
  const result = evaluate(current, saved, pending, closed);
  return `<section class="medication-calculator" data-medication-calculator aria-label="Medication calculator"><div class="mc-heading"><div><h2>Medication calculator</h2><p>Selected order + final preparation</p></div><span class="mc-mode">${esc(saved.mode)}${closed ? ' · closed' : ''}</span></div><p class="mc-scope">Arithmetic for the selected order; confirm indication, route, dose limits and measurable volume/device precision.</p><section class="mc-block mc-weight"><h3><span>1</span>Shared patient weight</h3><div class="mc-weight-status" data-mc-weight-status role="status">${weightStatusHTML(saved, pending, closed)}</div><div class="mc-weight-grid"><label class="mc-field"><span>Patient weight (kg)</span><input type="number" min="0" step="any" inputmode="decimal" data-mc-weight="weight" data-mc-focus="weight" value="${esc(weight.weight)}" ${closed ? 'disabled' : ''}></label><label class="mc-field"><span>Weight basis</span><select data-mc-weight="basis" data-mc-focus="weight-basis" ${closed ? 'disabled' : ''}><option value="Unknown" ${weight.basis === 'Unknown' ? 'selected' : ''}>Choose basis</option><option value="Measured" ${weight.basis === 'Measured' ? 'selected' : ''}>Measured</option><option value="Estimated" ${weight.basis === 'Estimated' ? 'selected' : ''}>Estimated</option></select></label><button type="button" data-mc-apply-weight ${closed || !pending ? 'disabled' : ''}>Use patient weight</button></div><p class="mc-weight-error" data-mc-weight-error role="alert" hidden></p><p class="mc-small">The calculator uses the shared patient weight. Confirm it is the dosing weight required by the order; ideal or adjusted body weight is not calculated. Measured / estimated describes how the entered weight was obtained.</p></section><section class="mc-block mc-order"><h3><span>2</span>The selected order</h3><label class="mc-field"><span>Medication</span><select data-mc-field="medication" data-mc-focus="medication">${optionsHTML([...catalogNames, 'Other medication'], current.medication, 'Choose medication')}</select></label><div data-mc-custom ${current.medication === 'Other medication' ? '' : 'hidden'}>${textField('customMedication','Medication name',current.customMedication,'maxlength="120" autocomplete="off"')}</div><div class="mc-pair mc-optional-fields">${textField('indication','Indication (optional)',current.indication,'maxlength="240"')}${textField('orderSource','Order source (optional)',current.orderSource,'maxlength="240"')}</div><div class="mc-pair"><label class="mc-field"><span>Delivery</span><select data-mc-field="delivery" data-mc-focus="delivery">${optionsHTML(deliveries,current.delivery,'Choose delivery')}</select></label><label class="mc-field"><span>Dose unit</span><select data-mc-field="doseUnit" data-mc-focus="doseUnit">${optionsHTML(DOSE_UNITS,current.doseUnit,'Choose unit')}</select></label></div><label class="mc-per-kg"><input type="checkbox" data-mc-field="perKg" data-mc-focus="perKg" ${current.perKg === true ? 'checked' : ''}><span>Order is per kg of dosing weight</span></label><div class="mc-pair"><div data-mc-infusion ${current.delivery === 'Infusion' ? '' : 'hidden'}><label class="mc-field"><span>Rate time unit</span><select data-mc-field="timeUnit" data-mc-focus="timeUnit"><option value="">Choose time unit</option><option value="min" ${current.timeUnit === 'min' ? 'selected' : ''}>Per minute</option><option value="hour" ${current.timeUnit === 'hour' ? 'selected' : ''}>Per hour</option></select></label></div>${numberField('dose',current.delivery === 'Infusion' ? 'Ordered rate amount' : current.delivery === 'Timed infusion' ? 'Total ordered dose' : 'Ordered dose',current.dose)}<div data-mc-timed ${current.delivery === 'Timed infusion' ? '' : 'hidden'}>${numberField('durationMinutes','Duration (minutes)',current.durationMinutes)}</div></div><p class="mc-small">Choose units and dose basis before entering the number. Changing them clears the affected amount.</p></section><section class="mc-block mc-preparation" data-mc-preparation ${current.doseUnit === 'mL' ? 'hidden' : ''}><h3><span>3</span>Final preparation</h3><p class="mc-preparation-intro">Amount of drug in the <strong>final total preparation volume</strong>.</p><label class="mc-field"><span>Drug amount unit</span><select data-mc-field="concentrationUnit" data-mc-focus="concentrationUnit">${optionsHTML(concentrationUnits,current.concentrationUnit,'Choose preparation unit')}</select></label><div class="mc-pair">${numberField('concentrationAmount','Drug amount in preparation',current.concentrationAmount)}${numberField('concentrationVolume','Final total volume (mL)',current.concentrationVolume)}</div><p class="mc-small">Examples: 4 mg in a final 250 mL, or 5 mg in a final 1 mL. After dilution or reconstitution, enter the resulting preparation. No stock concentration is assumed.</p><p class="mc-small">The order and label must describe the same drug/substance basis (for example, salt versus elemental amount).</p></section><section class="mc-results" aria-label="Calculation result" aria-live="polite" aria-atomic="true" data-mc-results>${resultHTML(current,saved,pending,closed)}</section><div class="mc-actions"><button type="button" class="mc-review" data-mc-document ${canDocument(current,result,pending,closed) ? '' : 'disabled'}>Review medication record</button><button type="button" data-mc-clear>Clear calculation</button><p data-mc-handoff-status>${esc(handoffStatus(current,result,pending,closed))}</p></div><details class="mc-reference" data-mc-detail="referenceOpen" ${current.referenceOpen ? 'open' : ''} ${catalogNames.includes(current.medication) ? '' : 'hidden'}><summary data-mc-focus="reference-summary"><strong>Existing catalog reference</strong><small data-mc-reference-title>${esc(current.medication)}</small></summary><div data-mc-reference-body>${referenceHTML(current,saved,pending,closed)}</div></details><details class="mc-help" data-mc-detail="methodOpen" ${current.methodOpen ? 'open' : ''}><summary data-mc-focus="method-summary">Calculation method &amp; source help</summary><div>${methodHTML()}</div></details><div class="mc-navigation"><span>Open record:</span><button type="button" data-mc-navigate="Interventions">Interventions</button><button type="button" data-mc-navigate="Patient weight">Patient weight</button></div></section>`;
}

export function wireMedicationCalculator(container, {draft = {}, patient = {}, weightDraft = null, closed = false, onDraftChange = () => {}, onWeightDraft = () => {}, onApplyWeight = () => {}, onDocument = () => {}, onNavigate = () => {}} = {}) {
  if (!container?.querySelector) return;
  const root = container.matches?.('[data-medication-calculator]') ? container : container.querySelector('[data-medication-calculator]');
  if (!root) return;
  let current = normalizeDraft(draft);
  let pending = normalizeWeightDraft(weightDraft);
  const saved = normalizePatient(patient);
  const doc = root.ownerDocument;
  let weightError = '';
  liveRoot = root;

  const persist = next => { current = normalizeDraft(next); onDraftChange({...current}); };

  function refresh() {
    if (!root.isConnected) return;
    root.querySelectorAll('[data-mc-field]').forEach(input => {
      const key = input.dataset.mcField;
      if (key === 'perKg') input.checked = current.perKg === true;
      else if (input.value !== current[key]) input.value = current[key] ?? '';
    });
    root.querySelector('[data-mc-custom]').hidden = current.medication !== 'Other medication';
    root.querySelector('[data-mc-infusion]').hidden = current.delivery !== 'Infusion';
    root.querySelector('[data-mc-timed]').hidden = current.delivery !== 'Timed infusion';
    root.querySelector('[data-mc-preparation]').hidden = current.doseUnit === 'mL';
    root.querySelector('[data-mc-label="dose"]').textContent = current.delivery === 'Infusion' ? 'Ordered rate amount' : current.delivery === 'Timed infusion' ? 'Total ordered dose' : 'Ordered dose';
    root.querySelector('[data-mc-weight-status]').innerHTML = weightStatusHTML(saved,pending,closed);
    const error = root.querySelector('[data-mc-weight-error]');
    error.textContent = weightError;
    error.hidden = !weightError;
    root.querySelector('[data-mc-apply-weight]').disabled = closed || !pending;
    const result = evaluate(current,saved,pending,closed);
    root.querySelector('[data-mc-results]').innerHTML = resultHTML(current,saved,pending,closed);
    root.querySelector('[data-mc-document]').disabled = !canDocument(current,result,pending,closed);
    root.querySelector('[data-mc-handoff-status]').textContent = handoffStatus(current,result,pending,closed);
    const reference = root.querySelector('[data-mc-detail="referenceOpen"]');
    reference.hidden = !catalogNames.includes(current.medication);
    reference.open = current.referenceOpen;
    root.querySelector('[data-mc-reference-title]').textContent = current.medication;
    root.querySelector('[data-mc-reference-body]').innerHTML = referenceHTML(current,saved,pending,closed);
    root.querySelector('[data-mc-detail="methodOpen"]').open = current.methodOpen;
  }

  function handleInput(event) {
    const input = event.target;
    if (input.matches?.('[data-mc-weight]')) {
      if (closed) return;
      pending = {weight:root.querySelector('[data-mc-weight="weight"]').value,basis:root.querySelector('[data-mc-weight="basis"]').value};
      weightError = '';
      onWeightDraft({...pending});
      refresh();
      return;
    }
    if (!input.matches?.('[data-mc-field]')) return;
    const key = input.dataset.mcField;
    if (!fieldNames.includes(key)) return;
    const value = key === 'perKg' ? input.checked : input.value;
    if (current[key] === value) return;
    let next = {...current,[key]:value};
    if (key === 'medication') next = {...defaults(),medication:value};
    else if (key === 'customMedication') next = {...defaults(),medication:'Other medication',customMedication:value};
    else if (key === 'doseUnit') next = {...next,dose:'',concentrationAmount:'',concentrationUnit:'',concentrationVolume:''};
    else if (key === 'delivery') next = {...next,dose:'',timeUnit:'',durationMinutes:''};
    else if (key === 'perKg' || key === 'timeUnit') next.dose = '';
    else if (key === 'concentrationUnit') next.concentrationAmount = '';
    persist(next);
    refresh();
  }

  root.oninput = handleInput;
  root.onchange = handleInput;
  root.onclick = event => {
    const button = event.target.closest?.('button');
    if (!button || !root.contains(button)) return;
    if (button.hasAttribute('data-mc-apply-weight')) {
      if (closed || !pending) return;
      try { onApplyWeight(pending.weight,pending.basis); }
      catch (error) { weightError = error?.message || 'Patient weight could not be applied.'; refresh(); }
      return;
    }
    if (button.hasAttribute('data-mc-document')) {
      const result = evaluate(current,saved,pending,closed);
      if (canDocument(current,result,pending,closed)) onDocument({draft:{...current},result});
      return;
    }
    if (button.hasAttribute('data-mc-clear')) {
      persist(defaults());
      refresh();
      root.querySelector('[data-mc-field="medication"]')?.focus({preventScroll:true});
      return;
    }
    if (button.hasAttribute('data-mc-navigate') && ['Interventions','Patient weight'].includes(button.dataset.mcNavigate)) onNavigate(button.dataset.mcNavigate);
  };
  root.querySelectorAll('details[data-mc-detail]').forEach(details => {
    details.ontoggle = () => {
      if (!details.isConnected) return;
      const key = details.dataset.mcDetail;
      if (!['referenceOpen','methodOpen'].includes(key) || current[key] === details.open) return;
      persist({...current,[key]:details.open});
    };
  });

  const snapshot = restoreSnapshot;
  restoreSnapshot = null;
  if (snapshot) {
    const target = [...root.querySelectorAll('[data-mc-focus]')].find(input => input.dataset.mcFocus === snapshot.key);
    target?.focus({preventScroll:true});
    if (target && snapshot.start !== null && typeof target.setSelectionRange === 'function') {
      try { target.setSelectionRange(snapshot.start,snapshot.end); } catch { /* Numeric fields do not expose a caret range in every browser. */ }
    }
    if (target) doc.defaultView?.scrollTo?.(snapshot.x,snapshot.y);
  }
}
