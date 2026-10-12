// Original bedside-first reference content. Sources checked 2026-10-12.
const S = {
  bleeding: { label: 'European guideline on traumatic bleeding and coagulopathy, sixth edition (2023)', url: 'https://link.springer.com/article/10.1186/s13054-023-04327-7' },
  trauma: { label: 'NICE NG39: Major trauma, assessment and initial management (2016)', url: 'https://www.nice.org.uk/guidance/ng39/chapter/Recommendations' },
  tbi: { label: 'American College of Surgeons: Traumatic Brain Injury Best Practices (2024)', url: 'https://www.facs.org/media/vgfgjpfk/best-practices-guidelines-traumatic-brain-injury.pdf' },
  head: { label: 'NICE NG232: Head injury, assessment and early management (2023)', url: 'https://www.nice.org.uk/guidance/NG232/chapter/recommendations' },
  spine: { label: 'American College of Surgeons: Spine Injury Best Practices (2022)', url: 'https://www.facs.org/media/k45gikqv/spine_injury_guidelines.pdf' },
  spinePerfusion: { label: 'AO Spine/Praxis: Acute spinal cord injury hemodynamic guideline (2024)', url: 'https://journals.sagepub.com/doi/10.1177/21925682231202348' },
  limb: { label: 'AAOS: Management of Acute Compartment Syndrome (2025)', url: 'https://www.aaos.org/acscpg2025' },
  limbBedside: { label: 'British Orthopaedic Association: Compartment syndrome standard (2025)', url: 'https://www.boa.ac.uk/resource/boast-10-pdf.html' },
  limbVascular: { label: 'EAST: Penetrating lower-extremity arterial trauma guideline (2012)', url: 'https://www.east.org/education-resources/practice-management-guidelines/details/penetrating-lower-extremity-arterial-trauma,-evaluation-and-management-of' },
  stroke: { label: 'AHA/ASA: Early management of acute ischemic stroke (2026)', url: 'https://www.ahajournals.org/doi/10.1161/STR.0000000000000513' },
  strokeExam: { label: 'NIH/NINDS: NIH Stroke Scale examination instructions', url: 'https://www.ninds.nih.gov/sites/default/files/migrate-documents/nih_stroke_scale_booklet_508c.pdf' },
  strokeSigns: { label: 'NIH/NINDS: Stroke signs and symptoms', url: 'https://www.ninds.nih.gov/health-information/stroke/signs-and-symptoms' },
  ich: { label: 'AHA/ASA: Spontaneous intracerebral hemorrhage guideline (2022)', url: 'https://professional.heart.org/-/media/CPR2-Files/Private/2022-Guideline-for-the-Management-of-Patients-With-Spontaneous-Intracerebral-Hemorrhage-1.pdf' },
  sah: { label: 'AHA/ASA: Aneurysmal subarachnoid hemorrhage guideline (2023)', url: 'https://www.ahajournals.org/doi/pdf/10.1161/STR.0000000000000436' },
  sahDiagnosis: { label: 'NICE NG228: Aneurysmal subarachnoid hemorrhage (2022)', url: 'https://www.nice.org.uk/guidance/ng228/chapter/Recommendations' },
  andexxa: { label: 'FDA: Andexxa safety and U.S. sales discontinuation (2025)', url: 'https://www.fda.gov/safety/medical-product-safety-information/update-safety-andexxa-astrazeneca-fda-safety-communication' },
  seizures: { label: 'American Epilepsy Society: Convulsive status epilepticus guideline (2016)', url: 'https://cms.aesnet.org/clinical-care/clinical-guidance/guideline-prolonged-seizures/guideline-for-treatment-of-prolonged-seizures-in-children-and-adults' },
  esett: { label: 'ESETT randomized trial: Levetiracetam, fosphenytoin and valproate (2019)', url: 'https://pubmed.ncbi.nlm.nih.gov/31774955' },
  ems: { label: 'NASEMSO: National Model EMS Clinical Guidelines, version 3 (2022)', url: 'https://nasemso.org/wp-content/uploads/National-Model-EMS-Clinical-Guidelines_2022.pdf' },
  amsImaging: { label: 'American College of Radiology: Altered mental status imaging (2024)', url: 'https://acsearch.acr.org/docs/3102409/Narrative/' },
  delirium: { label: 'NICE CG103: Delirium assessment and management (updated 2023)', url: 'https://www.nice.org.uk/guidance/cg103/chapter/Recommendations' },
  hypoglycemia: { label: 'American Diabetes Association: Glycemic goals and hypoglycemia (2026)', url: 'https://diabetesjournals.org/care/article/49/Supplement_1/S132/163927/6-Glycemic-Goals-Hypoglycemia-and-Hyperglycemic' },
  hypoglycemiaPediatric: { label: 'Royal Children’s Hospital: Pediatric hypoglycemia guideline', url: 'https://www.rch.org.au/clinicalguide/guideline_index/Hypoglycaemia_Guideline/' },
  sulfonylurea: { label: 'University of Utah Poison Control: Octreotide protocol', url: 'https://poisoncontrol.utah.edu/documents/protocol-octreotide' },
  diabetesCrisis: { label: 'ADA/EASD and partner societies: Hyperglycemic crises consensus (2024)', url: 'https://link.springer.com/article/10.1007/s00125-024-06183-8' },
  diabetesPediatric: { label: 'Royal Children’s Hospital: Pediatric diabetic ketoacidosis guideline', url: 'https://www.rch.org.au/clinicalguide/guideline_index/Diabetic_Ketoacidosis/' },
  resuscitation: { label: 'AHA: Adult and pediatric special circumstances of resuscitation (2025)', url: 'https://cpr.heart.org/en/resuscitation-science/cpr-and-ecc-guidelines/adult-and-pediatric-special-circumstances-of-resuscitation/' },
  opioidTests: { label: 'American College of Medical Toxicology: Urine opioid testing statement (2022)', url: 'https://www.acmt.net/wp-content/uploads/2022/06/PRS_210913_Interpretation-of-Urine-Opiate-and-Opioid-Tests.pdf' },
  co: { label: 'CDC: Clinical guidance for carbon monoxide poisoning (2024)', url: 'https://www.cdc.gov/carbon-monoxide/hcp/clinical-guidance/index.html' },
  coPolicy: { label: 'ACEP: Acute carbon monoxide poisoning clinical policy (2025)', url: 'https://www.acepnow.com/article/new-clinical-policy-for-adult-patients-with-acute-carbon-monoxide-poisoning/' },
  pregnancyImaging: { label: 'ACOG Committee Opinion 723: Diagnostic imaging during pregnancy (2017)', url: 'https://www.acog.org/clinical/clinical-guidance/committee-opinion/articles/2017/10/guidelines-for-diagnostic-imaging-during-pregnancy-and-lactation' }
};

