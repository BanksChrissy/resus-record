// Original bedside reference text. Sources describe clinical options, not automatic orders.
const sources = {
  aorta: { label: 'ACC/AHA Aortic Disease Guideline, 2022', url: 'https://www.jacc.org/doi/10.1016/j.jacc.2022.08.004' },
  acs: { label: 'ACC/AHA Acute Coronary Syndromes Guideline, 2025', url: 'https://www.jacc.org/doi/10.1016/j.jacc.2024.11.009' },
  als: { label: 'AHA Adult Advanced Life Support, 2025', url: 'https://cpr.heart.org/en/resuscitation-science/cpr-and-ecc-guidelines/adult-advanced-life-support' },
  af: { label: 'ACC/AHA Atrial Fibrillation Guideline, 2023', url: 'https://www.jacc.org/doi/10.1016/j.jacc.2023.08.017' },
  brady: { label: 'ACC/AHA/HRS Bradycardia Guideline, 2018', url: 'https://www.ahajournals.org/doi/10.1161/CIR.0000000000000628' },
  bradyAlgorithm: { label: 'AHA Adult Bradycardia Algorithm, 2025', url: 'https://cpr.heart.org/-/media/CPR-Files/CPR-Guidelines-Files/2025-Algorithms/Algorithm-ACLS-Bradycardia-250514.pdf?sc_lang=en' },
  gina: { label: 'GINA Asthma Summary Guide, 2026', url: 'https://ginasthma.org/wp-content/uploads/2026/07/GINA-Summary-Guide-2026-WEB-WMS.pdf' },
  ginaFull: { label: 'GINA Asthma Strategy Report, 2026', url: 'https://ginasthma.org/wp-content/uploads/2026/05/GINA-2026-Strategy-Report-WMS.pdf' },
  gold: { label: 'GOLD COPD Report, 2026', url: 'https://goldcopd.org/wp-content/uploads/2026/01/GOLD-REPORT-2026-v1.3-8Dec2025_WMV2.pdf' },
  hf: { label: 'ESC Heart Failure Guideline, 2026', url: 'https://academic.oup.com/eurheartj/article/47/38/5346/8766302' },
  pe: { label: 'AHA/ACC Acute Pulmonary Embolism Guideline, 2026', url: 'https://www.jacc.org/doi/10.1016/j.jacc.2025.11.005' },
  cap: { label: 'ATS/IDSA Community-Acquired Pneumonia Guideline, 2019', url: 'https://www.idsociety.org/practice-guideline/community-acquired-pneumonia-cap-in-adults' },
  capUpdate: { label: 'ATS Community-Acquired Pneumonia Update, 2025', url: 'https://academic.oup.com/ajrccm/article/212/1/24/8435770' },
  sepsis: { label: 'Surviving Sepsis Campaign Adult Guideline, 2026', url: 'https://sccm.org/clinical-resources/guidelines/guidelines/surviving-sepsis-campaign-international-guidelines-for-management-of-sepsis-and-septic-shock-2026' },
  pericardium: { label: 'ESC Myocarditis and Pericarditis Guideline, 2025', url: 'https://academic.oup.com/eurheartj/article/46/40/3952/8234483?searchresult=1' },
  thorax: { label: 'WSES–AAST Thoracic Trauma Guidelines, 2025', url: 'https://link.springer.com/article/10.1186/s13017-025-00651-1' }
};

