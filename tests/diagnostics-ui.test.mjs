import test from 'node:test';
import assert from 'node:assert/strict';
import {diagnosticsHTML, wireDiagnostics} from '../diagnostics-ui.mjs';
import {diagnosticPathways, diagnosticTools, findDiagnosticPathways} from '../diagnostics-data.mjs';

const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

// A deliberately small DOM adapter for this module's event routing and element identity.
// It does not implement layout, browser focus defaults, or visual/accessibility testing.
const decode = value => String(value).replace(/&(amp|lt|gt|quot|#39);/g, (_, name) => ({amp:'&',lt:'<',gt:'>',quot:'"','#39':"'"}[name]));
const voidElements = new Set(['input','br','hr','img','meta','link','source','wbr']);

function matchesSimple(element, selector) {
  const tag = selector.match(/^[a-z][\w-]*/i)?.[0];
  if (tag && element.tag !== tag.toLowerCase()) return false;
  for (const [, name] of selector.matchAll(/\.([\w-]+)/g)) {
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
    this.parentElement = null;
    this._open = Object.hasOwn(attributes, 'open');
    this._value = attributes.value;
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
  getAttribute(name) { return this.attributes[name] ?? null; }
  hasAttribute(name) { return Object.hasOwn(this.attributes, name); }
  setAttribute(name, value) { this.attributes[name] = String(value); }
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
  scrollIntoView() { this.scrollCount = (this.scrollCount || 0) + 1; }
  set innerHTML(html) {
    if (this.contains(this.ownerDocument.activeElement)) this.ownerDocument.activeElement = this.ownerDocument.body;
    this.children.forEach(child => { child.parentElement = null; });
    this.children = parseHTML(html, this.ownerDocument);
    this.children.forEach(child => { child.parentElement = this; });
  }
  set outerHTML(html) {
    const parent = this.parentElement;
    if (this.contains(this.ownerDocument.activeElement)) this.ownerDocument.activeElement = this.ownerDocument.body;
    const replacements = parseHTML(html, this.ownerDocument);
    replacements.forEach(child => { child.parentElement = parent; });
    parent.children.splice(parent.children.indexOf(this), 1, ...replacements);
    this.parentElement = null;
  }
  emit(type) { for (let element = this; element; element = element.parentElement) element[`on${type}`]?.({target:this}); }
}

function parseHTML(html, document) {
  const fragment = new Element('fragment', {}, document);
  const stack = [fragment];
  for (const [token] of html.matchAll(/<\/?[a-z][^>]*>/gi)) {
    const closing = token.startsWith('</');
    const tag = token.match(/^<\/?([\w-]+)/)[1].toLowerCase();
    if (closing) {
      while (stack.length > 1) if (stack.pop().tag === tag) break;
      continue;
    }
    const raw = token.slice(tag.length + 1, -1);
    const attributes = {};
    for (const [, key, double, single, bare] of raw.matchAll(/([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g)) attributes[key] = decode(double ?? single ?? bare ?? '');
    const element = new Element(tag, attributes, document);
    element.parentElement = stack.at(-1);
    stack.at(-1).children.push(element);
    if (!voidElements.has(tag) && !token.endsWith('/>')) stack.push(element);
  }
  fragment.children.forEach(element => { element.parentElement = null; });
  return fragment.children;
}

function mount(ui = {}, mode = 'Adult') {
  const document = {activeElement:null};
  document.defaultView = {scrollX:0, scrollY:0, scrollTo(x, y) { this.scrollX = x; this.scrollY = y; }};
  document.body = new Element('body', {}, document);
  document.activeElement = document.body;
  const host = new Element('div', {}, document);
  host.parentElement = document.body;
  document.body.children = [host];
  const state = {ui, documentCalls:[], navigationCalls:[], changes:[]};
  const render = () => {
    host.innerHTML = diagnosticsHTML({ui:state.ui, mode});
    wireDiagnostics(host, {
      ui:state.ui, mode,
      onStateChange(patch) { state.ui = {...state.ui, ...patch}; state.changes.push(patch); },
      onDocument(value) { state.documentCalls.push(value); },
      onNavigate(value) { state.navigationCalls.push(value); }
    });
  };
  render();
  return {host, state, document, render, cleanup:() => { document.body.innerHTML = ''; }};
}

const buttonWith = (host, key, value) => host.querySelectorAll('button').find(button => button.dataset[key] === value);

test('all pathway fields, definitive care and source links remain in the rendered reference', () => {
  for (const pathway of diagnosticPathways) {
    const html = diagnosticsHTML({ui:{selectedId:pathway.id}});
    for (const key of ['bedside','basic-tools','differentials','testing','immediate','definitive','advanced-tools','modifiers','reassessment','sources']) assert.ok(html.includes(`data-diag-section="${pathway.id}:${key}"`), pathway.id + ' ' + key);
    for (const key of ['basicTools','immediate','definitive','advancedTools','reassessment','redFlags']) for (const value of pathway[key]) assert.ok(html.includes(escapeHTML(value)), pathway.id + ' ' + key);
    for (const key of ['bedside','testing','differentials']) for (const entry of pathway[key]) for (const value of Object.values(entry)) assert.ok(html.includes(escapeHTML(value)), pathway.id + ' ' + key);
    for (const source of pathway.sources) assert.ok(html.includes(escapeHTML(source.label)), pathway.id + ' source');
    assert.equal((html.match(/data-diag-document=/g) || []).length, 1);
  }
});

test('rendering escapes queries, tolerates unknown state and shows every tool tier', () => {
  assert.ok(!diagnosticsHTML({ui:{query:'"><script>alert(1)</script>'}}).includes('<script>'));
  assert.ok(diagnosticsHTML({ui:{query:'"><script>alert(1)</script>'}}).includes('&lt;script&gt;'));
  assert.ok(diagnosticsHTML({ui:{selectedId:'does-not-exist'}}).includes('data-diag-pathway='));
  assert.ok(diagnosticsHTML({ui:null}).includes('Diagnostics'));
  const tools = diagnosticsHTML({ui:{view:'tools'}});
  for (const tool of diagnosticTools) {
    assert.ok(tools.includes(escapeHTML(tool.name)));
    assert.ok(tools.includes(escapeHTML(tool.limitations)));
  }
  assert.ok(diagnosticsHTML({ui:{view:'first-pass'}}).includes('Start with the patient'));
});

test('null and malformed saved UI can be rendered and wired with safe defaults', () => {
  for (const saved of [null, 'invalid saved state', 7, [], {query:['bad'], presentation:'invalid', selectedId:19, view:'invalid', openSections:[]}]) {
    const app = mount(saved);
    try {
      const input = app.host.querySelector('[data-diag-search]');
      assert.equal(input.value, '');
      assert.equal(app.host.querySelectorAll('[data-diag-pathway]').length, diagnosticPathways.length);
      input.value = 'shock';
      input.emit('input');
      assert.equal(app.state.ui.query, 'shock');
      assert.deepEqual(app.state.documentCalls, []);
    } finally { app.cleanup(); }
  }
});

test('typing filters in place; parent renders preserve query, focus, selection and scroll', () => {
  const app = mount();
  try {
    const input = app.host.querySelector('[data-diag-search]');
    input.value = 'pulmonary';
    input.focus();
    input.setSelectionRange(3, 5);
    app.document.defaultView.scrollY = 270;
    input.emit('input');
    assert.equal(app.state.ui.query, 'pulmonary');
    assert.equal(app.host.querySelector('[data-diag-search]'), input);
    assert.equal(app.document.activeElement, input);
    assert.equal(app.host.querySelectorAll('[data-diag-pathway]').length, findDiagnosticPathways({query:'pulmonary'}).length);
    app.render();
    const replacement = app.host.querySelector('[data-diag-search]');
    assert.notEqual(replacement, input);
    assert.equal(replacement.value, 'pulmonary');
    assert.equal(app.document.activeElement, replacement);
    assert.equal(replacement.selectionStart, 3);
    assert.equal(replacement.selectionEnd, 5);
    assert.equal(app.document.defaultView.scrollY, 270);
    assert.deepEqual(app.state.documentCalls, []);
  } finally { app.cleanup(); }
});

test('pathway, view and back navigation preserve filters and require an explicit documentation action', () => {
  const pathway = diagnosticPathways.find(item => item.id === 'acute-coronary-syndrome') || diagnosticPathways[0];
  const app = mount({query:pathway.title, presentation:'All'});
  try {
    buttonWith(app.host, 'diagPathway', pathway.id).emit('click');
    assert.equal(app.state.ui.selectedId, pathway.id);
    assert.equal(app.document.activeElement.dataset.diagFocus, 'detail-title');
    buttonWith(app.host, 'diagView', 'tools').emit('click');
    assert.equal(app.state.ui.view, 'tools');
    buttonWith(app.host, 'diagView', 'pathways').emit('click');
    assert.equal(app.host.querySelector('[data-diag-current-pathway]').dataset.diagCurrentPathway, pathway.id);
    assert.deepEqual(app.state.documentCalls, []);
    buttonWith(app.host, 'diagDocument', pathway.id).emit('click');
    assert.deepEqual(app.state.documentCalls, [{pathwayId:pathway.id, title:pathway.title}]);
    buttonWith(app.host, 'diagNavigate', 'Patient weight').emit('click');
    buttonWith(app.host, 'diagNavigate', 'Interventions').emit('click');
    assert.deepEqual(app.state.navigationCalls, ['Patient weight','Interventions']);
    app.host.querySelector('[data-diag-back]').emit('click');
    assert.equal(app.state.ui.selectedId, '');
    assert.equal(app.host.querySelector('[data-diag-search]').value, pathway.title);
    assert.equal(app.document.activeElement.dataset.diagPathway, pathway.id);
    assert.equal(app.document.activeElement.scrollCount, 1);
  } finally { app.cleanup(); }
});

test('disclosures, jump controls and pediatric context survive a parent render', async () => {
  const pathway = diagnosticPathways[0];
  const app = mount({selectedId:pathway.id}, 'Pediatric');
  const section = name => app.host.querySelectorAll('.diag-section').find(item => item.dataset.diagSection === `${pathway.id}:${name}`);
  try {
    assert.equal(section('modifiers').open, true);
    const jump = app.host.querySelector('[data-diag-jump-select]');
    jump.value = 'testing';
    jump.emit('change');
    assert.equal(section('testing').open, true);
    assert.equal(app.state.ui.openSections[`${pathway.id}:testing`], true);
    assert.equal(app.document.activeElement.tag, 'summary');
    section('bedside').open = false;
    await Promise.resolve();
    assert.equal(app.state.ui.openSections[`${pathway.id}:bedside`], false);
    app.render();
    assert.equal(section('bedside').open, false);
    assert.equal(section('testing').open, true);
    app.host.querySelector('[data-diag-expand]').emit('click');
    assert.ok(app.host.querySelectorAll('.diag-section').every(item => item.open));
    app.host.querySelector('[data-diag-collapse]').emit('click');
    assert.equal(section('bedside').open, true);
    assert.equal(section('immediate').open, true);
    assert.equal(section('testing').open, false);
    assert.equal(section('modifiers').open, true);
    assert.deepEqual(app.state.documentCalls, []);
  } finally { app.cleanup(); }
});
