/*
 * Content — non-question copy for the conversation flow.
 *
 * Product release: 1.0.0 — versioning unified at the product level (see CHANGELOG.md).
 *
 * Holds the start page, chapter meta (heading, subline, einleitung, transition)
 * and the closing message. All texts are configurable; the wizard reads them
 * and never hardcodes copy. Chapter headings are kept verbatim as specified.
 * Address form: "Sie" throughout, consistent with the questionnaire.
 */

export const content = {
  version: '1.0.0',

  // Shared trust note — shown prominently on the start screen and in the
  // global footer (single source, see app.js / screens/start.js).
  privacyNote: 'Ihre Angaben werden ausschliesslich lokal in Ihrem Browser verarbeitet.',

  start: {
    badge: 'Ihre persönliche Business-Potenzialanalyse',
    title: 'Business-Potenzialanalyse',
    headline: 'Wie viel ungenutztes <span class="highlight">Potenzial</span> steckt in Ihrem Unternehmen?',
    subline: 'Finden Sie in wenigen Minuten heraus, in welchen Bereichen Sie Zeit sparen, Abläufe verbessern und Ihr Unternehmen wirtschaftlich weiterentwickeln können.',
    hints: [
      'Dauer ca. 5–8 Minuten',
      'Keine Vorbereitung notwendig',
      'Sofortige persönliche Auswertung',
    ],
    button: 'Business-Potenzialanalyse starten',
  },

  // Chapter meta keyed by chapter id. Order defines the flow order.
  // Chapter id maps to: 'motivation', 'profile', or a knowledge-base processId.
  chapters: [
    {
      id: 'motivation',
      heading: 'Einstieg: persönliche Motivation',
    },
    {
      id: 'profile',
      heading: 'Unternehmensprofil',
      einleitung: 'Erzählen Sie uns kurz etwas über Ihr Unternehmen.',
    },
    {
      id: 'p_leads',
      heading: 'Kapitel 1: Neukundengewinnung',
      subline: 'Wie finden neue Kunden heute zu Ihnen?',
      einleitung: 'Jedes Unternehmen gewinnt neue Kunden auf unterschiedliche Weise. Uns interessiert nicht, welcher Weg der beste ist. Wir möchten verstehen, wie neue Kunden heute zu Ihnen finden.',
      transition: 'Vielen Dank. Als Nächstes schauen wir uns an, was passiert, wenn sich Interessenten oder Kunden bei Ihnen melden.',
    },
    {
      id: 'p_inquiries',
      heading: 'Kapitel 2: Kundenanfragen',
      subline: 'Was passiert, wenn sich ein Interessent bei Ihnen meldet?',
      einleitung: 'Viele Unternehmen verlieren keine Kunden, weil ihr Angebot schlecht ist. Anfragen gehen eher verloren, weil sie zu spät beantwortet werden oder im Alltag untergehen. Deshalb möchten wir verstehen, wie Anfragen heute bei Ihnen ankommen und bearbeitet werden.',
      transition: 'Perfekt. Damit haben wir einen guten Überblick über Ihre Kundenkommunikation. Als Nächstes schauen wir uns Ihre Termine und die tägliche Organisation an.',
    },
    {
      id: 'p_scheduling',
      heading: 'Kapitel 3: Termine & Organisation',
      subline: 'Wie werden Termine heute vereinbart und organisiert?',
      einleitung: 'Je mehr ein Unternehmen wächst, desto wichtiger werden klare Abläufe. Uns interessiert nicht, wie perfekt Ihr Unternehmen organisiert ist, sondern wie Ihr Alltag tatsächlich aussieht.',
      transition: 'Vielen Dank. Jetzt möchten wir verstehen, wie Angebote und Aufträge bei Ihnen entstehen.',
    },
    {
      id: 'p_offers',
      heading: 'Kapitel 4: Angebote & Aufträge',
      subline: 'Wie wird aus einem Interessenten ein Kunde?',
      einleitung: 'Viele Unternehmer investieren viel Zeit in Angebote, Rückfragen und Nachfassen. Schauen wir uns an, wie dieser Ablauf heute bei Ihnen aussieht.',
      transition: 'Danke. Jetzt schauen wir uns die Aufgaben an, die zusätzlich zur eigentlichen Kundenarbeit im Büro und in der Verwaltung anfallen.',
    },
    {
      id: 'p_admin',
      heading: 'Kapitel 5: Verwaltung & Büro',
      subline: 'Welche Aufgaben begleiten Ihren Arbeitsalltag zusätzlich zur eigentlichen Kundenarbeit?',
      einleitung: 'Routineaufgaben gehören zu jedem Unternehmen. Entscheidend ist nicht, ob sie vorhanden sind, sondern wie stark sie Ihren Arbeitsalltag zusätzlich belasten.',
      transition: 'Zum Abschluss möchten wir noch besser verstehen, wie stark Ihr Unternehmen heute von Ihnen persönlich abhängt.',
    },
    {
      id: 'p_owner',
      heading: 'Kapitel 6: Sie als Unternehmer',
      subline: 'Wie wirkt sich Ihr Unternehmen heute auf Ihren Alltag aus?',
      einleitung: 'Jedes Unternehmen entwickelt sich mit seinem Unternehmer. Deshalb möchten wir zum Abschluss verstehen, wie Ihr Alltag heute aussieht.',
    },
  ],

  // Shown before the analysis is computed (no extra motivation/future question).
  closing: {
    heading: 'Vielen Dank.',
    text: 'Sie haben uns einen guten Einblick in Ihren Unternehmeralltag gegeben. Jetzt analysieren wir Ihre Antworten und identifizieren die Bereiche mit dem grössten wirtschaftlichen Potenzial für Ihr Unternehmen.',
    button: 'Auswertung ansehen',
  },

  // Kurze, hochwertige Analyse-Sequenz zwischen Abschluss und Report.
  analyzing: {
    heading: 'Analyse läuft',
    subline: 'Ihre Angaben werden ausgewertet.',
    steps: [
      'Antworten ausgewertet',
      'Unternehmensbereiche analysiert',
      'Unternehmerische Muster erkannt',
      'Wirtschaftliche Potenziale priorisiert',
      'Automatisierungspotenziale berechnet',
      'Persönlichen Business-Potenzial-Report erstellt',
    ],
  },
};