export const cardiopulmonaryPathways = [
  {
    id: 'acute-aortic-syndrome',
    title: 'Acute aortic syndrome',
    category: 'Cardiovascular',
    presentations: ['Chest pain', 'Abdominal / pelvic pain', 'Collapse / syncope', 'Shock / poor perfusion', 'Focal deficit / seizure'],
    physiology: 'Aortic wall disruption threatens rupture, coronary flow, and branch-vessel perfusion.',
    redFlags: ['Abrupt pain with shock, neurologic deficit, or limb ischemia: urgent aortic-team evaluation.'],
    bedside: [
      { action: 'Ask whether pain was maximal immediately; map radiation and migration.', meaning: 'Abrupt severe chest, back, or abdominal pain raises concern.', limitation: 'Classic tearing pain is not required.' },
      { action: 'Compare arm pressures and radial/femoral pulses; examine speech and limb function.', meaning: 'Asymmetry or deficits suggest malperfusion.', limitation: 'Symmetric pulses do not exclude dissection.' },
      { action: 'Auscultate for a new diastolic murmur; assess skin perfusion.', meaning: 'Regurgitation or shock suggests complications.', limitation: 'An absent murmur is not exclusionary.' }
    ],
    basicTools: ['Manual cuff, stethoscope, focused neurologic examination.'],
    differentials: [
      { condition: 'Acute coronary syndrome', discriminator: 'ECG; coronary involvement can accompany dissection.' },
      { condition: 'Pulmonary embolism', discriminator: 'Risk assessment and appropriately targeted imaging.' }
    ],
    testing: [
      { test: 'CT angiography', role: 'Defines aorta, branches, rupture, and repair anatomy.', timing: 'Urgently when feasible.' },
      { test: 'Transesophageal echo / MRI', role: 'Alternative definitive imaging; echo also assesses complications.', timing: 'Choose by stability and availability.' }
    ],
    immediate: ['Analgesia; monitored anti-impulse therapy when perfusion permits. Beta blockade usually precedes additional vasodilation.'],
    definitive: ['Emergency surgery for type A; endovascular/surgical intervention for complicated type B; specialist-directed medical care otherwise.'],
    advancedTools: ['Arterial monitoring; transesophageal echo; aortic operating/endovascular suite.'],
    reassessment: ['Repeat pain, pulses, neurologic findings, pressure, and perfusion.'],
    modifiers: { pediatric: ['Use pediatric specialist assessment.'], pregnancy: ['Coordinate urgent obstetric and aortic care.'] },
    sources: [sources.aorta]
  },
  {
    id: 'acute-coronary-syndrome',
    title: 'Acute coronary syndrome',
    category: 'Cardiovascular',
    presentations: ['Chest pain', 'Breathing difficulty', 'Collapse / syncope', 'Shock / poor perfusion'],
    physiology: 'Myocardial ischemia can progress to injury, pump failure, or lethal arrhythmia.',
    redFlags: ['Ongoing ischemia, shock, pulmonary edema, or electrical instability requires urgent escalation.'],
    bedside: [
      { action: 'Establish onset, persistence, radiation, exertional relationship, and associated symptoms.', meaning: 'The symptom pattern establishes suspicion and urgency.', limitation: 'Absence of classic chest pain is insufficient reassurance.' },
      { action: 'Examine mentation, skin, pulses, lungs, and heart sounds.', meaning: 'Identify hypoperfusion, congestion, or mechanical complications.', limitation: 'A normal examination does not exclude ischemia.' },
      { action: 'Ask about bleeding, medications, and abrupt back pain or neurologic symptoms.', meaning: 'Identify treatment hazards and competing aortic disease.', limitation: 'Risk factors do not establish the diagnosis.' }
    ],
    basicTools: ['Diagnostic 12-lead ECG; serial tracings; targeted posterior/right-sided leads.'],
    differentials: [
      { condition: 'Aortic syndrome', discriminator: 'Abrupt onset, malperfusion; aortic imaging.' },
      { condition: 'Pulmonary embolism', discriminator: 'Thrombotic context and dedicated workup.' }
    ],
    testing: [
      { test: 'Serial ECG and high-sensitivity troponin', role: 'Identify evolving ischemia/injury; neither single negative excludes early disease.', timing: 'Promptly; assay-specific repeat pathway.' },
      { test: 'Echo / coronary angiography', role: 'Assess complications and coronary anatomy.', timing: 'Urgency follows ischemia and instability.' }
    ],
    immediate: ['Aspirin when appropriate; selected anti-ischemic/antithrombotic therapy; support oxygenation and perfusion.'],
    definitive: ['Timely PCI; eligible STEMI fibrinolysis when appropriate; selected surgical revascularization.'],
    advancedTools: ['Catheterization laboratory; echocardiography; selected circulatory support.'],
    reassessment: ['Repeat symptoms, ECG, perfusion, pressure, and congestion.'],
    modifiers: { pediatric: ['Adult pathway; pediatric specialist evaluation.'], pregnancy: ['Coordinate coronary and obstetric care.'] },
    sources: [sources.acs]
  },
  {
    id: 'asthma-exacerbation',
    title: 'Asthma exacerbation',
    category: 'Respiratory',
    presentations: ['Breathing difficulty', 'Altered mental status'],
    physiology: 'Airway narrowing and air trapping increase respiratory work and can exhaust ventilation.',
    redFlags: ['Drowsiness, exhaustion, cyanosis, or a quiet chest requires immediate escalation.'],
    bedside: [
      { action: 'Assess speech, position, respiratory effort, expiration, and bilateral air entry.', meaning: 'Limited speech and poor entry indicate severity.', limitation: 'Quieter wheezing may mean less airflow, not improvement.' },
      { action: 'Ask about onset, triggers, inhalers, prior intensive care/intubation, and response.', meaning: 'Identify risk and failed treatment.', limitation: 'Previous mild attacks do not guarantee a mild course.' },
      { action: 'Check skin, voice, swallowing, and focal chest findings.', meaning: 'Consider anaphylaxis, upper-airway obstruction, or an alternate pulmonary process.', limitation: 'Wheeze is not specific to asthma.' }
    ],
    basicTools: ['Stethoscope, pulse oximeter, peak-flow meter when feasible.'],
    differentials: [
      { condition: 'Anaphylaxis', discriminator: 'Exposure with airway, circulatory, or multisystem findings.' },
      { condition: 'Foreign body / pneumothorax', discriminator: 'Abrupt onset or asymmetry; targeted imaging.' }
    ],
    testing: [
      { test: 'Peak flow / spirometry', role: 'Quantify obstruction; later confirm variable airflow limitation.', timing: 'Do not delay stabilization.' },
      { test: 'Blood gas / chest imaging', role: 'Assess failure, complications, or alternate diagnosis.', timing: 'Severe, deteriorating, or poorly responsive cases; not routine.' }
    ],
    immediate: ['Inhaled bronchodilator, appropriate ipratropium, systemic corticosteroid, and oxygen when needed. Epinephrine for concomitant anaphylaxis.'],
    definitive: ['Selected intravenous magnesium; critical-care respiratory support/intubation if failing; ongoing inhaled anti-inflammatory treatment.'],
    advancedTools: ['Nebulizer/spacer, blood-gas analyzer, ventilator.'],
    reassessment: ['Repeat speech, effort, entry, mentation, saturation, and peak flow.'],
    modifiers: { pediatric: ['Use age-appropriate severity assessment.'], pregnancy: ['Prioritize maternal respiratory stabilization.'] },
    sources: [sources.gina, sources.ginaFull]
  },
  {
    id: 'bradyarrhythmia',
    title: 'Bradyarrhythmia with poor perfusion',
    category: 'Cardiovascular',
    presentations: ['Collapse / syncope', 'Shock / poor perfusion', 'Altered mental status', 'Chest pain'],
    physiology: 'An inadequate ventricular rate can reduce cardiac output; the underlying cause also matters.',
    redFlags: ['Bradycardia with shock, ischemia, altered mentation, or acute heart failure.'],
    bedside: [
      { action: 'Palpate a pulse while checking mentation, breathing, skin, and pressure.', meaning: 'Establish mechanical perfusion and clinical compromise.', limitation: 'An electrical rate does not prove cardiac output.' },
      { action: 'Ask about baseline rate, medications, overdose, ischemic symptoms, and renal disease.', meaning: 'Look for reversible toxic, ischemic, or metabolic causes.', limitation: 'A familiar medication dose does not exclude toxicity.' },
      { action: 'After pacing, check a matching pulse and blood pressure.', meaning: 'Mechanical capture must accompany electrical capture.', limitation: 'Muscle contraction can mimic a palpable response.' }
    ],
    basicTools: ['Manual cuff, ECG, glucose meter, pulse oximetry.'],
    differentials: [
      { condition: 'Physiologic bradycardia', discriminator: 'Baseline rate with preserved perfusion.' },
      { condition: 'Drug effect / hyperkalemia', discriminator: 'Exposure, renal context, ECG and laboratory testing.' }
    ],
    testing: [
      { test: 'Diagnostic ECG', role: 'Define conduction disturbance and ischemic clues.', timing: 'Without delaying support.' },
      { test: 'Targeted labs / echocardiography', role: 'Investigate electrolytes, ischemia, toxicity, and structural disease.', timing: 'Alongside stabilization.' }
    ],
    immediate: ['Correct reversible causes; atropine when appropriate; transcutaneous pacing and/or adrenergic infusion if required.'],
    definitive: ['Temporary transvenous pacing for persistent instability; cause-directed treatment or indicated permanent pacemaker.'],
    advancedTools: ['Pacer/defibrillator, infusion pump, transvenous pacing equipment.'],
    reassessment: ['Sustained capture, perfusion, pressure, symptoms, and recurrence.'],
    modifiers: { pediatric: ['Use pediatric bradycardia pathways.'], pregnancy: ['Coordinate maternal stabilization and obstetric care.'] },
    sources: [sources.bradyAlgorithm, sources.brady]
  },
  {
    id: 'copd-exacerbation',
    title: 'COPD exacerbation',
    category: 'Respiratory',
    presentations: ['Breathing difficulty', 'Altered mental status'],
    physiology: 'Worsening airflow obstruction can increase air trapping and impair gas exchange.',
    redFlags: ['Exhaustion, altered mentation, severe hypoxemia, or worsening ventilatory failure.'],
    bedside: [
      { action: 'Compare breathlessness, function, sputum, oxygen, and ventilation needs with baseline.', meaning: 'Establish change and possible infectious triggers.', limitation: 'Baseline disability does not explain new deterioration.' },
      { action: 'Assess speech, effort, expiration, air entry, and consciousness.', meaning: 'Identify respiratory failure and fatigue.', limitation: 'Saturation does not establish ventilation or carbon dioxide level.' },
      { action: 'Examine for focal findings, edema, asymmetric legs, or irregular pulse.', meaning: 'Seek pneumonia, heart failure, embolism, or arrhythmia.', limitation: 'A COPD diagnosis does not establish today’s cause.' }
    ],
    basicTools: ['Stethoscope, pulse oximeter, ECG, temperature.'],
    differentials: [
      { condition: 'Heart failure / pneumonia', discriminator: 'Congestion or focal findings; imaging.' },
      { condition: 'Pulmonary embolism', discriminator: 'Risk assessment and dedicated testing.' }
    ],
    testing: [
      { test: 'Arterial blood gas', role: 'Measure hypercapnia and acidemia.', timing: 'Respiratory failure; repeat after support changes.' },
      { test: 'Chest imaging / targeted labs', role: 'Identify complications and competing disease.', timing: 'Selected by severity and findings.' }
    ],
    immediate: ['Short-acting bronchodilators, systemic corticosteroid, controlled oxygen; antibiotics when indicated.'],
    definitive: ['Treat the trigger; noninvasive ventilation for hypercapnic failure, invasive ventilation when needed; confirm underlying obstruction with spirometry.', 'NIV requires airway protection, secretion handling and close monitoring; worsening mentation, exhaustion, shock or failed support warrants prompt invasive-airway escalation.'],
    advancedTools: ['Blood-gas analyzer, high-flow oxygen, noninvasive/invasive ventilator.'],
    reassessment: ['Effort, mentation, gases, oxygen requirement, secretion clearance.'],
    modifiers: { pediatric: ['Adult pathway; investigate pediatric alternatives.'], pregnancy: ['Individualize respiratory and obstetric care.'] },
    sources: [sources.gold]
  },
  {
    id: 'heart-failure-pulmonary-edema',
    title: 'Heart failure / pulmonary edema',
    category: 'Cardiovascular',
    presentations: ['Breathing difficulty', 'Chest pain', 'Shock / poor perfusion'],
    physiology: 'Elevated filling pressures cause congestion; inadequate forward flow causes hypoperfusion.',
    redFlags: ['Severe respiratory distress, shock, ischemia, or suspected acute mechanical complication.'],
    bedside: [
      { action: 'Ask about orthopnea, nocturnal breathlessness, weight change, medications, and chest discomfort.', meaning: 'Identify congestion and precipitating illness.', limitation: 'Pulmonary edema can reflect redistribution without weight gain.' },
      { action: 'Assess neck veins, edema, crackles, and heart sounds.', meaning: 'Map congestion and possible valvular disease.', limitation: 'Absent peripheral edema does not exclude pulmonary congestion.' },
      { action: 'Check mentation, skin temperature, pulses, and recent urine output.', meaning: 'Separate hypoperfusion from congestion.', limitation: 'Pressure alone does not establish adequate flow.' }
    ],
    basicTools: ['Manual cuff, stethoscope, ECG, pulse oximetry.'],
    differentials: [
      { condition: 'Pneumonia / obstructive lung disease', discriminator: 'Focal findings, history, imaging.' },
      { condition: 'Pulmonary embolism', discriminator: 'Dedicated risk assessment and testing.' }
    ],
    testing: [
      { test: 'Echo / lung imaging / natriuretic peptides', role: 'Characterize dysfunction and congestion.', timing: 'Early; interpret together.' },
      { test: 'Renal function, electrolytes, troponin, selected gas/lactate', role: 'Identify trigger and organ consequences.', timing: 'Alongside stabilization.' }
    ],
    immediate: ['Oxygen when hypoxemic; appropriate noninvasive ventilation; vasodilators for selected hypertensive presentations; diuresis for overload.', 'NIV requires airway protection, secretion handling and close monitoring; worsening mentation, exhaustion, shock or failed support warrants prompt invasive-airway escalation.'],
    definitive: ['Treat ischemic/mechanical trigger; selected vasopressor, inotrope, intubation, or circulatory support for failure.'],
    advancedTools: ['Ultrasound, ventilator, infusion pumps, catheterization/surgical facilities.'],
    reassessment: ['Effort, perfusion, pressure, urine, congestion, renal/electrolyte trend.'],
    modifiers: { pediatric: ['Use pediatric cardiac assessment.'], pregnancy: ['Consider peripartum cardiomyopathy; coordinate obstetrics.'] },
    sources: [sources.hf]
  },
  {
    id: 'pneumonia',
    title: 'Pneumonia',
    category: 'Respiratory',
    presentations: ['Breathing difficulty', 'Chest pain', 'Altered mental status', 'Shock / poor perfusion'],
    physiology: 'Pulmonary infection impairs gas exchange and can provoke systemic organ dysfunction.',
    redFlags: ['Respiratory failure, confusion, or hypoperfusion: evaluate severe pneumonia and sepsis.'],
    bedside: [
      { action: 'Ask about cough, sputum, fever, pleurisy, aspiration, exposures, and immune status.', meaning: 'Identify infection pattern and treatment risks.', limitation: 'Fever or purulent sputum need not be present.' },
      { action: 'Compare air entry, focal crackles, percussion, and respiratory effort.', meaning: 'Focal findings support consolidation or pleural disease.', limitation: 'Auscultation cannot reliably confirm or exclude pneumonia.' },
      { action: 'Assess mentation, intake, recent urine, skin perfusion, and functional decline.', meaning: 'Determine severity and care requirements.', limitation: 'Local chest findings do not measure systemic severity.' }
    ],
    basicTools: ['Thermometer, stethoscope, manual cuff, pulse oximeter.'],
    differentials: [
      { condition: 'Pulmonary edema', discriminator: 'Congestion assessment and cardiac/lung imaging.' },
      { condition: 'Embolism / aspiration', discriminator: 'Risk/onset pattern; targeted testing.' }
    ],
    testing: [
      { test: 'Chest radiograph / skilled lung ultrasound', role: 'Identify pulmonary infiltrate or pleural complication.', timing: 'Early when feasible.' },
      { test: 'Selected cultures, pathogen tests, labs, gas; CT if needed', role: 'Define severity, cause, or complication.', timing: 'Avoid delaying urgent antimicrobial treatment.' }
    ],
    immediate: ['Support oxygenation, ventilation, and perfusion; appropriate empiric antimicrobials.'],
    definitive: ['Pathogen-directed antibiotics/antivirals; drain infected pleural collections. Consider steroids for selected severe adult non-influenza pneumonia.'],
    advancedTools: ['Ultrasound/CT, blood-gas testing, ventilator, pleural drainage.'],
    reassessment: ['Effort, oxygen need, mentation, perfusion, and treatment response.'],
    modifiers: { pediatric: ['Use pediatric assessment and antibiotic guidance.'], pregnancy: ['Coordinate imaging and medication selection.'] },
    sources: [sources.cap, sources.capUpdate]
  },
  {
    id: 'pulmonary-embolism',
    title: 'Pulmonary embolism',
    category: 'Cardiovascular',
    presentations: ['Breathing difficulty', 'Chest pain', 'Collapse / syncope', 'Shock / poor perfusion', 'Pregnancy / postpartum'],
    physiology: 'Pulmonary arterial obstruction increases right-ventricular load and can reduce systemic output.',
    redFlags: ['Syncope, hypoperfusion, escalating respiratory support, or hemodynamic collapse.'],
    bedside: [
      { action: 'Establish onset, pleurisy, syncope, previous thrombosis, surgery/immobility, and malignancy.', meaning: 'Build structured pretest probability.', limitation: 'No recognized provoking factor does not exclude embolism.' },
      { action: 'Compare legs for unilateral swelling; assess breathing and perfusion.', meaning: 'Identify thrombosis clues and circulatory impact.', limitation: 'Normal legs or saturation do not exclude embolism.' },
      { action: 'Review recent bleeding, procedures, and anticoagulants.', meaning: 'Anticipate anticoagulation/reperfusion hazards.', limitation: 'Severity and bleeding risk require separate assessments.' }
    ],
    basicTools: ['Manual cuff, oximeter, ECG; validated probability tools.'],
    differentials: [
      { condition: 'Pneumonia / pneumothorax', discriminator: 'Chest examination and imaging.' },
      { condition: 'Coronary / aortic disease', discriminator: 'ECG and condition-specific imaging.' }
    ],
    testing: [
      { test: 'Eligible D-dimer pathway; CT pulmonary angiography or V/Q imaging', role: 'Use D-dimer only in eligible low/intermediate pretest probability; a negative result does not exclude high-probability PE. Dedicated imaging confirms.', timing: 'Urgent; adapt to stability.' },
      { test: 'Echo / biomarkers / venous ultrasound', role: 'Assess severity or associated thrombosis; echo alone is insufficient for diagnosis.', timing: 'Selected adjuncts.' }
    ],
    immediate: ['Support oxygenation/perfusion; anticoagulation when appropriate.'],
    definitive: ['Selected systemic thrombolysis, catheter therapy/thrombectomy, surgical embolectomy, or mechanical support.'],
    advancedTools: ['Dedicated imaging, infusion pumps, intervention/surgical center.'],
    reassessment: ['Perfusion, pressure, mentation, respiratory support, bleeding.'],
    modifiers: { pediatric: ['Adult probability rules may not apply.'], pregnancy: ['Use pregnancy-specific evaluation; retain indicated imaging.'] },
    sources: [sources.pe]
  },
  {
    id: 'sepsis-septic-shock',
    title: 'Sepsis / septic shock',
    category: 'Metabolic & toxicology',
    presentations: ['Shock / poor perfusion', 'Altered mental status', 'Breathing difficulty', 'Abdominal / pelvic pain'],
    physiology: 'Infection-associated organ dysfunction may combine vasodilation, leakage, and impaired cardiac performance.',
    redFlags: ['Suspected infection with hypoperfusion or new organ dysfunction.'],
    bedside: [
      { action: 'Seek respiratory, urinary, abdominal, skin, device, and procedural clues.', meaning: 'Localize infection and possible source-control needs.', limitation: 'An apparent source does not exclude another.' },
      { action: 'Track mentation, breathing, capillary refill, mottling, pressure, and recent urine.', meaning: 'Identify and trend organ perfusion.', limitation: 'Temperature or pressure alone cannot define severity.' },
      { action: 'Repeat examination after fluid or vasoactive treatment.', meaning: 'Assess benefit and developing congestion.', limitation: 'Capillary refill is affected by temperature and observation conditions.' }
    ],
    basicTools: ['Thermometer, manual cuff, oximeter, glucose meter.'],
    differentials: [
      { condition: 'Hemorrhage / cardiogenic shock', discriminator: 'Bleeding and congestion assessment; targeted ultrasound.' },
      { condition: 'Toxic / endocrine illness', discriminator: 'Exposure/context and directed testing.' }
    ],
    testing: [
      { test: 'Lactate, organ-function labs, cultures, targeted imaging', role: 'Assess consequences and investigate source.', timing: 'Do not delay urgent treatment.' }
    ],
    immediate: ['Prompt appropriate antimicrobials; individualized crystalloid resuscitation; norepinephrine for septic shock as indicated.'],
    definitive: ['Early source control; tailored antimicrobials; selected additional vasopressors, inotrope, corticosteroid, and organ support.'],
    advancedTools: ['Ultrasound/CT, infusion pumps, arterial monitoring, drainage/surgery, ventilation/dialysis.'],
    reassessment: ['Perfusion, urine, respiratory support, lactate trend; do not chase lactate with fluid alone.'],
    modifiers: { pediatric: ['Use pediatric sepsis guidance.'], pregnancy: ['Assess obstetric sources; coordinate maternal care.'] },
    sources: [sources.sepsis]
  },
  {
    id: 'tachyarrhythmia',
    title: 'Tachyarrhythmia with poor perfusion',
    category: 'Cardiovascular',
    presentations: ['Collapse / syncope', 'Chest pain', 'Breathing difficulty', 'Shock / poor perfusion'],
    physiology: 'Rapid or disorganized activation can impair filling and output; tachycardia can also be compensatory.',
    redFlags: ['Pulse loss, shock, ischemia, altered mentation, or acute heart failure.'],
    bedside: [
      { action: 'Confirm a pulse; assess mentation, pressure, skin, and breathing.', meaning: 'Determine perfusion and immediate urgency.', limitation: 'Monitor rate does not establish instability.' },
      { action: 'Ask whether palpitations preceded illness; assess pain, bleeding, fever, and hypoxia.', meaning: 'Separate causal arrhythmia from a secondary response.', limitation: 'Rate alone cannot make that distinction.' },
      { action: 'Review medications, stimulants, prior rhythm, and onset.', meaning: 'Identify triggers and treatment hazards.', limitation: 'A prior benign rhythm does not classify today’s tracing.' }
    ],
    basicTools: ['Pulse/manual cuff; rhythm strip and diagnostic ECG; artifact check.'],
    differentials: [
      { condition: 'Compensatory sinus tachycardia', discriminator: 'Treat the physiologic driver.' },
      { condition: 'Pre-excited atrial fibrillation / ventricular tachycardia', discriminator: 'QRS width, regularity, morphology, diagnostic ECG.' }
    ],
    testing: [
      { test: 'ECG, selected electrolytes/ischemia/toxicology tests, echo', role: 'Classify rhythm and substrate.', timing: 'Do not delay necessary electrical treatment.' }
    ],
    immediate: ['Appropriate synchronized cardioversion for causal unstable tachyarrhythmia; unsynchronized defibrillation for polymorphic ventricular tachycardia/pulseless shockable rhythm.'],
    definitive: ['Correct causes; selected rhythm/rate therapy, anticoagulation, ablation, or device therapy. Avoid atrioventricular-nodal blockers in pre-excited atrial fibrillation.'],
    advancedTools: ['Defibrillator, sedation/airway capability, electrophysiology services.'],
    reassessment: ['Perfusion, symptoms, post-treatment ECG, and recurrence.'],
    modifiers: { pediatric: ['Use pediatric rhythm criteria and therapies.'], pregnancy: ['Coordinate maternal and obstetric monitoring.'] },
    sources: [sources.als, sources.af]
  },
  {
    id: 'cardiac-tamponade',
    title: 'Tamponade, cardiac',
    category: 'Cardiovascular',
    presentations: ['Shock / poor perfusion', 'Breathing difficulty', 'Chest pain', 'Trauma / bleeding'],
    physiology: 'Pericardial pressure restricts cardiac filling and lowers output.',
    redFlags: ['Suspected tamponade with hemodynamic compromise needs urgent drainage.'],
    bedside: [
      { action: 'Ask about trauma/procedure, malignancy, renal failure, and inflammatory illness.', meaning: 'Identify a plausible pericardial cause.', limitation: 'Fluid accumulation rate matters as well as volume.' },
      { action: 'Assess neck veins, heart sounds, pulse, pressure, and perfusion.', meaning: 'Venous congestion with poor output supports obstruction.', limitation: 'Beck’s triad may be absent.' },
      { action: 'Measure respiratory blood-pressure variation when feasible.', meaning: 'Pulsus paradoxus supports impaired filling.', limitation: 'It is not unique to tamponade; never delay urgent care.' }
    ],
    basicTools: ['Manual cuff, stethoscope, ECG.'],
    differentials: [
      { condition: 'Tension pneumothorax', discriminator: 'Chest asymmetry; immediate pleural assessment.' },
      { condition: 'Pulmonary embolism / right-heart failure', discriminator: 'Targeted echocardiography and cause-specific testing.' }
    ],
    testing: [
      { test: 'Urgent echocardiography', role: 'Assess effusion, distribution, and filling compromise.', timing: 'At bedside alongside clinical assessment.' },
      { test: 'Fluid analysis / targeted imaging', role: 'Identify underlying cause.', timing: 'After necessary stabilization.' }
    ],
    immediate: ['Arrange drainage; selected temporary fluid support. Avoid unnecessary positive-pressure ventilation and diuresis.'],
    definitive: ['Image-guided pericardiocentesis or surgical drainage/repair, particularly for bleeding, clot, or purulence.'],
    advancedTools: ['Echo, drainage equipment, cardiothoracic surgical capability.'],
    reassessment: ['Pressure, perfusion, respiratory status, and repeat echo for reaccumulation.'],
    modifiers: { pediatric: ['Use pediatric procedural expertise.'], pregnancy: ['Coordinate maternal stabilization and obstetrics.'] },
    sources: [sources.pericardium]
  },
  {
    id: 'tension-pneumothorax',
    title: 'Tension pneumothorax',
    category: 'Trauma',
    presentations: ['Breathing difficulty', 'Chest pain', 'Shock / poor perfusion', 'Trauma / bleeding'],
    physiology: 'Pressurized pleural gas impairs ventilation and venous return.',
    redFlags: ['Suspected tension physiology: emergency decompression must not await imaging.'],
    bedside: [
      { action: 'Ask about trauma, procedures, ventilation, and sudden deterioration.', meaning: 'Establish timing and precipitating context.', limitation: 'Visible chest injury is unnecessary.' },
      { action: 'Compare expansion and air entry; palpate chest/subcutaneous tissues; percuss if feasible.', meaning: 'Asymmetry supports a unilateral pleural process.', limitation: 'Noise, shallow breathing, and body habitus limit examination.' },
      { action: 'Check perfusion, pressure, and ventilation difficulty.', meaning: 'Physiologic compromise determines urgency.', limitation: 'Do not require tracheal deviation or jugular distension.' }
    ],
    basicTools: ['Stethoscope, manual cuff, pulse oximeter.'],
    differentials: [
      { condition: 'Mainstem tube / obstruction', discriminator: 'Tube depth, circuit, suction, bilateral entry.' },
      { condition: 'Hemothorax / tamponade', discriminator: 'Bleeding context and bedside ultrasound.' }
    ],
    testing: [
      { test: 'Immediate ultrasound when available', role: 'Refine pleural assessment.', timing: 'Do not delay decompression.' },
      { test: 'Radiograph / CT', role: 'Define injury and complications.', timing: 'After stabilization or when clinically appropriate.' }
    ],
    immediate: ['Emergency pleural decompression by an appropriate trained clinician; support ventilation/perfusion.'],
    definitive: ['Effective chest drainage; investigate persistent leak or airway injury with bronchoscopy/surgery when indicated.'],
    advancedTools: ['Ultrasound, thoracostomy/chest-drain equipment, CT, bronchoscopy.'],
    reassessment: ['Air entry, ventilation, saturation, pressure; verify decompression effectiveness if unimproved.'],
    modifiers: { pediatric: ['Use size-appropriate equipment and technique.'], pregnancy: ['Stabilize maternal breathing and circulation promptly.'] },
    sources: [sources.thorax]
  }
];
