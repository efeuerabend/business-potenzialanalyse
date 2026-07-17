/*
 * Datenschutzerklärung — Platzhalterseite (RC1).
 *
 * Struktur bereits angelegt und sauber verlinkt (Footer, siehe index.html),
 * Inhalte bewusst noch nicht final: die endgültige Fassung setzt Hosting,
 * Domain, die Alfima-Anbindung und die Tracking-Entscheidung voraus.
 */

export function privacyScreen() {
  const el = document.createElement('div');
  el.innerHTML = `
    <span class="badge">Rechtliches</span>
    <h1>Datenschutzerklärung</h1>
    <div class="card">
      <p>Diese Seite wird vor dem Produktivbetrieb vollständig ausgearbeitet.</p>
      <p class="muted">Die endgültige Fassung folgt nach Festlegung von Hosting, Domain, der Alfima-Anbindung und einer allfälligen Tracking-Lösung.</p>
    </div>

    <h2>Verantwortliche Stelle</h2>
    <p class="muted">Wird ergänzt.</p>

    <h2>Verarbeitete Daten</h2>
    <p class="muted">Wird ergänzt. Stand heute: Ihre Angaben in der Business-Potenzialanalyse werden ausschliesslich lokal in Ihrem Browser verarbeitet und nicht an einen Server übertragen.</p>

    <h2>Zweck der Verarbeitung</h2>
    <p class="muted">Wird ergänzt.</p>

    <h2>Ihre Rechte</h2>
    <p class="muted">Wird ergänzt.</p>

    <h2>Kontakt</h2>
    <p class="muted">Wird ergänzt.</p>

    <p><a href="#/" class="link-nav">&larr; Zur Startseite</a></p>
  `;
  return el;
}