export const traumaNeuroPathways = [
  {
    id: 'acute-limb-threat',
    title: 'Acute limb threat / compartment syndrome',
    category: 'Trauma',
    presentations: ['Trauma / bleeding', 'Shock / poor perfusion', 'Pediatric'],
    physiology: 'Arterial interruption or rising compartment pressure reduces muscle and nerve perfusion; delay can make tissue injury irreversible.',
    redFlags: ['Cold or pale limb with new weakness or sensory loss; expanding hematoma, pulsatile bleeding, or rapidly escalating pain.', 'Suspected compartment syndrome or a clinically threatened limb needs immediate surgical escalation.'],
    bedside: [
      { action: 'Compare both limbs: temperature, color, capillary refill, pulses, sensation and active movement.', meaning: 'A new asymmetric perfusion or neurological deficit raises vascular injury or ischemia.', limitation: 'A palpable pulse does not exclude arterial injury or compartment syndrome.' },
      { action: 'Ask whether pain is worsening or analgesic needs are increasing; gently assess passive stretch and compartment tension.', meaning: 'Progressive pain, stretch pain and tense swelling raise compartment pressure concern.', limitation: 'Pain may be unreliable with altered consciousness, nerve injury or regional anesthesia; absent pain cannot clear the limb.' },
      { action: 'Inspect the injury, dressing/cast and joint alignment; establish compression and ischemia duration.', meaning: 'A tight external device or displaced injury may contribute to impaired perfusion.', limitation: 'An open fracture does not necessarily decompress every involved compartment.' }
    ],
    basicTools: ['Handheld Doppler and correctly sized blood-pressure cuffs: compare arterial signals and obtain an arterial pressure index when appropriate.', 'Splinting materials and scissors: support the injury and release avoidable external constriction.'],
    differentials: [
      { condition: 'Isolated fracture or soft-tissue injury', discriminator: 'Serial neurological/perfusion examination; unexpected progression requires renewed vascular and compartment assessment.' },
      { condition: 'Primary nerve injury', discriminator: 'Map the deficit, but investigate associated vascular injury rather than attributing all weakness to the nerve.' }
    ],
    testing: [
      { test: 'Compartment pressure measurement', role: 'Supports diagnosis when examination is uncertain or unreliable; interpret against diastolic pressure and clinical trajectory.', timing: 'Urgent surgical assessment; measurements must not delay fasciotomy when the diagnosis is clinically established.' },
      { test: 'CT angiography / vascular imaging', role: 'Defines suspected arterial injury; an abnormal examination or arterial pressure index warrants further evaluation.', timing: 'When stable enough and imaging will guide care; hard vascular signs may justify immediate exploration.' },
      { test: 'Radiographs, potassium, renal function and creatine kinase', role: 'Characterize skeletal injury and consequences of muscle breakdown; these do not exclude compartment syndrome.', timing: 'Alongside definitive planning, without delaying reperfusion.' }
    ],
    immediate: ['Control hemorrhage, remove unnecessary constriction, provide analgesia and support systemic perfusion.', 'Splint; urgent reduction of a perfusion-threatening displacement requires the appropriate clinician and protocol.'],
    definitive: ['Emergency fasciotomy for acute compartment syndrome; arterial repair, temporary shunting or other revascularization as indicated.', 'Orthopedic/vascular surgery manages stabilization, debridement and reperfusion complications.'],
    advancedTools: ['Compartment manometer, vascular ultrasound/angiography, operating room and vascular shunts.'],
    reassessment: ['Repeat motor, sensory and perfusion findings after every manipulation or dressing change; track time and pain trajectory.'],
    modifiers: { pediatric: ['Escalating analgesic demand, anxiety or agitation may be the first usable clues in a child with an unreliable pain description.'], pregnancy: [] },
    sources: [S.limb, S.limbBedside, S.limbVascular]
  },
  {
    id: 'acute-ischemic-stroke',
    title: 'Acute stroke / transient focal deficit',
    category: 'Neurologic',
    presentations: ['Focal deficit / seizure', 'Altered mental status', 'Collapse / syncope', 'Pediatric'],
    physiology: 'Interrupted regional blood flow causes focal brain dysfunction; threatened tissue and treatment eligibility depend on time, anatomy and imaging.',
    redFlags: ['New focal deficit, severe ataxia, abrupt visual loss or unexplained reduced consciousness: activate urgent stroke evaluation.', 'Deteriorating airway or consciousness requires simultaneous stabilization.'],
    bedside: [
      { action: 'Establish last-known-well separately from discovery time; ask about baseline disability, anticoagulants and symptom evolution.', meaning: 'Timing and baseline function shape reperfusion decisions and distinguish new deficits.', limitation: 'Unknown onset or presentation beyond 4.5 hours does not exclude every reperfusion option.' },
      { action: 'Examine gaze, fields, facial movement, arm/leg drift, sensation, naming, commands and neglect.', meaning: 'A coherent focal pattern supports a vascular territory and identifies disabling deficits.', limitation: 'A low NIH Stroke Scale score or normal brief screen cannot exclude a disabling stroke.' },
      { action: 'Assess eye movements, coordination and safe sitting balance; ask about diplopia and abrupt gait failure.', meaning: 'Brainstem/cerebellar findings raise posterior circulation disease.', limitation: 'Do not force walking in an unsafe patient or apply HINTS outside its validated clinical context and examiner training.' }
    ],
    basicTools: ['Glucose meter: identify a reversible mimic immediately.', 'Penlight, simple naming objects and standardized stroke scale: make serial examinations comparable.'],
    differentials: [
      { condition: 'Hypoglycemia or postictal deficit', discriminator: 'Glucose, witnessed seizure and recovery trajectory; persistent focal signs still need stroke imaging.' },
      { condition: 'Intracranial hemorrhage or migraine aura', discriminator: 'History changes probability; examination alone cannot safely separate these from ischemia.' }
    ],
    testing: [
      { test: 'Noncontrast head CT', role: 'Detects hemorrhage and major established injury; an early normal scan does not exclude ischemia.', timing: 'Urgently as part of stroke activation.' },
      { test: 'CT/MR angiography; selected perfusion imaging or MRI', role: 'Identifies occlusion and refines diagnosis or extended-window treatment selection.', timing: 'Rapidly through the stroke pathway; do not delay otherwise eligible treatment with unnecessary studies.' },
      { test: 'ECG and targeted laboratory testing', role: 'Assesses rhythm, glucose, coagulation and relevant treatment contraindications.', timing: 'In parallel with brain imaging.' }
    ],
    immediate: ['Support oxygenation and perfusion, correct hypoglycemia, and keep oral intake pending swallowing assessment.', 'Arrange the appropriate stroke destination; avoid empiric antithrombotics before necessary hemorrhage exclusion.'],
    definitive: ['Eligible alteplase or tenecteplase and/or thrombectomy, selected by the stroke team using current criteria.', 'Mechanism-directed antithrombotic treatment and secondary prevention after the acute decision.'],
    advancedTools: ['Stroke CT/angiography, MRI/perfusion, thrombectomy suite and stroke-unit monitoring.'],
    reassessment: ['Repeat the same neurological examination; communicate new onset information, worsening, fluctuation or incomplete recovery.'],
    modifiers: { pediatric: ['Children can have stroke; urgent pediatric stroke expertise and imaging are required.'], pregnancy: ['Coordinate stroke and obstetric care; clinically necessary imaging should not be withheld because of pregnancy.'] },
    sources: [S.stroke, S.strokeExam, S.strokeSigns, S.pregnancyImaging]
  },
  {
    id: 'altered-mental-status',
    title: 'Altered mental status / toxic-metabolic illness',
    category: 'Neurologic',
    presentations: ['Altered mental status', 'Focal deficit / seizure', 'Collapse / syncope', 'Pediatric'],
    physiology: 'Global brain dysfunction can reflect impaired oxygen/glucose delivery, abnormal chemistry, toxins, infection or structural disease.',
    redFlags: ['Inadequate ventilation, hypoglycemia, shock, dangerous temperature, meningismus with systemic illness, or new focal deficit.', 'New coma or progressive loss of airway protection needs immediate stabilization.'],
    bedside: [
      { action: 'Obtain baseline and onset from someone who knows the patient; test arousal, attention and command-following.', meaning: 'Acute change and fluctuating attention suggest delirium and require a cause search.', limitation: 'Dementia, language barriers and hearing loss confound testing; orientation alone is insufficient.' },
      { action: 'Observe respiratory depth, pupils, skin moisture/temperature, symmetry and evidence of trauma.', meaning: 'Ventilatory failure, toxidromes, temperature illness or focal brain disease may become apparent before laboratory results.', limitation: 'Alcohol odor or a psychiatric history does not explain away a medical emergency.' },
      { action: 'Review medications, missed doses, access to toxins, intake, urine output, infection symptoms and shared exposures.', meaning: 'Identifies plausible reversible causes and guides targeted testing.', limitation: 'Collateral histories and medication lists may be incomplete; mixed causes are common.' }
    ],
    basicTools: ['Glucose, thermometer, pulse oximeter and capnography: assess immediately reversible physiological problems.', 'A validated delirium assessment such as 4AT supports recognition in an appropriate patient; it does not identify the cause.'],
    differentials: [
      { condition: 'Stroke, hemorrhage or nonconvulsive seizure', discriminator: 'Focal findings, unexplained failure to recover, CT/MRI and EEG as indicated.' },
      { condition: 'Hypoxia/hypercapnia, infection, intoxication or electrolyte/organ failure', discriminator: 'Respiratory examination, exposure context, blood gas and targeted chemistry/infection testing.' }
    ],
    testing: [
      { test: 'Electrolytes, renal/liver tests, blood gas and selected toxicology/infection studies', role: 'Identifies treatable metabolic, respiratory or infectious causes; choose tests from the presentation.', timing: 'Early, without postponing correction of glucose, ventilation or shock.' },
      { test: 'Head CT; selected MRI', role: 'Investigates structural disease, particularly with focality, trauma or persistent unexplained altered status.', timing: 'Urgent when indicated; a presumed metabolic explanation does not prohibit imaging.' },
      { test: 'EEG or lumbar puncture', role: 'Evaluates nonconvulsive status or central nervous system infection when suspected.', timing: 'After stabilization and assessment of procedure safety; do not delay necessary empiric infection treatment.' }
    ],
    immediate: ['Correct oxygenation/ventilation, glucose, perfusion and temperature; give indicated antidotes.', 'Use calm communication, orientation and sensory aids while assessing and treating the cause.'],
    definitive: ['Cause-directed treatment for infection, intoxication/withdrawal, endocrine/electrolyte disease or organ failure; specialist and critical-care support when needed.'],
    advancedTools: ['Blood-gas analyzer, CT/MRI, EEG, lumbar-puncture equipment and organ-support capability.'],
    reassessment: ['Track attention and arousal against baseline, repeat focal examination, and investigate persistent impairment after initial correction.'],
    modifiers: { pediatric: ['Use caregiver-reported behavior and developmental baseline; poor interaction or feeding may replace a verbal complaint.'], pregnancy: ['Add pregnancy/postpartum hypertensive and metabolic emergencies to the cause search.'] },
    sources: [S.ems, S.delirium, S.amsImaging]
  },
  {
    id: 'carbon-monoxide',
    title: 'Carbon monoxide exposure',
    category: 'Metabolic & toxicology',
    presentations: ['Altered mental status', 'Collapse / syncope', 'Chest pain', 'Breathing difficulty', 'Pregnancy / postpartum'],
    physiology: 'Carbon monoxide impairs oxygen transport and tissue function, creating neurological and cardiac injury despite misleading oxygen-saturation readings.',
    redFlags: ['Syncope, neurological deficit, ischemic chest symptoms, dysrhythmia, severe acidosis or pregnancy after a credible exposure.'],
    bedside: [
      { action: 'Ask about combustion, enclosed spaces, generators/heaters, fires and similarly ill people or pets.', meaning: 'A shared exposure or improvement outside the location strongly raises suspicion.', limitation: 'An isolated case or nonspecific headache does not exclude exposure.' },
      { action: 'Assess attention, memory, coordination, gait when safe, and cardiac symptoms.', meaning: 'Neurological or cardiac dysfunction indicates clinically important toxicity.', limitation: 'Apparent initial recovery does not eliminate risk of delayed neurological problems.' }
    ],
    basicTools: ['Glucose and repeated neurological examination help assess mimics and trajectory.', 'Conventional pulse oximetry cannot exclude carbon monoxide poisoning.'],
    differentials: [{ condition: 'Viral illness, hypoglycemia or another intoxication', discriminator: 'Exposure pattern, glucose and blood co-oximetry; assess concurrent smoke inhalation and trauma.' }],
    testing: [
      { test: 'Blood co-oximetry', role: 'Measures carboxyhemoglobin; elapsed time and oxygen treatment can lower the measured concentration.', timing: 'Promptly, without delaying oxygen; the number alone does not grade severity.' },
      { test: 'ECG, troponin and blood gas', role: 'Assesses cardiac injury and acid-base disturbance in significant exposure.', timing: 'Early when symptoms or severity warrant.' }
    ],
    immediate: ['Leave the exposure safely; provide high-concentration oxygen and support ventilation/circulation.'],
    definitive: ['Consult toxicology/Poison Control; selected symptomatic patients may benefit from hyperbaric oxygen based on severity and access.', 'Arrange follow-up for new cognitive, behavioral or motor symptoms after apparent recovery.'],
    advancedTools: ['Laboratory co-oximeter, cardiac monitoring and hyperbaric oxygen facility when indicated.'],
    reassessment: ['Repeat neurological and cardiac assessment; worsening requires renewed evaluation despite falling carboxyhemoglobin.'],
    modifiers: { pediatric: ['Use age-appropriate neurological assessment and investigate all potentially exposed household members.'], pregnancy: ['Fetal risk changes treatment decisions; obtain early obstetric and hyperbaric/toxicology advice.'] },
    sources: [S.co, S.coPolicy]
  },
  {
    id: 'dka-hhs',
    title: 'Diabetic ketoacidosis / hyperosmolar crisis',
    category: 'Metabolic & toxicology',
    presentations: ['Altered mental status', 'Breathing difficulty', 'Shock / poor perfusion', 'Abdominal / pelvic pain', 'Pediatric'],
    physiology: 'Insulin deficiency causes ketosis/acidosis or severe hyperosmolar dehydration; both can produce major fluid and electrolyte deficits.',
    redFlags: ['Shock, reduced consciousness, respiratory exhaustion, or worsening neurological status during treatment.'],
    bedside: [
      { action: 'Ask about thirst, polyuria, vomiting, missed insulin, infection and SGLT2 inhibitors.', meaning: 'Identifies a hyperglycemic-crisis pattern and possible precipitant.', limitation: 'Ketoacidosis can occur without marked hyperglycemia.' },
      { action: 'Examine perfusion, hydration, abdominal tenderness and breathing depth.', meaning: 'Deep compensatory breaths and abdominal symptoms favor acidosis; profound dehydration and neurological dysfunction raise hyperosmolar disease.', limitation: 'Breathing pattern and glucose alone establish neither diagnosis; mixed disease occurs.' }
    ],
    basicTools: ['Glucose and blood-ketone meters; serial mentation and perfusion assessment.', 'ECG evaluates rhythm and possible potassium effects without replacing potassium measurement.'],
    differentials: [{ condition: 'Sepsis, toxic alcohol/salicylate exposure or starvation ketosis', discriminator: 'History, ketones, venous gas, osmolality and targeted testing distinguish overlapping presentations.' }],
    testing: [
      { test: 'Beta-hydroxybutyrate, venous pH/bicarbonate, electrolytes and renal function', role: 'Confirms ketosis/acidosis and identifies potassium-related treatment constraints.', timing: 'Urgently before insulin-directed correction.' },
      { test: 'Osmolality and cause-directed investigations', role: 'Establishes hyperosmolar disease and evaluates its precipitant.', timing: 'Early and serially during correction.' }
    ],
    immediate: ['Reassessed isotonic fluid resuscitation; protect ventilation and identify potassium.', 'In adults with potassium below 3.5 mmol/L, replace potassium and defer insulin until potassium exceeds 3.5.'],
    definitive: ['Protocolized fluids, insulin, electrolytes and dextrose as needed while metabolic abnormalities resolve; treat the trigger.'],
    advancedTools: ['Infusion pumps, blood-gas/electrolyte testing, osmolality measurement and critical-care monitoring.'],
    reassessment: ['Trend mentation, potassium, ketones/acidosis, osmolality, urine output and overload; falling glucose alone does not establish resolution.'],
    modifiers: { pediatric: ['Use a dedicated pediatric pathway. Recheck neurological status frequently; suspected cerebral injury requires immediate treatment without waiting for CT.'], pregnancy: ['Ketoacidosis may develop at lower glucose levels; coordinate urgent obstetric and metabolic care.'] },
    sources: [S.diabetesCrisis, S.diabetesPediatric]
  },
  {
    id: 'hypoglycemia',
    title: 'Hypoglycemia',
    category: 'Metabolic & toxicology',
    presentations: ['Altered mental status', 'Focal deficit / seizure', 'Collapse / syncope', 'Pediatric'],
    physiology: 'Insufficient available glucose impairs brain function and triggers autonomic responses; prolonged or recurrent deficiency can injure the brain.',
    redFlags: ['Seizure, coma, inability to swallow, or persistent/recurrent hypoglycemia needs immediate correction.'],
    bedside: [
      { action: 'Check glucose in unexplained confusion, weakness, focal deficit or seizure; examine sweating, tremor and behavior.', meaning: 'Low glucose supplies a rapidly treatable explanation for neurological dysfunction.', limitation: 'Autonomic warning signs can be absent; symptoms alone cannot reliably estimate the concentration.' },
      { action: 'Ask about insulin, sulfonylureas, last intake, exertion, alcohol, renal disease and previous episodes.', meaning: 'Longer-acting medication or impaired clearance raises recurrence risk.', limitation: 'A single corrected reading does not establish that the cause has ended.' }
    ],
    basicTools: ['Glucose meter and repeat measurement: use the trend together with neurological recovery.', 'Confirm an unexpected low bedside result with a reliable sample when feasible without delaying necessary treatment.'],
    differentials: [
      { condition: 'Stroke or postictal state', discriminator: 'Persistent focal findings or impaired recovery after glucose correction need continued neurological evaluation.' },
      { condition: 'Sepsis, adrenal/metabolic disease or poisoning', discriminator: 'Unexplained or recurrent hypoglycemia requires cause-directed laboratory investigation.' }
    ],
    testing: [
      { test: 'Glucose measurement', role: 'Below 70 mg/dL is an adult diabetes alert threshold; below 54 is clinically significant. Severe episodes are defined clinically by assistance required.', timing: 'Immediately and again after treatment.' },
      { test: 'Laboratory glucose, chemistry and selected critical sample', role: 'Investigates an unexplained cause; pediatric endocrine/metabolic samples may be most informative during the low value.', timing: 'Obtain when feasible without delaying glucose correction.' }
    ],
    immediate: ['Give fast-acting oral glucose only with safe swallowing; otherwise clinician-selected parenteral glucose or glucagon when access is unavailable.', 'Support airway and ventilation if consciousness is impaired.'],
    definitive: ['Provide ongoing glucose/nutrition and address the cause; sulfonylurea poisoning may require octreotide with toxicology advice.', 'Observe when recurrent hypoglycemia is plausible; review the medication plan and ability to eat reliably.'],
    advancedTools: ['IV/IO access, infusion pump and laboratory/endocrine testing when indicated.'],
    reassessment: ['Document glucose and return toward baseline, then recheck for recurrence; investigate incomplete recovery.'],
    modifiers: { pediatric: ['Use age-specific thresholds and weight-based treatment, especially in neonates. Consider endocrine/metabolic disease in unexplained episodes.'], pregnancy: ['Coordinate glucose treatment with the insulin/intake plan; assess for concurrent illness rather than assuming pregnancy explains the episode.'] },
    sources: [S.hypoglycemia, S.hypoglycemiaPediatric, S.sulfonylurea]
  },
  {
    id: 'intracranial-hemorrhage',
    title: 'Intracranial hemorrhage / thunderclap headache',
    category: 'Neurologic',
    presentations: ['Focal deficit / seizure', 'Altered mental status', 'Collapse / syncope'],
    physiology: 'Intracranial bleeding damages tissue and may raise pressure, obstruct cerebrospinal-fluid flow or compromise cerebral perfusion.',
    redFlags: ['Thunderclap headache, collapse, new focal deficit, seizure, declining consciousness or new pupillary asymmetry.', 'Progressive neurological deterioration requires immediate airway and neurosurgical escalation.'],
    bedside: [
      { action: 'Ask how quickly headache reached maximum intensity, with exertion, collapse, neck pain or vomiting; identify anticoagulants.', meaning: 'Abrupt maximal headache raises subarachnoid hemorrhage; anticoagulants raise bleeding concern.', limitation: 'A normal neurological examination or improving headache does not exclude subarachnoid bleeding.' },
      { action: 'Trend consciousness, pupils, gaze and bilateral limb movement; assess airway and pressure.', meaning: 'New asymmetry or decline suggests evolving injury, pressure or hydrocephalus.', limitation: 'Clinical appearance cannot reliably distinguish hemorrhagic from ischemic stroke.' }
    ],
    basicTools: ['Penlight, glucose meter and repeat blood pressure; record comparable neurological findings.'],
    differentials: [
      { condition: 'Ischemic stroke', discriminator: 'Urgent brain imaging before choosing antithrombotic/reperfusion treatment.' },
      { condition: 'Migraine, meningitis, venous thrombosis or arterial dissection', discriminator: 'Onset and examination guide CT/angiography, venous imaging or lumbar puncture; thunderclap needs a vascular workup.' }
    ],
    testing: [
      { test: 'Noncontrast head CT', role: 'Detects acute hemorrhage and mass effect.', timing: 'Urgently; sensitivity for subarachnoid blood depends on timing and scan quality.' },
      { test: 'Lumbar puncture after negative CT when indicated', role: 'Evaluates unresolved suspicion for subarachnoid hemorrhage, particularly with later presentation.', timing: 'Follow the diagnostic pathway and assess safety; a negative CT is not a universal stop rule.' },
      { test: 'CT/MR angiography or catheter angiography; coagulation and chemistry', role: 'Defines a vascular source and treatment-relevant anticoagulation/metabolic abnormalities.', timing: 'Early, guided by the hemorrhage pattern and specialist team.' }
    ],
    immediate: ['Support airway/perfusion; use controlled blood-pressure management, treat active seizures and urgently reverse indicated anticoagulant effects.', 'Warfarin reversal uses IV vitamin K plus four-factor prothrombin complex concentrate; dabigatran may require idarucizumab. Use a current factor Xa inhibitor reversal pathway.'],
    definitive: ['Neurosurgical evacuation/decompression or ventricular drainage when indicated; aneurysm coiling/clipping for a ruptured aneurysm.', 'Confirmed aneurysmal subarachnoid hemorrhage requires neurocritical care, nimodipine and surveillance for delayed ischemia.'],
    advancedTools: ['Neurovascular imaging, angiography suite, ventricular drain, pressure monitoring and operating room.'],
    reassessment: ['Trend pupils, consciousness, deficit and pressure; new decline demands evaluation for rebleeding, hydrocephalus, seizure or ischemia.'],
    modifiers: { pediatric: ['Pediatric neurological and vascular expertise is needed; causes and interventions differ from typical adult spontaneous hemorrhage.'], pregnancy: ['Add pregnancy/postpartum vascular and hypertensive causes; necessary imaging should proceed with coordinated obstetric care.'] },
    sources: [S.ich, S.sah, S.sahDiagnosis, S.andexxa, S.pregnancyImaging]
  },
  {
    id: 'opioid-toxicity',
    title: 'Opioid toxicity / respiratory depression',
    category: 'Metabolic & toxicology',
    presentations: ['Altered mental status', 'Breathing difficulty', 'Collapse / syncope', 'Pediatric'],
    physiology: 'Opioid effects suppress ventilation and airway protection, causing carbon-dioxide retention, hypoxemia and potentially cardiac arrest.',
    redFlags: ['Slow or shallow breathing, apnea, cyanosis, loss of airway protection or cardiac arrest.'],
    bedside: [
      { action: 'Count breaths and assess depth, chest rise, airway sounds and responsiveness; check pupils.', meaning: 'Inadequate ventilation with depressed consciousness raises opioid or sedative toxicity.', limitation: 'Pinpoint pupils are supportive, not required; a normal oxygen saturation on supplemental oxygen may conceal hypoventilation.' },
      { action: 'Ask about medications, patches, route, last exposure, co-ingestants and recent trauma.', meaning: 'Longer-acting drugs and combinations change recurrence risk and the differential.', limitation: 'History may be unavailable and the actual drug may differ from what was intended.' }
    ],
    basicTools: ['Bag-mask ventilation, suction and airway adjuncts address the immediate threat.', 'Glucose and capnography help assess mimics and ventilation; pulse oximetry tracks oxygenation.'],
    differentials: [
      { condition: 'Hypoglycemia, stroke or head injury', discriminator: 'Glucose and serial focal/trauma examination, with brain imaging if findings or persistent impairment warrant.' },
      { condition: 'Other sedatives or mixed ingestion', discriminator: 'Incomplete response and exposure history; treat the physiological problem while investigating.' }
    ],
    testing: [
      { test: 'Glucose, blood gas and ECG', role: 'Assesses reversible mimics, ventilatory failure and relevant co-exposure effects.', timing: 'As indicated in parallel with resuscitation.' },
      { test: 'Targeted toxicology testing', role: 'Can support exposure identification but does not determine immediate respiratory treatment. Routine opiate screens can miss fentanyl and other opioids.', timing: 'Never wait for a screen before ventilation or indicated naloxone.' }
    ],
    immediate: ['Open the airway and provide effective breaths/bag-mask ventilation while giving naloxone for suspected opioid-related respiratory depression.', 'If pulseless, prioritize CPR, defibrillator and standard resuscitation; naloxone must not delay them.'],
    definitive: ['Continue respiratory support; recurrent toxicity may need repeated antagonist or infusion and monitored care.', 'Investigate co-exposures and complications; offer overdose prevention and treatment linkage after stabilization.'],
    advancedTools: ['Advanced airway/ventilator, blood-gas analyzer, infusion pump and drug-specific laboratory testing.'],
    reassessment: ['Target adequate spontaneous ventilation and airway protection; watch for recurrent sedation, aspiration and hypoxemia.', 'A naloxone response does not exclude concurrent trauma or other illness.'],
    modifiers: { pediatric: ['Use pediatric resuscitation and antagonist protocols; unexplained exposure requires safeguarding assessment.'], pregnancy: ['Maternal ventilation and resuscitation take priority; coordinate obstetric monitoring after stabilization.'] },
    sources: [S.resuscitation, S.opioidTests]
  },
  {
    id: 'seizure-status',
    title: 'Seizure / status epilepticus',
    category: 'Neurologic',
    presentations: ['Focal deficit / seizure', 'Altered mental status', 'Collapse / syncope', 'Pregnancy / postpartum', 'Pediatric'],
    physiology: 'Persistent abnormal neuronal activity increases metabolic demand and can compromise oxygenation, circulation and brain function.',
    redFlags: ['Convulsion lasting five minutes or repeated convulsions without recovery requires status treatment.', 'Persistent impaired consciousness, focality, injury, fever or pregnancy/postpartum status demands a cause search.'],
    bedside: [
      { action: 'Time the event; obtain witness description of focal onset, responsiveness, movements and recovery.', meaning: 'Duration and recovery distinguish a self-limited event from ongoing status and guide urgency.', limitation: 'Stopped movements do not prove seizure activity has ended; paralysis masks motor activity.' },
      { action: 'Check breathing, injuries, glucose, temperature, medication adherence and withdrawal/exposure context.', meaning: 'Identifies treatable triggers and complications alongside seizure control.', limitation: 'An established epilepsy diagnosis does not exclude a new metabolic, infectious or structural cause.' },
      { action: 'Repeat commands, gaze and limb examination during recovery.', meaning: 'Persistent focal signs or failure to recover raises ongoing seizure or structural disease.', limitation: 'Postictal weakness can mimic stroke; the label does not remove the need for appropriate imaging/EEG.' }
    ],
    basicTools: ['Clock, glucose meter, thermometer, suction and bag-mask equipment.', 'ECG, pulse oximetry and capnography when available: monitor physiology and treatment effects.'],
    differentials: [
      { condition: 'Convulsive syncope', discriminator: 'Preceding symptoms, rapid recovery and ECG/rhythm assessment; movements alone do not establish epilepsy.' },
      { condition: 'Stroke, infection or metabolic/toxic seizure', discriminator: 'Focal examination, context, laboratory testing, imaging and selected lumbar puncture.' }
    ],
    testing: [
      { test: 'Glucose, electrolytes, calcium/magnesium and targeted drug/exposure tests', role: 'Identifies reversible precipitants and guides ongoing therapy.', timing: 'Early without delaying status treatment.' },
      { test: 'EEG', role: 'Detects nonconvulsive status and confirms seizure control in refractory or persistently impaired patients.', timing: 'Urgently with unexplained failure to recover; continuous monitoring during anesthetic treatment.' },
      { test: 'Brain imaging and selected infection evaluation', role: 'Investigates a new structural or infectious cause.', timing: 'After immediate stabilization, sooner with focality or neurological deterioration.' }
    ],
    immediate: ['Protect from injury, support ventilation, correct hypoglycemia and give an appropriate benzodiazepine promptly for status.'],
    definitive: ['Benzodiazepine-refractory convulsive status requires a clinician-selected second-line agent such as levetiracetam, fosphenytoin or valproate.', 'Persistent status requires specialist escalation, anesthetic therapy with airway support/continuous EEG, and treatment of the cause.'],
    advancedTools: ['EEG, infusion pumps, advanced airway/ventilator, CT/MRI and neurocritical care.'],
    reassessment: ['Track seizure cessation and recurrence, ventilation after medication, glucose and neurological recovery.'],
    modifiers: { pediatric: ['Use weight-based pediatric therapy and age-specific causes; a febrile appearance does not exclude a serious infection.'], pregnancy: ['Consider eclampsia urgently during pregnancy or postpartum; its magnesium/obstetric pathway differs from routine epilepsy management.'] },
    sources: [S.seizures, S.esett, S.ems]
  },
  {
    id: 'spinal-cord-injury',
    title: 'Spinal cord injury / neurogenic shock',
    category: 'Trauma',
    presentations: ['Trauma / bleeding', 'Shock / poor perfusion', 'Focal deficit / seizure', 'Breathing difficulty'],
    physiology: 'Cord injury interrupts motor/sensory pathways; sympathetic disruption can reduce vascular tone and heart rate while high lesions impair breathing.',
    redFlags: ['New weakness or sensory level after injury, progressive respiratory weakness, or shock with suspected spinal injury.', 'Do not attribute trauma-related hypotension to neurogenic shock before investigating hemorrhage.'],
    bedside: [
      { action: 'Compare limb movement and sensation; locate the highest abnormal level and ask about new bladder/bowel dysfunction.', meaning: 'A level or bilateral pattern supports spinal cord involvement and establishes a reassessment baseline.', limitation: 'An incomplete or unreliable examination cannot clear the spine.' },
      { action: 'Inspect breathing mechanics and cough; assess spinal pain/tenderness without unnecessary movement.', meaning: 'High cord injury can compromise ventilation even before oxygen saturation falls.', limitation: 'Pain may be absent with altered consciousness or major neurological injury.' },
      { action: 'Compare heart rate, skin findings and perfusion while searching for bleeding.', meaning: 'Relative bradycardia with compatible injury can support neurogenic circulatory failure.', limitation: 'Warm skin/bradycardia are not diagnostic. Spinal shock refers to depressed neurological function/reflexes, not the circulatory syndrome.' }
    ],
    basicTools: ['Serial neurological examination, appropriate blood-pressure cuff and ECG.', 'Spinal-motion-restriction equipment selected for the injury and patient; avoid unnecessary movement and pressure injury.'],
    differentials: [
      { condition: 'Hemorrhagic or obstructive shock', discriminator: 'Repeat chest, abdomen, pelvis and external bleeding assessment; ultrasound and definitive imaging as appropriate.' },
      { condition: 'Brain injury, peripheral nerve injury or chronic deficit', discriminator: 'Pattern, baseline history, serial examination and targeted imaging.' }
    ],
    testing: [
      { test: 'Spinal CT', role: 'Defines bony injury and alignment when imaging is indicated.', timing: 'After immediate threats are addressed, with safe handling.' },
      { test: 'MRI', role: 'Evaluates cord, ligament and compressive pathology, including deficits unexplained by CT.', timing: 'Urgently through the spine team when neurological findings warrant.' }
    ],
    immediate: ['Protect the spine, support ventilation and correct hypotension while assessing concurrent bleeding.', 'Treat significant bradyarrhythmia and use clinician-selected fluids/vasopressor support according to the physiological problem.'],
    definitive: ['Urgent spine consultation; decompression and stabilization when indicated.', 'Individualized perfusion-directed critical care, pulmonary support, thrombosis prevention and rehabilitation planning; evidence does not support one universal pressure target for every patient.'],
    advancedTools: ['CT/MRI, arterial monitoring, ventilator, vasopressor pumps and spine surgery.'],
    reassessment: ['Repeat motor/sensory and respiratory findings after movement and intervention; track perfusion and bradyarrhythmia.'],
    modifiers: { pediatric: ['Use pediatric spine expertise; neurological injury may be present without an obvious fracture on initial imaging.'], pregnancy: ['Coordinate positioning and obstetric assessment without delaying necessary spinal imaging.'] },
    sources: [S.spine, S.spinePerfusion, S.pregnancyImaging]
  },
  {
    id: 'traumatic-brain-injury',
    title: 'Traumatic brain injury',
    category: 'Trauma',
    presentations: ['Trauma / bleeding', 'Altered mental status', 'Focal deficit / seizure', 'Pediatric'],
    physiology: 'Primary injury can evolve through bleeding, swelling and impaired perfusion; hypoxemia and hypotension amplify secondary brain injury.',
    redFlags: ['Declining consciousness, new pupil asymmetry, focal weakness, posturing, seizure or loss of airway protection.', 'A low-energy fall can still cause serious hemorrhage in an older or anticoagulated patient.'],
    bedside: [
      { action: 'Record eye, verbal and motor Glasgow Coma Scale components; compare pupils and bilateral movement.', meaning: 'A reproducible baseline detects deterioration and supports triage.', limitation: 'Sedation, intoxication, aphasia and prior deficits confound the score; record what cannot be tested.' },
      { action: 'Ask about amnesia, loss of consciousness, vomiting, headache progression and antithrombotic medication.', meaning: 'Identifies risk and evolving symptoms beyond the initial mechanism.', limitation: 'A normal initial examination does not exclude evolving intracranial bleeding.' },
      { action: 'Inspect scalp/skull and ears/nose; assess associated neck injury and extracranial bleeding.', meaning: 'Fracture findings and associated injuries change imaging and resuscitation priorities.', limitation: 'Absent external injury does not exclude important intracranial trauma.' }
    ],
    basicTools: ['Penlight, glucose meter, blood pressure and pulse oximetry; capnography when ventilation is supported.', 'Serial neurological examination is essential even after initial imaging.'],
    differentials: [
      { condition: 'Hypoglycemia, intoxication or seizure', discriminator: 'Glucose, history and response; persistent impairment must still be evaluated for injury.' },
      { condition: 'Stroke or syncope preceding the fall', discriminator: 'Establish the sequence and examine focal neurology/ECG rather than assuming trauma caused the collapse.' }
    ],
    testing: [
      { test: 'Noncontrast head CT', role: 'Detects acute hemorrhage, fracture and mass effect when indicated by risk or examination.', timing: 'Urgently for high-risk findings; age-appropriate decision rules require their inclusion criteria.' },
      { test: 'CT angiography, selected MRI and coagulation testing', role: 'Evaluates vascular injury, unexplained deficits and treatment-relevant anticoagulation.', timing: 'As indicated without delaying necessary neurosurgical care.' }
    ],
    immediate: ['Prevent hypoxemia/hypotension; protect the airway and cervical spine and maintain appropriate ventilation.', 'Position head/neck to avoid venous obstruction while preserving perfusion. Routine prophylactic hyperventilation is inappropriate; suspected herniation may require brief specialist/protocol-directed rescue measures.'],
    definitive: ['Neurosurgical evacuation/decompression when indicated, treatment of intracranial pressure and seizures, and agent-specific anticoagulant reversal.', 'Arrange rehabilitation and follow-up for persistent cognitive, behavioral or physical symptoms.'],
    advancedTools: ['CT/MRI, intracranial-pressure monitor, ventricular drain, advanced airway and neurosurgical operating room.'],
    reassessment: ['Repeat individual neurological components, pupils, pressure and ventilation after interventions and any change; deterioration requires urgent re-evaluation.'],
    modifiers: { pediatric: ['Use pediatric Glasgow Coma Scale and validated pediatric imaging criteria; caregiver-reported behavior change matters.'], pregnancy: ['Necessary head imaging should not be withheld; preserve maternal oxygenation/perfusion and coordinate obstetric care.'] },
    sources: [S.tbi, S.head, S.pregnancyImaging]
  },
  {
    id: 'traumatic-hemorrhage',
    title: 'Traumatic hemorrhage / occult bleeding',
    category: 'Trauma',
    presentations: ['Trauma / bleeding', 'Shock / poor perfusion', 'Collapse / syncope', 'Altered mental status', 'Abdominal / pelvic pain'],
    physiology: 'Blood loss reduces venous return and oxygen delivery while injury, hypoperfusion and resuscitation can impair hemostasis.',
    redFlags: ['Uncontrolled bleeding, worsening perfusion or only transient improvement after resuscitation.', 'Do not wait for hypotension, a low hemoglobin or laboratory confirmation before treating a convincing hemorrhagic emergency.'],
    bedside: [
      { action: 'Expose systematically; inspect wounds, back, axillae and groin, then assess chest, abdomen, pelvis and long bones.', meaning: 'Localizes visible and concealed bleeding compartments; chest bleeding can impair ventilation as well as circulation.', limitation: 'Little external blood does not imply a small total loss; avoid repeated pelvic springing.' },
      { action: 'Trend mentation, skin temperature, capillary refill, pulse quality, pressure and response to treatment.', meaning: 'Deterioration or transient response suggests inadequate perfusion or ongoing loss.', limitation: 'Normal pressure, hemoglobin or oxygen saturation cannot exclude major hemorrhage; tachycardia may be absent.' },
      { action: 'Establish mechanism, timing, antithrombotics and treatments already given.', meaning: 'Predicts concealed injury, coagulopathy and relevant treatment windows.', limitation: 'Mechanism supports suspicion but cannot determine the injury alone.' }
    ],
    basicTools: ['Pressure/packing materials, tourniquet, pelvic binder and warming equipment.', 'Serial vitals and examination; portable ultrasound adds information if immediately available and competently performed.'],
    differentials: [
      { condition: 'Tension pneumothorax or traumatic tamponade', discriminator: 'Chest findings and focused ultrasound; immediate treatment when obstructive physiology is clinically evident.' },
      { condition: 'Neurogenic or cardiogenic shock', discriminator: 'Neurological pattern, ECG/ultrasound and ongoing exclusion of bleeding; causes may coexist.' }
    ],
    testing: [
      { test: 'Focused trauma ultrasound and portable radiography', role: 'Helps locate fluid/chest/pelvic injury; negative FAST does not exclude major intraperitoneal or retroperitoneal bleeding.', timing: 'During resuscitation when it changes the next step.' },
      { test: 'Contrast CT', role: 'Defines injuries and bleeding source in a patient sufficiently stable for scanning.', timing: 'Do not send a persistently unstable patient away from needed operative/interventional control.' },
      { test: 'Blood count, type/crossmatch, coagulation/fibrinogen, ionized calcium, gas/lactate and selected viscoelastic testing', role: 'Guides transfusion and physiological correction; serial interpretation is essential.', timing: 'Early and repeated during major hemorrhage treatment.' }
    ],
    immediate: ['Control external bleeding; apply an indicated pelvic binder over the greater trochanters and prevent heat loss.', 'Use blood-based resuscitation when available, eligible early tranexamic acid and indicated calcium; resuscitation must proceed with source control.'],
    definitive: ['Trauma surgery and/or embolization for hemorrhage control; protocolized transfusion followed by targeted correction of deficits.'],
    advancedTools: ['Blood warmer/rapid infuser, point-of-care coagulation, CT, interventional radiology and operating room.'],
    reassessment: ['Track control of bleeding, perfusion, recurrent deterioration, temperature, calcium and transfusion needs rather than pressure alone.'],
    modifiers: { pediatric: ['Use weight-based resuscitation and age-specific physiology; hypotension may be late.'], pregnancy: ['Prioritize maternal perfusion and evaluate obstetric bleeding/placental injury; do not apply permissive hypotension indiscriminately.'] },
    sources: [S.bleeding, S.trauma]
  }
];
