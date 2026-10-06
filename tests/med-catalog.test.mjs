import test from 'node:test';
import assert from 'node:assert/strict';
import {medicationCatalog,medicationReferences} from '../med-catalog.mjs';
const refs=(n,w=70,mode='Adult',basis='Measured')=>medicationReferences(n,mode,w,basis);
test('every medication has adult and pediatric entries',()=>{
 assert.equal(medicationCatalog.length,53);
 assert.equal(new Set(medicationCatalog.map(m=>m.name)).size,53);
 for(const med of medicationCatalog)for(const mode of ['Adult','Pediatric']){
  assert.ok(refs(med.name,70,mode).length,med.name+' '+mode);
  for(const w of [.1,5,20,70,200,500])for(const r of refs(med.name,w,mode))for(const value of r.values){assert.ok(Number.isFinite(value)&&value>0);if(r.cap)assert.ok(value<=r.cap);}
 }
});
test('weight changes refresh calculated doses but not fixed doses',()=>{
 assert.equal(refs('Fentanyl',70)[0].display,'70 micrograms');
 assert.equal(refs('Fentanyl',120)[0].display,'100 micrograms');
 assert.equal(refs('Epinephrine 0.1 mg/mL',20)[0].display,'1 mg');
 assert.equal(refs('Epinephrine 0.1 mg/mL',100)[0].display,'1 mg');
 assert.equal(refs('Ketamine (Ketalar)',70)[0].display,'14 mg');
 assert.equal(refs('Ketamine (Ketalar)',80)[0].display,'16 mg');
});
test('pediatric caps, minima and preparation volumes',()=>{
 assert.equal(refs('Epinephrine 0.1 mg/mL',20,'Pediatric')[0].display,'0.2 mg');
 assert.equal(refs('Epinephrine 0.1 mg/mL',20,'Pediatric')[0].volume,'2 mL');
 assert.equal(refs('Atropine',3,'Pediatric')[0].display,'0.1 mg');
 assert.equal(refs('Atropine',30,'Pediatric')[0].display,'0.5 mg');
 assert.equal(refs('Etomidate (Amidate)',100,'Pediatric')[0].display,'20 mg');
 assert.equal(refs('Etomidate (Amidate)',100)[0].display,'30 mg');
 assert.equal(refs('Dextrose 10% (D10W)',100,'Pediatric')[0].display,'250 mL');
 assert.equal(refs('Norepinephrine (Levophed)',20,'Pediatric')[0].display,'1 micrograms/min');
});
test('invalid weight and missing basis never produce a weighted dose',()=>{
 for(const med of medicationCatalog)for(const mode of ['Adult','Pediatric'])for(const w of ['',0,-1,501,Infinity,'bad'])for(const r of refs(med.name,w,mode))if(r.weighted){assert.deepEqual(r.values,[]);assert.equal(r.disabled,true);}
 assert.deepEqual(refs('Fentanyl',70,'Adult','Unknown')[0].values,[]);
 assert.deepEqual(refs('Fentanyl',70,'unknown'),[]);
});
test('ranges and unspecified doses are not collapsed into a selected dose',()=>{
 assert.deepEqual(refs('Diltiazem (Cardizem)',80)[0].values,[20]);
 assert.deepEqual(refs('Rocuronium',70)[0].values,[42,84]);
 assert.deepEqual(refs('Vecuronium')[0].values,[]);
 assert.equal(refs('Glucagon',20,'Pediatric').filter(r=>r.label.startsWith('Hypoglycemia')&&r.values.length).length,0);
});
