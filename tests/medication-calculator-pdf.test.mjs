import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {inflateSync} from 'node:zlib';
import {exportPDF} from '../export.mjs';
import {medicationCalculatorSeed,matchingCalculatorSnapshot} from '../medication-calculator-record.mjs';

const PDFLib=createRequire(import.meta.url)('../pdf-lib.min.js');

test('PDF retains an ordered calculation and preparation without counting it as administration',async()=>{
  const previousWindow=globalThis.window,previousDocument=globalThis.document;
  globalThis.window={PDFLib};
  globalThis.document={createElement:()=>({getContext:()=>({measureText:()=>{throw Error('Unexpected unsupported text in PDF fixture');}})})};
  try{
    const patient={weightKg:'80',weightBasis:'Measured',mode:'Adult'};
    const seed=medicationCalculatorSeed({medication:'Norepinephrine (Levophed)',delivery:'Infusion',dose:'0.1',doseUnit:'micrograms',perKg:true,timeUnit:'min',concentrationAmount:'4',concentrationUnit:'mg',concentrationVolume:'250',orderSource:'Synthetic calculation check'},patient);
    const { _calculator,...fields}=seed;
    const data={...fields,...matchingCalculatorSnapshot(seed,fields,patient).data,Status:'Ordered'};
    const t=Date.parse('2026-10-12T22:00:00Z');
    const event={id:'ordered-med-1',type:'Medication',t,entered:t,mode:'Adult',weight:'80',weightBasis:'Measured',data};
    const state={run:{'Run name / number':'Medication calculation export check',Mode:'Adult'},start:t,end:null,events:[event],team:[]};
    const bytes=await exportPDF(state,[event]);
    const pdf=await PDFLib.PDFDocument.load(bytes),chunks=[];
    for(const [,object]of pdf.context.enumerateIndirectObjects()){
      if(!(object instanceof PDFLib.PDFRawStream))continue;
      let contents=Buffer.from(object.getContents());
      if(String(object.dict.get(PDFLib.PDFName.of('Filter'))).includes('FlateDecode'))contents=inflateSync(contents);
      for(const [,hex]of contents.toString('latin1').matchAll(/<([\da-f]+)>\s*Tj/gi))chunks.push(Buffer.from(hex,'hex').toString('latin1'));
    }
    const written=chunks.join('\n');
    for(const phrase of ['Status: Ordered','No administered medication recorded.','Calculation ordered dose / rate: 0.1 micrograms/kg/min','Preparation drug amount: 4 mg','Preparation final total volume (mL): 250','Calculated infusion rate (mL/hour): 30','Calculation weight (kg): 80','Calculation weight basis: Measured','Synthetic calculation check'])assert.ok(written.includes(phrase),phrase);
    assert.ok(!written.includes('Actual dose / rate: 30'));
    assert.ok(!written.includes('Administered volume (mL): 30'));
    assert.ok(!written.includes('_calculator:'));
  }finally{
    if(previousWindow===undefined)delete globalThis.window;else globalThis.window=previousWindow;
    if(previousDocument===undefined)delete globalThis.document;else globalThis.document=previousDocument;
  }
});
