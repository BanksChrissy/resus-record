const DB_NAME='resus-record-local-v1';
const STORE='session';
export function validateSaved(record){
 if(!record)return null;
 const s=record.state;
 if(record.version!==1||!Number.isInteger(record.revision)||!s||!s.run||!Array.isArray(s.events)||!Array.isArray(s.team)||!s.events.every(e=>typeof e.id==='string'&&typeof e.type==='string'&&Number.isFinite(e.t)&&e.data&&typeof e.data==='object'))throw Error('Saved data could not be read. It has not been overwritten.');
 return record;
}
export function freshRun(previous,blank){
 return {...blank,team:structuredClone(previous.team),collapsed:!!previous.collapsed,run:{...blank.run,'Recorder initials':previous.run['Recorder initials']||''}};
}
export async function openSessionStore(){
 const db=await new Promise((resolve,reject)=>{
  const request=indexedDB.open(DB_NAME,1);
  request.onupgradeneeded=()=>request.result.createObjectStore(STORE);
  request.onsuccess=()=>resolve(request.result);
  request.onerror=()=>reject(request.error);
  request.onblocked=()=>reject(Error('Close other Resus Record tabs to enable local saving.'));
 });
 db.onversionchange=()=>db.close();
 return {
  reset(state){return new Promise((resolve,reject)=>{const tx=db.transaction(STORE,'readwrite'),store=tx.objectStore(STORE),req=store.get('active');let revision;req.onsuccess=()=>{revision=(Number.isInteger(req.result?.revision)?req.result.revision:0)+1;store.put({version:1,revision,savedAt:Date.now(),state},'active');};tx.oncomplete=()=>resolve(revision);tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error||Error('Clear failed.'));});},
  read(){return new Promise((resolve,reject)=>{const tx=db.transaction(STORE,'readonly'),req=tx.objectStore(STORE).get('active');req.onsuccess=()=>{try{resolve(validateSaved(req.result));}catch(e){reject(e);}};req.onerror=()=>reject(req.error);});},
  write(state,revision){return new Promise((resolve,reject)=>{
   const tx=db.transaction(STORE,'readwrite'),store=tx.objectStore(STORE),req=store.get('active');let failure;
   req.onsuccess=()=>{if((req.result?.revision||0)!==revision){failure=Error('Another tab changed this run. Export this tab if needed, then reload to use the latest saved run.');failure.name='SessionConflict';tx.abort();return;}store.put({version:1,revision:revision+1,savedAt:Date.now(),state},'active');};
   tx.oncomplete=()=>resolve(revision+1);tx.onerror=()=>reject(failure||tx.error||Error('Local save failed.'));tx.onabort=()=>reject(failure||tx.error||Error('Local save interrupted.'));
  });}
 };
}
