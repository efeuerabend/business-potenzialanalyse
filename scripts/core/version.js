/*
 * Version registry.
 *
 * Each configuration domain is versioned independently (Decision Engine,
 * Knowledge Base, Rules, Patterns, Questions, Recommendations, Configuration,
 * Scoring). This registry collects the active versions so that any later
 * result/report can record exactly which versions it was produced with.
 *
 * The registry itself holds NO domain knowledge — it only aggregates version
 * strings that the individual config/engine modules declare.
 */

// Version of the engine runtime code (the platform itself), not a config domain.
// 1.1.0: added process activation (activeWhen) and the questionnaire runtime.
// 1.2.0: added overall assessment and the modular recommendation engine.
// 1.2.1: report model carries a consultative opening (passthrough).
// 1.3.0: report model carries modular personalisation (motivation + reason).
// 1.4.0: report model splits notable potentials from quiet areas (threshold).
// 1.5.0: four-block insights + cross-area synthesis ("roter Faden").
// 1.6.0: RC1.1 quality upgrade — pattern text variants selected from a
//   concrete answer (deterministic, not random), and the "roter Faden" is now
//   assembled from each detected pattern's `impact` clause instead of a fixed
//   lookup table of pre-written pattern-pair combinations.
// 1.0.0: Release 1.0.0 — versioning unified at the product level (see
//   CHANGELOG.md). This constant now tracks the product release, not an
//   independent engine changelog; history above is kept for context.
export const ENGINE_VERSION = '1.0.0';

/**
 * Build an immutable snapshot of all active versions.
 * @param {object} parts - map of domain -> semver string
 * @returns {Readonly<object>}
 */
export function buildVersionSnapshot(parts) {
  return Object.freeze({
    engine: ENGINE_VERSION,
    ...parts,
    capturedAt: new Date().toISOString(),
  });
}

/**
 * Human-readable one-line summary, e.g. for the footer or a report header.
 * @param {object} snapshot
 * @returns {string}
 */
export function formatVersionSummary(snapshot) {
  const order = [
    'engine', 'knowledgeBase', 'rules', 'patterns',
    'questions', 'recommendations', 'scoring', 'configuration',
  ];
  return order
    .filter((key) => snapshot[key])
    .map((key) => `${key} v${snapshot[key]}`)
    .join(' · ');
}
