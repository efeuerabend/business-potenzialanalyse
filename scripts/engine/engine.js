/*
 * FokusOne Decision Engine — orchestrator.
 *
 * This is the reusable product core. It contains NO business knowledge:
 * every process, question, rule, pattern, weighting, potential level and
 * recommendation text lives in config/. The engine only reads that data and
 * runs a fixed pipeline:
 *
 *   process -> relevant answers -> rules -> dimension scores
 *           -> patterns -> potential level -> prioritisation -> recommendations
 *
 * Because the pipeline is generic, a completely different analysis can be built
 * by swapping the configuration alone, without touching this file.
 *
 * Sprint 1 delivers the full mechanism; the Business-Potenzialanalyse content
 * (real processes, questions, rules) is added in Sprint 2/3 via config only.
 */

import { applyRules } from './rules-runtime.js';
import { detectPatterns } from './pattern-runtime.js';
import { evaluateCondition } from './conditions.js';
import { buildVersionSnapshot } from '../core/version.js';

/** Map an aggregated numeric score to a potential level from scoring config. */
function mapLevel(score, levels) {
  const match = levels.find(
    (lvl) => score >= (lvl.min ?? -Infinity) && score <= (lvl.max ?? Infinity),
  );
  return match ? { id: match.id, label: match.label } : { id: 'unknown', label: 'Im Vergleich zu den anderen Bereichen derzeit nachrangig' };
}

/** Aggregate per-dimension scores into a single weighted process score. */
function aggregateScore(dimensionScores, weights) {
  return Object.entries(dimensionScores).reduce((sum, [dim, value]) => {
    const weight = weights?.[dim] ?? 1;
    return sum + value * weight;
  }, 0);
}

/**
 * Run the full analysis.
 * @param {object} state  - { profile, answers }
 * @param {object} config - { knowledgeBase, rules, patterns, recommendations, scoring, appConfig }
 * @returns {object} result
 */
export function runAnalysis(state, config) {
  const { knowledgeBase, rules, patterns, recommendations, scoring, appConfig } = config;
  const answers = state.answers || {};
  const profile = state.profile || {};

  const processes = knowledgeBase?.processes || [];
  const weights = scoring?.weights || {};
  const levels = scoring?.levels || [];

  // 1. Score each process from its rules. A process is only "active" (relevant)
  //    when its config-declared `activeWhen` condition holds; processes without
  //    `activeWhen` are always active. Inactive processes are still scored but
  //    flagged so downstream (prioritisation, report) can ignore them.
  const processScores = processes.map((proc) => {
    const context = { answers, profile, processId: proc.id, dimensions: {} };
    const dimensions = applyRules(rules?.rules || [], context);
    const score = aggregateScore(dimensions, weights);
    const active = evaluateCondition(proc.activeWhen, { answers, profile });
    return {
      processId: proc.id,
      label: proc.label,
      active,
      dimensions,
      score,
      level: mapLevel(score, levels),
    };
  });

  // 2. Detect global patterns. Dimensions are exposed so patterns can react to
  //    both raw answers and derived scores.
  const aggregatedDimensions = processScores.reduce((acc, ps) => {
    for (const [dim, val] of Object.entries(ps.dimensions)) {
      acc[dim] = (acc[dim] || 0) + val;
    }
    return acc;
  }, {});
  const detectedPatterns = detectPatterns(patterns?.patterns || [], {
    answers,
    profile,
    dimensions: aggregatedDimensions,
  });

  // 3. Prioritise ACTIVE processes by score (descending).
  const prioritized = processScores
    .filter((ps) => ps.active)
    .sort((a, b) => b.score - a.score)
    .map((ps) => ps.processId);

  // 4. Overall assessment: the highest potential level reached among active
  //    processes represents the biggest opportunity. Top areas = prioritised
  //    active processes. (Mechanism only; the wording lives in config.)
  const levelRank = new Map(levels.map((lvl, i) => [lvl.id, i]));
  const activeScores = processScores.filter((ps) => ps.active);
  let overall = {
    level: { id: levels[0]?.id || 'low', label: levels[0]?.label || '' },
    topProcessIds: prioritized.slice(0, 3),
  };
  if (activeScores.length) {
    const top = activeScores.reduce((a, b) =>
      ((levelRank.get(b.level.id) ?? 0) > (levelRank.get(a.level.id) ?? 0) ? b : a));
    overall = { level: top.level, topProcessIds: prioritized.slice(0, 3) };
  }

  // 5. Version snapshot for reproducibility of every result/report.
  const versions = buildVersionSnapshot({
    knowledgeBase: knowledgeBase?.version,
    rules: rules?.version,
    patterns: patterns?.version,
    questions: config.questions?.version,
    recommendations: recommendations?.version,
    scoring: scoring?.version,
    configuration: appConfig?.version,
  });

  return {
    generatedAt: new Date().toISOString(),
    versions,
    processScores,
    detectedPatterns,
    prioritized,
    overall,
  };
}
