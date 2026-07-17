/*
 * Questions — adaptive questionnaire catalogue (verbindlicher Flow).
 *
 * Product release: 1.0.0 — versioning unified at the product level (see CHANGELOG.md).
 *
 * Structure per Standards/question-design.md: single/multi only, one info per
 * question, neutral wording, adaptive follow-ups via `condition`. Address form
 * "Sie". All chapters are always present; relevance is handled inside the
 * questions ("Nicht relevant" options) rather than a selection gate.
 *
 * Fields: id, stage ('motivation'|'profile'|'process'), processId (for process
 * stage), type, label, help?, options[{value,label}], condition?, optionsFrom?,
 * optional?
 *
 * `optionsFrom` (adaptive options): render only the options whose value was
 * selected in the referenced answer (used for "only the platforms you chose").
 */

const cond = (id, op, value) => ({ fact: `answers.${id}`, op, value });
const includes = (id, value) => cond(id, 'includes', value);
const includesAny = (id, value) => cond(id, 'includesAny', value);

export const questions = {
  version: '1.0.0',

  questions: [
    // ================= Einstieg: persönliche Motivation =================
    {
      id: 'motivation', stage: 'motivation', type: 'single',
      label: 'Wenn Sie heute nur eine Sache in Ihrem Unternehmen verbessern könnten – welche wäre das?',
      purpose: 'personalization',
      options: [
        { value: 'zeit_alltag', label: 'Mehr Zeit im Alltag' },
        { value: 'umsatz', label: 'Mehr Umsatz' },
        { value: 'stress', label: 'Weniger Stress' },
        { value: 'struktur', label: 'Mehr Struktur im Unternehmen' },
        { value: 'routine', label: 'Weniger Routinearbeiten' },
        { value: 'zeit_kunden', label: 'Mehr Zeit für Kunden' },
        { value: 'freizeit', label: 'Mehr Freizeit' },
        { value: 'planbarkeit', label: 'Bessere Planbarkeit' },
        { value: 'unabhaengig', label: 'Mein Unternehmen soll unabhängiger von mir werden' },
      ],
    },

    // ===================== Unternehmensprofil =====================
    {
      id: 'profile_industry', stage: 'profile', type: 'single',
      label: 'In welchem Bereich ist Ihr Unternehmen tätig?',
      purpose: 'profile',
      options: [
        { value: 'handwerk', label: 'Handwerk' },
        { value: 'dienstleistung', label: 'Dienstleistung' },
        { value: 'handel', label: 'Handel' },
        { value: 'gesundheit', label: 'Gesundheit' },
        { value: 'fitness', label: 'Fitness' },
        { value: 'beauty', label: 'Beauty' },
        { value: 'gastronomie', label: 'Gastronomie' },
        { value: 'immobilien', label: 'Immobilien' },
        { value: 'agentur', label: 'Agentur' },
        { value: 'beratung', label: 'Beratung' },
        { value: 'produktion', label: 'Produktion' },
        { value: 'bildung', label: 'Bildung' },
        { value: 'sonstige', label: 'Sonstige' },
      ],
    },
    {
      id: 'profile_employees', stage: 'profile', type: 'single',
      label: 'Wie viele Menschen arbeiten in Ihrem Unternehmen?',
      purpose: 'scoring',
      options: [
        { value: 'solo', label: 'Nur ich' },
        { value: '2-5', label: '2–5' },
        { value: '6-10', label: '6–10' },
        { value: '11-20', label: '11–20' },
        { value: '21-50', label: '21–50' },
        { value: '50+', label: 'Mehr als 50' },
      ],
    },
    {
      id: 'profile_work_mode', stage: 'profile', type: 'multi',
      label: 'Wie arbeiten Sie heute überwiegend?',
      purpose: 'profile',
      options: [
        { value: 'vor_ort', label: 'Vor Ort beim Kunden' },
        { value: 'geschaeft', label: 'Im eigenen Geschäft' },
        { value: 'buero', label: 'Im Büro' },
        { value: 'online', label: 'Online' },
      ],
    },
    {
      id: 'profile_role', stage: 'profile', type: 'single',
      label: 'Welche Aussage trifft am ehesten auf Sie zu?',
      purpose: 'scoring',
      options: [
        { value: 'operativ', label: 'Ich arbeite überwiegend selbst im Tagesgeschäft.' },
        { value: 'teilweise', label: 'Ich arbeite teilweise operativ mit.' },
        { value: 'fuehrung', label: 'Ich kümmere mich überwiegend um die Unternehmensführung.' },
      ],
    },

    // ===================== Kapitel 1: Neue Kunden =====================
    {
      id: 'q_leads_channels', stage: 'process', processId: 'p_leads', type: 'multi',
      label: 'Über welche Wege gewinnen Sie heute neue Kunden?',
      purpose: 'scoring',
      options: [
        { value: 'empfehlung', label: 'Empfehlungen' },
        { value: 'google_suche', label: 'Google-Suche' },
        { value: 'google_profil', label: 'Google-Unternehmensprofil' },
        { value: 'facebook', label: 'Facebook' },
        { value: 'instagram', label: 'Instagram' },
        { value: 'linkedin', label: 'LinkedIn' },
        { value: 'tiktok', label: 'TikTok' },
        { value: 'website', label: 'Eigene Website' },
        { value: 'ads', label: 'Bezahlte Werbung' },
        { value: 'print', label: 'Flyer oder Printwerbung' },
        { value: 'netzwerk', label: 'Persönliche Kontakte oder Netzwerk' },
        { value: 'messen', label: 'Messen oder Veranstaltungen' },
        { value: 'leads', label: 'Gekaufte Leads' },
        { value: 'laufkundschaft', label: 'Laufkundschaft' },
        { value: 'sponsoring', label: 'Sponsoring oder Kooperationen' },
        { value: 'sonstige', label: 'Sonstige' },
      ],
    },
    {
      id: 'q_leads_regularity', stage: 'process', processId: 'p_leads', type: 'single',
      label: 'Wie regelmässig kommen heute neue Kunden oder Anfragen zu Ihnen?',
      purpose: 'scoring',
      options: [
        { value: 'sehr_regelmaessig', label: 'Sehr regelmässig' },
        { value: 'meist_regelmaessig', label: 'Meist regelmässig' },
        { value: 'unterschiedlich', label: 'Unterschiedlich' },
        { value: 'eher_unregelmaessig', label: 'Eher unregelmässig' },
        { value: 'kaum_planbar', label: 'Kaum planbar' },
      ],
    },
    {
      id: 'q_leads_missing', stage: 'process', processId: 'p_leads', type: 'single',
      label: 'Haben Sie den Eindruck, dass Ihnen derzeit neue Kunden oder Anfragen fehlen?',
      purpose: 'scoring',
      options: [
        { value: 'nein', label: 'Nein' },
        { value: 'teilweise', label: 'Teilweise' },
        { value: 'ja', label: 'Ja' },
        { value: 'schwer', label: 'Kann ich schwer einschätzen' },
      ],
    },
    {
      id: 'q_leads_website_inquiries', stage: 'process', processId: 'p_leads', type: 'single',
      condition: includes('q_leads_channels', 'website'),
      label: 'Erhalten Sie regelmässig Anfragen über Ihre Website?',
      purpose: 'scoring',
      options: [
        { value: 'ja', label: 'Ja' },
        { value: 'manchmal', label: 'Manchmal' },
        { value: 'selten', label: 'Selten' },
        { value: 'nein', label: 'Nein' },
      ],
    },
    {
      id: 'q_leads_social_platforms', stage: 'process', processId: 'p_leads', type: 'multi',
      condition: includesAny('q_leads_channels', ['facebook', 'instagram', 'linkedin', 'tiktok']),
      optionsFrom: 'q_leads_channels',
      label: 'Über welche dieser Plattformen erhalten Sie tatsächlich Anfragen?',
      purpose: 'scoring',
      options: [
        { value: 'facebook', label: 'Facebook' },
        { value: 'instagram', label: 'Instagram' },
        { value: 'linkedin', label: 'LinkedIn' },
        { value: 'tiktok', label: 'TikTok' },
      ],
    },
    {
      id: 'q_leads_paid_who', stage: 'process', processId: 'p_leads', type: 'single',
      condition: includesAny('q_leads_channels', ['ads', 'leads']),
      label: 'Wer bearbeitet die eingehenden Anfragen überwiegend?',
      purpose: 'scoring',
      options: [
        { value: 'ich', label: 'Ich selbst' },
        { value: 'mitarbeitende', label: 'Mitarbeitende' },
        { value: 'extern', label: 'Externer Dienstleister' },
        { value: 'unterschiedlich', label: 'Unterschiedlich' },
      ],
    },

    // ===================== Kapitel 2: Kundenanfragen =====================
    {
      id: 'q_inq_channels', stage: 'process', processId: 'p_inquiries', type: 'multi',
      label: 'Über welche Wege erreichen Sie Interessenten oder Kunden?',
      purpose: 'scoring',
      options: [
        { value: 'phone_fixed', label: 'Festnetztelefon' },
        { value: 'phone_mobile', label: 'Mobiltelefon' },
        { value: 'email', label: 'E-Mail' },
        { value: 'form', label: 'Kontaktformular' },
        { value: 'whatsapp', label: 'WhatsApp' },
        { value: 'facebook', label: 'Facebook' },
        { value: 'instagram', label: 'Instagram' },
        { value: 'linkedin', label: 'LinkedIn' },
        { value: 'social_other', label: 'Weitere Social-Media-Kanäle' },
        { value: 'in_person', label: 'Persönlich im Geschäft' },
        { value: 'fax', label: 'Fax' },
        { value: 'post', label: 'Brief oder Post' },
        { value: 'other', label: 'Sonstige' },
      ],
    },
    {
      id: 'q_inq_who', stage: 'process', processId: 'p_inquiries', type: 'single',
      label: 'Wer beantwortet die meisten Anfragen?',
      purpose: 'scoring',
      options: [
        { value: 'ich', label: 'Ich selbst' },
        { value: 'mitarbeitende', label: 'Mitarbeitende' },
        { value: 'gemeinsam', label: 'Gemeinsam' },
        { value: 'unterschiedlich', label: 'Unterschiedlich' },
        { value: 'extern', label: 'Externer Dienstleister' },
      ],
    },
    {
      id: 'q_inq_speed', stage: 'process', processId: 'p_inquiries', type: 'single',
      label: 'Wie schnell werden Anfragen normalerweise beantwortet?',
      purpose: 'scoring',
      options: [
        { value: 'sofort', label: 'Sofort' },
        { value: 'stunden', label: 'Innerhalb weniger Stunden' },
        { value: 'selber_tag', label: 'Meist am selben Tag' },
        { value: 'naechster_tag', label: 'Oft erst am nächsten Tag' },
        { value: 'unterschiedlich', label: 'Unterschiedlich' },
      ],
    },
    {
      id: 'q_inq_unanswered', stage: 'process', processId: 'p_inquiries', type: 'single',
      label: 'Bleiben Anfragen manchmal unbeantwortet oder gehen im Alltag unter?',
      purpose: 'scoring',
      options: [
        { value: 'nie', label: 'Nie' },
        { value: 'selten', label: 'Selten' },
        { value: 'manchmal', label: 'Manchmal' },
        { value: 'haeufig', label: 'Häufig' },
      ],
    },
    {
      id: 'q_inq_repetitive', stage: 'process', processId: 'p_inquiries', type: 'single',
      label: 'Wiederholen sich viele Fragen Ihrer Kunden?',
      purpose: 'scoring',
      options: [
        { value: 'fast_nie', label: 'Fast nie' },
        { value: 'manchmal', label: 'Manchmal' },
        { value: 'haeufig', label: 'Häufig' },
        { value: 'sehr_haeufig', label: 'Sehr häufig' },
      ],
    },
    {
      id: 'q_inq_phone_unavailable', stage: 'process', processId: 'p_inquiries', type: 'multi',
      condition: includesAny('q_inq_channels', ['phone_fixed', 'phone_mobile']),
      label: 'Was passiert, wenn gerade niemand ans Telefon gehen kann?',
      purpose: 'scoring',
      options: [
        { value: 'mailbox', label: 'Mailbox' },
        { value: 'rueckruf', label: 'Rückruf später' },
        { value: 'mitarbeitende', label: 'Mitarbeitende übernehmen' },
        { value: 'unbeantwortet', label: 'Der Anruf bleibt unbeantwortet' },
        { value: 'erneut', label: 'Der Anrufer versucht es erneut' },
        { value: 'unterschiedlich', label: 'Unterschiedlich' },
      ],
    },
    {
      id: 'q_inq_message_speed', stage: 'process', processId: 'p_inquiries', type: 'single',
      condition: includesAny('q_inq_channels', ['whatsapp', 'facebook', 'instagram', 'linkedin', 'social_other', 'form']),
      label: 'Wie schnell werden diese Nachrichten normalerweise beantwortet?',
      purpose: 'scoring',
      options: [
        { value: 'sofort', label: 'Sofort' },
        { value: 'stunden', label: 'Innerhalb weniger Stunden' },
        { value: 'selber_tag', label: 'Am selben Tag' },
        { value: 'naechster_tag', label: 'Oft erst am nächsten Tag' },
        { value: 'unterschiedlich', label: 'Unterschiedlich' },
      ],
    },

    // ================= Kapitel 3: Termine & Organisation =================
    {
      id: 'q_sched_relevant', stage: 'process', processId: 'p_scheduling', type: 'single',
      label: 'Vereinbaren oder organisieren Sie regelmässig Termine mit Kunden oder Interessenten?',
      purpose: 'scoring',
      options: [
        { value: 'ja_regelmaessig', label: 'Ja, regelmässig' },
        { value: 'gelegentlich', label: 'Gelegentlich' },
        { value: 'nein', label: 'Nein' },
      ],
    },
    {
      id: 'q_sched_how', stage: 'process', processId: 'p_scheduling', type: 'multi',
      condition: cond('q_sched_relevant', 'notEquals', 'nein'),
      label: 'Wie werden Termine heute vereinbart?',
      purpose: 'scoring',
      options: [
        { value: 'phone_fixed', label: 'Festnetztelefon' },
        { value: 'phone_mobile', label: 'Mobiltelefon' },
        { value: 'whatsapp', label: 'WhatsApp' },
        { value: 'email', label: 'E-Mail' },
        { value: 'form', label: 'Kontaktformular' },
        { value: 'online_booking', label: 'Online-Terminbuchung' },
        { value: 'persoenlich', label: 'Persönlich' },
        { value: 'mitarbeitende', label: 'Mitarbeitende vereinbaren Termine' },
        { value: 'sonstige', label: 'Sonstige' },
      ],
    },
    {
      id: 'q_sched_who', stage: 'process', processId: 'p_scheduling', type: 'single',
      condition: cond('q_sched_relevant', 'notEquals', 'nein'),
      label: 'Wer organisiert die meisten Termine?',
      purpose: 'scoring',
      options: [
        { value: 'ich', label: 'Ich selbst' },
        { value: 'mitarbeitende', label: 'Mitarbeitende' },
        { value: 'gemeinsam', label: 'Gemeinsam' },
        { value: 'unterschiedlich', label: 'Unterschiedlich' },
      ],
    },
    {
      id: 'q_sched_missed', stage: 'process', processId: 'p_scheduling', type: 'single',
      condition: cond('q_sched_relevant', 'notEquals', 'nein'),
      label: 'Kommt es vor, dass Termine verschoben oder vergessen werden?',
      purpose: 'scoring',
      options: [
        { value: 'nie', label: 'Nie' },
        { value: 'selten', label: 'Selten' },
        { value: 'manchmal', label: 'Manchmal' },
        { value: 'haeufig', label: 'Häufig' },
      ],
    },
    {
      id: 'q_sched_phone', stage: 'process', processId: 'p_scheduling', type: 'single',
      condition: cond('q_sched_relevant', 'notEquals', 'nein'),
      label: 'Müssen Termine häufig telefonisch abgestimmt werden?',
      purpose: 'scoring',
      options: [
        { value: 'fast_nie', label: 'Fast nie' },
        { value: 'manchmal', label: 'Manchmal' },
        { value: 'haeufig', label: 'Häufig' },
        { value: 'fast_immer', label: 'Fast immer' },
      ],
    },
    {
      id: 'q_sched_reminders', stage: 'process', processId: 'p_scheduling', type: 'single',
      condition: cond('q_sched_relevant', 'notEquals', 'nein'),
      label: 'Erinnern Sie Kunden aktiv an Termine?',
      purpose: 'scoring',
      options: [
        { value: 'immer', label: 'Immer' },
        { value: 'meistens', label: 'Meistens' },
        { value: 'selten', label: 'Selten' },
        { value: 'nie', label: 'Nie' },
        { value: 'nicht_relevant', label: 'Für mein Unternehmen nicht relevant' },
      ],
    },

    // ================= Kapitel 4: Angebote & Aufträge =================
    {
      id: 'q_off_relevant', stage: 'process', processId: 'p_offers', type: 'single',
      label: 'Erstellen Sie für Kunden regelmässig Angebote, Kostenvoranschläge oder vergleichbare Unterlagen?',
      purpose: 'scoring',
      options: [
        { value: 'ja_regelmaessig', label: 'Ja, regelmässig' },
        { value: 'gelegentlich', label: 'Gelegentlich' },
        { value: 'nein', label: 'Nein' },
      ],
    },
    {
      id: 'q_off_who', stage: 'process', processId: 'p_offers', type: 'single',
      condition: cond('q_off_relevant', 'notEquals', 'nein'),
      label: 'Wer erstellt die meisten Angebote oder vergleichbaren Unterlagen?',
      purpose: 'scoring',
      options: [
        { value: 'ich', label: 'Ich selbst' },
        { value: 'mitarbeitende', label: 'Mitarbeitende' },
        { value: 'gemeinsam', label: 'Gemeinsam' },
        { value: 'extern', label: 'Externer Dienstleister' },
        { value: 'nicht_relevant', label: 'Nicht relevant' },
      ],
    },
    {
      id: 'q_off_wait', stage: 'process', processId: 'p_offers', type: 'single',
      condition: cond('q_off_relevant', 'notEquals', 'nein'),
      label: 'Müssen Kunden häufig auf ein Angebot oder eine Rückmeldung warten?',
      purpose: 'scoring',
      options: [
        { value: 'nie', label: 'Nie' },
        { value: 'selten', label: 'Selten' },
        { value: 'manchmal', label: 'Manchmal' },
        { value: 'haeufig', label: 'Häufig' },
        { value: 'nicht_relevant', label: 'Nicht relevant' },
      ],
    },
    {
      id: 'q_off_followup', stage: 'process', processId: 'p_offers', type: 'single',
      condition: cond('q_off_relevant', 'notEquals', 'nein'),
      label: 'Werden Interessenten nach einem Angebot aktiv nachkontaktiert?',
      purpose: 'scoring',
      options: [
        { value: 'immer', label: 'Immer' },
        { value: 'haeufig', label: 'Häufig' },
        { value: 'selten', label: 'Selten' },
        { value: 'nie', label: 'Nie' },
        { value: 'nicht_relevant', label: 'Nicht relevant' },
      ],
    },
    {
      id: 'q_off_repetitive', stage: 'process', processId: 'p_offers', type: 'single',
      condition: cond('q_off_relevant', 'notEquals', 'nein'),
      label: 'Wiederholen sich viele Angebote oder Unterlagen in ähnlicher Form?',
      purpose: 'scoring',
      options: [
        { value: 'fast_nie', label: 'Fast nie' },
        { value: 'manchmal', label: 'Manchmal' },
        { value: 'haeufig', label: 'Häufig' },
        { value: 'sehr_haeufig', label: 'Sehr häufig' },
        { value: 'nicht_relevant', label: 'Nicht relevant' },
      ],
    },

    // ================= Kapitel 5: Verwaltung & Büro =================
    {
      id: 'q_adm_tasks', stage: 'process', processId: 'p_admin', type: 'multi',
      label: 'Welche dieser Aufgaben erledigen Sie regelmässig selbst?',
      purpose: 'scoring',
      options: [
        { value: 'emails', label: 'E-Mails bearbeiten' },
        { value: 'rechnungen', label: 'Rechnungen schreiben' },
        { value: 'buchhaltung', label: 'Buchhaltung vorbereiten' },
        { value: 'angebote', label: 'Angebote schreiben' },
        { value: 'bestellung', label: 'Material oder Waren bestellen' },
        { value: 'dokumente', label: 'Dokumente verwalten' },
        { value: 'kundendaten', label: 'Kundenakten oder Kundendaten pflegen' },
        { value: 'personal', label: 'Personal organisieren' },
        { value: 'termine', label: 'Termine koordinieren' },
        { value: 'social', label: 'Social Media pflegen' },
        { value: 'rueckfragen', label: 'Rückfragen beantworten' },
        { value: 'vertraege', label: 'Verträge oder Unterlagen vorbereiten' },
        { value: 'keine', label: 'Keine davon' },
        { value: 'sonstige', label: 'Sonstige' },
      ],
    },
    {
      id: 'q_adm_interrupt', stage: 'process', processId: 'p_admin', type: 'single',
      label: 'Wie häufig unterbrechen Sie diese Aufgaben bei Ihrer eigentlichen Arbeit?',
      purpose: 'scoring',
      options: [
        { value: 'fast_nie', label: 'Fast nie' },
        { value: 'manchmal', label: 'Manchmal' },
        { value: 'mehrmals_taeglich', label: 'Mehrmals täglich' },
        { value: 'sehr_haeufig', label: 'Sehr häufig' },
      ],
    },
    {
      id: 'q_adm_afterhours', stage: 'process', processId: 'p_admin', type: 'single',
      label: 'Wie häufig erledigen Sie Büroaufgaben noch nach Feierabend oder am Wochenende?',
      purpose: 'scoring',
      options: [
        { value: 'nie', label: 'Nie' },
        { value: 'selten', label: 'Selten' },
        { value: 'manchmal', label: 'Manchmal' },
        { value: 'haeufig', label: 'Häufig' },
      ],
    },
    {
      id: 'q_adm_repetitive', stage: 'process', processId: 'p_admin', type: 'single',
      label: 'Haben Sie das Gefühl, dass sich viele dieser Aufgaben ständig wiederholen?',
      purpose: 'scoring',
      options: [
        { value: 'nein', label: 'Nein' },
        { value: 'teilweise', label: 'Teilweise' },
        { value: 'ja', label: 'Ja' },
      ],
    },
    {
      id: 'q_adm_neglected', stage: 'process', processId: 'p_admin', type: 'single',
      label: 'Kommen wichtige Büroaufgaben manchmal zu kurz, weil das Tagesgeschäft vorgeht?',
      purpose: 'scoring',
      options: [
        { value: 'nie', label: 'Nie' },
        { value: 'selten', label: 'Selten' },
        { value: 'manchmal', label: 'Manchmal' },
        { value: 'haeufig', label: 'Häufig' },
      ],
    },

    // ================= Kapitel 6: Sie als Unternehmer =================
    {
      id: 'q_own_reason', stage: 'process', processId: 'p_owner', type: 'single',
      label: 'Was war damals Ihr wichtigster Grund für die Selbstständigkeit?',
      purpose: 'personalization',
      options: [
        { value: 'freiheit', label: 'Mehr Freiheit' },
        { value: 'eigener_chef', label: 'Mein eigener Chef sein' },
        { value: 'familie', label: 'Mehr Zeit für meine Familie' },
        { value: 'verdienen', label: 'Mehr verdienen' },
        { value: 'leidenschaft', label: 'Meine Leidenschaft zum Beruf machen' },
        { value: 'aufbauen', label: 'Etwas Eigenes aufbauen' },
        { value: 'entscheiden', label: 'Selbst entscheiden können' },
        { value: 'sinn', label: 'Etwas Sinnvolles schaffen' },
        { value: 'chance', label: 'Eine berufliche Chance nutzen' },
      ],
    },
    {
      id: 'q_own_runs_without', stage: 'process', processId: 'p_owner', type: 'single',
      label: 'Kann Ihr Unternehmen mehrere Tage ohne Sie weiterlaufen, ohne dass wichtige Aufgaben liegen bleiben?',
      purpose: 'scoring',
      options: [
        { value: 'ja', label: 'Ja' },
        { value: 'groesstenteils', label: 'Grösstenteils' },
        { value: 'teilweise', label: 'Nur teilweise' },
        { value: 'eher_nicht', label: 'Eher nicht' },
        { value: 'nein', label: 'Nein' },
      ],
    },
    {
      id: 'q_own_afterhours', stage: 'process', processId: 'p_owner', type: 'single',
      label: 'Wie häufig arbeiten Sie ausserhalb Ihrer regulären Arbeitszeit?',
      purpose: 'scoring',
      options: [
        { value: 'fast_nie', label: 'Fast nie' },
        { value: 'manchmal', label: 'Manchmal' },
        { value: 'mehrmals_woche', label: 'Mehrmals pro Woche' },
        { value: 'fast_taeglich', label: 'Fast täglich' },
      ],
    },
    {
      id: 'q_own_dependency', stage: 'process', processId: 'p_owner', type: 'single',
      label: 'Haben Sie das Gefühl, dass Ihr Unternehmen zu stark von Ihnen persönlich abhängt?',
      purpose: 'scoring',
      options: [
        { value: 'nein', label: 'Nein' },
        { value: 'teilweise', label: 'Teilweise' },
        { value: 'ja', label: 'Ja' },
      ],
    },
    {
      id: 'q_own_phone_off', stage: 'process', processId: 'p_owner', type: 'single',
      label: 'Wenn morgen Ihr Handy für einen ganzen Tag ausgeschaltet wäre – würde Ihr Unternehmen trotzdem weitgehend normal weiterlaufen?',
      purpose: 'scoring',
      options: [
        { value: 'ja', label: 'Ja' },
        { value: 'wahrscheinlich', label: 'Wahrscheinlich schon' },
        { value: 'eher_nicht', label: 'Eher nicht' },
        { value: 'nein', label: 'Nein' },
      ],
    },
    {
      id: 'q_own_time_use', stage: 'process', processId: 'p_owner', type: 'single',
      label: 'Wenn Sie mehr Zeit im Unternehmen gewinnen könnten, wofür würden Sie diese am liebsten nutzen?',
      purpose: 'personalization',
      options: [
        { value: 'kunden', label: 'Mehr Zeit für Kunden' },
        { value: 'entwicklung', label: 'Mehr Zeit für Unternehmensentwicklung' },
        { value: 'familie', label: 'Mehr Zeit für meine Familie' },
        { value: 'freizeit', label: 'Mehr Freizeit' },
        { value: 'ideen', label: 'Neue Geschäftsideen umsetzen' },
        { value: 'mitarbeitende', label: 'Mitarbeitende weiterentwickeln' },
        { value: 'mich_selbst', label: 'Mehr Zeit für mich selbst' },
      ],
    },
  ],
};
