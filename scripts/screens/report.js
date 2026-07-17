/*
 * Report screen (Sprint 3) — Persönlicher Business-Potenzial-Report.
 *
 * Renders the assembled report model (engine/recommendation-engine.js) along
 * the fixed dramaturgy from Standards/report-design.md:
 *   1 Relevante Bereiche in Ihrem Unternehmen
 *   2 Was uns dabei auffällt (4-block insights per area)
 *   3 Ihre grössten wirtschaftlichen Potenziale (+ Potenzial-Kompass)
 *   4 Der rote Faden (synthesis across areas, no tools)
 *   5 Warum endet die Analyse hier?
 *   6 Der nächste sinnvolle Schritt (neutral, keine Verlinkung — RC1)
 *
 * PDF output uses the browser print function (window.print) with print styles;
 * no server-side PDF service.
 */

import { buildReport } from '../engine/recommendation-engine.js';
import { formatReportDate } from '../core/report-meta.js';

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function stepById(model, id) {
  return model.steps.find((s) => s.id === id) || { title: '', intro: '' };
}

function section(step, bodyHtml) {
  return `
    <section class="report-step">
      <h2 class="report-step__title">${escapeHtml(step.title)}</h2>
      <p class="report-step__intro">${escapeHtml(step.intro)}</p>
      ${bodyHtml}
    </section>
  `;
}

export function reportScreen({ store, config }) {
  const result = store.getState().result;
  const el = document.createElement('div');

  // Guard: report requires a completed analysis.
  if (!result) {
    el.innerHTML = `
      <h1>Kein Ergebnis vorhanden</h1>
      <p>Bitte durchlaufen Sie zuerst die Analyse.</p>
      <p><a class="btn btn-primary" href="#/analyse">Zur Analyse</a></p>
    `;
    return el;
  }

  const model = buildReport(result, config, store.getState().answers);
  const reportMeta = store.getState().reportMeta;
  const engineVersion = model.versions.engine;
  const createdAtLabel = formatReportDate(reportMeta.createdAt);

  // --- Step 1: recognized ---
  const recognizedHtml = `
    <ul class="chips">
      ${model.recognized.map((r) => `<li class="chip" data-area="${escapeHtml(r.processId)}">${escapeHtml(r.label)}</li>`).join('')}
    </ul>`;

  // --- Step 2: four-block insights (Beobachtung / Einordnung / Bedeutung / Tür) ---
  const meaningHtml = model.patterns.length
    ? `<div class="stack">
        ${model.patterns.slice(0, 5).map((p) => `
          <div class="card insight">
            <p class="insight__lead">${escapeHtml(p.beobachtung)}</p>
            <p>${escapeHtml(p.einordnung)}</p>
            <p>${escapeHtml(p.bedeutung)}</p>
            <p class="insight__door">${escapeHtml(p.offeneTuer)}</p>
          </div>`).join('')}
      </div>`
    : `<div class="card"><p>${escapeHtml(model.noFindings)}</p></div>`;

  // --- Step 3: notable potentials + compass + quiet areas ---
  const compassHtml = model.compass.length ? `
    <div class="compass">
      ${model.compass.map((c) => `
        <div class="compass__row" data-area="${escapeHtml(c.processId)}">
          <div class="compass__head">
            <span class="compass__label">${escapeHtml(c.label)}</span>
            <span class="badge">${escapeHtml(c.levelLabel)}</span>
          </div>
          <div class="compass__bar"><span style="width:${c.pct}%"></span></div>
        </div>`).join('')}
    </div>` : '';

  const topAreas = model.potentials.slice(0, 3);
  const quietHtml = model.quietAreas.length ? `
    <div class="quiet-areas">
      <h3 class="quiet-areas__title">${escapeHtml(model.quietAreasTitle)}</h3>
      <ul class="chips">${model.quietAreas.map((q) => `<li class="chip" data-area="${escapeHtml(q.processId)}">${escapeHtml(q.label)}</li>`).join('')}</ul>
      ${model.quietAreasNote ? `<p class="muted">${escapeHtml(model.quietAreasNote)}</p>` : ''}
    </div>` : '';
  const potentialsHtml = `
    ${topAreas.length
      ? `<ol class="ranked">${topAreas.map((p) => `<li><strong>${escapeHtml(p.label)}</strong> <span class="muted">— ${escapeHtml(p.levelLabel)}</span></li>`).join('')}</ol>${compassHtml}`
      : `<div class="card"><p>${escapeHtml(model.noNotablePotentials)}</p></div>`}
    ${quietHtml}`;

  // --- Step 4: synthesis ("roter Faden") — connects the areas ---
  const assessmentHtml = `
    <div class="card card--tint">
      <p class="synthesis">${escapeHtml(model.synthesis)}</p>
    </div>`;

  // --- Step 5: limits (intro carries the explanation) ---
  const limitsHtml = '';

  // --- Step 6: next step — neutral, informational, no CTA (RC1) ---
  // Version snapshot kept for reproducibility, but not shown as technical text
  // in the consultation document — embedded as a hidden comment instead.
  const versionMeta = Object.entries(model.versions)
    .filter(([k]) => k !== 'capturedAt')
    .map(([k, v]) => `${k} v${v}`)
    .join(' · ');

  const nextStepHtml = `
    <ul class="next-step-questions">
      ${model.nextStepQuestions.map((q) => `<li>${escapeHtml(q)}</li>`).join('')}
    </ul>
    <p>${escapeHtml(model.nextStepClosing)}</p>`;

  // --- Assemble ---
  el.innerHTML = `
    <div class="report" id="report">
      <div class="report-print-head">
        <img class="report-print-head__logo"
             src="./assets/logos/fokusone-logo-standard-no-tagline-transparent.png"
             alt="FokusOne">
        <span class="report-print-head__meta">${escapeHtml(reportMeta.id)} · Erstellt am ${escapeHtml(createdAtLabel)}</span>
      </div>

      <header class="report-head">
        <span class="badge">Persönlicher Business-Potenzial-Report</span>
        <h1>Ihr Business-Potenzial-Report</h1>
        <p class="report-lead">${escapeHtml(model.opening)}</p>
        ${model.personal ? `<p class="report-personal">${escapeHtml(model.personal)}</p>` : ''}
        <p class="report-disclaimer">${escapeHtml(model.disclaimer)}</p>
        <div class="report-actions no-print">
          <button type="button" class="btn btn-light" id="print-report">Als PDF speichern</button>
        </div>
      </header>

      ${section(stepById(model, 'recognized'), recognizedHtml)}
      ${section(stepById(model, 'meaning'), meaningHtml)}
      ${section(stepById(model, 'potentials'), potentialsHtml)}
      ${section(stepById(model, 'assessment'), assessmentHtml)}
      ${section(stepById(model, 'limits'), limitsHtml)}
      ${section(stepById(model, 'nextStep'), nextStepHtml)}

      <!-- Analyse-Grundlage (Reproduzierbarkeit): ${versionMeta} -->
      <footer class="report-foot muted">
        <p>FokusOne · Business- &amp; KI-Consulting — fundierte Erstorientierung auf Basis Ihrer Angaben.</p>
        <p class="report-foot__meta">Business-Potenzialanalyse · Version ${escapeHtml(engineVersion)} · ${escapeHtml(reportMeta.id)} · Erstellt am ${escapeHtml(createdAtLabel)}</p>
      </footer>
    </div>
    <p class="no-print"><a href="#/">Zur Startseite</a></p>
  `;

  el.querySelector('#print-report')?.addEventListener('click', () => window.print());
  return el;
}
