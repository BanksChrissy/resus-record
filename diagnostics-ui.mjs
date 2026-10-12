import {
  diagnosticPathways, diagnosticTools, firstPass, presentationFilters,
  diagnosticsUpdated, findDiagnosticPathways, getDiagnosticPathway
} from './diagnostics-data.mjs';

const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const asArray = value => Array.isArray(value) ? value : [];
const own = (object, key) => Object.prototype.hasOwnProperty.call(object, key);
const views = ['pathways', 'first-pass', 'tools'];
const tiers = ['No equipment', 'Basic bedside', 'Advanced / definitive'];
const allowedSections = ['Vitals', 'Physical assessment', 'Patient weight', 'Interventions', 'H’s & T’s'];
const sectionDefinitions = [
  ['bedside', 'Bedside assessment', 'Questions, examination, interpretation and limits', true],
  ['basic-tools', 'Basic tools', 'What simple equipment adds', true],
  ['differentials', 'Differential diagnosis', 'The next finding or test that separates alternatives', false],
  ['testing', 'Definitive & targeted testing', 'What each investigation establishes and when to obtain it', false],
  ['immediate', 'Immediate treatment', 'Stabilization and time-critical care', true],
  ['definitive', 'Definitive treatment', 'Cause-directed care, procedures and destination', false],
  ['advanced-tools', 'Advanced tools & procedures', 'Equipment and capabilities beyond the bedside', false],
  ['modifiers', 'Pediatric & pregnancy considerations', 'Age-specific and pregnancy-related changes', false],
  ['reassessment', 'Reassessment', 'Specific response and failure endpoints', true],
  ['sources', 'Sources', 'Primary guidelines and official references', false]
];

let liveRoot = null;
let pendingRestore = null;

function normalizeUI(ui = {}) {
  if (!ui || typeof ui !== 'object' || Array.isArray(ui)) ui = {};
  const presentations = ['All', ...asArray(presentationFilters)];
  const selectedId = typeof ui.selectedId === 'string' && getDiagnosticPathway(ui.selectedId) ? ui.selectedId : '';
  return {
    query: typeof ui.query === 'string' ? ui.query : '',
    presentation: presentations.includes(ui.presentation) ? ui.presentation : 'All',
    selectedId,
    view: views.includes(ui.view) ? ui.view : 'pathways',
    openSections: ui.openSections && typeof ui.openSections === 'object' && !Array.isArray(ui.openSections)
      ? {...ui.openSections} : {}
  };
}

function safeURL(value) {
  try {
    const url = new URL(String(value));
    return url.protocol === 'https:' && !url.username && !url.password ? url.href : '';
  } catch { return ''; }
}

function sourcesHTML(sources) {
  const items = asArray(sources).map(source => {
    const url = safeURL(source.url);
    return url ? `<li><a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(source.label)}<span class="diag-external" aria-hidden="true"> ↗</span></a></li>` : '';
  }).filter(Boolean);
  return items.length ? `<ul class="diag-sources">${items.join('')}</ul><p class="diag-small">Source links open online in a new tab.</p>` : '<p class="diag-small">No linked source supplied for this item.</p>';
}

function listHTML(items, className = '') {
  const list = asArray(items).filter(item => typeof item === 'string' && item.trim());
  return list.length ? `<ul class="diag-list ${className}">${list.map(item => `<li>${esc(item)}</li>`).join('')}</ul>` : '<p class="diag-small">No additional item listed for this pathway.</p>';
}

function navigationHTML() {
  return `<div class="diag-record-links" aria-label="Related record sections"><span>Open record:</span><button type="button" data-diag-navigate="Vitals">Vitals</button><button type="button" data-diag-navigate="Physical assessment">Physical assessment</button><button type="button" data-diag-navigate="Patient weight">Medication reference</button><button type="button" data-diag-navigate="Interventions">Interventions</button></div>`;
}

function tabsHTML(ui) {
  return `<div class="diag-tabs" role="group" aria-label="Diagnostic reference views">${[
    ['pathways', 'Pathways'], ['first-pass', 'First pass'], ['tools', 'Tools']
  ].map(([id, label]) => `<button type="button" data-diag-view="${id}" data-diag-focus="view-${id}" aria-pressed="${ui.view === id}">${label}</button>`).join('')}</div>`;
}

