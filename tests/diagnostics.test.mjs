import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {runInNewContext} from 'node:vm';
import {diagnosticPathways,diagnosticTools,firstPass,presentationFilters,findDiagnosticPathways,getDiagnosticPathway} from '../diagnostics-data.mjs';
import {diagnosticAssessmentSeed,diagnosticAssessmentFields} from '../diagnostics-record.mjs';
import {freshRun,validateSaved} from '../storage.mjs';

const root=new URL('../',import.meta.url);
const text=value=>assert.equal(typeof value,'string');
const meaningful=value=>{text(value);assert.ok(value.trim().length>0);};

test('every selectable pathway retains bedside limits and the complete definitive-care chain',()=>{
  assert.equal(diagnosticPathways.length,34);
  assert.equal(new Set(diagnosticPathways.map(p=>p.id)).size,diagnosticPathways.length);
  assert.deepEqual(diagnosticPathways.map(p=>p.title),diagnosticPathways.map(p=>p.title).sort((a,b)=>a.localeCompare(b)));
  for(const p of diagnosticPathways){
    assert.equal(getDiagnosticPathway(p.id),p);
    meaningful(p.physiology);
    assert.ok(p.presentations.length>0,p.id);
    p.presentations.forEach(label=>assert.ok(presentationFilters.includes(label),`${p.id}: ${label}`));
    assert.ok(p.bedside.length>=2,`${p.id}: bedside examination`);
    p.bedside.forEach(item=>['action','meaning','limitation'].forEach(key=>meaningful(item[key])));
    for(const key of ['redFlags','basicTools','immediate','definitive','advancedTools','reassessment']){
      assert.ok(p[key].length>0,`${p.id}: ${key}`);p[key].forEach(meaningful);
    }
    assert.ok(p.differentials.length>0,p.id);
    p.differentials.forEach(item=>['condition','discriminator'].forEach(key=>meaningful(item[key])));
    assert.ok(p.testing.length>0,p.id);
    p.testing.forEach(item=>['test','role','timing'].forEach(key=>meaningful(item[key])));
    for(const population of ['pediatric','pregnancy']){assert.ok(Array.isArray(p.modifiers[population]),p.id);p.modifiers[population].forEach(meaningful);}
    assert.ok(p.sources.length>0,p.id);
    p.sources.forEach(source=>{meaningful(source.label);assert.equal(new URL(source.url).protocol,'https:');});
  }
  for(const presentation of presentationFilters)assert.ok(findDiagnosticPathways({presentation}).length>0,presentation);
  assert.ok(firstPass.length>=8);
  assert.equal(new Set(diagnosticTools.map(t=>t.id)).size,diagnosticTools.length);
  for(const tier of ['No equipment','Basic bedside','Advanced / definitive'])assert.ok(diagnosticTools.some(t=>t.tier===tier));
  diagnosticTools.forEach(t=>{meaningful(t.use);meaningful(t.limitations);assert.ok(t.sources.length);t.sources.forEach(s=>assert.equal(new URL(s.url).protocol,'https:'));});
});

test('search reaches bedside, definitive testing and treatment text and preserves presentation filtering',()=>{
  assert.ok(findDiagnosticPathways({query:'FAST'}).some(p=>p.id==='traumatic-hemorrhage'));
  assert.ok(findDiagnosticPathways({query:'THROMBECTOMY'}).some(p=>p.id==='acute-ischemic-stroke'));
  assert.ok(findDiagnosticPathways({query:'  dialysis  '}).some(p=>p.id==='hyperkalemia'));
  assert.ok(findDiagnosticPathways({query:'capillary refill',presentation:'Shock / poor perfusion'}).length);
  assert.ok(findDiagnosticPathways({query:'carbon–monoxide'}).some(p=>p.id==='carbon-monoxide'));
  assert.deepEqual(findDiagnosticPathways({query:'unmatchedstring-9834756'}),[]);
  assert.ok(findDiagnosticPathways({presentation:'Pediatric'}).every(p=>p.presentations.includes('Pediatric')));
  assert.equal(findDiagnosticPathways({presentation:'missing'}).length,diagnosticPathways.length);
  assert.equal(getDiagnosticPathway('missing'),null);
  assert.equal(getDiagnosticPathway(null),null);
  assert.deepEqual(findDiagnosticPathways({query:'https://'}),[],'source URLs are not clinical matches');
});

