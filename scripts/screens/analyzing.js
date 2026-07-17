/*
 * Analyzing screen — kurze, hochwertige Analyse-Sequenz zwischen Fragebogen
 * und Report. Das Ergebnis ist beim Betreten bereits berechnet und gespeichert;
 * diese Sequenz macht die Auswertung sichtbar (professionelle Business-Software,
 * keine Hacker-/Matrix-Optik) und wechselt danach automatisch zum Report.
 */

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function analyzingScreen({ store, config }) {
  const a = config.content.analyzing;
  const el = document.createElement('div');

  // Ohne Ergebnis (direkter Aufruf) zurück zur Analyse.
  if (!store.getState().result) {
    el.innerHTML = `
      <h1>Kein Ergebnis vorhanden</h1>
      <p><a class="btn btn-primary" href="#/analyse">Zur Analyse</a></p>`;
    return el;
  }

  // Bereits einmal gezeigt (z. B. Browser-Zurück vom Report) -> Animation
  // nicht erneut abspielen, direkt zum Report.
  if (store.getState().meta.analysisShown) {
    window.location.hash = '#/report';
    return el;
  }
  store.markAnalysisShown();

  el.className = 'analyze';
  el.innerHTML = `
    <h1>${escapeHtml(a.heading)}</h1>
    <p class="analyze-subline">${escapeHtml(a.subline)}</p>
    <div class="card analyze-card">
      <div class="analyze-bar"><span></span></div>
      <ul class="analyze-steps">
        ${a.steps.map((s) => `
          <li class="analyze-step">
            <span class="analyze-check"></span>
            <span>${escapeHtml(s)}</span>
          </li>`).join('')}
      </ul>
    </div>
  `;

  const steps = [...el.querySelectorAll('.analyze-step')];
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const stepDelay = reduce ? 180 : 560;
  const tail = reduce ? 250 : 700;

  steps.forEach((step, i) => {
    setTimeout(() => step.classList.add('is-done'), (i + 1) * stepDelay);
  });

  setTimeout(() => {
    if (window.location.hash === '#/analyzing') window.location.hash = '#/report';
  }, steps.length * stepDelay + tail);

  return el;
}
