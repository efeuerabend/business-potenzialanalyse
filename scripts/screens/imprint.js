/*
 * Impressum — Platzhalterseite (RC1).
 *
 * Struktur bereits angelegt und sauber verlinkt (Footer, siehe index.html),
 * Inhalte bewusst noch nicht final: die endgültige Fassung setzt Hosting,
 * Domain und die Alfima-Anbindung voraus.
 */

export function imprintScreen() {
  const el = document.createElement('div');
  el.innerHTML = `
    <span class="badge">Rechtliches</span>
    <h1>Impressum</h1>
    <div class="card">
      <p>Diese Seite wird vor dem Produktivbetrieb vollständig ausgearbeitet.</p>
      <p class="muted">Die endgültige Fassung folgt nach Festlegung von Hosting und Domain.</p>
    </div>

    <h2>Angaben gemäss anwendbarem Recht</h2>
    <p class="muted">Wird ergänzt.</p>

    <h2>Vertretungsberechtigte Person</h2>
    <p class="muted">Wird ergänzt.</p>

    <h2>Kontakt</h2>
    <p class="muted">Wird ergänzt.</p>

    <h2>Handelsregister / UID</h2>
    <p class="muted">Wird ergänzt.</p>

    <p><a href="#/" class="link-nav">&larr; Zur Startseite</a></p>
  `;
  return el;
}
