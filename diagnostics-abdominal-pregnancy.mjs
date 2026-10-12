// Original clinical reference text; treatment options require clinician selection.
const sources = {
  obstruction: { label: 'WSES Bologna Adhesive Small Bowel Obstruction Guidelines, 2018', url: 'https://link.springer.com/article/10.1186/s13017-018-0185-2' },
  perforation: { label: 'WSES Perforated and Bleeding Peptic Ulcer Guidelines, 2020', url: 'https://link.springer.com/article/10.1186/s13017-019-0283-9' },
  mesenteric: { label: 'WSES Acute Mesenteric Ischemia Guidelines, 2022', url: 'https://link.springer.com/article/10.1186/s13017-022-00443-x' },
  ulcerBleeding: { label: 'ESGE Peptic Ulcer Bleeding Guideline, 2026', url: 'https://pubmed.ncbi.nlm.nih.gov/42127996/' },
  varices: { label: 'ESGE Esophagogastric Variceal Hemorrhage Guideline, 2022', url: 'https://www.esge.com/assets/downloads/pdfs/guidelines/2022_a-1939-4887.pdf' },
  lowerBleeding: { label: 'ACG Acute Lower Gastrointestinal Bleeding Guideline, 2023', url: 'https://pubmed.ncbi.nlm.nih.gov/36735555/' },
  bleedingImaging: { label: 'ACG/SAR Imaging for Gastrointestinal Bleeding Consensus, 2024', url: 'https://pubs.rsna.org/doi/10.1148/radiol.232298' },
  ectopicDiagnosis: { label: 'NICE NG126 Ectopic Pregnancy: Diagnosis, updated 2026', url: 'https://www.nice.org.uk/guidance/NG126/chapter/diagnosis-of-viable-intrauterine-pregnancy-and-of-tubal-ectopic-pregnancy' },
  ectopicTreatment: { label: 'NICE NG126 Ectopic Pregnancy: Management, updated 2026', url: 'https://www.nice.org.uk/guidance/ng126/chapter/management-of-tubal-ectopic-pregnancy' },
  pregnancyHypertension: { label: 'NICE NG133 Hypertension in Pregnancy, updated 2023', url: 'https://www.nice.org.uk/guidance/ng133/chapter/recommendations' },
  severeHypertension: { label: 'ACOG Safe Motherhood Initiative: Severe Hypertension', url: 'https://www.acog.org/community/districts-and-sections/district-ii/programs-and-resources/safe-motherhood-initiative/severe-hypertension' },
  hypertensionTherapy: { label: 'ACOG Committee Opinion 767: Emergency Hypertension Therapy, 2019', url: 'https://pubmed.ncbi.nlm.nih.gov/30575639/' },
  postpartum: { label: 'WHO/FIGO/ICM Consolidated Postpartum Hemorrhage Guidelines, 2025', url: 'https://www.who.int/publications/i/item/9789240115637/' },
  postpartumDetails: { label: 'WHO Postpartum Hemorrhage Recommendations and Supporting Evidence, 2025', url: 'https://www.ncbi.nlm.nih.gov/books/NBK619233/?report=printable' },
  figo: { label: 'FIGO Postpartum Hemorrhage Recommendations, 2022', url: 'https://obgyn.onlinelibrary.wiley.com/doi/10.1002/ijgo.14116' }
};

