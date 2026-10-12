import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {inflateSync} from 'node:zlib';
import {exportPDF} from '../export.mjs';
import {diagnosticAssessmentSeed} from '../diagnostics-record.mjs';

const require=createRequire(import.meta.url);
const PDFLib=require('../pdf-lib.min.js');

test('diagnostic uncertainty, tests, treatment plans and corrections appear in the real PDF export',async()=>{
  const previousWindow=globalThis.window,previousDocument=globalThis.document;
  globalThis.window={PDFLib};
  globalThis.document={createElement:tag=>{
    assert.equal(tag,'canvas');
    return {getContext:()=>({measureText:()=>{throw Error('Unexpected non-Latin text in this PDF fixture');}})};
  }};
  try{
    const t=Date.parse('2026-10-12T12:00:00Z');
    const original={id:'diagnostic-1',type:'Diagnostic assessment',t,entered:t,mode:'Adult',data:{
      ...diagnosticAssessmentSeed('traumatic-hemorrhage'),
      'Assessment status':'Suspected',
      'Working diagnosis / physiological problem':'Possible concealed bleeding',
      'Supporting findings':'Cool skin and weak peripheral pulses',
      'Not assessed / examination limits':'Retroperitoneum not assessed',
      'Tests planned / pending':'Contrast CT pending stability',
      'Immediate care planned':'Blood and hemorrhage control',
      'Definitive care / destination':'Trauma surgery team',
      'Response / reassessment':'Transient response only',
      'Performed by':'AB'
    }};
    const replacement={...original.data,'Assessment status':'Unresolved','Results / interpretation':'Imaging still pending'};
    const correction={id:'correction-1',type:'Correction',target:original.id,t:t+1000,entered:t+1000,correctedTime:t,replacement,data:{Reason:'Revised degree of certainty'}};
    const effective={...original,data:replacement,correction:correction.id};
    const state={run:{'Run name / number':'Diagnostic export check',Mode:'Adult'},start:t,end:t+2000,team:[],events:[original,correction]};
    const bytes=await exportPDF(state,[effective]);
    assert.equal(Buffer.from(bytes.slice(0,5)).toString(),'%PDF-');
    const pdf=await PDFLib.PDFDocument.load(bytes);
    assert.ok(pdf.getPageCount()>1);
    const text=[];
    for(const [,object]of pdf.context.enumerateIndirectObjects()){
      if(!(object instanceof PDFLib.PDFRawStream))continue;
      let contents=Buffer.from(object.getContents());
      if(String(object.dict.get(PDFLib.PDFName.of('Filter'))).includes('FlateDecode'))contents=inflateSync(contents);
      for(const [,hex]of contents.toString('latin1').matchAll(/<([\da-f]+)>\s*Tj/gi))text.push(Buffer.from(hex,'hex').toString('latin1'));
    }
    const written=text.join('\n');
    for(const phrase of ['Diagnostic assessment','Assessment status: Unresolved','Possible concealed bleeding','Retroperitoneum not assessed','Contrast CT pending stability','Blood and hemorrhage control','Trauma surgery team','Transient response only','Imaging still pending','AMENDED','Original recorded fields','Assessment status: Suspected','Revised degree of certainty','Diagnostics reference 2026-10-12'])assert.ok(written.includes(phrase),`missing PDF text: ${phrase}`);
  } finally{
    if(previousWindow===undefined)delete globalThis.window;else globalThis.window=previousWindow;
    if(previousDocument===undefined)delete globalThis.document;else globalThis.document=previousDocument;
  }
});
