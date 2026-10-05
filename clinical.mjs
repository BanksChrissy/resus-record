export const VERSION='1.1 · AHA 2025 · reviewed 2026-10-05';
const base='https://cpr.heart.org/-/media/CPR-Files/CPR-Guidelines-Files/';
export const sources=[
 ['Adult cardiac arrest',base+'2025-Algorithms/Algorithm-ACLS-CA-250527.pdf'],
 ['Pediatric cardiac arrest',base+'2025-Accessible/Algorithm-PALS-CA-LngDscrp-250729-Ed.pdf'],
 ['Adult bradycardia',base+'2025-Algorithms/Algorithm-ACLS-Bradycardia-250514.pdf'],
 ['Pediatric bradycardia',base+'2025-Algorithms/Algorithm-PALS-Bradycardia-250121.pdf'],
 ['Adult tachyarrhythmia',base+'2025-Algorithms/Algorithm-ACLS-Tachycardia-250514.pdf'],
 ['Pediatric tachyarrhythmia',base+'2025-Accessible/Algorithm-PALS-Tachyarrhythmia-LngDscrp-250729-Ed.pdf'],
 ['Adult cardioversion',base+'2025-Algorithms/Algorithm-ACLS-Electrical-Cardioversion-250514.pdf'],
 ['Adult post-arrest care',base+'2025-Algorithms/Algorithm-ACLS-PCAC-250527.pdf'],
 ['Special circumstances','https://cpr.heart.org/en/resuscitation-science/cpr-and-ecc-guidelines/adult-and-pediatric-special-circumstances-of-resuscitation'],
 ['Pediatric advanced life support','https://cpr.heart.org/en/resuscitation-science/cpr-and-ecc-guidelines/pediatric-advanced-life-support']
];
export const causes=[
 ['H','Hypovolemia','Volume loss, bleeding, fluid response. Record fluids, blood products and hemorrhage control.'],
 ['H','Hypoxia','Airway, chest rise, oxygen delivery, ventilation and oxygen saturation.'],
 ['H','Hydrogen ion excess / acidosis','Blood gas, pH, ventilation and perfusion. Bicarbonate is not routine arrest therapy.'],
 ['H','Hypokalemia / hyperkalemia','Potassium level, ECG and clinical setting. Use a cause-specific protocol; benefit of calcium and bicarbonate in hyperkalemic arrest is uncertain.'],
 ['H','Hypothermia','Core temperature, method, exposure and rewarming measures.'],
 ['H','Hypoglycemia','Explicit pediatric cause. Record glucose, units and treatment.'],
 ['T','Tension pneumothorax','Clinical evidence and decompression procedure, side and response.'],
 ['T','Tamponade, cardiac','Clinical / ultrasound findings, drainage or escalation and response.'],
 ['T','Toxins','Agent, exposure, suspected mechanism, antidote and expert advice.'],
 ['T','Thrombosis, pulmonary','Evidence, reperfusion / procedural escalation and response.'],
 ['T','Thrombosis, coronary','ECG findings, coronary intervention and destination.']
];
export const drugs={
 'Cardiac arrest':['Epinephrine','Amiodarone','Lidocaine'],
 'Bradycardia with pulse':['Atropine','Epinephrine','Dopamine'],
 'Tachyarrhythmia with pulse':['Adenosine','Amiodarone','Procainamide','Diltiazem','Verapamil','Beta-blocker','Magnesium sulfate'],
 'Cause-specific / fluids':['Dextrose','Calcium','Insulin with glucose','Potassium replacement','Sodium bicarbonate','Naloxone','IV lipid emulsion','Digoxin immune Fab','Hydroxocobalamin','Atropine','Pralidoxime','High-dose insulin','Vasopressor','Fibrinolytic','Crystalloid','Blood product','Other']
};
export const causeDrugNotes={
 'Dextrose':'Hypoglycemia: select concentration and dose using the treating team’s protocol.',
 'Calcium':'Selected electrolyte or toxicologic indications. Not routine arrest treatment. Effectiveness in hyperkalemic arrest is uncertain.',
 'Insulin with glucose':'Selected hyperkalemia treatment; monitor glucose and potassium using a cause-specific protocol.',
 'Potassium replacement':'Document confirmed indication, dilution, route and controlled infusion; follow local protocol.',
 'Sodium bicarbonate':'Selected sodium-channel blocker poisoning; not routine undifferentiated arrest treatment. Benefit in hyperkalemic arrest is uncertain.',
 'Naloxone':'Suspected opioid respiratory depression. Do not delay ventilation or CPR.',
 'IV lipid emulsion':'Life-threatening local anesthetic systemic toxicity; follow a toxicology protocol.',
 'Digoxin immune Fab':'Life-threatening digoxin / cardiac glycoside poisoning; dose is exposure-specific.',
 'Hydroxocobalamin':'Suspected life-threatening cyanide poisoning; use the appropriate toxicology protocol.',
 'Atropine':'Selected cholinergic poisoning; poisoning doses differ from bradycardia doses.',
 'Pralidoxime':'Selected organophosphate poisoning alongside atropine; consult toxicology.',
 'High-dose insulin':'Selected beta-blocker / calcium-channel blocker poisoning with hemodynamic compromise; glucose and potassium monitoring required.',
 'Vasopressor':'Select drug and titration targets for the clinical mechanism; document each infusion change.',
 'Fibrinolytic':'Selected pulmonary embolism cases; document indication and treating clinician’s decision.',
 'Crystalloid':'Select fluid, volume and reassessment for the mechanism of shock.',
 'Blood product':'Record product, volume, route and response; use local transfusion protocol.'
};
export const fmt=n=>Number(n.toFixed(4)).toString();
export function validWeight(w){return Number.isFinite(Number(w))&&Number(w)>0&&Number(w)<=500;}
export function doseReference(group,drug,mode,weight,doseNo=1){
 const p=mode==='Pediatric',w=validWeight(weight)?Number(weight):null,n=Number(doseNo),r={dose:null,unit:'mg',route:p?'IV / IO':'IV',source:p?1:0,text:'',calculation:''};
 const calc=(factor,cap,min=0)=>{r.calculation=`${factor} mg/kg${cap?`; maximum ${cap} mg`:''}${min?`; minimum ${min} mg`:''}`; if(w)r.dose=Math.max(min,Math.min(w*factor,cap??Infinity)); else r.text+=' Enter a valid weight in kg for calculation.';};
 if(!Number.isInteger(n)||n<1){r.text='Select a valid dose number.';return r;}
 if(group==='Cardiac arrest'){
  r.route='IV / IO';
  if(drug==='Epinephrine'){r.text='Arrest bolus every 3–5 min. Nonshockable arrest: give as soon as feasible. Shockable arrest: prioritize initial defibrillation.';p?calc(.01,1):r.dose=1;if(p)r.text+=' Use 0.1 mg/mL concentration.';}
  if(drug==='Amiodarone'){r.text='Refractory VF / pulseless VT. Alternative to lidocaine. Arrest bolus only.';if(n>(p?3:2)){r.text+=' No further dose calculated beyond the algorithm’s listed doses.';}else if(p)calc(5,n===1?300:150);else r.dose=n===1?300:150;}
  if(drug==='Lidocaine'){r.text='Refractory VF / pulseless VT. Alternative to amiodarone.';if(p)calc(1);else if(n<=2){r.calculation=n===1?'1–1.5 mg/kg':'0.5–0.75 mg/kg';if(w)r.range=[w*(n===1?1:.5),w*(n===1?1.5:.75)];else r.text+=' Enter weight in kg.';}else r.text+=' Further dosing requires local protocol.';}
 }else if(group==='Bradycardia with pulse'){
  r.source=p?3:2;
  if(drug==='Atropine'){r.text=p?'For increased vagal tone or primary AV block. May repeat once. Support oxygenation / ventilation; persistent HR <60/min with compromise despite support requires CPR.':'1 mg IV; repeat every 3–5 min, maximum total 3 mg. If ineffective, pacing and/or chronotropic infusion.';if(n>(p?2:3))r.text+=' No additional dose calculated beyond the listed limit.';else p?calc(.02,.5,.1):r.dose=1;}
  if(drug==='Epinephrine'){if(p){r.text='Pediatric bradycardia bolus: 0.1 mg/mL concentration. Respiratory support and CPR when indicated remain central.';calc(.01,1);}else{r.text='Titrated infusion, 2–10 micrograms/min. NOT the arrest bolus.';r.unit='micrograms/min';r.range=[2,10];}}
  if(drug==='Dopamine'){r.text=p?'Use pediatric / local vasoactive protocol. Adult infusion guidance is not applied.':'Titrated infusion, 5–20 micrograms/kg/min.';if(!p){r.unit='micrograms/kg/min';r.range=[5,20];}}
 }else if(group==='Tachyarrhythmia with pulse'){
  r.source=p?5:4;
  if(drug==='Adenosine'){r.text='Selected regular SVT; for wide complexes only if regular and monomorphic. Rapid push with saline flush. Instability attributable to the rhythm calls for prompt electrical therapy.';if(n>2)r.text+=' Further dosing requires expert / local protocol.';else p?calc(n===1?.1:.2,n===1?6:12):r.dose=n===1?6:12;}
  else if(p)r.text='Pediatric tachyarrhythmia: seek expert consultation before additional drug therapies. No adult dosing is applied.';
  else if(drug==='Amiodarone'){r.dose=150;r.text='Stable wide-QRS tachycardia: 150 mg IV over 10 min; repeat if VT recurs, then 1 mg/min for the first 6 h. NOT an arrest bolus.';}
  else if(drug==='Procainamide'){r.text='Stable wide-QRS tachycardia: 20–50 mg/min; stop for rhythm suppression, hypotension, QRS widening >50%, or cumulative 17 mg/kg. Maintenance 1–4 mg/min. Avoid prolonged QT or heart failure.';r.unit='mg/min';r.range=[20,50];if(w)r.calculation=`17 mg/kg cumulative limit = ${fmt(17*w)} mg`;}
  else if(drug==='Magnesium sulfate'){r.text='Torsades with long QT; not routine ventricular arrhythmia therapy. Use the selected protocol for dose and rate.';}
  else r.text='Selected adult rate-control situations. Not a generic wide-complex treatment. Use rhythm-specific / local protocol.';
 }else {r.source=8;r.text=causeDrugNotes[drug]||'Record the treating clinician’s selected drug, dose, route and indication.';}
 return r;
}
export function volumeFor(dose,concentration){const d=Number(dose),c=Number(concentration);return Number.isFinite(d)&&d>0&&Number.isFinite(c)&&c>0?d/c:null;}
export function shockReference(mode,weight,therapy,number,adultMaximum){
 if(mode!=='Pediatric')return therapy==='Defibrillation'?'Biphasic: use manufacturer-recommended energy; if unknown, maximum available. Subsequent shocks at least equivalent. Monophasic: 360 J.':therapy==='Synchronized cardioversion'?'AHA 2025: AF / atrial flutter 200 J; narrow-complex tachycardia / monomorphic VT 100 J. Confirm synchronization each time. Polymorphic VT requires unsynchronized defibrillation.':'Record electrical AND mechanical capture.';
 if(therapy==='Pacing')return 'Record electrical AND mechanical capture; use the treating team’s settings.';
 if(!validWeight(weight))return 'Enter weight in kg before calculating pediatric energy.';
 const w=Number(weight);if(therapy==='Synchronized cardioversion')return `First 0.5–1 J/kg = ${fmt(.5*w)}–${fmt(w)} J; if ineffective, 2 J/kg = ${fmt(2*w)} J. Sedation when feasible without delaying treatment.`;
 const n=Number(number),cap=Number(adultMaximum);if(!(cap>0))return 'Enter this device’s adult maximum energy to calculate a pediatric defibrillation reference. First 2 J/kg; second 4 J/kg; later ≥4 J/kg, up to 10 J/kg or adult maximum.';
 if(n<=2)return `${n===1?2:4} J/kg = ${fmt(w*(n===1?2:4))} J; device/adult ceiling ${fmt(cap)} J. Use no more than ${fmt(Math.min(w*(n===1?2:4),cap))} J.`;
 return `Subsequent ≥4 J/kg (${fmt(4*w)} J); ceiling ${fmt(Math.min(10*w,cap))} J (lower of 10 J/kg or adult maximum). Treating team selects energy within applicable limits.`;
}
export function duration(ms){let s=Math.max(0,Math.floor(ms/1000));return `${Math.floor(s/60).toString().padStart(2,'0')}:${(s%60).toString().padStart(2,'0')}`;}
export function clock(ms){return new Date(ms).toLocaleTimeString('en-GB',{hour12:false});}
