/*
 * Scoring configuration — evaluation dimensions, weightings, potential levels.
 *
 * Product release: 1.0.0 — versioning unified at the product level (see CHANGELOG.md).
 *
 * Seven dimensions per fachkonzept.md. Potential levels are transparent
 * categories — NO money amounts, ROI values or amortisation times.
 *
 * The final process score is a weighted sum of these seven dimensions — this
 * is already a multi-factor priority, not a single flat number. Mapping to
 * the RC1.1 review's named factors: Häufigkeit=frequency, Zeitaufwand=burden,
 * Unternehmerabhängigkeit=ownerDependency, Automatisierbarkeit=repeatability+
 * standardizability+feasibility, wirtschaftlicher Nutzen=economicLeverage.
 * "Erwartbarer ROI" is the combination of economicLeverage (value if solved)
 * and feasibility (how realistically it can be solved) — feasibility's weight
 * was raised from 1.0 to 1.2 so genuinely realistic quick wins outrank a
 * theoretical lever that is hard to actually implement.
 *
 * Thresholds are calibrated against config/rules.js weights so that realistic
 * answer sets reach meaningful levels. Level bounds use .99 upper edges so
 * every possible (fractional) score maps to a level — no gap can ever fall
 * through to the "unknown" fallback in engine.js.
 */

export const scoring = {
  version: '1.0.0',

  dimensions: [
    'frequency',          // Häufigkeit
    'burden',             // Belastung / Aufwand
    'ownerDependency',    // Unternehmerabhängigkeit
    'repeatability',      // Wiederholbarkeit
    'standardizability',  // Standardisierbarkeit
    'economicLeverage',   // möglicher wirtschaftlicher Hebel
    'feasibility',        // voraussichtliche Umsetzbarkeit (Teil des ROI)
  ],

  weights: {
    frequency: 1,
    burden: 1,
    ownerDependency: 1.5,
    repeatability: 1,
    standardizability: 1,
    economicLeverage: 1.5,
    feasibility: 1.2,
  },

  // Transparent potential categories. Thresholds calibrated to the rule weights.
  levels: [
    { id: 'low', label: 'geringes Potenzial', min: 0, max: 4.99 },
    { id: 'medium', label: 'mittleres Potenzial', min: 5, max: 9.99 },
    { id: 'high', label: 'hohes Potenzial', min: 10, max: 15.99 },
    { id: 'very_high', label: 'sehr hohes Potenzial', min: 16, max: Infinity },
  ],
};
