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
 ['Pediatric advanced life support','https://cpr.heart.org/en/resuscitation-science/cpr-and-ecc-guidelines/pediatric-advanced-life-support'],
 ['LIFEPAK 15 operating instructions','https://www.stryker.com/content/dam/stryker/ems/resources/operating-instructions/lifepak_15_operating_instructions_en.pdf'],
 ['LIFEPAK 15 instructor guide','https://www.stryker.com/content/dam/stryker/ems/training/lifepak-15/lifepak_15_instructors_guide.pdf'],
 ['AHA adult advanced life support','https://cpr.heart.org/en/resuscitation-science/cpr-and-ecc-guidelines/adult-advanced-life-support']
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
 if(mode!=='Pediatric')return therapy==='Defibrillation'?'LIFEPAK 15 biphasic: adult VF/pulseless VT manufacturer sequence 200 → 300 → 360 J. Maximum 360 J. Confirm local protocol and response before selecting each energy; the app does not advance the sequence.':therapy==='Synchronized cardioversion'?'LIFEPAK 15 · AHA 2025: AF / atrial flutter initial 200 J biphasic; narrow-complex tachycardia / monomorphic VT initial 100 J synchronized. Check SYNC and QRS markers each time. Polymorphic VT requires unsynchronized high-energy defibrillation.':'Record electrical AND mechanical capture.';
 if(therapy==='Pacing')return 'Record electrical AND mechanical capture; use the treating team’s settings.';
 if(!validWeight(weight))return 'Enter weight in kg before calculating pediatric energy.';
 const w=Number(weight);if(therapy==='Synchronized cardioversion')return `First 0.5–1 J/kg = ${fmt(.5*w)}–${fmt(w)} J; if ineffective, 2 J/kg = ${fmt(2*w)} J. Sedation when feasible without delaying treatment.`;
 const n=Number(number),cap=Number(adultMaximum);if(!(cap>0))return 'Enter this device’s adult maximum energy to calculate a pediatric defibrillation reference. First 2 J/kg; second 4 J/kg; later ≥4 J/kg, up to 10 J/kg or adult maximum.';
 if(n<=2)return `${n===1?2:4} J/kg = ${fmt(w*(n===1?2:4))} J; device/adult ceiling ${fmt(cap)} J. Use no more than ${fmt(Math.min(w*(n===1?2:4),cap))} J.`;
 return `Subsequent ≥4 J/kg (${fmt(4*w)} J); ceiling ${fmt(Math.min(10*w,cap))} J (lower of 10 J/kg or adult maximum). Treating team selects energy within applicable limits.`;
}
export function duration(ms){let s=Math.max(0,Math.floor(ms/1000));return `${Math.floor(s/60).toString().padStart(2,'0')}:${(s%60).toString().padStart(2,'0')}`;}
export function clock(ms){return new Date(ms).toLocaleTimeString('en-GB',{hour12:false});}

