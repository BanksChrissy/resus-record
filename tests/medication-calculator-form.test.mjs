import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import {drugs,doseReference,sources,fmt,volumeFor} from '../clinical.mjs';
import {formatMedicationNumber} from '../medication-calculator.mjs';
import {medicationCalculatorSeed,matchingCalculatorSnapshot} from '../medication-calculator-record.mjs';

const appSource=readFileSync(new URL('../app.mjs',import.meta.url),'utf8');
const modalSource=appSource.slice(appSource.indexOf('function openMedication('),appSource.indexOf('function openCause('));
const patient={weightKg:'80',weightBasis:'Measured',mode:'Adult'};
const order={medication:'Norepinephrine (Levophed)',delivery:'Infusion',dose:'0.1',doseUnit:'micrograms',perKg:true,timeUnit:'min',concentrationAmount:'4',concentrationUnit:'mg',concentrationVolume:'250'};

// Execute the production modal's event handlers with a minimal form adapter.
// This checks integration semantics, not browser layout or accessibility.
function mount(seed){
  const saved=[],errors=[],elements={},listeners={};
  const form={elements,addEventListener:(type,fn)=>{listeners[type]=fn;}};
  const nodes=Object.fromEntries(['#dose-reference','#med-totals','#volume-reference','#calculator-order-reference'].map(key=>[key,{innerHTML:'',textContent:'',hidden:false}]));
  const copyButton={};
  const f=(label,type='text',options=null,required=false,extra={})=>({label,type,options,required,...extra});
  const state={run:{Mode:patient.mode,'Weight (kg)':patient.weightKg,'Weight basis':patient.weightBasis}};
  const context={seed,state,drugs,doseReference,sources,fmt,volumeFor,formatMedicationNumber,matchingCalculatorSnapshot,Number,Object,String,
    $:selector=>selector==='#entry-form'?form:selector==='#use-dose'?(nodes['#dose-reference'].innerHTML.includes('id="use-dose"')?copyButton:null):nodes[selector],
    esc:value=>String(value??'').replace(/&/g,'&amp;').replace(/</g,'&lt;'),
    f,sel:(label,options)=>f(label,'select',options),num:(label,extra={})=>f(label,'number',null,false,extra),area:label=>f(label,'textarea'),
    canRecord:()=>true,effective:()=>[],calculatorPatient:()=>patient,modalContext:{dirty:false},common:()=>'',showDialog:()=>{},
    inputField:(definition,value)=>{const label={hidden:false};elements[definition.label]={value:String(value??definition.value??definition.options?.[0]??''),options:definition.options,closest:()=>label};return '';},
    formData:()=>Object.fromEntries(Object.entries(elements).map(([key,input])=>[key,input.value])),
    eventTime:()=>123,complete:(type,data,t)=>saved.push({type,data,t}),fail:error=>errors.push(error.message)
  };
  runInNewContext(modalSource+'\nopenMedication(seed);',context);
  return {form,nodes,saved,errors,copyButton,change:()=>listeners.change(),submit:()=>form.onsubmit({preventDefault(){}})};
}

test('real medication form requires status and actual administration after calculator handoff',()=>{
  const app=mount(medicationCalculatorSeed(order,patient));
  assert.deepEqual(app.saved,[]);
  assert.equal(app.form.elements['Actual dose / rate'].value,'');
  assert.equal(app.form.elements['Administered volume (mL)'].value,'');
  assert.equal(app.form.elements.Route.value,'Select route');
  assert.ok(app.nodes['#calculator-order-reference'].innerHTML.includes('30 mL/hour'));
  app.submit();
  assert.match(app.errors.at(-1),/Choose whether/);
  app.form.elements.Status.value='Administered';
  app.submit();
  assert.match(app.errors.at(-1),/actual administered dose/);
  assert.deepEqual(app.saved,[]);
  app.form.elements.Status.value='Ordered';
  app.submit();
  assert.equal(app.saved.length,1);
  assert.equal(app.saved[0].data.Status,'Ordered');
  assert.equal(app.saved[0].data['Calculated infusion rate (mL/hour)'],'30');
  assert.equal(app.saved[0].data['Actual dose / rate'],'');
});

test('actual drug-change handler clears old preparation and detaches its calculation',()=>{
  const app=mount(medicationCalculatorSeed(order,patient));
  const fields=app.form.elements;
  fields['Actual dose / rate'].value='30';fields['Administered volume (mL)'].value='10';fields.Status.value='Administered';fields.Route.value='IV';
  fields.Drug.value='Midazolam (Versed)';fields.Drug.onchange();
  for(const key of ['Ordered dose / rate','Actual dose / rate','Concentration','Administered volume (mL)'])assert.equal(fields[key].value,'',key);
  assert.equal(fields.Status.value,'Select status');
  assert.equal(fields.Route.value,'Select route');
  assert.equal(fields['Dose units'].value,'mg');
  assert.ok(!app.nodes['#calculator-order-reference'].innerHTML.includes('30 mL/hour'));
  fields.Status.value='Ordered';app.submit();
  assert.equal(app.saved[0].data['Calculated infusion rate (mL/hour)'],undefined);
});

test('editing order concentration removes stale snapshot; copying an existing reference still works',()=>{
  const app=mount(medicationCalculatorSeed(order,patient));
  app.form.elements.Concentration.value='0.032';app.change();
  app.form.elements.Status.value='Ordered';app.submit();
  assert.equal(app.saved[0].data['Calculated infusion rate (mL/hour)'],undefined);
  const reference=mount({Context:'Cardiac arrest',Drug:'Epinephrine'});
  assert.equal(typeof reference.copyButton.onclick,'function');
  reference.copyButton.onclick();
  assert.equal(reference.form.elements['Ordered dose / rate'].value,'1 mg');
  assert.equal(reference.form.elements['Actual dose / rate'].value,'');
  assert.deepEqual(reference.saved,[]);
});