function searchHTML(ui) {
  if (ui.view === 'first-pass' || (ui.view === 'pathways' && ui.selectedId)) return '';
  const pathwayView = ui.view === 'pathways';
  const options = [...new Set(['All', ...asArray(presentationFilters)])];
  return `<div class="diag-filters ${pathwayView ? '' : 'diag-filters-tools'}"><label class="diag-search-label"><span>${pathwayView ? 'Search the full clinical reference' : 'Find a tool or examination'}</span><div class="diag-search-field"><input type="search" data-diag-search data-diag-focus="search" value="${esc(ui.query)}" placeholder="${pathwayView ? 'Finding, condition, test or treatment…' : 'Name, use or limitation…'}" autocomplete="off" spellcheck="false" aria-controls="diag-results"><button type="button" class="diag-clear" data-diag-clear aria-label="Clear search" ${ui.query ? '' : 'hidden'}>Clear</button></div></label>${pathwayView ? `<label class="diag-presentation-label"><span>Presenting problem</span><select data-diag-presentation data-diag-focus="presentation" aria-controls="diag-results">${options.map(label => `<option value="${esc(label)}" ${ui.presentation === label ? 'selected' : ''}>${esc(label === 'All' ? 'All presentations' : label)}</option>`).join('')}</select></label>` : ''}</div>`;
}

function pathwayResultsHTML(ui) {
  const matches = asArray(findDiagnosticPathways({query: ui.query, presentation: ui.presentation}))
    .slice().sort((a, b) => a.title.localeCompare(b.title));
  return `<div class="diag-results-meta"><span role="status" aria-live="polite">${matches.length} ${matches.length === 1 ? 'pathway' : 'pathways'}${ui.query.trim() || ui.presentation !== 'All' ? ' found' : ''}</span><span>Alphabetical · A–Z</span></div>${matches.length ? `<div class="diag-pathways">${matches.map(pathway => `<button type="button" class="diag-path-card" data-diag-pathway="${esc(pathway.id)}" data-diag-focus="pathway-${esc(pathway.id)}" data-category="${esc(pathway.category)}"><span class="diag-path-title">${esc(pathway.title)}<span class="diag-chevron" aria-hidden="true">›</span></span><span class="diag-path-physiology">${esc(pathway.physiology)}</span><span class="diag-path-category">${esc(pathway.category)}</span></button>`).join('')}</div>` : `<div class="diag-empty"><h3>No matching pathway</h3><p>Try a broader finding or select all presentations. Search matches wording in the reference; absence from these results does not exclude a condition.</p><button type="button" data-diag-reset>Show all pathways</button></div>`}`;
}

function toolResultsHTML(ui) {
  const words = ui.query.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);
  const tools = asArray(diagnosticTools).filter(tool => {
    const text = [tool.name, tool.tier, tool.use, tool.limitations].join(' ').toLocaleLowerCase();
    return words.every(word => text.includes(word));
  });
  return `<div class="diag-results-meta"><span role="status" aria-live="polite">${tools.length} ${tools.length === 1 ? 'tool' : 'tools'}${words.length ? ' found' : ''}</span><span>Bedside → definitive</span></div>${tools.length ? tiers.map((tier, index) => {
    const entries = tools.filter(tool => tool.tier === tier).sort((a, b) => a.name.localeCompare(b.name));
    return entries.length ? `<section class="diag-tool-tier"><h3><span class="diag-tier-number">${index + 1}</span>${esc(tier)}</h3><div class="diag-tools">${entries.map(tool => `<article class="diag-tool"><h4>${esc(tool.name)}</h4><p>${esc(tool.use)}</p><p class="diag-limitation"><strong>Limit:</strong> ${esc(tool.limitations)}</p><details class="diag-tool-source" data-diag-section="tool:${esc(tool.id)}:sources" ${ui.openSections[`tool:${tool.id}:sources`] === true ? 'open' : ''}><summary>Sources</summary>${sourcesHTML(tool.sources)}</details></article>`).join('')}</div></section>` : '';
  }).join('') : `<div class="diag-empty"><h3>No matching tool</h3><p>Try a broader name or examination finding.</p><button type="button" data-diag-clear>Show all tools</button></div>`}`;
}

function firstPassHTML() {
  return `<div class="diag-first-intro"><h3 data-diag-focus="first-pass-title" tabindex="-1">Start with the patient</h3><p>Recognize physiological failure, treat immediate threats, then use a focused examination to choose the next investigation.</p></div><ol class="diag-first-pass">${asArray(firstPass).map((step, index) => `<li><div class="diag-step-heading"><span class="diag-step-number" aria-hidden="true">${String(index + 1).padStart(2, '0')}</span><h4>${esc(step.title)}</h4></div><p class="diag-clinical-question">${esc(step.question)}</p><p>${esc(step.action)}</p>${step.limitation ? `<p class="diag-limitation"><strong>Limit:</strong> ${esc(step.limitation)}</p>` : ''}</li>`).join('')}</ol><button type="button" class="diag-primary-link" data-diag-view="pathways">Choose a presenting problem <span aria-hidden="true">→</span></button>`;
}

