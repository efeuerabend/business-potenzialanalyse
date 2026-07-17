/*
 * Pattern Library — operational patterns (verbindlicher Flow).
 *
 * Product release: 1.0.0 — versioning unified at the product level (see CHANGELOG.md).
 *
 * Patterns combine answers and derived dimension scores into named business
 * patterns. Pure data, interpreted by engine/pattern-runtime.js. Pattern ids
 * match the modular blocks in config/recommendations.js. Patterns describe
 * situations — never a concrete tool or vendor.
 */

const ans = (fact, value) => ({ fact: `answers.${fact}`, op: 'equals', value });
const notAns = (fact, value) => ({ fact: `answers.${fact}`, op: 'notEquals', value });
const inc = (fact, value) => ({ fact: `answers.${fact}`, op: 'includes', value });
const dimGte = (dimension, value) => ({ fact: `dimensions.${dimension}`, op: 'gte', value });

export const patterns = {
  version: '1.0.0',

  patterns: [
    {
      id: 'pat_owner_dependency',
      label: 'Hohe Unternehmerabhängigkeit',
      description: 'Das Unternehmen hängt stark an der Person der Inhaberin oder des Inhabers.',
      when: dimGte('ownerDependency', 6),
      potentialHint: 'high',
    },
    {
      id: 'pat_missing_delegation',
      label: 'Wenig Delegation trotz Team',
      description: 'Obwohl Mitarbeitende vorhanden sind, bleibt vieles an der Inhaberin oder dem Inhaber hängen.',
      when: { all: [notAns('profile_employees', 'solo'), dimGte('ownerDependency', 4)] },
      potentialHint: 'high',
    },
    {
      id: 'pat_delayed_handling',
      label: 'Verzögerte Bearbeitung von Anfragen',
      description: 'Anfragen werden nicht zeitnah beantwortet.',
      when: { any: [ans('q_inq_speed', 'naechster_tag'), ans('q_inq_message_speed', 'naechster_tag'), ans('q_inq_unanswered', 'haeufig')] },
      potentialHint: 'high',
    },
    {
      id: 'pat_lost_inquiries',
      label: 'Verlorene Anfragen und Interessenten',
      description: 'Interessenten oder Anfragen gehen im Alltag verloren.',
      when: { any: [ans('q_inq_unanswered', 'haeufig'), ans('q_inq_unanswered', 'manchmal'), inc('q_inq_phone_unavailable', 'unbeantwortet')] },
      potentialHint: 'high',
    },
    {
      id: 'pat_recurring_communication',
      label: 'Hoher Anteil wiederkehrender Kommunikation',
      description: 'Viele Kundenfragen ähneln sich und treten häufig auf.',
      when: { any: [ans('q_inq_repetitive', 'haeufig'), ans('q_inq_repetitive', 'sehr_haeufig')] },
      potentialHint: 'medium',
    },
    {
      id: 'pat_manual_scheduling',
      label: 'Manueller Terminaufwand',
      description: 'Die Terminabstimmung ist aufwendig und manuell.',
      when: { any: [ans('q_sched_phone', 'haeufig'), ans('q_sched_phone', 'fast_immer'), ans('q_sched_missed', 'haeufig')] },
      potentialHint: 'medium',
    },
    {
      id: 'pat_recurring_offers',
      label: 'Wiederkehrender Angebotsaufwand',
      description: 'Ähnliche Angebote werden immer wieder neu erstellt.',
      // q_off_repetitive is only answered when the offers chapter is relevant,
      // so no extra relevance guard is needed here.
      when: { any: [ans('q_off_repetitive', 'haeufig'), ans('q_off_repetitive', 'sehr_haeufig')] },
      potentialHint: 'medium',
    },
    {
      id: 'pat_admin_overload',
      label: 'Administrative Überlastung',
      description: 'Verwaltung und Routinearbeit binden viel Zeit.',
      when: {
        any: [
          ans('q_adm_afterhours', 'haeufig'),
          ans('q_adm_interrupt', 'sehr_haeufig'),
          ans('q_adm_interrupt', 'mehrmals_taeglich'),
          ans('q_adm_neglected', 'haeufig'),
        ],
      },
      potentialHint: 'medium',
    },
    {
      id: 'pat_growth_bottleneck',
      label: 'Unregelmässige oder fehlende Kundengewinnung',
      description: 'Neue Kunden kommen unregelmässig oder es fehlen spürbar Anfragen.',
      when: {
        any: [
          ans('q_leads_missing', 'ja'),
          ans('q_leads_regularity', 'kaum_planbar'),
          ans('q_leads_regularity', 'eher_unregelmaessig'),
        ],
      },
      potentialHint: 'high',
    },
  ],
};
