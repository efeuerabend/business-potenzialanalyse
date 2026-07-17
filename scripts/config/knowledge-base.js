/*
 * Knowledge Base — processes, tasks, industries.
 *
 * Product release: 1.0.0 — versioning unified at the product level (see CHANGELOG.md).
 *
 * The six chapters are now always active (no process-selection gate); each
 * chapter's questions carry their own relevance handling. `activeWhen` is
 * therefore removed, so every process is evaluated. Labels match the chapter
 * names used in the report/compass.
 *
 * Chapter texts (subline, einleitung, transition) live in config/content.js.
 *
 * Schema: process = { id, label, description, tasks: [{id,label}] }
 */

export const knowledgeBase = {
  version: '1.0.0',

  industries: [
    { id: 'handwerk', label: 'Handwerk' },
    { id: 'dienstleistung', label: 'Dienstleistung' },
    { id: 'handel', label: 'Handel' },
    { id: 'gesundheit', label: 'Gesundheit' },
    { id: 'fitness', label: 'Fitness' },
    { id: 'beauty', label: 'Beauty' },
    { id: 'gastronomie', label: 'Gastronomie' },
    { id: 'immobilien', label: 'Immobilien' },
    { id: 'agentur', label: 'Agentur' },
    { id: 'beratung', label: 'Beratung' },
    { id: 'produktion', label: 'Produktion' },
    { id: 'bildung', label: 'Bildung' },
    { id: 'sonstige', label: 'Sonstige' },
  ],

  processes: [
    {
      id: 'p_leads',
      label: 'Neukundengewinnung',
      description: 'Wie neue Kunden heute zum Unternehmen finden.',
      tasks: [{ id: 't_leads', label: 'Kundengewinnung' }],
    },
    {
      id: 'p_inquiries',
      label: 'Kundenanfragen',
      description: 'Wie eingehende Anfragen entgegengenommen und beantwortet werden.',
      tasks: [{ id: 't_inquiries', label: 'Anfragenbearbeitung' }],
    },
    {
      id: 'p_scheduling',
      label: 'Termine & Organisation',
      description: 'Wie Termine vereinbart und organisiert werden.',
      // Only relevant when the business actually schedules appointments.
      activeWhen: { fact: 'answers.q_sched_relevant', op: 'notEquals', value: 'nein' },
      tasks: [{ id: 't_scheduling', label: 'Terminkoordination' }],
    },
    {
      id: 'p_offers',
      label: 'Angebote & Aufträge',
      description: 'Wie aus Interessenten über Angebote Kunden werden.',
      // Only relevant when the business actually creates offers/quotes.
      activeWhen: { fact: 'answers.q_off_relevant', op: 'notEquals', value: 'nein' },
      tasks: [{ id: 't_offers', label: 'Angebotserstellung' }],
    },
    {
      id: 'p_admin',
      label: 'Verwaltung & Büro',
      description: 'Aufgaben, die zusätzlich zur Kundenarbeit im Büro anfallen.',
      tasks: [{ id: 't_admin', label: 'Administration' }],
    },
    {
      id: 'p_owner',
      label: 'Sie als Unternehmer',
      description: 'In welchem Mass das Unternehmen von der Inhaberin oder dem Inhaber persönlich abhängt.',
      tasks: [{ id: 't_owner', label: 'Unternehmerabhängigkeit' }],
    },
  ],
};