function detailSectionHTML(pathway, key, title, hint, body, ui, defaultOpen = false, extraClass = '') {
  const stateKey = `${pathway.id}:${key}`;
  const isOpen = own(ui.openSections, stateKey) ? ui.openSections[stateKey] === true : defaultOpen;
  return `<details class="diag-section ${extraClass}" id="diag-${esc(pathway.id)}-${key}" data-diag-section="${esc(stateKey)}" data-diag-default-open="${defaultOpen}" ${isOpen ? 'open' : ''}><summary data-diag-focus="section-${esc(stateKey)}"><span><strong>${esc(title)}</strong><small>${esc(hint)}</small></span><span class="diag-disclosure-mark" aria-hidden="true"></span></summary><div class="diag-section-body">${body}</div></details>`;
}

function pathwayDetailHTML(pathway, ui, mode) {
  const pediatric = mode === 'Pediatric';
  const body = {
    bedside: `<ol class="diag-bedside">${asArray(pathway.bedside).map((item, index) => `<li><h4><span aria-hidden="true">${index + 1}.</span> ${esc(item.action)}</h4><p><strong>Interpret:</strong> ${esc(item.meaning)}</p><p class="diag-limitation"><strong>Limit:</strong> ${esc(item.limitation)}</p></li>`).join('')}</ol>`,
    'basic-tools': listHTML(pathway.basicTools),
    differentials: `<dl class="diag-comparison">${asArray(pathway.differentials).map(item => `<div><dt>${esc(item.condition)}</dt><dd>${esc(item.discriminator)}</dd></div>`).join('')}</dl>`,
    testing: `<div class="diag-investigations">${asArray(pathway.testing).map(item => `<article><h4>${esc(item.test)}</h4><p>${esc(item.role)}</p><p class="diag-timing"><strong>Timing:</strong> ${esc(item.timing)}</p></article>`).join('')}</div>`,
    immediate: listHTML(pathway.immediate),
    definitive: listHTML(pathway.definitive),
    'advanced-tools': listHTML(pathway.advancedTools),
    modifiers: `<div class="diag-modifiers"><div class="${pediatric ? 'diag-current-mode' : ''}"><h4>Pediatric${pediatric ? ' · current run mode' : ''}</h4>${listHTML(pathway.modifiers?.pediatric)}</div><div><h4>Pregnancy / postpartum</h4>${listHTML(pathway.modifiers?.pregnancy)}</div></div>`,
    reassessment: listHTML(pathway.reassessment),
    sources: sourcesHTML(pathway.sources)
  };
  return `<article class="diag-detail" data-diag-current-pathway="${esc(pathway.id)}"><div class="diag-detail-top"><button type="button" class="diag-back" data-diag-back data-diag-focus="back"><span aria-hidden="true">←</span> All pathways</button><span class="diag-path-category">${esc(pathway.category)}</span></div><h3 class="diag-detail-title" data-diag-focus="detail-title" tabindex="-1">${esc(pathway.title)}</h3><p class="diag-physiology"><strong>Mechanism</strong>${esc(pathway.physiology)}</p>${pediatric && asArray(pathway.modifiers?.pediatric).length ? `<div class="diag-mode-note"><strong>Pediatric run:</strong> age-specific considerations are included below.<button type="button" data-diag-jump="modifiers">Read considerations</button></div>` : ''}${asArray(pathway.redFlags).length ? `<section class="diag-red-flags"><h4>Act before testing</h4>${listHTML(pathway.redFlags)}</section>` : ''}<div class="diag-detail-controls"><label><span class="diag-visually-hidden">Jump to a pathway section</span><select data-diag-jump-select data-diag-focus="jump"><option value="">Jump to section…</option>${sectionDefinitions.map(([key, title]) => `<option value="${key}">${esc(title)}</option>`).join('')}</select></label><button type="button" data-diag-expand>Expand all</button><button type="button" data-diag-collapse>Condense</button></div>${sectionDefinitions.map(([key, title, hint, defaultOpen]) => detailSectionHTML(pathway, key, title, hint, body[key], ui, key === 'modifiers' && pediatric ? true : defaultOpen, key === 'bedside' ? 'diag-bedside-section' : key === 'immediate' ? 'diag-treatment-section' : '')).join('')}<div class="diag-document-bar"><div><strong>Document your assessment</strong><small>Enter findings, uncertainty and response to care.</small></div><button type="button" class="diag-document" data-diag-document="${esc(pathway.id)}">Document assessment</button></div></article>`;
}