// Decision support uses one current assessment, never a pulse from an older event.
// Two minutes is an app freshness limit, not a treatment interval.
export function rhythmPrompt(mode,events,ended,now=Date.now()){
 if(ended)return null;
 const types=['Rhythm & pulse','Electrical therapy','ROSC','Rearrest','CPR started','CPR stopped','CPR resumed','Medication'];
 const e=events.filter(e=>types.includes(e.type)&&(e.type!=='Medication'||e.data.Status==='Administered')).at(-1);if(!e)return null;
 const out=(title,text,source=4,extra={})=>({title,text,source,event:e,...extra});
 if(mode!=='Adult')return out('Pediatric pathway','Use the pediatric algorithm and weight-based references. Adult energy and medication prompts are not applied.',5);
 if(e.mode&&e.mode!==mode)return out('Reassess in the current patient mode','The last finding was recorded in a different patient mode. Record a current rhythm and pulse.');
 if(e.type!=='Rhythm & pulse')return out(e.type==='ROSC'?'ROSC recorded · reassess':'Condition or treatment changed · reassess',e.type==='ROSC'?'Assess oxygenation, ventilation, blood pressure and the underlying cause using post-arrest care. Record a new rhythm and pulse.':'Record the current rhythm and pulse before using a rhythm-specific prompt.',e.type==='ROSC'?7:0);
 if(!Number.isFinite(e.t)||now-e.t>120000||now<e.t)return out('Reassess current findings','This assessment is outside the app’s 2-minute freshness window or has a future timestamp. Record a new rhythm, pulse and stability assessment.');
 const d=e.data,r=d.Rhythm,p=d.Pulse,h=d['Hemodynamic condition'];
 const absent=['VF','Pulseless VT','PEA','Asystole'];
 if(p==='Present'&&absent.includes(r))return out('Conflicting rhythm and pulse','The selected arrest rhythm conflicts with a present pulse. Recheck and document the current findings.');
 if(r==='Polymorphic VT')return out('Polymorphic VT → unsynchronized defibrillation','Deliver a high-energy unsynchronized shock; do not wait for synchronization. Use the device’s defibrillation energy guidance. If pulseless, follow the cardiac-arrest pathway.',6,{therapy:'Defibrillation'});
 if(p==='Absent'||absent.includes(r)){
  if(['VF','Pulseless VT','Monomorphic VT with pulse'].includes(r))return out('VF / pulseless VT → defibrillation + CPR','LIFEPAK 15 adult VF/pVT sequence: 200 → 300 → 360 J biphasic (manufacturer reference). Confirm local protocol and previous response; do not restart at 200 J after failed higher-energy shocks. Resume CPR immediately after the shock and follow the arrest sequence. Assess reversible causes.',0,{therapy:'Defibrillation'});
  if(['Unknown','Not entered',undefined,'Other'].includes(r))return out('No pulse → CPR + rhythm assessment','Start high-quality CPR and identify the rhythm. The rhythm determines whether defibrillation is indicated.',0);
  return out('PEA / asystole pathway → CPR, no shock','With no pulse and a nonshockable rhythm: provide CPR, give epinephrine as soon as possible per the arrest protocol, and investigate reversible causes. Reassess rhythm every 2 minutes.',0);
 }
 const tachy=['Atrial fibrillation with RVR','Atrial fibrillation','Atrial flutter','SVT','Regular narrow-complex tachycardia','Monomorphic VT with pulse'];
 if(!tachy.includes(r)&&r!=='Bradycardia')return out('Assess rhythm in clinical context','Record the pulse and assess perfusion. Treat the underlying cause; this finding alone does not select an electrical treatment.');
 if(p!=='Present'||!['Stable','Compromise attributable to arrhythmia','Compromise from another cause','Uncertain cause'].includes(h))return out(`${r} → assess pulse and stability`,'Check for low blood pressure, acute mental-status change, shock, ischemic chest symptoms or acute heart failure. Confirm whether the rhythm is causing the compromise.',r==='Bradycardia'?2:4,{assess:true});
 if(h==='Compromise from another cause'||h==='Uncertain cause')return out('Compromise: establish the cause','Support airway, breathing and perfusion. Determine whether the rhythm is driving the instability; no automatic cardioversion energy is selected.',4,{assess:true});
 if(r==='Bradycardia')return h==='Stable'?out('Stable bradycardia → observe and investigate','Monitor, obtain a 12-lead ECG, and identify reversible causes. Reassess if perfusion changes.',2):out('Bradycardia with compromise → atropine / pacing pathway','Atropine 1 mg IV; repeat every 3–5 minutes to a 3 mg total. If ineffective, transcutaneous pacing and/or dopamine or epinephrine infusion; seek expert help and consider transvenous pacing. Treat reversible causes.',2,{deviceTherapy:'Pacing'});
 if(h==='Stable')return out(`${r} → stable tachycardia pathway`,r.startsWith('Atrial')?'Monitor and obtain a 12-lead ECG. Assess preexcitation, heart failure and thromboembolic risk before choosing rate/rhythm control; use expert consultation and the applicable protocol. Avoid AV-nodal blockers in preexcited AF.':r==='Monomorphic VT with pulse'?'Obtain a 12-lead ECG and expert consultation; consider an antiarrhythmic infusion. Adenosine is only considered for a regular, monomorphic rhythm.':'Monitor and obtain a 12-lead ECG. If confirmed regular and narrow-complex, consider vagal maneuvers and adenosine per protocol; reassess stability.',r.startsWith('Atrial')?12:4);
 const priorCardioversion=events.some(x=>x.type==='Electrical therapy'&&x.t<=e.t&&x.data.Therapy==='Synchronized cardioversion');
 if(priorCardioversion)return out('Persistent / recurrent tachyarrhythmia → reassess energy','Prior cardioversion is recorded. Reassess the rhythm, perfusion, pad contact and response; consider increasing energy, antiarrhythmic therapy and expert consultation. LIFEPAK 15 maximum is 360 J. Do not automatically repeat an initial-energy setting.',4,{therapy:'Synchronized cardioversion',repeat:true});
 const energy=r.startsWith('Atrial')?200:100;
 return out(`${r} → unstable → initial ${energy} J synchronized`,`${energy} J initial cardioversion reference${energy===200?' (biphasic)':''}. Confirm SYNC markers before the shock and recheck synchronization for each attempt. Sedate when feasible without delaying urgent treatment. If synchronization is delayed and the patient is critical, use an unsynchronized shock. Follow device guidance; reassess before repeat energy selection.`,6,{therapy:'Synchronized cardioversion',energy});
}

