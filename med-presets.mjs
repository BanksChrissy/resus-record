// Administration shortcuts from user-supplied Meds.pdf, pp. 1, 2, 4.
// Pediatric arrest caps and initial lidocaine dose cross-checked with 2025 AHA PALS.
// These are explicit selections, not treatment orders or automatic dose sequencing.
export const presetSource='Meds.pdf pp. 1, 2, 4; 2025 AHA adult/pediatric cardiac arrest algorithms';
export function arrestPresets(drug,mode,weight,basis){
 if(!['Adult','Pediatric'].includes(mode))throw Error('Select Adult or Pediatric mode.');
 if(!['Epinephrine','Amiodarone','Lidocaine'].includes(drug))return [];
 const pediatric=mode==='Pediatric',weighted=pediatric||drug==='Lidocaine';
 const w=Number(weight),known=Number.isFinite(w)&&w>0&&w<=500&&['Measured','Estimated'].includes(basis);
 const fixed=(key,amount,description)=>({key,amount,description});
 const calc=(key,factor,cap,description)=>({key,amount:known?Number(Math.min(w*factor,cap).toFixed(6)):null,description,formula:`${factor} mg/kg${Number.isFinite(cap)?`; max ${cap} mg`:''}`});
 let doses;
 if(drug==='Epinephrine')doses=pediatric?[calc('arrest',.01,1,'Arrest bolus · 0.1 mg/mL')]:[fixed('arrest',1,'Arrest bolus · 0.1 mg/mL')];
 if(drug==='Amiodarone')doses=pediatric?[calc('first',5,300,'First arrest dose'),calc('subsequent',5,150,'Subsequent arrest dose')]:[fixed('first',300,'First arrest dose'),fixed('second',150,'Second arrest dose')];
 if(drug==='Lidocaine')doses=pediatric?[calc('first',1,Infinity,'Arrest dose')]:[calc('first',1,Infinity,'First arrest dose'),calc('second',.5,Infinity,'Second arrest dose')];
 return doses.flatMap(d=>['IV','IO'].map(route=>({...d,id:`${drug}-${mode}-${d.key}-${route}`,drug,route,units:'mg',mode,weighted,weight:weighted&&known?w:null,basis:weighted?basis:null,disabled:weighted&&!known})));
}
export function arrestPresetData(p){
 if(!p||p.disabled||!Number.isFinite(p.amount)||p.amount<=0||!['IV','IO'].includes(p.route))throw Error('Enter weight and weight basis before selecting this dose.');
 return {Drug:p.drug,Status:'Administered',Context:'Cardiac arrest',Delivery:'Bolus','Actual dose / rate':String(p.amount),'Dose units':p.units,Route:p.route,'Details status':'Added',Preset:`${p.description}: ${p.amount} ${p.units} ${p.route}`,'Preset source':presetSource,...(p.weighted?{'Preset calculation':`${p.formula}; ${p.weight} kg (${p.basis})`}:{}),...(p.drug==='Epinephrine'?{Concentration:'0.1','Concentration units':'mg/mL'}:{})};
}