function contentHTML(ui, mode) {
  if (ui.view === 'first-pass') return firstPassHTML();
  if (ui.view === 'tools') return `<p class="diag-view-intro">Use the simplest available tool that answers the question. Advanced and definitive capabilities remain included.</p><div id="diag-results" data-diag-results>${toolResultsHTML(ui)}</div>`;
  const pathway = ui.selectedId ? getDiagnosticPathway(ui.selectedId) : null;
  return pathway ? pathwayDetailHTML(pathway, ui, mode) : `<p class="diag-view-intro">Start with a presenting problem. Each pathway connects bedside findings with definitive tests, treatment and reassessment.</p><div id="diag-results" data-diag-results>${pathwayResultsHTML(ui)}</div>`;
}

function captureView(root) {
  if (!root?.isConnected) return null;
  const active = root.ownerDocument.activeElement;
  if (!active || !root.contains(active)) return null;
  const key = active.getAttribute('data-diag-focus');
  return key ? {
    key,
    start: typeof active.selectionStart === 'number' ? active.selectionStart : null,
    end: typeof active.selectionEnd === 'number' ? active.selectionEnd : null,
    scrollX: root.ownerDocument.defaultView?.scrollX || 0,
    scrollY: root.ownerDocument.defaultView?.scrollY || 0,
    signature: root.dataset.diagSignature
  } : null;
}

/** Returns reference markup only; rendering does not record findings or select a diagnosis. */
export function diagnosticsHTML({ui = {}, mode = 'Adult'} = {}) {
  if (liveRoot?.isConnected) pendingRestore = captureView(liveRoot);
  const current = normalizeUI(ui);
  const normalizedMode = mode === 'Pediatric' ? 'Pediatric' : 'Adult';
  return `<section class="diagnostics" data-diagnostics-root data-diag-signature="${esc(`${current.view}:${current.selectedId}`)}" aria-label="Diagnostic reference"><div class="diag-heading"><div><h2>Diagnostics</h2><p>Bedside examination → targeted testing → treatment</p></div><span class="diag-mode">${normalizedMode}</span></div>${tabsHTML(current)}${searchHTML(current)}<div class="diag-content" data-diag-content>${contentHTML(current, normalizedMode)}</div>${navigationHTML()}<p class="diag-reference-note">Clinical reference · Findings stay unknown until assessed and documented.<span>Updated ${esc(diagnosticsUpdated)} · ${diagnosticPathways.length} pathways</span></p></section>`;
}