export const abdominalPregnancyPathways = [
  {
    id: 'acute-mesenteric-ischemia',
    title: 'Acute mesenteric ischemia',
    category: 'Abdominal & pelvic',
    presentations: ['Abdominal / pelvic pain', 'Shock / poor perfusion'],
    physiology: 'Impaired intestinal perfusion injures mucosa before the abdominal wall necessarily becomes tender.',
    redFlags: ['Severe unexplained pain, deterioration, or peritonitis: urgent surgical/vascular involvement.'],
    bedside: [
      { action: 'Compare pain severity with gentle palpation.', meaning: 'Disproportionate pain raises suspicion.', limitation: 'This classic mismatch is not required.' },
      { action: 'Ask about atrial fibrillation, vascular disease, post-meal pain, and recent shock.', meaning: 'Suggests embolic, thrombotic, or low-flow mechanisms.', limitation: 'Risk factors cannot confirm ischemia.' },
      { action: 'Repeat tenderness, guarding, distension, perfusion, and any stool findings.', meaning: 'Peritonitis suggests advanced injury; blood may reflect mucosal damage.', limitation: 'A soft abdomen and absent rectal bleeding do not exclude early ischemia.' }
    ],
    basicTools: ['Manual pressure and ECG: perfusion and rhythm context.'],
    differentials: [{ condition: 'Obstruction / pancreatitis', discriminator: 'Dedicated imaging; enzyme elevation can mislead.' }],
    testing: [
      { test: 'CT angiography', role: 'Defines vessels and bowel injury.', timing: 'Without delay; renal injury alone should not postpone.' },
      { test: 'Lactate, blood count, chemistry', role: 'Assess consequences; normal results cannot exclude.', timing: 'Alongside imaging.' }
    ],
    immediate: ['Bowel rest, perfusion support, broad-spectrum antibiotics; selected anticoagulation.'],
    definitive: ['Endovascular or open arterial revascularization; resect nonviable bowel with planned viability reassessment. Heparin for venous thrombosis. Correct low-flow causes; selected catheter vasodilator.'],
    advancedTools: ['Endovascular/surgical suite; nasogastric decompression; critical care.'],
    reassessment: ['Pain, peritoneal signs, perfusion, urine output, metabolic trajectory.'],
    modifiers: { pediatric: ['Specialist pathway.'], pregnancy: ['Coordinate urgent obstetric/surgical care.'] },
    sources: [sources.mesenteric]
  },
  {
    id: 'ectopic-pregnancy',
    title: 'Ectopic pregnancy',
    category: 'Pregnancy',
    presentations: ['Abdominal / pelvic pain', 'Pregnancy / postpartum', 'Collapse / syncope', 'Shock / poor perfusion', 'Trauma / bleeding'],
    physiology: 'Extrauterine implantation can rupture and cause concealed intraperitoneal hemorrhage.',
    redFlags: ['Pain with collapse, hypoperfusion, or peritonitis: urgent gynecologic surgery assessment.'],
    bedside: [
      { action: 'Ask about pregnancy possibility, dates, prior ectopic, and assisted conception.', meaning: 'Establish pregnancy context.', limitation: 'Absent risk factors do not exclude.' },
      { action: 'Ask about unilateral pain, bleeding, shoulder-tip pain, and fainting.', meaning: 'Consider pelvic disease or intraperitoneal bleeding.', limitation: 'Classic symptoms need not coexist.' },
      { action: 'Assess abdominal tenderness, guarding, pulses, skin, and mentation.', meaning: 'Identify peritoneal irritation and hemorrhagic shock.', limitation: 'Little vaginal bleeding does not quantify internal loss.' }
    ],
    basicTools: ['Pregnancy test; manual cuff and serial perfusion assessment.'],
    differentials: [{ condition: 'Miscarriage / ovarian torsion', discriminator: 'Formal pelvic ultrasound and gynecologic assessment.' }],
    testing: [
      { test: 'Transvaginal ultrasound and quantitative serum hCG', role: 'Locate pregnancy; this pregnancy hormone alone cannot locate it.', timing: 'Urgent; serial follow-up only if stable.' },
      { test: 'Blood count and crossmatch', role: 'Prepare hemorrhage treatment.', timing: 'Alongside stabilization.' }
    ],
    immediate: ['Intravenous access, blood products when needed, analgesia, and expedited specialist care.'],
    definitive: ['Rupture/instability: surgery, usually salpingectomy; selected salpingotomy. Eligible stable, unruptured ectopic: methotrexate or expectant management with reliable serial follow-up.'],
    advancedTools: ['Pelvic ultrasound, blood products, operative capability.'],
    reassessment: ['Worsening symptoms override previously reassuring hCG or scans.'],
    modifiers: { pediatric: ['Consider pregnancy in adolescents.'], pregnancy: ['Unknown location remains unresolved until followed appropriately.'] },
    sources: [sources.ectopicDiagnosis, sources.ectopicTreatment]
  },
  {
    id: 'gastrointestinal-bleeding',
    title: 'Gastrointestinal bleeding',
    category: 'Abdominal & pelvic',
    presentations: ['Trauma / bleeding', 'Abdominal / pelvic pain', 'Collapse / syncope', 'Shock / poor perfusion'],
    physiology: 'Luminal blood loss reduces circulating volume and oxygen delivery; source determines hemostatic treatment.',
    redFlags: ['Ongoing major bleeding, collapse, shock, or inability to protect the airway requires immediate escalation.'],
    bedside: [
      { action: 'Inspect vomit and stool; establish onset, color, quantity, and recurrence.', meaning: 'Hematemesis/melena suggests an upper source.', limitation: 'Brisk upper bleeding can cause red rectal blood.' },
      { action: 'Assess mentation, skin temperature, pulses, capillary refill, and serial pressure.', meaning: 'Estimate perfusion and response.', limitation: 'Early hemoglobin can remain normal despite serious loss.' },
      { action: 'Ask about ulcers, cirrhosis, anticoagulants, antiplatelets, and anti-inflammatory medicines.', meaning: 'Direct source and treatment-risk assessment.', limitation: 'Medication use does not establish the bleeding lesion.' }
    ],
    basicTools: ['Manual cuff, ECG, direct stool inspection; focused abdominal examination.'],
    differentials: [
      { condition: 'Swallowed blood / hemoptysis', discriminator: 'Examine mouth/nose and clarify vomiting versus coughing.' },
      { condition: 'Nonbleeding dark stool', discriminator: 'Iron/bismuth history; judge the entire clinical picture.' }
    ],
    testing: [
      { test: 'Serial blood count, coagulation, chemistry, crossmatch', role: 'Guide replacement and selected reversal.', timing: 'With resuscitation.' },
      { test: 'Upper endoscopy / colonoscopy', role: 'Locate and treat the lesion.', timing: 'After initial stabilization; colon preparation when appropriate.' },
      { test: 'CT angiography', role: 'Localize active major lower bleeding for embolization.', timing: 'Urgently with ongoing hemodynamically significant bleeding.' }
    ],
    immediate: ['Blood products for major hemorrhage; selected anticoagulant reversal; airway protection when needed.', 'Consider intravenous proton pump inhibitor for suspected upper bleeding. Suspected varices: vasoactive therapy such as octreotide/terlipressin plus antibiotic prophylaxis.'],
    definitive: ['Ulcer: endoscopic clips/thermal hemostasis plus acid suppression; repeat endoscopy, embolization, or surgery for failure. Test/treat Helicobacter pylori and confirm eradication.', 'Varices: band ligation or gastric-varix cyanoacrylate; selected early/rescue portal shunt. Lower source: endoscopic therapy or embolization; surgery when necessary.'],
    advancedTools: ['Therapeutic endoscope, angiography, transjugular intrahepatic portosystemic shunt, operating room.'],
    reassessment: ['Bleeding recurrence, perfusion, transfusion requirement, serial hemoglobin.'],
    modifiers: { pediatric: ['Pediatric source-specific assessment.'], pregnancy: ['Coordinate urgent gastroenterology/obstetric care.'] },
    sources: [sources.ulcerBleeding, sources.varices, sources.lowerBleeding, sources.bleedingImaging, sources.perforation]
  },
  {
    id: 'postpartum-hemorrhage',
    title: 'Postpartum hemorrhage',
    category: 'Pregnancy',
    presentations: ['Pregnancy / postpartum', 'Trauma / bleeding', 'Shock / poor perfusion', 'Collapse / syncope'],
    physiology: 'Failed uterine contraction, genital injury, retained tissue, or impaired clotting permits ongoing blood loss.',
    redFlags: ['Continued heavy bleeding or deteriorating perfusion: activate obstetric hemorrhage response while treating.'],
    bedside: [
      { action: 'Track cumulative bleeding, pulse, pressure, mentation, and capillary refill.', meaning: 'Trend hemorrhage and perfusion together.', limitation: 'Visual estimates underestimate loss; concealed bleeding is possible.' },
      { action: 'Palpate uterine tone and size.', meaning: 'A soft enlarged uterus supports atony.', limitation: 'A firm uterus does not exclude tears, retained tissue, or coagulopathy.' },
      { action: 'Review placental completeness; trained clinicians examine the genital tract.', meaning: 'Seek retained tissue, lacerations, or hematoma.', limitation: 'Multiple causes can coexist; examination must not postpone treatment.' }
    ],
    basicTools: ['Calibrated collection drape or weighing materials; cuff, warming equipment, urinary output measurement.'],
    differentials: [{ condition: 'Concealed pelvic bleeding / uterine inversion', discriminator: 'Disproportionate shock, pain, uterine position; urgent obstetric examination.' }],
    testing: [
      { test: 'Blood count, coagulation, fibrinogen, crossmatch', role: 'Guide blood components and clotting-factor replacement.', timing: 'Do not wait for results to treat shock.' },
      { test: 'Ultrasound / operative examination', role: 'Investigate tissue or concealed bleeding.', timing: 'Selected by stability; do not delay hemorrhage control.' }
    ],
    immediate: ['Simultaneous uterine massage, uterotonic (usually oxytocin), intravenous tranexamic acid as soon as possible within 3 hours of birth, fluids, genital examination, and escalation.', 'For atony, trained bimanual compression can bridge care. Activate blood replacement for ongoing major loss; prevent hypothermia.'],
    definitive: ['Repair tears; remove retained tissue appropriately; correct coagulopathy. Selected further uterotonics: avoid methylergonovine with hypertension and carboprost with asthma. Balloon tamponade requires surgical/blood backup.', 'Persistent hemorrhage: uterine artery embolization, compression sutures, vessel ligation, or hysterectomy.'],
    advancedTools: ['Massive-transfusion resources, balloon tamponade, interventional radiology, operating room.'],
    reassessment: ['Bleeding rate, uterine tone, perfusion, temperature, urine output, coagulation.'],
    modifiers: { pediatric: ['Adolescent patients need the same urgent response.'], pregnancy: ['Delayed postpartum bleeding also requires urgent cause assessment.'] },
    sources: [sources.postpartum, sources.postpartumDetails, sources.figo]
  },
  {
    id: 'preeclampsia-eclampsia',
    title: 'Preeclampsia and eclampsia',
    category: 'Pregnancy',
    presentations: ['Pregnancy / postpartum', 'Focal deficit / seizure', 'Altered mental status', 'Abdominal / pelvic pain', 'Breathing difficulty'],
    physiology: 'Pregnancy-associated vascular dysfunction can injure brain, liver, kidneys, lungs, and placenta.',
    redFlags: ['Seizure, persistent severe hypertension, pulmonary edema, or neurologic deterioration requires urgent obstetric/critical care.'],
    bedside: [
      { action: 'Repeat blood pressure with a correctly sized cuff; establish pregnancy/postpartum timing.', meaning: 'Confirm severity and relevant context.', limitation: 'A previously normal pregnancy does not exclude new disease.' },
      { action: 'Ask about persistent headache, visual disturbance, epigastric/right-upper abdominal pain, and dyspnea.', meaning: 'Suggests cerebral, hepatic, or pulmonary involvement.', limitation: 'Symptoms or proteinuria need not all be present.' },
      { action: 'Assess consciousness, focal deficits, breathing, reflexes, and urine output.', meaning: 'Seek organ injury and treatment complications.', limitation: 'Absent clonus is not reassuring enough to exclude disease.' }
    ],
    basicTools: ['Manual cuff, glucose meter, stethoscope, urine dipstick; quantify protein formally when indicated.'],
    differentials: [{ condition: 'Intracranial hemorrhage / cerebral venous thrombosis', discriminator: 'Focal findings, atypical headache, persistent altered state: urgent brain imaging.' }],
    testing: [
      { test: 'Blood count/platelets, creatinine, liver/hemolysis tests, urine protein', role: 'Identify organ involvement and severity.', timing: 'With stabilization; treatment must not await proteinuria.' },
      { test: 'Fetal assessment; selected brain/chest imaging', role: 'Assess fetal compromise and competing maternal threats.', timing: 'Urgency follows clinical findings.' }
    ],
    immediate: ['Protect airway during seizures; magnesium sulfate treats eclampsia and selected severe-feature seizure risk.', 'Treat severe pressure separately with appropriate intravenous labetalol/hydralazine or immediate-release oral nifedipine. Avoid routine fluid loading.'],
    definitive: ['Obstetric delivery when indicated after stabilization; selected antenatal corticosteroids for prematurity; continued postpartum treatment and surveillance.'],
    advancedTools: ['Infusion pumps, fetal monitoring/ultrasound, critical care, delivery capability.'],
    reassessment: ['Pressure, symptoms, seizures, breathing, reflexes, urine output, laboratory trajectory; monitor magnesium toxicity.'],
    modifiers: { pediatric: ['Adolescent pregnancy needs obstetric care.'], pregnancy: ['Disease can first present after birth.'] },
    sources: [sources.pregnancyHypertension, sources.severeHypertension, sources.hypertensionTherapy]
  },
  {
    id: 'surgical-abdomen-obstruction-perforation',
    title: 'Surgical abdomen: obstruction or perforation',
    category: 'Abdominal & pelvic',
    presentations: ['Abdominal / pelvic pain', 'Shock / poor perfusion'],
    physiology: 'Obstruction traps fluid and can compromise bowel perfusion; perforation contaminates the peritoneum.',
    redFlags: ['Peritonitis, shock, continuous worsening pain, or suspected strangulation requires immediate surgical assessment.'],
    bedside: [
      { action: 'Establish onset, colic versus constant pain, vomiting, distension, and last stool/flatus.', meaning: 'Characterize obstruction and evolving complications.', limitation: 'Early stool passage or diarrhea does not exclude obstruction.' },
      { action: 'Inspect scars and abdominal/groin hernias; ask about prior operations.', meaning: 'Suggests adhesions or an incarcerated hernia.', limitation: 'No surgical history does not exclude obstruction.' },
      { action: 'Gently palpate for focal tenderness, involuntary guarding, rigidity; repeat examination.', meaning: 'Peritoneal signs raise concern for ischemia or perforation.', limitation: 'Minimal tenderness cannot exclude early strangulation or a contained leak.' }
    ],
    basicTools: ['Manual cuff, temperature, serial pulse/skin/mentation and urine output assessment.'],
    differentials: [
      { condition: 'Mesenteric ischemia', discriminator: 'Severe unexplained pain or vascular context: urgent CT angiography.' },
      { condition: 'Ileus / gastroenteritis', discriminator: 'Medication/systemic illness context; imaging distinguishes mechanical obstruction.' }
    ],
    testing: [
      { test: 'CT abdomen/pelvis', role: 'Defines obstruction, closed loop, ischemia, or perforation.', timing: 'Urgently when feasible; do not postpone necessary surgery.' },
      { test: 'Blood count, chemistry, lactate; selected radiograph/ultrasound', role: 'Assess consequences; alternatives support assessment when CT unavailable.', timing: 'Normal labs or radiographs cannot rule out dangerous disease.' }
    ],
    immediate: ['Nothing by mouth, intravenous fluid/electrolyte correction, analgesia; selected nasogastric decompression.', 'Broad-spectrum antibiotics for suspected perforation or bowel ischemia; treat associated shock.'],
    definitive: ['Surgery for strangulation, ischemia, perforation, or failed conservative management.', 'Selected uncomplicated adhesive obstruction: monitored nonoperative care, decompression, and water-soluble contrast pathway with surgical oversight.'],
    advancedTools: ['CT, nasogastric suction, operative source control and bowel-viability assessment.'],
    reassessment: ['Pain pattern, peritoneal signs, vomiting/distension, perfusion, urine output; deterioration overrides observation.'],
    modifiers: { pediatric: ['Age-specific causes and pediatric surgical input.'], pregnancy: ['Ultrasound/MRI may help; coordinate urgent surgical/obstetric evaluation.'] },
    sources: [sources.obstruction, sources.perforation]
  }
];