test('reviewing a reference cannot prefill a diagnosis, finding, treatment or response',()=>{
  const before=JSON.stringify(diagnosticPathways);
  const seed=diagnosticAssessmentSeed('traumatic-hemorrhage');
  assert.deepEqual(Object.keys(seed).sort(),['Assessment status','Pathway reviewed','Reference version'].sort());
  assert.equal(seed['Assessment status'],'Not assessed');
  assert.equal(seed['Pathway reviewed'],getDiagnosticPathway('traumatic-hemorrhage').title);
  assert.equal(diagnosticAssessmentSeed('untrusted-id'),null);
  findDiagnosticPathways({query:'hemorrhage'});
  assert.equal(JSON.stringify(diagnosticPathways),before);
  const labels=diagnosticAssessmentFields.map(f=>f.label);
  assert.equal(new Set(labels).size,labels.length);
  for(const label of ['Working diagnosis / physiological problem','Supporting findings','Conflicting findings / important alternatives','Not assessed / examination limits','Tests planned / pending','Results / interpretation','Immediate care planned','Definitive care / destination'])assert.ok(labels.includes(label));
  assert.equal(diagnosticAssessmentFields.find(f=>f.label==='Assessment status').options[0],'Not assessed');
});

test('diagnostic entries survive existing session validation; a new run clears them and their browsing state',()=>{
  const event={id:'diagnostic-1',type:'Diagnostic assessment',t:100,entered:100,data:{...diagnosticAssessmentSeed('hyperkalemia'),'Working diagnosis / physiological problem':'Unresolved metabolic cause','Not assessed / examination limits':'Potassium pending'}};
  const state={run:{Mode:'Adult','Recorder initials':'AB'},team:[{id:'staff',name:'AB'}],events:[event],collapsed:true,diagnosticsUi:{query:'potassium',selectedId:'hyperkalemia'}};
  const record={version:1,revision:2,state};
  assert.deepEqual(validateSaved(JSON.parse(JSON.stringify(record))).state.events,[event]);
  const blank={run:{Mode:'Adult'},events:[],team:[],diagnosticsUi:{query:'',selectedId:''}};
  const next=freshRun(state,blank);
  assert.deepEqual(next.events,[]);
  assert.deepEqual(next.diagnosticsUi,blank.diagnosticsUi);
  assert.deepEqual(next.team,state.team);
  assert.notEqual(next.team,state.team);
  assert.equal(next.run['Recorder initials'],'AB');
});

test('the offline install caches all imported diagnostics assets and bypasses clinical or external requests',async()=>{
  const handlers={},stored=new Set(),cacheNames=[],network=[];
  const origin='https://example.test',base=origin+'/resus-record/';
  class Request{constructor(url,options={}){this.url=new URL(url,base).href;this.cache=options.cache;this.method='GET';}}
  const cache={async addAll(requests){for(const r of requests)stored.add(r.url);},async match(request){const url=typeof request==='string'?request:request.url;return stored.has(url)?{cached:url}:undefined;}};
  let skipped=false,claimed=false;
  runInNewContext(readFileSync(new URL('sw.js',root),'utf8'),{
    URL,Request,
    self:{location:{origin,href:base+'sw.js'},addEventListener:(name,handler)=>handlers[name]=handler,skipWaiting:async()=>{skipped=true;},clients:{claim:async()=>{claimed=true;}}},
    caches:{open:async name=>{cacheNames.push(name);return cache;},keys:async()=>['resus-shell-v28','resus-shell-v29'],delete:async()=>true},
    fetch:async request=>{network.push(request.url);return {network:true};}
  });
  let work;
  handlers.install({waitUntil:promise=>{work=promise;}});await work;
  assert.ok(skipped);
  handlers.activate({waitUntil:promise=>{work=promise;}});await work;assert.ok(claimed);
  const installedVersion=cacheNames[0];
  const app=readFileSync(new URL('app.mjs',root),'utf8');
  assert.ok(app.includes(`caches.open('${installedVersion}')`),'app and service worker must agree on cache version');
  const pending=['app.mjs'],seen=new Set();
  while(pending.length){const path=pending.pop();if(seen.has(path))continue;seen.add(path);assert.ok(stored.has(base+path),`${path} not precached`);const content=readFileSync(new URL(path,root),'utf8');for(const [,dependency]of content.matchAll(/from\s*['"]\.\/([^'"]+)['"]/g))pending.push(dependency);}
  for(const url of stored){const path=new URL(url).pathname.slice('/resus-record/'.length);if(path)assert.ok(existsSync(fileURLToPath(new URL(path,root))),`missing cached file ${path}`);}
  const html=readFileSync(new URL('index.html',root),'utf8');
  for(const [,asset]of html.matchAll(/(?:src|href)="([^"#]+\.(?:css|js|mjs))"/g))assert.ok(stored.has(base+asset),asset);
  let response;
  handlers.fetch({request:{url:base+'diagnostics-data.mjs',method:'GET'},respondWith:promise=>{response=promise;}});
  assert.deepEqual(await response,{cached:base+'diagnostics-data.mjs'});
  assert.deepEqual(network,[]);
  for(const request of [{url:base+'patient.json',method:'GET'},{url:base+'diagnostics-data.mjs',method:'POST'},{url:'https://source.example/guideline',method:'GET'}]){
    let intercepted=false;handlers.fetch({request,respondWith:()=>{intercepted=true;}});assert.equal(intercepted,false);
  }
});
