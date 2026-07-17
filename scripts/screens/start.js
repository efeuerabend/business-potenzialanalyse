/*
 * Start screen — entry point (verbindlicher Flow).
 *
 * All copy comes from config/content.js (start). Consultative, "Sie" form.
 */

export function startScreen({ config }) {
  const s = config.content.start;
  const el = document.createElement('div');
  el.className = 'start';
  el.innerHTML = `
    <span class="badge">${s.badge}</span>
    <h1>${s.headline}</h1>
    <p>${s.subline}</p>
    <div class="card">
      <ul class="hints">
        ${s.hints.map((h) => `<li>${h}</li>`).join('')}
      </ul>
      <p class="privacy-note">${config.content.privacyNote}</p>
      <a class="btn btn-primary" href="#/analyse">${s.button}</a>
    </div>
  `;
  return el;
}
