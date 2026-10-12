import test from 'node:test';
import assert from 'node:assert/strict';
import {medicationCalculatorHTML, wireMedicationCalculator} from '../medication-calculator-ui.mjs';
import {medicationCatalog, medicationReferences} from '../med-catalog.mjs';

// A small DOM adapter for actual module event routing and element identity.
// This does not claim browser layout, numeric-input sanitization, or accessibility QA.
const decode = value => String(value).replace(/&(amp|lt|gt|quot|#39);/g, (_, name) => ({amp:'&',lt:'<',gt:'>',quot:'"','#39':"'"}[name]));
const voidElements = new Set(['input','br','hr','img','meta','link','source','wbr']);

function matchesSimple(element, selector) {
  const tag = selector.match(/^[a-z][\w-]*/i)?.[0];
  if (tag && element.tag !== tag.toLowerCase()) return false;
  for (const [, name] of selector.replace(/\[[^\]]*\]/g, '').matchAll(/\.([\w-]+)/g)) {
    if (!(element.getAttribute('class') || '').split(/\s+/).includes(name)) return false;
  }
  for (const [, name, value] of selector.matchAll(/\[([^\]=]+)(?:="([^"]*)")?\]/g)) {
    if (!element.hasAttribute(name) || (value !== undefined && element.getAttribute(name) !== value)) return false;
  }
  return true;
}

class Element {
  constructor(tag, attributes, document) {
    this.tag = tag;
    this.attributes = attributes;
    this.ownerDocument = document;
    this.children = [];
    this.content = [];
    this.parentElement = null;
    this._open = Object.hasOwn(attributes, 'open');
    this._value = attributes.value;
    this.checked = Object.hasOwn(attributes, 'checked');
    this.disabled = Object.hasOwn(attributes, 'disabled');
    this.hidden = Object.hasOwn(attributes, 'hidden');
    if (tag === 'input') this.selectionStart = this.selectionEnd = 0;
  }
  get dataset() { return Object.fromEntries(Object.entries(this.attributes).filter(([key]) => key.startsWith('data-')).map(([key,value]) => [key.slice(5).replace(/-([a-z])/g, (_, letter) => letter.toUpperCase()),value])); }
  get isConnected() { return this === this.ownerDocument.body || !!this.parentElement?.isConnected; }
  get value() {
    if (this._value !== undefined) return this._value;
    if (this.tag === 'select') return (this.children.find(el => el.hasAttribute('selected')) || this.children[0])?.getAttribute('value') || '';
    return '';
  }
  set value(value) { this._value = String(value); }
  get open() { return this._open; }
  set open(value) {
    const changed = this._open !== !!value;
    this._open = !!value;
    if (changed) queueMicrotask(() => this.ontoggle?.({target:this}));
  }
  get textContent() { return this.content.map(item => typeof item === 'string' ? item : item.textContent).join(''); }
  set textContent(text) {
    this.children.forEach(child => { child.parentElement = null; });
    this.children = [];
    this.content = [String(text)];
  }
  appendChild(element) { element.parentElement = this; this.children.push(element); this.content.push(element); }
  getAttribute(name) { return this.attributes[name] ?? null; }
  hasAttribute(name) { return Object.hasOwn(this.attributes, name); }
  contains(element) { return this === element || this.children.some(child => child.contains(element)); }
  matches(selector) {
    const parts = selector.trim().split(/\s+(?=(?:[^"]*"[^"]*")*[^"]*$)/);
    if (!matchesSimple(this, parts.pop())) return false;
    let ancestor = this.parentElement;
    while (parts.length) {
      const part = parts.pop();
      while (ancestor && !matchesSimple(ancestor, part)) ancestor = ancestor.parentElement;
      if (!ancestor) return false;
      ancestor = ancestor.parentElement;
    }
    return true;
  }
  closest(selector) { return this.matches(selector) ? this : this.parentElement?.closest(selector) || null; }
  querySelectorAll(selector) { return this.children.flatMap(child => [...(child.matches(selector) ? [child] : []), ...child.querySelectorAll(selector)]); }
  querySelector(selector) { return this.querySelectorAll(selector)[0] || null; }
  focus() { this.ownerDocument.activeElement = this; }
  setSelectionRange(start, end) { this.selectionStart = start; this.selectionEnd = end; }
  set innerHTML(html) {
    if (this.contains(this.ownerDocument.activeElement)) this.ownerDocument.activeElement = this.ownerDocument.body;
    this.children.forEach(child => { child.parentElement = null; });
    const fragment = parseHTML(html, this.ownerDocument);
    this.content = fragment.content;
    this.children = fragment.children;
    this.children.forEach(child => { child.parentElement = this; });
  }
  // Emit even on disabled controls so handler guards are tested independently.
  emit(type) { for (let element = this; element; element = element.parentElement) element[`on${type}`]?.({target:this}); }
}

function parseHTML(html, document) {
  const fragment = new Element('fragment', {}, document);
  const stack = [fragment];
  let cursor = 0;
  for (const match of html.matchAll(/<\/?[a-z][^>]*>/gi)) {
    const token = match[0];
    stack.at(-1).content.push(decode(html.slice(cursor, match.index)));
    cursor = match.index + token.length;
    const tag = token.match(/^<\/?([\w-]+)/)[1].toLowerCase();
    if (token.startsWith('</')) {
      while (stack.length > 1) if (stack.pop().tag === tag) break;
      continue;
    }
    const raw = token.slice(tag.length + 1, -1);
    const attributes = {};
    for (const [, key, double, single, bare] of raw.matchAll(/([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g)) attributes[key] = decode(double ?? single ?? bare ?? '');
    const element = new Element(tag, attributes, document);
    stack.at(-1).appendChild(element);
    if (!voidElements.has(tag) && !token.endsWith('/>')) stack.push(element);
  }
  stack.at(-1).content.push(decode(html.slice(cursor)));
  return fragment;
}

const patient70 = {weightKg:'70', weightBasis:'Measured', mode:'Adult'};
const bolus = {medication:'Fentanyl', delivery:'Bolus', dose:'100', doseUnit:'micrograms', perKg:false, concentrationAmount:'50', concentrationUnit:'micrograms', concentrationVolume:'1'};
const infusion = {medication:'Norepinephrine (Levophed)', delivery:'Infusion', dose:'0.1', doseUnit:'micrograms', perKg:true, timeUnit:'min', concentrationAmount:'4', concentrationUnit:'mg', concentrationVolume:'250'};
const timed = {medication:'Tranexamic acid (TXA)', delivery:'Timed infusion', dose:'1', doseUnit:'g', perKg:false, durationMinutes:'10', concentrationAmount:'1', concentrationUnit:'g', concentrationVolume:'100'};

function mount({draft = {}, patient = patient70, weightDraft = null, closed = false} = {}) {
  const document = {activeElement:null};
  document.defaultView = {scrollX:0, scrollY:0, scrollTo(x, y) { this.scrollX = x; this.scrollY = y; }};
  document.body = new Element('body', {}, document);
  document.activeElement = document.body;
  const host = new Element('div', {}, document);
  document.body.appendChild(host);
  const state = {draft, patient:{...patient}, weightDraft, closed, draftCalls:[], weightDraftCalls:[], applyCalls:[], documentCalls:[], navigationCalls:[]};
  const render = () => {
    host.innerHTML = medicationCalculatorHTML(state);
    wireMedicationCalculator(host, {
      ...state,
      onDraftChange(value) { state.draft = value; state.draftCalls.push(value); },
      onWeightDraft(value) { state.weightDraft = value; state.weightDraftCalls.push(value); },
      onApplyWeight(weight, basis) {
        state.applyCalls.push({weight,basis});
        if (state.applyError) throw new Error(state.applyError);
        state.patient = {...state.patient,weightKg:weight,weightBasis:basis};
        state.weightDraft = null;
        render(); // Root applies shared weight with a synchronous parent rerender.
      },
      onDocument(value) { state.documentCalls.push(value); },
      onNavigate(value) { state.navigationCalls.push(value); }
    });
  };
  render();
  const field = key => host.querySelector(`[data-mc-field="${key}"]`);
  const set = (key, value, event = 'input') => {
    const input = field(key);
    if (key === 'perKg') input.checked = value;
    else input.value = value;
    input.emit(event);
    return input;
  };
  const button = name => host.querySelector(`[data-mc-${name}]`);
  const metrics = () => host.querySelectorAll('.mc-result-metrics strong').map(element => element.textContent);
  return {host,state,document,render,field,set,button,metrics,cleanup:() => { document.body.innerHTML = ''; }};
}

test('blank and malformed saved drafts have no assumed dose or preparation and never document', () => {
  for (const draft of [undefined,null,[],7,'bad draft',{medication:'Epinephrine 1 mg/mL'},{delivery:'Unknown',doseUnit:'mcg',perKg:'false',dose:{value:1}}]) {
    const app = mount({draft});
    try {
      assert.equal(app.field('dose').value, '');
      assert.equal(app.field('doseUnit').value, '');
      assert.equal(app.field('concentrationAmount').value, '');
      assert.equal(app.field('concentrationUnit').value, '');
      assert.equal(app.field('concentrationVolume').value, '');
      assert.deepEqual(app.field('medication').children.map(option => option.value), ['',...medicationCatalog.map(item => item.name),'Other medication']);
      assert.equal(app.button('document').disabled, true);
      app.button('document').emit('click');
      app.set('indication','Example order');
      assert.equal(app.state.draft.indication, 'Example order');
      assert.equal(Object.hasOwn(app.state.draft,'weightKg'), false);
      assert.equal(Object.hasOwn(app.state.draft,'result'), false);
      assert.deepEqual(app.state.documentCalls, []);
    } finally { app.cleanup(); }
  }
  const invalidBasis = mount({draft:{...bolus,perKg:'false'}});
  try {
    assert.deepEqual(invalidBasis.metrics(), []);
    assert.equal(invalidBasis.button('document').disabled, true);
    assert.match(invalidBasis.host.querySelector('[data-mc-results]').textContent,/basis|per.?kilogram|perKg/i);
  } finally { invalidBasis.cleanup(); }
});

test('live concentration changes preserve the input and remove stale output when preparation becomes invalid', () => {
  const app = mount({draft:bolus});
  try {
    assert.deepEqual(app.metrics(), ['2 mL']);
    const amount = app.field('concentrationAmount');
    amount.focus();
    amount.setSelectionRange(1,2);
    app.set('concentrationAmount','100');
    assert.deepEqual(app.metrics(), ['1 mL']);
    assert.equal(app.field('concentrationAmount'), amount);
    assert.equal(app.document.activeElement, amount);
    assert.equal(amount.selectionStart, 1);
    assert.equal(app.state.draft.concentrationAmount, '100');
    assert.equal(app.button('document').disabled, false);
    app.set('concentrationAmount','');
    assert.deepEqual(app.metrics(), []);
    assert.equal(app.host.querySelector('.mc-result-success'), null);
    assert.equal(app.button('document').disabled, true);
    app.button('document').emit('click');
    assert.deepEqual(app.state.documentCalls, []);
  } finally { app.cleanup(); }
});

test('infusion, timed infusion and direct volume show calculated outputs with full arithmetic context', () => {
  for (const [draft, expected] of [[infusion,['26.25 mL/hour']],[timed,['100 mL','600 mL/hour']],[{...bolus,dose:'20',doseUnit:'mL',concentrationAmount:'',concentrationUnit:'',concentrationVolume:''},['20 mL']]]) {
    const app = mount({draft});
    try {
      assert.deepEqual(app.metrics(), expected);
      const result = app.host.querySelector('[data-mc-results]');
      assert.match(result.textContent, /Entered order/);
      assert.match(result.textContent, /Resolved dose \/ rate/);
      assert.match(result.textContent, /No dose limit evaluated for the entered order/);
      assert.ok(result.querySelectorAll('.mc-calculation-steps li').length > 0);
      if (draft.delivery === 'Infusion') {
        assert.match(result.textContent,/Calculated infusion rate/);
        assert.match(result.textContent,/70 kg · Measured/);
      }
      if (draft.delivery === 'Timed infusion') assert.match(result.textContent,/Calculated total infusion volume/);
      assert.equal(app.host.querySelector('[data-mc-preparation]').hidden,draft.doseUnit === 'mL');
      assert.deepEqual(app.state.documentCalls, []);
    } finally { app.cleanup(); }
  }
  const small = mount({draft:{...bolus,dose:'0.000001',doseUnit:'mg',concentrationAmount:'100',concentrationUnit:'mg'}});
  try { assert.deepEqual(small.metrics(),['0.00000001 mL']); }
  finally { small.cleanup(); }
});

test('pending patient weight blocks stale weight arithmetic; applying it rerenders using the new shared weight', () => {
  const app = mount({draft:infusion});
  try {
    assert.deepEqual(app.metrics(), ['26.25 mL/hour']);
    const originalRoot = app.host.querySelector('[data-medication-calculator]');
    const weight = app.host.querySelector('[data-mc-weight="weight"]');
    weight.value = '80';
    weight.emit('input');
    assert.deepEqual(app.state.weightDraftCalls,[{weight:'80',basis:'Measured'}]);
    assert.equal(app.state.patient.weightKg,'70');
    assert.deepEqual(app.metrics(), []);
    assert.match(app.host.querySelector('[data-mc-results]').textContent,/Apply the patient weight/);
    assert.match(app.host.querySelector('[data-mc-reference-body]').textContent,/Apply pending weight/);
    assert.equal(app.button('document').disabled,true);
    app.button('document').emit('click');
    assert.deepEqual(app.state.documentCalls,[]);
    app.button('apply-weight').emit('click');
    assert.deepEqual(app.state.applyCalls,[{weight:'80',basis:'Measured'}]);
    assert.equal(originalRoot.isConnected,false);
    assert.equal(app.state.patient.weightKg,'80');
    assert.equal(app.state.weightDraft,null);
    assert.equal(app.field('dose').value,'0.1');
    assert.deepEqual(app.metrics(),['30 mL/hour']);
    assert.match(app.host.querySelector('[data-mc-results]').textContent,/80 kg · Measured/);
    assert.equal(app.button('document').disabled,false);
    assert.equal(app.button('apply-weight').disabled,true);
    assert.deepEqual(app.state.documentCalls,[]);
  } finally { app.cleanup(); }
});

test('weight application errors retain pending state and a nonweighted calculation cannot bypass record gating', () => {
  const app = mount({draft:bolus,weightDraft:{weight:'0',basis:'Estimated'}});
  try {
    assert.deepEqual(app.metrics(),['2 mL']);
    assert.equal(app.button('document').disabled,true);
    app.button('document').emit('click');
    app.state.applyError = 'Enter a positive patient weight.';
    app.button('apply-weight').emit('click');
    assert.match(app.host.querySelector('[data-mc-weight-error]').textContent,/positive patient weight/);
    assert.equal(app.host.querySelector('[data-mc-weight-error]').hidden,false);
    assert.equal(app.state.patient.weightKg,'70');
    assert.deepEqual(app.state.weightDraft,{weight:'0',basis:'Estimated'});
    assert.deepEqual(app.state.documentCalls,[]);
  } finally { app.cleanup(); }
  for (const identity of [{medication:''},{medication:'Other medication',customMedication:'   '}]) {
    const unidentified = mount({draft:{...bolus,...identity}});
    try {
      assert.deepEqual(unidentified.metrics(),['2 mL']);
      assert.equal(unidentified.button('document').disabled,true);
      unidentified.button('document').emit('click');
      assert.deepEqual(unidentified.state.documentCalls,[]);
    } finally { unidentified.cleanup(); }
  }
});

test('record handoff is explicit and contains the entered order, never an administration event', () => {
  const app = mount({draft:{...bolus,medication:'Other medication',customMedication:'Entered medication',actualDose:'999',status:'Given',weightKg:'5'}});
  try {
    app.set('orderSource','Entered order source');
    app.set('indication','Entered indication');
    assert.deepEqual(app.state.documentCalls,[]);
    app.button('document').emit('click');
    assert.equal(app.state.documentCalls.length,1);
    const payload = app.state.documentCalls[0];
    assert.equal(payload.draft.customMedication,'Entered medication');
    assert.equal(payload.draft.orderSource,'Entered order source');
    assert.equal(payload.draft.indication,'Entered indication');
    assert.equal(payload.result.volumeMl,2);
    for (const key of ['actualDose','status','weightKg','result']) assert.equal(Object.hasOwn(payload.draft,key),false);
    app.host.querySelector('[data-mc-navigate="Interventions"]').emit('click');
    app.host.querySelector('[data-mc-navigate="Patient weight"]').emit('click');
    assert.deepEqual(app.state.navigationCalls,['Interventions','Patient weight']);
    assert.equal(app.state.documentCalls.length,1);
  } finally { app.cleanup(); }
});

test('closed runs calculate from saved weight while blocking weight changes and new record handoff', () => {
  const app = mount({draft:infusion,closed:true,weightDraft:{weight:'80',basis:'Estimated'}});
  try {
    assert.deepEqual(app.metrics(),['26.25 mL/hour']);
    assert.match(app.host.querySelector('[data-mc-weight-status]').textContent,/unapplied weight draft below is not used/);
    const weight = app.host.querySelector('[data-mc-weight="weight"]');
    assert.equal(weight.disabled,true);
    assert.equal(app.host.querySelector('[data-mc-weight="basis"]').disabled,true);
    assert.equal(app.button('apply-weight').disabled,true);
    assert.equal(app.button('document').disabled,true);
    weight.value = '90';
    weight.emit('input');
    app.button('apply-weight').emit('click');
    app.button('document').emit('click');
    assert.deepEqual(app.state.weightDraftCalls,[]);
    assert.deepEqual(app.state.applyCalls,[]);
    assert.deepEqual(app.state.documentCalls,[]);
    app.set('dose','0.2');
    assert.deepEqual(app.metrics(),['52.5 mL/hour']);
    assert.equal(app.state.patient.weightKg,'70');
  } finally { app.cleanup(); }
});

test('medication and unit changes clear affected numbers instead of reinterpreting the prior order', () => {
  const app = mount({draft:{...timed,indication:'Prior indication',orderSource:'Prior source'}});
  try {
    app.set('medication','Epinephrine 1 mg/mL','change');
    for (const key of ['dose','doseUnit','concentrationAmount','concentrationUnit','concentrationVolume','durationMinutes','indication','orderSource']) assert.equal(app.field(key).value,'',key);
    assert.equal(app.state.patient.weightKg,'70');
    assert.deepEqual(app.metrics(),[]);
    app.set('doseUnit','mg','change');
    app.set('dose','1');
    app.set('concentrationUnit','mg','change');
    app.set('concentrationAmount','1');
    app.set('concentrationVolume','1');
    assert.deepEqual(app.metrics(),['1 mL']);
    app.button('clear').emit('click');
    assert.equal(app.field('medication').value,'');
    assert.equal(app.field('dose').value,'');
    assert.deepEqual(app.metrics(),[]);
    assert.equal(app.state.patient.weightKg,'70');
    assert.equal(app.document.activeElement,app.field('medication'));
    assert.deepEqual(app.state.documentCalls,[]);
  } finally { app.cleanup(); }
  for (const [base,key,value,cleared] of [[bolus,'doseUnit','mg',['dose','concentrationAmount','concentrationUnit','concentrationVolume']],[timed,'delivery','Infusion',['dose','timeUnit','durationMinutes']],[bolus,'perKg',true,['dose']],[infusion,'timeUnit','hour',['dose']],[bolus,'concentrationUnit','mg',['concentrationAmount']]]) {
    const change = mount({draft:base});
    try {
      change.set(key,value,'change');
      for (const name of cleared) assert.equal(change.field(name).value,'',`${key} clears ${name}`);
      assert.deepEqual(change.metrics(),[]);
      assert.equal(change.button('document').disabled,true);
      assert.deepEqual(change.state.documentCalls,[]);
    } finally { change.cleanup(); }
  }
});

test('references retain fixed doses without a weight and remain separate from calculation inputs', async () => {
  for (const [medication,patient] of [['Epinephrine 1 mg/mL',{weightKg:'',weightBasis:'Unknown',mode:'Pediatric'}],['Fentanyl',patient70]]) {
    const app = mount({draft:{medication},patient});
    try {
      const body = app.host.querySelector('[data-mc-reference-body]');
      for (const reference of medicationReferences(medication,patient.mode,patient.weightKg,patient.weightBasis)) {
        for (const key of ['label','display','formula','note','source']) if (reference[key]) assert.ok(body.textContent.includes(reference[key]),`${medication}: ${key}`);
        if (reference.url) assert.ok(body.querySelectorAll('a').some(anchor => anchor.getAttribute('href') === reference.url));
      }
      assert.match(body.textContent,/do not populate or validate the entered order/);
      if (!patient.weightKg) {
        assert.match(body.textContent,/3–5 mg/);
        assert.match(body.textContent,/Weight and basis needed/);
      }
      const details = app.host.querySelector('[data-mc-detail="referenceOpen"]');
      details.open = true;
      await Promise.resolve();
      assert.equal(app.state.draft.referenceOpen,true);
      assert.equal(app.field('dose').value,'');
      assert.equal(app.field('concentrationAmount').value,'');
      app.render();
      assert.equal(app.host.querySelector('[data-mc-detail="referenceOpen"]').open,true);
      assert.deepEqual(app.state.documentCalls,[]);
    } finally { app.cleanup(); }
  }
});

test('parent rerenders retain draft, text focus and selection; all entered metadata is escaped', () => {
  const app = mount({draft:bolus});
  try {
    const source = app.field('orderSource');
    source.focus();
    app.set('orderSource','Entered order source');
    source.setSelectionRange(3,8);
    app.document.defaultView.scrollY = 280;
    app.render();
    const replacement = app.field('orderSource');
    assert.notEqual(replacement,source);
    assert.equal(replacement.value,'Entered order source');
    assert.equal(app.document.activeElement,replacement);
    assert.equal(replacement.selectionStart,3);
    assert.equal(replacement.selectionEnd,8);
    assert.equal(app.document.defaultView.scrollY,280);
    assert.deepEqual(app.metrics(),['2 mL']);
  } finally { app.cleanup(); }
  const malicious = '\"><script>alert(1)</script><img src=x onerror=alert(2)>';
  const html = medicationCalculatorHTML({draft:{...bolus,medication:'Other medication',customMedication:malicious,indication:malicious,orderSource:malicious},patient:{weightKg:malicious,weightBasis:'Unknown'}});
  assert.equal(html.includes('<script>'),false);
  assert.equal(html.includes('<img src=x'),false);
  assert.ok(html.includes('&lt;script&gt;'));
  const escaped = mount({draft:{...bolus,medication:'Other medication',customMedication:malicious}});
  try {
    assert.equal(escaped.host.querySelector('script'),null);
    assert.equal(escaped.host.querySelector('img'),null);
    assert.equal(escaped.field('customMedication').value,malicious);
    assert.deepEqual(escaped.state.documentCalls,[]);
  } finally { escaped.cleanup(); }
});