/** Mount after diagnosticsHTML. onStateChange persists state without calling a parent render. */
export function wireDiagnostics(container, {ui = {}, mode = 'Adult', onStateChange = () => {}, onDocument = () => {}, onNavigate = () => {}} = {}) {
  if (!container?.querySelector) return;
  let root = container.matches?.('[data-diagnostics-root]') ? container : container.querySelector('[data-diagnostics-root]');
  if (!root) return;
  let current = normalizeUI(ui);
  const normalizedMode = mode === 'Pediatric' ? 'Pediatric' : 'Adult';
  const host = root.parentElement;
  const doc = root.ownerDocument;

  const persist = patch => {
    current = {...current, ...patch};
    onStateChange(patch);
  };

  const focusKey = key => {
    const target = [...root.querySelectorAll('[data-diag-focus]')].find(el => el.dataset.diagFocus === key);
    target?.focus({preventScroll: true});
    return target;
  };

  const restoreFocus = snapshot => {
    if (!snapshot || snapshot.signature !== root.dataset.diagSignature) return;
    const target = focusKey(snapshot.key);
    if (target && snapshot.start !== null && typeof target.setSelectionRange === 'function') {
      try { target.setSelectionRange(snapshot.start, snapshot.end); } catch { /* Native selects have no selection range. */ }
    }
    if (target) doc.defaultView?.scrollTo?.(snapshot.scrollX, snapshot.scrollY);
  };

  const refreshResults = () => {
    const results = root.querySelector('[data-diag-results]');
    if (!results) return;
    results.innerHTML = current.view === 'tools' ? toolResultsHTML(current) : pathwayResultsHTML(current);
    const clear = root.querySelector('.diag-search-field [data-diag-clear]');
    if (clear) clear.hidden = !current.query;
    wireSectionToggles();
  };

  const repaint = ({focus = null, scroll = false} = {}) => {
    const oldSnapshot = captureView(root);
    const oldRoot = root;
    // Preserve the host and parent event handlers; only replace this reference's own subtree.
    oldRoot.outerHTML = diagnosticsHTML({ui: current, mode: normalizedMode});
    root = host?.querySelector('[data-diagnostics-root]');
    if (!root) return;
    liveRoot = root;
    pendingRestore = null;
    bind();
    if (focus) {
      const target = focusKey(focus);
      if (scroll && focus.startsWith('pathway-') && target) target.scrollIntoView({block: 'nearest', behavior: 'auto'});
      else if (scroll) root.querySelector('[data-diag-content]')?.scrollIntoView({block: 'start', behavior: 'auto'});
    } else restoreFocus(oldSnapshot);
  };

  function wireSectionToggles() {
    root.querySelectorAll('details[data-diag-section]').forEach(details => {
      details.ontoggle = () => {
        if (!details.isConnected) return;
        const key = details.dataset.diagSection;
        const previous = own(current.openSections, key) ? current.openSections[key] === true : details.dataset.diagDefaultOpen === 'true';
        if (previous === details.open) return;
        persist({openSections: {...current.openSections, [key]: details.open}});
      };
    });
  }

  function jumpTo(key) {
    const target = [...root.querySelectorAll('.diag-section')].find(el => el.dataset.diagSection === `${current.selectedId}:${key}`);
    if (!target) return;
    persist({openSections: {...current.openSections, [target.dataset.diagSection]: true}});
    target.open = true;
    target.querySelector('summary')?.focus({preventScroll: true});
    target.scrollIntoView({block: 'start', behavior: 'auto'});
  }

  function bind() {
    liveRoot = root;
    root.oninput = event => {
      const input = event.target.closest?.('[data-diag-search]');
      if (!input) return;
      persist({query: input.value});
      refreshResults();
    };
    root.onchange = event => {
      if (event.target.matches('[data-diag-presentation]')) {
        persist({presentation: event.target.value});
        refreshResults();
      } else if (event.target.matches('[data-diag-jump-select]')) {
        jumpTo(event.target.value);
        event.target.value = '';
      }
    };
    root.onclick = event => {
      const button = event.target.closest?.('button');
      if (!button || !root.contains(button)) return;
      if (button.hasAttribute('data-diag-view')) {
        const view = button.dataset.diagView;
        if (!views.includes(view)) return;
        persist({view});
        repaint({focus: `view-${view}`});
      } else if (button.hasAttribute('data-diag-pathway')) {
        if (!getDiagnosticPathway(button.dataset.diagPathway)) return;
        persist({selectedId: button.dataset.diagPathway, view: 'pathways'});
        repaint({focus: 'detail-title', scroll: true});
      } else if (button.hasAttribute('data-diag-back')) {
        const id = current.selectedId;
        persist({selectedId: '', view: 'pathways'});
        repaint({focus: `pathway-${id}`, scroll: true});
      } else if (button.hasAttribute('data-diag-clear') || button.hasAttribute('data-diag-reset')) {
        const resetAll = button.hasAttribute('data-diag-reset');
        persist({query: '', ...(resetAll ? {presentation: 'All'} : {})});
        const input = root.querySelector('[data-diag-search]');
        if (input) input.value = '';
        const select = root.querySelector('[data-diag-presentation]');
        if (select && resetAll) select.value = 'All';
        refreshResults();
        input?.focus({preventScroll: true});
      } else if (button.hasAttribute('data-diag-document')) {
        const pathway = getDiagnosticPathway(button.dataset.diagDocument);
        if (pathway) onDocument({pathwayId: pathway.id, title: pathway.title});
      } else if (button.hasAttribute('data-diag-navigate')) {
        if (allowedSections.includes(button.dataset.diagNavigate)) onNavigate(button.dataset.diagNavigate);
      } else if (button.hasAttribute('data-diag-jump')) {
        jumpTo(button.dataset.diagJump);
      } else if (button.hasAttribute('data-diag-expand') || button.hasAttribute('data-diag-collapse')) {
        const expand = button.hasAttribute('data-diag-expand');
        const openSections = {...current.openSections};
        root.querySelectorAll('.diag-section').forEach(section => {
          // Condense returns to the bedside-first reading layout, keeping urgent care visible.
          const open = expand || section.dataset.diagDefaultOpen === 'true';
          openSections[section.dataset.diagSection] = open;
          section.open = open;
        });
        persist({openSections});
      }
    };
    wireSectionToggles();
  }

  bind();
  const snapshot = pendingRestore;
  pendingRestore = null;
  if (snapshot) restoreFocus(snapshot);
}
