/*
 * Rules — evaluation rulebook (verbindlicher Flow).
 *
 * Product release: 1.0.0 — versioning unified at the product level (see CHANGELOG.md).
 * Kept for context: the RC1.1 quality review closed two calibration gaps —
 *   (a) q_adm_tasks (which admin tasks the owner personally handles) was
 *       collected but never scored, so p_admin systematically undervalued
 *       businesses where the owner does most of their own administration —
 *       exactly the case that should score highest.
 *   (b) "shared" / "mostly-yes" answers (q_*_who = 'gemeinsam',
 *       q_own_runs_without = 'groesstenteils') fell through to zero instead of
 *       a graded partial contribution, flattening otherwise distinct answers
 *       into the same score.
 *
 * Each rule links a condition to a weighted contribution on one scoring
 * dimension, scoped to a process. Pure data, interpreted by
 * engine/rules-runtime.js. Calibrated together with config/scoring.js.
 *
 * Dimensions: frequency, burden, ownerDependency, repeatability,
 * standardizability, economicLeverage, feasibility.
 */

const eq = (fact, value) => ({ fact: `answers.${fact}`, op: 'equals', value });
const inc = (fact, value) => ({ fact: `answers.${fact}`, op: 'includes', value });

export const rules = {
  version: '1.0.0',

  rules: [
    // --- Kapitel 1: Neue Kunden (p_leads) ---
    // Planbarkeit / mögliches Wachstumspotenzial (nicht die Kanalanzahl).
    { id: 'r_leads_reg_var', processId: 'p_leads', when: eq('q_leads_regularity', 'unterschiedlich'), then: { dimension: 'economicLeverage', weight: 1 } },
    { id: 'r_leads_reg_irr', processId: 'p_leads', when: eq('q_leads_regularity', 'eher_unregelmaessig'), then: { dimension: 'economicLeverage', weight: 2 } },
    { id: 'r_leads_reg_unplan', processId: 'p_leads', when: eq('q_leads_regularity', 'kaum_planbar'), then: { dimension: 'economicLeverage', weight: 3 } },
    { id: 'r_leads_missing_part', processId: 'p_leads', when: eq('q_leads_missing', 'teilweise'), then: { dimension: 'economicLeverage', weight: 1 } },
    { id: 'r_leads_missing_yes', processId: 'p_leads', when: eq('q_leads_missing', 'ja'), then: { dimension: 'economicLeverage', weight: 3 } },
    { id: 'r_leads_web_none', processId: 'p_leads', when: eq('q_leads_website_inquiries', 'nein'), then: { dimension: 'economicLeverage', weight: 1 } },
    { id: 'r_leads_paid_owner', processId: 'p_leads', when: eq('q_leads_paid_who', 'ich'), then: { dimension: 'ownerDependency', weight: 2 } },

    // --- Kapitel 2: Kundenanfragen (p_inquiries) ---
    { id: 'r_inq_owner', processId: 'p_inquiries', when: eq('q_inq_who', 'ich'), then: { dimension: 'ownerDependency', weight: 2 } },
    // "Gemeinsam" ist echte Teilverantwortung — nicht dasselbe wie vollständig
    // delegiert (mitarbeitende/extern/unterschiedlich), aber auch nicht "ich".
    { id: 'r_inq_owner_shared', processId: 'p_inquiries', when: eq('q_inq_who', 'gemeinsam'), then: { dimension: 'ownerDependency', weight: 1 } },
    { id: 'r_inq_slow_lev', processId: 'p_inquiries', when: eq('q_inq_speed', 'naechster_tag'), then: { dimension: 'economicLeverage', weight: 2 } },
    { id: 'r_inq_slow_burden', processId: 'p_inquiries', when: eq('q_inq_speed', 'naechster_tag'), then: { dimension: 'burden', weight: 1 } },
    { id: 'r_inq_var_lev', processId: 'p_inquiries', when: eq('q_inq_speed', 'unterschiedlich'), then: { dimension: 'economicLeverage', weight: 1 } },
    { id: 'r_inq_msg_slow', processId: 'p_inquiries', when: eq('q_inq_message_speed', 'naechster_tag'), then: { dimension: 'economicLeverage', weight: 1 } },
    { id: 'r_inq_unans_some', processId: 'p_inquiries', when: eq('q_inq_unanswered', 'manchmal'), then: { dimension: 'economicLeverage', weight: 2 } },
    { id: 'r_inq_unans_often_lev', processId: 'p_inquiries', when: eq('q_inq_unanswered', 'haeufig'), then: { dimension: 'economicLeverage', weight: 3 } },
    { id: 'r_inq_unans_often_burden', processId: 'p_inquiries', when: eq('q_inq_unanswered', 'haeufig'), then: { dimension: 'burden', weight: 1 } },
    { id: 'r_inq_rep_high_rep', processId: 'p_inquiries', when: eq('q_inq_repetitive', 'haeufig'), then: { dimension: 'repeatability', weight: 2 } },
    { id: 'r_inq_rep_high_std', processId: 'p_inquiries', when: eq('q_inq_repetitive', 'haeufig'), then: { dimension: 'standardizability', weight: 2 } },
    { id: 'r_inq_rep_high_feas', processId: 'p_inquiries', when: eq('q_inq_repetitive', 'haeufig'), then: { dimension: 'feasibility', weight: 2 } },
    { id: 'r_inq_rep_vhigh_rep', processId: 'p_inquiries', when: eq('q_inq_repetitive', 'sehr_haeufig'), then: { dimension: 'repeatability', weight: 3 } },
    { id: 'r_inq_rep_vhigh_std', processId: 'p_inquiries', when: eq('q_inq_repetitive', 'sehr_haeufig'), then: { dimension: 'standardizability', weight: 2 } },
    { id: 'r_inq_rep_vhigh_feas', processId: 'p_inquiries', when: eq('q_inq_repetitive', 'sehr_haeufig'), then: { dimension: 'feasibility', weight: 2 } },
    { id: 'r_inq_phone_lost', processId: 'p_inquiries', when: inc('q_inq_phone_unavailable', 'unbeantwortet'), then: { dimension: 'economicLeverage', weight: 2 } },

    // --- Kapitel 3: Termine & Organisation (p_scheduling) ---
    { id: 'r_sched_owner', processId: 'p_scheduling', when: eq('q_sched_who', 'ich'), then: { dimension: 'ownerDependency', weight: 2 } },
    { id: 'r_sched_owner_shared', processId: 'p_scheduling', when: eq('q_sched_who', 'gemeinsam'), then: { dimension: 'ownerDependency', weight: 1 } },
    { id: 'r_sched_missed_some', processId: 'p_scheduling', when: eq('q_sched_missed', 'manchmal'), then: { dimension: 'burden', weight: 1 } },
    { id: 'r_sched_missed_often_burden', processId: 'p_scheduling', when: eq('q_sched_missed', 'haeufig'), then: { dimension: 'burden', weight: 2 } },
    { id: 'r_sched_missed_often_lev', processId: 'p_scheduling', when: eq('q_sched_missed', 'haeufig'), then: { dimension: 'economicLeverage', weight: 1 } },
    { id: 'r_sched_phone_high_burden', processId: 'p_scheduling', when: eq('q_sched_phone', 'haeufig'), then: { dimension: 'burden', weight: 1 } },
    { id: 'r_sched_phone_high_std', processId: 'p_scheduling', when: eq('q_sched_phone', 'haeufig'), then: { dimension: 'standardizability', weight: 1 } },
    { id: 'r_sched_phone_high_feas', processId: 'p_scheduling', when: eq('q_sched_phone', 'haeufig'), then: { dimension: 'feasibility', weight: 1 } },
    { id: 'r_sched_phone_always_burden', processId: 'p_scheduling', when: eq('q_sched_phone', 'fast_immer'), then: { dimension: 'burden', weight: 2 } },
    { id: 'r_sched_phone_always_std', processId: 'p_scheduling', when: eq('q_sched_phone', 'fast_immer'), then: { dimension: 'standardizability', weight: 2 } },
    { id: 'r_sched_phone_always_feas', processId: 'p_scheduling', when: eq('q_sched_phone', 'fast_immer'), then: { dimension: 'feasibility', weight: 2 } },
    // "Nie" ist ein stärkeres Signal als "selten" — bisher identisch gewichtet.
    { id: 'r_sched_rem_never', processId: 'p_scheduling', when: eq('q_sched_reminders', 'nie'), then: { dimension: 'economicLeverage', weight: 2 } },
    { id: 'r_sched_rem_rare', processId: 'p_scheduling', when: eq('q_sched_reminders', 'selten'), then: { dimension: 'economicLeverage', weight: 1 } },

    // --- Kapitel 4: Angebote & Aufträge (p_offers) ---
    { id: 'r_off_owner', processId: 'p_offers', when: eq('q_off_who', 'ich'), then: { dimension: 'ownerDependency', weight: 2 } },
    { id: 'r_off_owner_shared', processId: 'p_offers', when: eq('q_off_who', 'gemeinsam'), then: { dimension: 'ownerDependency', weight: 1 } },
    { id: 'r_off_wait_some', processId: 'p_offers', when: eq('q_off_wait', 'manchmal'), then: { dimension: 'economicLeverage', weight: 1 } },
    { id: 'r_off_wait_often_lev', processId: 'p_offers', when: eq('q_off_wait', 'haeufig'), then: { dimension: 'economicLeverage', weight: 2 } },
    { id: 'r_off_wait_often_burden', processId: 'p_offers', when: eq('q_off_wait', 'haeufig'), then: { dimension: 'burden', weight: 1 } },
    { id: 'r_off_follow_never', processId: 'p_offers', when: eq('q_off_followup', 'nie'), then: { dimension: 'economicLeverage', weight: 2 } },
    { id: 'r_off_follow_rare', processId: 'p_offers', when: eq('q_off_followup', 'selten'), then: { dimension: 'economicLeverage', weight: 1 } },
    { id: 'r_off_rep_high_rep', processId: 'p_offers', when: eq('q_off_repetitive', 'haeufig'), then: { dimension: 'repeatability', weight: 2 } },
    { id: 'r_off_rep_high_std', processId: 'p_offers', when: eq('q_off_repetitive', 'haeufig'), then: { dimension: 'standardizability', weight: 2 } },
    { id: 'r_off_rep_high_feas', processId: 'p_offers', when: eq('q_off_repetitive', 'haeufig'), then: { dimension: 'feasibility', weight: 2 } },
    { id: 'r_off_rep_vhigh_rep', processId: 'p_offers', when: eq('q_off_repetitive', 'sehr_haeufig'), then: { dimension: 'repeatability', weight: 3 } },
    { id: 'r_off_rep_vhigh_std', processId: 'p_offers', when: eq('q_off_repetitive', 'sehr_haeufig'), then: { dimension: 'standardizability', weight: 2 } },
    { id: 'r_off_rep_vhigh_feas', processId: 'p_offers', when: eq('q_off_repetitive', 'sehr_haeufig'), then: { dimension: 'feasibility', weight: 2 } },
    { id: 'r_off_freq_regular', processId: 'p_offers', when: eq('q_off_relevant', 'ja_regelmaessig'), then: { dimension: 'frequency', weight: 2 } },
    { id: 'r_off_freq_occasional', processId: 'p_offers', when: eq('q_off_relevant', 'gelegentlich'), then: { dimension: 'frequency', weight: 1 } },

    // --- Kapitel 5: Verwaltung & Büro (p_admin) ---
    // Wer die Aufgabe selbst erledigt, ist von ihr abhängig — analog zu den
    // "wer macht das" Regeln in jedem anderen Kapitel (r_*_owner). Zusätzlich
    // erhält jede Aufgabe einen realistischen Automatisierungs-/Werthinweis:
    // klassische Verwaltungsarbeit (Rechnungen, Termine, Angebote, Buchhaltung,
    // E-Mails, Rückfragen) ist wirtschaftlich relevant und gut standardisierbar;
    // Aufgaben mit hohem Beurteilungsanteil (Personal, Social Media) bewusst
    // nicht als "leicht automatisierbar" bewertet.
    { id: 'r_adm_task_emails_dep', processId: 'p_admin', when: inc('q_adm_tasks', 'emails'), then: { dimension: 'ownerDependency', weight: 0.5 } },
    { id: 'r_adm_task_emails_std', processId: 'p_admin', when: inc('q_adm_tasks', 'emails'), then: { dimension: 'standardizability', weight: 1 } },
    { id: 'r_adm_task_rechnungen_dep', processId: 'p_admin', when: inc('q_adm_tasks', 'rechnungen'), then: { dimension: 'ownerDependency', weight: 0.5 } },
    { id: 'r_adm_task_rechnungen_lev', processId: 'p_admin', when: inc('q_adm_tasks', 'rechnungen'), then: { dimension: 'economicLeverage', weight: 1 } },
    { id: 'r_adm_task_buchhaltung_dep', processId: 'p_admin', when: inc('q_adm_tasks', 'buchhaltung'), then: { dimension: 'ownerDependency', weight: 0.5 } },
    { id: 'r_adm_task_buchhaltung_lev', processId: 'p_admin', when: inc('q_adm_tasks', 'buchhaltung'), then: { dimension: 'economicLeverage', weight: 1 } },
    { id: 'r_adm_task_angebote_dep', processId: 'p_admin', when: inc('q_adm_tasks', 'angebote'), then: { dimension: 'ownerDependency', weight: 0.5 } },
    { id: 'r_adm_task_angebote_lev', processId: 'p_admin', when: inc('q_adm_tasks', 'angebote'), then: { dimension: 'economicLeverage', weight: 1 } },
    { id: 'r_adm_task_bestellung_dep', processId: 'p_admin', when: inc('q_adm_tasks', 'bestellung'), then: { dimension: 'ownerDependency', weight: 0.5 } },
    { id: 'r_adm_task_bestellung_std', processId: 'p_admin', when: inc('q_adm_tasks', 'bestellung'), then: { dimension: 'standardizability', weight: 1 } },
    { id: 'r_adm_task_dokumente_dep', processId: 'p_admin', when: inc('q_adm_tasks', 'dokumente'), then: { dimension: 'ownerDependency', weight: 0.5 } },
    { id: 'r_adm_task_dokumente_std', processId: 'p_admin', when: inc('q_adm_tasks', 'dokumente'), then: { dimension: 'standardizability', weight: 1 } },
    { id: 'r_adm_task_kundendaten_dep', processId: 'p_admin', when: inc('q_adm_tasks', 'kundendaten'), then: { dimension: 'ownerDependency', weight: 0.5 } },
    { id: 'r_adm_task_kundendaten_std', processId: 'p_admin', when: inc('q_adm_tasks', 'kundendaten'), then: { dimension: 'standardizability', weight: 1 } },
    { id: 'r_adm_task_personal_dep', processId: 'p_admin', when: inc('q_adm_tasks', 'personal'), then: { dimension: 'ownerDependency', weight: 0.5 } },
    { id: 'r_adm_task_termine_dep', processId: 'p_admin', when: inc('q_adm_tasks', 'termine'), then: { dimension: 'ownerDependency', weight: 0.5 } },
    { id: 'r_adm_task_termine_lev', processId: 'p_admin', when: inc('q_adm_tasks', 'termine'), then: { dimension: 'economicLeverage', weight: 1 } },
    { id: 'r_adm_task_social_dep', processId: 'p_admin', when: inc('q_adm_tasks', 'social'), then: { dimension: 'ownerDependency', weight: 0.5 } },
    { id: 'r_adm_task_rueckfragen_dep', processId: 'p_admin', when: inc('q_adm_tasks', 'rueckfragen'), then: { dimension: 'ownerDependency', weight: 0.5 } },
    { id: 'r_adm_task_rueckfragen_lev', processId: 'p_admin', when: inc('q_adm_tasks', 'rueckfragen'), then: { dimension: 'economicLeverage', weight: 1 } },
    { id: 'r_adm_task_vertraege_dep', processId: 'p_admin', when: inc('q_adm_tasks', 'vertraege'), then: { dimension: 'ownerDependency', weight: 0.5 } },
    { id: 'r_adm_task_vertraege_std', processId: 'p_admin', when: inc('q_adm_tasks', 'vertraege'), then: { dimension: 'standardizability', weight: 1 } },

    { id: 'r_adm_int_daily_burden', processId: 'p_admin', when: eq('q_adm_interrupt', 'mehrmals_taeglich'), then: { dimension: 'burden', weight: 2 } },
    { id: 'r_adm_int_daily_freq', processId: 'p_admin', when: eq('q_adm_interrupt', 'mehrmals_taeglich'), then: { dimension: 'frequency', weight: 1 } },
    { id: 'r_adm_int_vhigh_burden', processId: 'p_admin', when: eq('q_adm_interrupt', 'sehr_haeufig'), then: { dimension: 'burden', weight: 3 } },
    { id: 'r_adm_int_vhigh_freq', processId: 'p_admin', when: eq('q_adm_interrupt', 'sehr_haeufig'), then: { dimension: 'frequency', weight: 2 } },
    { id: 'r_adm_after_some', processId: 'p_admin', when: eq('q_adm_afterhours', 'manchmal'), then: { dimension: 'burden', weight: 1 } },
    { id: 'r_adm_after_often_burden', processId: 'p_admin', when: eq('q_adm_afterhours', 'haeufig'), then: { dimension: 'burden', weight: 2 } },
    { id: 'r_adm_after_often_owner', processId: 'p_admin', when: eq('q_adm_afterhours', 'haeufig'), then: { dimension: 'ownerDependency', weight: 1 } },
    { id: 'r_adm_rep_part', processId: 'p_admin', when: eq('q_adm_repetitive', 'teilweise'), then: { dimension: 'repeatability', weight: 1 } },
    { id: 'r_adm_rep_yes_rep', processId: 'p_admin', when: eq('q_adm_repetitive', 'ja'), then: { dimension: 'repeatability', weight: 2 } },
    { id: 'r_adm_rep_yes_std', processId: 'p_admin', when: eq('q_adm_repetitive', 'ja'), then: { dimension: 'standardizability', weight: 2 } },
    { id: 'r_adm_rep_yes_feas', processId: 'p_admin', when: eq('q_adm_repetitive', 'ja'), then: { dimension: 'feasibility', weight: 2 } },
    { id: 'r_adm_neg_some', processId: 'p_admin', when: eq('q_adm_neglected', 'manchmal'), then: { dimension: 'economicLeverage', weight: 1 } },
    { id: 'r_adm_neg_often', processId: 'p_admin', when: eq('q_adm_neglected', 'haeufig'), then: { dimension: 'economicLeverage', weight: 2 } },

    // --- Kapitel 6: Sie als Unternehmer (p_owner) ---
    { id: 'r_own_role_operativ', processId: 'p_owner', when: eq('profile_role', 'operativ'), then: { dimension: 'ownerDependency', weight: 1 } },
    // "Grösstenteils" lag bisher auf demselben Nullpunkt wie "ja" — obwohl es
    // spürbar mehr Abhängigkeit bedeutet als ein uneingeschränktes "Ja".
    { id: 'r_own_runs_mostly', processId: 'p_owner', when: eq('q_own_runs_without', 'groesstenteils'), then: { dimension: 'ownerDependency', weight: 0.5 } },
    { id: 'r_own_runs_part', processId: 'p_owner', when: eq('q_own_runs_without', 'teilweise'), then: { dimension: 'ownerDependency', weight: 1 } },
    { id: 'r_own_runs_barely', processId: 'p_owner', when: eq('q_own_runs_without', 'eher_nicht'), then: { dimension: 'ownerDependency', weight: 2 } },
    { id: 'r_own_runs_no', processId: 'p_owner', when: eq('q_own_runs_without', 'nein'), then: { dimension: 'ownerDependency', weight: 3 } },
    { id: 'r_own_after_week', processId: 'p_owner', when: eq('q_own_afterhours', 'mehrmals_woche'), then: { dimension: 'burden', weight: 1 } },
    { id: 'r_own_after_daily', processId: 'p_owner', when: eq('q_own_afterhours', 'fast_taeglich'), then: { dimension: 'burden', weight: 2 } },
    { id: 'r_own_dep_part', processId: 'p_owner', when: eq('q_own_dependency', 'teilweise'), then: { dimension: 'ownerDependency', weight: 1 } },
    { id: 'r_own_dep_yes', processId: 'p_owner', when: eq('q_own_dependency', 'ja'), then: { dimension: 'ownerDependency', weight: 3 } },
    { id: 'r_own_phone_barely', processId: 'p_owner', when: eq('q_own_phone_off', 'eher_nicht'), then: { dimension: 'ownerDependency', weight: 2 } },
    { id: 'r_own_phone_no', processId: 'p_owner', when: eq('q_own_phone_off', 'nein'), then: { dimension: 'ownerDependency', weight: 3 } },
  ],
};
