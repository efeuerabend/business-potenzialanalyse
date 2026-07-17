/*
 * System self-test screen (Sprint 1).
 *
 * Proves the platform is runnable end to end: it loads the full configuration,
 * runs the Decision Engine against a synthetic answer set and shows the active
 * version snapshot plus the raw result. This is a diagnostics view, NOT the
 * Business-Potenzial-Report (that is Sprint 3).
 */

import { formatVersionSummary } from '../core/version.js';

export function systemScreen({ config, runAnalysis }) {
  // Synthetic state that triggers the example rule/pattern, so the pipeline
  // produces a non-empty result without a real questionnaire.
  const syntheticState = {
    profile: { businessModel: 'dienstleistung' },
    answers: { q_example: 'yes' },
  };

  let result;
  let error = null;
  try {
    result = runAnalysis(syntheticState, config);
  } catch (e) {
    error = e;
  }

  const el = document.createElement('div');
  el.innerHTML = `
    <span class="badge">Diagnose</span>
    <h1>System-Selbsttest</h1>
    <p class="muted">
      Lädt die Konfiguration, führt die Decision Engine mit einem synthetischen
      Antwortsatz aus und zeigt das Roh-Ergebnis. Dient nur der technischen
      Überprüfung der Plattform.
    </p>
    <p><a href="#/" class="link-nav">&larr; Zurück</a></p>
  `;

  if (error) {
    const err = document.createElement('div');
    err.className = 'card';
    err.innerHTML = '<h2>Fehler</h2>';
    const pre = document.createElement('pre');
    pre.className = 'debug';
    pre.textContent = String(error && error.stack ? error.stack : error);
    err.appendChild(pre);
    el.appendChild(err);
    return el;
  }

  // --- Versions table ---
  const versionsCard = document.createElement('div');
  versionsCard.className = 'card';
  const versionRows = Object.entries(result.versions)
    .filter(([key]) => key !== 'capturedAt')
    .map(([key, value]) => `<tr><th>${key}</th><td>v${value}</td></tr>`)
    .join('');
  versionsCard.innerHTML = `
    <h2>Aktive Versionen</h2>
    <table class="kv"><tbody>${versionRows}</tbody></table>
  `;
  el.appendChild(versionsCard);

  // --- Engine summary ---
  const summaryCard = document.createElement('div');
  summaryCard.className = 'card';
  const proc = result.processScores[0];
  summaryCard.innerHTML = `
    <h2>Engine-Durchlauf</h2>
    <table class="kv"><tbody>
      <tr><th>Bewertete Prozesse</th><td>${result.processScores.length}</td></tr>
      <tr><th>Beispielprozess-Score</th><td>${proc ? proc.score : '—'}</td></tr>
      <tr><th>Potenzialstufe</th><td>${proc ? proc.level.label : '—'}</td></tr>
      <tr><th>Erkannte Muster</th><td>${result.detectedPatterns.length}</td></tr>
      <tr><th>Gesamteinschätzung</th><td>${result.overall ? result.overall.level.label : '—'}</td></tr>
    </tbody></table>
  `;
  el.appendChild(summaryCard);

  // --- Raw result ---
  const rawCard = document.createElement('div');
  rawCard.className = 'card';
  rawCard.innerHTML = '<h2>Roh-Ergebnis</h2>';
  const pre = document.createElement('pre');
  pre.className = 'debug';
  pre.textContent = JSON.stringify(result, null, 2);
  rawCard.appendChild(pre);
  el.appendChild(rawCard);

  // Expose version summary for quick visual confirmation.
  const note = document.createElement('p');
  note.className = 'muted';
  note.textContent = formatVersionSummary(result.versions);
  el.appendChild(note);

  return el;
}
