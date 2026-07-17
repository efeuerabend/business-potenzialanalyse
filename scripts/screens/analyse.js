/*
 * Analyse screen — the adaptive questionnaire wizard (verbindlicher Flow).
 *
 * Renders the conversation flow: motivation -> profile -> six chapters, each
 * with an inline chapter intro (heading, subline, einleitung) on its first
 * question, adaptive follow-ups, a transition interstitial after chapters that
 * define one, and a closing interstitial before the report is computed.
 *
 * All copy comes from config (content, questions). The wizard holds no business
 * text. On completion it runs the Decision Engine, stores the result and hands
 * over to the report.
 */

import { getVisibleQuestions, isAnswered } from '../engine/questionnaire.js';
import { renderQuestion } from '../ui/question-controls.js';

export function analyseScreen({ store, config, runAnalysis }) {
  const questions = config.questions.questions;
  const chapters = config.content.chapters;
  // Nur die durchnummerierten Fach-Kapitel ("Kapitel 1" … "Kapitel 6" in den
  // Chapter-Headings) zählen für die Fortschrittsanzeige — Einstieg und
  // Unternehmensprofil sind bewusst unnummeriert.
  const processChapters = chapters.filter((c) => c.id !== 'motivation' && c.id !== 'profile');
  const closing = config.content.closing;
  const container = document.createElement('div');
  let cursor = 0;

  // Ein bereits vorhandenes Ergebnis bedeutet: der Nutzer hat eine Analyse
  // abgeschlossen und beginnt jetzt bewusst einen neuen Durchlauf (z. B. über
  // "Zur Startseite" -> erneut starten). Ohne Reset blieben alte Antworten
  // markiert und konnten den Weiter-Button blockieren (RC1.1).
  if (store.getState().result) {
    store.reset();
  }

  store.markStarted();

  // Während einer laufenden Analyse vor Datenverlust bei Tab-Schliessen warnen
  // (sessionStorage schützt bereits gegen versehentliches Neuladen). Wird beim
  // Abschluss der Befragung wieder entfernt.
  function handleBeforeUnload(e) {
    e.preventDefault();
    e.returnValue = '';
  }
  window.addEventListener('beforeunload', handleBeforeUnload);

  function chapterIdOf(q) {
    if (q.stage === 'motivation') return 'motivation';
    if (q.stage === 'profile') return 'profile';
    return q.processId;
  }

  // Adaptive options: for questions with `optionsFrom`, show only the options
  // whose value was selected in the referenced answer.
  function resolveQuestion(q, answers) {
    if (!q.optionsFrom) return q;
    const selected = answers[q.optionsFrom];
    const opts = q.options.filter((o) => Array.isArray(selected) && selected.includes(o.value));
    return { ...q, options: opts.length ? opts : q.options };
  }

  // Build the current flow: questions grouped by chapter (in config order),
  // plus transition and closing interstitials.
  function buildFlow() {
    const answers = store.getState().answers;
    const visible = getVisibleQuestions(questions, answers);
    const byChapter = new Map();
    for (const q of visible) {
      const cid = chapterIdOf(q);
      if (!byChapter.has(cid)) byChapter.set(cid, []);
      byChapter.get(cid).push(q);
    }
    const flow = [];
    for (const chapter of chapters) {
      const qs = byChapter.get(chapter.id) || [];
      if (!qs.length) continue;
      qs.forEach((q, i) => flow.push({ type: 'question', q, chapter, isFirst: i === 0 }));
      if (chapter.transition) flow.push({ type: 'transition', chapter });
    }
    flow.push({ type: 'closing' });
    return flow;
  }

  function remainingQuestions(flow, fromIndex) {
    return flow.slice(fromIndex).filter((it) => it.type === 'question').length;
  }

  function chapterIntroHtml(chapter) {
    let html = `<span class="badge">${chapter.heading}</span>`;
    if (chapter.subline) html += `<h2 class="chapter-subline">${chapter.subline}</h2>`;
    if (chapter.einleitung) html += `<p class="chapter-intro muted">${chapter.einleitung}</p>`;
    return html;
  }

  function renderQuestionItem(item, flow) {
    const answers = store.getState().answers;
    const remaining = remainingQuestions(flow, cursor);
    const total = remainingQuestions(flow, 0);
    const done = total - remaining;

    const wrap = document.createElement('div');

    if (item.isFirst) {
      const intro = document.createElement('div');
      intro.className = 'chapter-head';
      intro.setAttribute('data-area', item.chapter.id);
      intro.innerHTML = chapterIntroHtml(item.chapter);
      wrap.appendChild(intro);
    }

    const progress = document.createElement('div');
    progress.className = 'progress';
    const chapterNumber = processChapters.findIndex((c) => c.id === item.chapter.id) + 1;
    const chapterLabel = chapterNumber > 0
      ? `Kapitel ${chapterNumber} von ${processChapters.length}`
      : (item.chapter.id === 'motivation' ? 'Einstieg' : 'Ihr Unternehmensprofil');
    const minutesLeft = Math.max(1, Math.ceil((remaining * 20) / 60));
    progress.innerHTML =
      `<span class="progress__chapter muted">${chapterLabel}</span>`
      + `<span class="progress__hint">noch ca. ${minutesLeft} Min.</span>`;
    wrap.appendChild(progress);

    const bar = document.createElement('div');
    bar.className = 'progress-bar';
    bar.innerHTML = `<span style="width:${Math.round((done / total) * 100)}%"></span>`;
    wrap.appendChild(bar);

    const card = document.createElement('div');
    card.className = 'card';
    const q = resolveQuestion(item.q, answers);
    card.appendChild(renderQuestion(q, answers, (value) => {
      store.setAnswer(item.q.id, value);
      updateNext();
    }));
    wrap.appendChild(card);

    const actions = document.createElement('div');
    actions.className = 'wizard-actions';
    const back = button('Zurück', 'btn btn-light', () => { cursor = Math.max(0, cursor - 1); render(); });
    back.disabled = cursor === 0;
    const next = button('Weiter', 'btn btn-primary', () => { cursor += 1; render(); });
    actions.appendChild(back);
    actions.appendChild(next);
    wrap.appendChild(actions);

    function updateNext() {
      next.disabled = !isAnswered(item.q, store.getState().answers);
    }
    updateNext();

    container.replaceChildren(wrap);
  }

  function renderTransition(item) {
    const wrap = document.createElement('div');
    const card = document.createElement('div');
    card.className = 'card interstitial';
    card.innerHTML = `<p>${item.chapter.transition}</p>`;
    wrap.appendChild(card);
    const actions = document.createElement('div');
    actions.className = 'wizard-actions';
    const back = button('Zurück', 'btn btn-light', () => { cursor = Math.max(0, cursor - 1); render(); });
    back.disabled = cursor === 0;
    const next = button('Weiter', 'btn btn-primary', () => { cursor += 1; render(); });
    actions.appendChild(back);
    actions.appendChild(next);
    wrap.appendChild(actions);
    container.replaceChildren(wrap);
  }

  function renderClosing() {
    const wrap = document.createElement('div');
    wrap.innerHTML = `
      <span class="badge">Fast geschafft</span>
      <h1>${closing.heading}</h1>
      <div class="card interstitial"><p>${closing.text}</p></div>
    `;
    const actions = document.createElement('div');
    actions.className = 'wizard-actions';
    const back = button('Zurück', 'btn btn-light', () => { cursor = Math.max(0, cursor - 1); render(); });
    const go = button(closing.button, 'btn btn-primary', finish);
    actions.appendChild(back);
    actions.appendChild(go);
    wrap.appendChild(actions);
    container.replaceChildren(wrap);
  }

  function finish() {
    window.removeEventListener('beforeunload', handleBeforeUnload);
    const result = runAnalysis(store.getState(), config);
    store.setResult(result);
    // Kurze Analyse-Sequenz, dann automatisch zum Report.
    window.location.hash = '#/analyzing';
  }

  function render() {
    const flow = buildFlow();
    if (cursor < 0) cursor = 0;
    if (cursor >= flow.length) cursor = flow.length - 1;
    const item = flow[cursor];
    if (item.type === 'question') renderQuestionItem(item, flow);
    else if (item.type === 'transition') renderTransition(item);
    else renderClosing();
  }

  function button(label, className, onClick) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = className;
    b.textContent = label;
    b.addEventListener('click', onClick);
    return b;
  }

  render();
  return container;
}
