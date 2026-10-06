// Manual run stopwatch, independent of clinical timers and session opening.
export function runTiming(events, now=Date.now()) {
 let elapsed=0, since=null, started=false;
 for(const e of events){
  if(['Run timer started','Run timer resumed'].includes(e.type)&&since===null){since=e.t;started=true;}
  if(['Run timer stopped','Run closed'].includes(e.type)&&since!==null){elapsed+=Math.max(0,e.t-since);since=null;}
 }
 return {elapsed:elapsed+(since===null?0:Math.max(0,now-since)),running:since!==null,started};
}
