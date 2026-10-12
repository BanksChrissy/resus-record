const anaphylaxisSource = {label:'Resuscitation Council UK anaphylaxis guidance, 2021',url:'https://www.resus.org.uk/library/additional-guidance/guidance-anaphylaxis/emergency-treatment-anaphylactic-reactions'};
const potassiumSource = {label:'UK Kidney Association hyperkalemia guideline, July 2026',url:'https://www.ukkidney.org/health-professionals/guidelines/treatment-acute-hyperkalaemia-adults-0'};
const pediatricSource = {label:'RCUK pediatric life support, 2025',url:'https://www.resus.org.uk/cy/node/36439'};
const palsSource = {label:'AHA / AAP pediatric advanced life support, 2025',url:'https://publications.aap.org/pediatrics/article/doi/10.1542/peds.2025-074351/205236'};

export const specialPathways = [
  {
    id:'anaphylaxis',title:'Anaphylaxis',category:'Respiratory',
    presentations:['Breathing difficulty','Shock / poor perfusion','Collapse / syncope','Pediatric'],
    physiology:'Mediator release produces airway swelling, bronchospasm, vasodilation and capillary leak.',
    redFlags:['Rapid airway, breathing or circulatory compromise after possible exposure: give intramuscular epinephrine without awaiting tests.'],
    bedside:[
      {action:'Establish exposure and timing.',meaning:'Rapid multisystem symptoms support anaphylaxis.',limitation:'A trigger or rash may be absent.'},
      {action:'Listen to voice, stridor and air entry.',meaning:'Hoarseness suggests laryngeal involvement; wheeze suggests bronchospasm.',limitation:'Quiet breathing can reflect critically poor airflow.'},
      {action:'Assess pulse, mentation and perfusion; inspect mucosa and skin.',meaning:'Collapse suggests distributive shock.',limitation:'Isolated hives do not establish anaphylaxis.'}
    ],
    basicTools:['Manual blood pressure, pulse oximetry and serial respiratory examination.'],
    differentials:[{condition:'Asthma',discriminator:'Look for exposure, mucosal change and circulatory involvement.'},{condition:'Bradykinin-mediated angioedema',discriminator:'Medication/history and absent urticaria; airway protection remains urgent.'}],
    testing:[{test:'Timed serum tryptase',role:'Supports later investigation; a normal result does not exclude anaphylaxis.',timing:'After treatment begins; follow sampling protocol.'},{test:'Allergy assessment',role:'Establish trigger and prevention plan.',timing:'After stabilization.'}],
    immediate:['Repeat intramuscular epinephrine under protocol when compromise persists. Support oxygenation/ventilation; give indicated intravenous crystalloid.','Keep supine when tolerated; adapt for breathing or pregnancy. Do not allow standing. Antihistamines do not treat airway obstruction or shock.'],
    definitive:['Refractory shock: expert titrated intravenous epinephrine infusion with continuous monitoring. Secure a threatened airway early.','Observe according to recurrence risk; provide an emergency action plan and allergy referral.'],
    advancedTools:['Infusion pump, advanced airway equipment and critical care.'],
    reassessment:['Recheck airway, work of breathing, perfusion and recurrence after every intervention.'],
    modifiers:{pediatric:['Use pediatric epinephrine dosing and equipment.'],pregnancy:['Epinephrine remains first-line; use left uterine displacement when indicated.']},
    sources:[anaphylaxisSource]
  },
  {
    id:'hyperkalemia',title:'Hyperkalemia',category:'Metabolic & toxicology',
    presentations:['Collapse / syncope','Shock / poor perfusion','Altered mental status'],
    physiology:'Excess extracellular potassium impairs cardiac conduction and can cause lethal arrhythmia.',
    redFlags:['Compatible unstable rhythm or peri-arrest deterioration: initiate emergency potassium treatment while obtaining rapid testing.'],
    bedside:[
      {action:'Ask about dialysis, urine output, medications and crush injury.',meaning:'Renal failure, potassium-retaining drugs and tissue injury increase risk.',limitation:'History alone cannot determine potassium.'},
      {action:'Assess weakness, breathing, pulse and perfusion.',meaning:'Weakness or bradycardic collapse can accompany toxicity.',limitation:'Severe hyperkalemia can be asymptomatic.'},
      {action:'Compare the current electrocardiogram with baseline.',meaning:'Conduction slowing, broad complexes or peaked T waves raise concern.',limitation:'A normal ECG does not exclude dangerous hyperkalemia.'}
    ],
    basicTools:['Cardiac monitor, diagnostic 12-lead ECG and glucose meter.'],
    differentials:[{condition:'Sodium-channel blocker toxicity',discriminator:'Exposure history, ECG pattern and toxicology consultation.'},{condition:'Pseudohyperkalemia',discriminator:'Check hemolysis and repeat an appropriate specimen without delaying treatment of instability.'}],
    testing:[{test:'Urgent potassium, renal function, glucose and blood gas',role:'Confirm disturbance and accompanying acidosis.',timing:'Immediately; repeat potassium after treatment.'}],
    immediate:['Intravenous calcium for indicated cardiac toxicity stabilizes the myocardium but does not lower potassium.','Insulin with glucose and adjunctive inhaled beta agonist shift potassium intracellularly. Follow the acute protocol and monitor glucose closely.'],
    definitive:['Remove potassium: urgent dialysis when indicated; selected binders or renal excretion measures according to clinical context. Stop contributors and treat the cause.'],
    advancedTools:['Rapid chemistry analyzer, infusion equipment and dialysis capability.'],
    reassessment:['Repeat ECG, potassium and glucose; detect rebound hyperkalemia and delayed hypoglycemia.'],
    modifiers:{pediatric:['Use a pediatric electrolyte protocol and dosing.'],pregnancy:['Coordinate renal and obstetric care.']},
    sources:[potassiumSource]
  },
  {
    id:'pediatric-respiratory-failure',title:'Pediatric respiratory distress / failure',category:'Pediatric',
    presentations:['Breathing difficulty','Altered mental status','Pediatric'],
    physiology:'Inadequate ventilation or oxygenation can progress to bradycardia and cardiac arrest.',
    redFlags:['Apnea, exhaustion, poor air movement or declining responsiveness: assist ventilation immediately.'],
    bedside:[
      {action:'Observe before touching: interaction, cry, posture and retractions.',meaning:'Behavior and work of breathing reveal physiological stress.',limitation:'Falling effort may mean fatigue, not recovery.'},
      {action:'Listen for stridor, wheeze, crackles and asymmetry.',meaning:'Localizes upper airway, lower airway or parenchymal disease.',limitation:'Do not provoke a distressed child with suspected critical upper-airway obstruction.'},
      {action:'Ask about choking, fever, feeding and onset.',meaning:'Sudden choking suggests a foreign body; feeding failure suggests severity.',limitation:'Unwitnessed aspiration remains possible.'}
    ],
    basicTools:['Age-appropriate mask/bag, stethoscope, pulse oximeter, glucose meter and thermometer.'],
    differentials:[{condition:'Croup / bacterial upper-airway disease',discriminator:'Barky cough versus drooling, toxicity or poor treatment response.'},{condition:'Bronchiolitis / asthma / foreign body',discriminator:'Age, prior episodes, prodrome, sudden onset and focal findings.'}],
    testing:[{test:'Blood gas, chest imaging or ultrasound',role:'Resolve severe, atypical or uncertain disease and complications.',timing:'After initial support; routine imaging is unnecessary in typical uncomplicated bronchiolitis.'},{test:'Bronchoscopy',role:'Confirm and remove an aspirated airway foreign body.',timing:'Urgent specialist pathway when indicated.'}],
    immediate:['Position the airway, relieve indicated obstruction, provide oxygen and effective bag-mask ventilation for inadequate breathing.','Croup: corticosteroid and nebulized epinephrine when indicated. Asthma: bronchodilator pathway. Typical bronchiolitis: supportive oxygen/hydration; avoid routine bronchodilators.'],
    definitive:['Treat identified infection; escalate to high-flow oxygen, noninvasive support or intubation according to failure and airway protection. Arrange pediatric critical care.'],
    advancedTools:['Pediatric airway kit, waveform capnography, ventilator and bronchoscopy.'],
    reassessment:['Trend mental status, air movement, heart rate, oxygenation and support required; reassess after epinephrine wears off.'],
    modifiers:{pediatric:['Use age-specific ranges and equipment; neonatal transition at birth follows a separate pathway.'],pregnancy:['A pregnant adolescent also needs maternal physiology and obstetric assessment.']},
    sources:[pediatricSource,{label:'Canadian Paediatric Society croup guidance, updated January 2026',url:'https://cps.ca/en/documents/position/acute-management-of-croup'},{label:'NICE NG9 bronchiolitis recommendations',url:'https://www.nice.org.uk/guidance/ng9/chapter/Recommendations'}]
  },
  {
    id:'pediatric-shock',title:'Pediatric shock / poor perfusion',category:'Pediatric',
    presentations:['Shock / poor perfusion','Collapse / syncope','Altered mental status','Pediatric'],
    physiology:'Inadequate tissue oxygen delivery may precede hypotension; the cause determines fluid and vasoactive treatment.',
    redFlags:['Poor perfusion with deteriorating mentation, breathing or heart rate: begin pediatric resuscitation and summon critical care.'],
    bedside:[
      {action:'Compare interaction with the caregiver’s description of baseline.',meaning:'Lethargy can indicate reduced cerebral perfusion.',limitation:'Fear, fever and medications also alter behavior.'},
      {action:'Compare central/peripheral pulses, refill, temperature and urine history.',meaning:'A pattern of weak pulses, cool extremities and reduced urine supports poor perfusion.',limitation:'Warm skin or normal blood pressure cannot exclude shock.'},
      {action:'Ask about losses, fever, bleeding and heart disease; assess liver and lungs.',meaning:'Hepatomegaly, gallop or pulmonary congestion raise concern for cardiac failure.',limitation:'A single examination cannot define fluid responsiveness.'}
    ],
    basicTools:['Correct-size blood pressure cuff, thermometer, glucose meter and accurate weight or approved estimate.'],
    differentials:[{condition:'Hypovolemic / hemorrhagic shock',discriminator:'Losses or bleeding, including concealed trauma.'},{condition:'Sepsis / cardiogenic / obstructive shock',discriminator:'Infection context, congestion, rhythm and focused ultrasound.'}],
    testing:[{test:'Blood gas/lactate, blood count, electrolytes and cultures when indicated',role:'Characterize organ dysfunction, metabolic problems and infection.',timing:'Alongside treatment; do not delay antibiotics for difficult sampling.'},{test:'Echocardiography and targeted imaging',role:'Assess pump failure, obstruction and source.',timing:'Early when cause is uncertain or response is poor.'}],
    immediate:['Support oxygenation and ventilation, obtain intravenous or intraosseous access, and correct hypoglycemia.','For indicated fluid resuscitation, use reassessed weight-based aliquots. Stop escalating fluid when overload appears. Hemorrhage requires blood and source control.','Infants and children with heart rate below 60/min and poor perfusion despite effective oxygenation/ventilation need CPR and the pediatric bradycardia/arrest pathway.'],
    definitive:['Prompt antibiotics and source control for sepsis; vasoactive support for persistent shock. Cardiac causes need tailored inotropy/afterload or structural treatment and early specialist care.'],
    advancedTools:['Infusion pumps, ultrasound, blood products, invasive monitoring and pediatric intensive care.'],
    reassessment:['Recheck perfusion after each intervention; trend urine, lactate, liver/lung findings and escalating support.'],
    modifiers:{pediatric:['Use pediatric dosing; adult fluid volumes and pressure targets do not transfer automatically.'],pregnancy:['Pregnant adolescents need concurrent obstetric assessment and pregnancy-specific causes considered.']},
    sources:[palsSource,pediatricSource]
  }
];
