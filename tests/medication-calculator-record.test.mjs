import test from 'node:test';
import assert from 'node:assert/strict';
import {medicationCalculatorSeed,matchingCalculatorSnapshot} from '../medication-calculator-record.mjs';
import {freshRun,validateSaved} from '../storage.mjs';

const patient={weightKg:'20',weightBasis:'Measured',mode:'Pediatric'};
const bolus={medication:'Midazolam (Versed)',delivery:'Bolus',dose:'0.1',doseUnit:'mg',perKg:true,timeUnit:'min',concentrationAmount:'5',concentrationUnit:'mg',concentrationVolume:'1',indication:'Entered test order',orderSource:'Synthetic arithmetic fixture'};

test('reviewing a calculated order seeds no administered dose, volume, route or status',()=>{
  const before=structuredClone(bolus);
  const seed=medicationCalculatorSeed(bolus,patient);
  assert.equal(seed.Drug,'Midazolam (Versed)');
  assert.equal(seed.Status,'Select status');
  assert.equal(seed['Actual dose / rate'],'');
  assert.equal(seed['Administered volume (mL)'],'');
  assert.equal(seed.Route,'Select route');
  assert.equal(seed.Concentration,'5');
  assert.equal(seed['Concentration units'],'mg/mL');
  assert.equal(Number(seed._calculator.data['Calculated bolus volume (mL)']),0.4);
  assert.equal(seed._calculator.data['Calculation weight (kg)'],'20');
  assert.match(seed['Ordered dose / rate'],/0\.1 mg\/kg/);
  assert.deepEqual(bolus,before);
});

test('continuous and timed infusions retain order, final preparation and calculated pump rate separately',()=>{
  const continuous=medicationCalculatorSeed({...bolus,medication:'Norepinephrine (Levophed)',delivery:'Infusion',doseUnit:'micrograms',concentrationAmount:'4',concentrationVolume:'250'},{weightKg:'80',weightBasis:'Measured',mode:'Adult'});
  assert.equal(continuous.Delivery,'Infusion start');
  assert.equal(continuous['Dose units'],'mL/hour');
  assert.equal(continuous['Actual dose / rate'],'');
  assert.equal(Number(continuous._calculator.data['Calculated infusion rate (mL/hour)']),30);
  assert.equal(continuous._calculator.data['Preparation drug amount'],'4 mg');
  assert.equal(continuous._calculator.data['Preparation final total volume (mL)'],'250');
  assert.equal(continuous._calculator.data['Calculated total infusion volume (mL)'],undefined);
  const timed=medicationCalculatorSeed({...bolus,delivery:'Timed infusion',dose:'100',perKg:false,concentrationAmount:'100',concentrationVolume:'50',durationMinutes:'10'},patient);
  assert.equal(Number(timed._calculator.data['Calculated total infusion volume (mL)']),50);
  assert.equal(Number(timed._calculator.data['Calculated infusion rate (mL/hour)']),300);
  assert.equal(timed._calculator.data['Ordered infusion duration (min)'],'10');
  assert.equal(timed['Administered volume (mL)'],'');
});

test('custom names and volume-only orders do not invent a drug concentration',()=>{
  const seed=medicationCalculatorSeed({...bolus,medication:'Other medication',customMedication:'Example solution',dose:'2',doseUnit:'mL',perKg:true,concentrationAmount:'',concentrationUnit:'',concentrationVolume:''},patient);
  assert.equal(seed.Drug,'Other');
  assert.equal(seed['Other drug / fluid'],'Example solution');
  assert.equal(seed.Concentration,'');
  assert.equal(Number(seed._calculator.data['Calculated bolus volume (mL)']),40);
  assert.equal(seed._calculator.data['Preparation drug amount'],undefined);
});

test('handoff recomputes against committed weight and rejects invalid identity or input',()=>{
  const seed=medicationCalculatorSeed({...bolus,weightKg:100,weightBasis:'Estimated'},patient);
  assert.equal(seed._calculator.data['Calculation weight (kg)'],'20');
  for(const draft of [null,{...bolus,medication:''},{...bolus,medication:'unrecognized'},{...bolus,medication:'Other medication',customMedication:' '},{...bolus,concentrationVolume:'0'}])assert.throws(()=>medicationCalculatorSeed(draft,patient));
  assert.throws(()=>medicationCalculatorSeed(bolus,{...patient,weightBasis:'Unknown'}));
});

test('changed identity, order, concentration, delivery or used weight detaches the old result',()=>{
  const seed=medicationCalculatorSeed(bolus,patient);
  const valid=matchingCalculatorSnapshot(seed,{...seed},patient);
  assert.ok(valid);
  for(const [key,value]of [['Drug','Other'],['Context','Cardiac arrest'],['Other drug / fluid','Unexpected'],['Ordered dose / rate','0.2 mg/kg'],['Concentration','10'],['Concentration',''],['Concentration units','micrograms/mL'],['Delivery','Infusion start']])assert.equal(matchingCalculatorSnapshot(seed,{...seed,[key]:value},patient),null,key);
  assert.equal(matchingCalculatorSnapshot(seed,seed,{...patient,weightKg:'21'}),null);
  assert.equal(matchingCalculatorSnapshot(seed,seed,{...patient,weightBasis:'Estimated'}),null);
  assert.equal(matchingCalculatorSnapshot(seed,seed,{...patient,mode:'Adult'}),null);
  assert.ok(matchingCalculatorSnapshot(seed,{...seed,Concentration:'5.0'},patient),'numerically equal concentration stays attached');
  assert.ok(matchingCalculatorSnapshot(seed,{...seed,Status:'Administered','Actual dose / rate':'1','Administered volume (mL)':'0.2',Route:'IV'},patient),'order calculation remains an order snapshot, not an assertion about actual administration');
});

test('saved calculation drafts and snapshots survive recovery; a new run clears the draft and weight',()=>{
  const seed=medicationCalculatorSeed(bolus,patient);
  const snapshot=structuredClone(seed._calculator.data);
  const event={id:'med-1',type:'Medication',t:1,entered:1,data:{...seed,...snapshot,_calculator:undefined,Status:'Ordered'}};
  const state={run:{Mode:'Pediatric','Weight (kg)':'20','Weight basis':'Measured'},events:[event],team:[],medicationCalculator:bolus,weightDraft:{weight:'21',basis:'Estimated',source:'Medication calculator'}};
  const saved=validateSaved(JSON.parse(JSON.stringify({version:1,revision:1,state}))).state;
  assert.equal(saved.medicationCalculator.concentrationAmount,'5');
  assert.equal(saved.events[0].data['Calculation weight (kg)'],'20');
  const next=freshRun(saved,{run:{Mode:'Adult','Weight (kg)':''},events:[],team:[],medicationCalculator:{},weightDraft:null});
  assert.deepEqual(next.medicationCalculator,{});
  assert.equal(next.weightDraft,null);
  assert.equal(next.run['Weight (kg)'],'');
  assert.equal(saved.events[0].data['Calculation weight (kg)'],'20');
});