export const LIFEPAK15={name:'LIFEPAK 15',maximum:360,energies:[2,3,4,5,6,7,8,9,10,15,20,30,50,70,100,125,150,175,200,225,250,275,300,325,360]};
export function lifepakSteps(therapy){
 if(therapy==='Synchronized cardioversion')return ['Use the LIFEPAK ECG signal; enable SYNC and verify a marker on each QRS, not the T wave.','Select energy, charge, verify the rhythm and energy, and clear everyone.','With therapy pads, hold SHOCK until ENERGY DELIVERED appears.','Recheck SYNC before another attempt. Factory default turns it off after a shock; local configuration may differ.'];
 if(therapy==='Defibrillation')return ['Confirm SYNC is off; select the intended energy and charge.','Recheck rhythm and energy, clear everyone, then deliver the shock.'];
 if(therapy==='Pacing')return ['Apply ECG leads and therapy pads; press PACER and check sensing markers.','Choose RATE; increase CURRENT to electrical capture.','Confirm mechanical capture with pulse or blood pressure. Provide analgesia/sedation as appropriate.'];
 return [];
}

export const GCS_CHOICES={
 'GCS eye':['4 · Spontaneous','3 · To sound','2 · To pressure','1 · No opening','NT · Not testable'],
 'GCS verbal':['5 · Oriented','4 · Confused conversation','3 · Words only','2 · Sounds only','1 · No verbal response','NT · Not testable'],
 'GCS motor':['6 · Obeys commands','5 · Localizes','4 · Normal flexion','3 · Abnormal flexion','2 · Extension','1 · No movement','NT · Not testable']
};
export const RASS_CHOICES=['+4 · Combative','+3 · Very agitated','+2 · Agitated','+1 · Restless','0 · Alert / calm','-1 · Drowsy','-2 · Light sedation','-3 · Moderate sedation','-4 · Deep sedation','-5 · Unarousable','NT · Not assessable'];
export const VITAL_NUMBERS=['Heart rate (beats/min)','Systolic BP (mm Hg)','Diastolic BP (mm Hg)','SpO2 (%)','Respiratory rate (breaths/min)','EtCO2 (mm Hg)','MAP (mm Hg)','Temperature (°C)','Pain (0–10)','Oxygen flow (L/min)','Capillary refill (seconds)'];
export function gcsTotal(data){const values=Object.entries(GCS_CHOICES).map(([key,options])=>options.includes(data[key])&&!data[key].startsWith('NT')?Number.parseInt(data[key],10):null);return values.every(v=>v!==null)?values.reduce((a,b)=>a+b,0):null;}
export function normalizeVitals(input){const d={...input};for(const [k,v]of Object.entries(d)){if(v===''||v===undefined||v==='Not entered')delete d[k];}
 for(const key of VITAL_NUMBERS){if(d[key]===undefined)continue;const n=Number(d[key]);if(!Number.isFinite(n)||(n<0&&key!=='Temperature (°C)')||(key==='SpO2 (%)'&&n>100)||(key==='Pain (0–10)'&&n>10))throw Error(`Check ${key}.`);d[key]=String(n);}
 for(const[key,options]of Object.entries(GCS_CHOICES)){if(d[key]!==undefined&&!options.includes(d[key]))throw Error(`Choose a valid ${key} component.`);}
 if(d.RASS!==undefined&&!RASS_CHOICES.includes(d.RASS))throw Error('Choose a valid RASS score.');
 if(d['Systolic BP (mm Hg)']!==undefined&&d['Diastolic BP (mm Hg)']!==undefined&&Number(d['Systolic BP (mm Hg)'])<Number(d['Diastolic BP (mm Hg)']))throw Error('Systolic BP cannot be below diastolic BP. Check the values.');
 if(d['Blood glucose']!==undefined){const b=String(d['Blood glucose']).trim().toUpperCase();if(!['HI','LO'].includes(b)&&(!/^\d+(\.\d+)?$/.test(b)||!Number.isFinite(Number(b))))throw Error('Blood glucose: enter a number, HI or LO.');d['Blood glucose']=b;if(!['mg/dL','mmol/L'].includes(d['Glucose units']))throw Error('Choose glucose units.');}else delete d['Glucose units'];
 delete d['GCS total'];const total=gcsTotal(d);if(total!==null)d['GCS total']=String(total);
 const clinical=[...VITAL_NUMBERS,...Object.keys(GCS_CHOICES),'RASS','Blood glucose','Orientation (A&O)','Alertness','Pupils','Skin / perfusion','Oxygen device','Details'];if(!clinical.some(k=>d[k]!==undefined))throw Error('Enter at least one observation before logging vitals.');return d;
}
