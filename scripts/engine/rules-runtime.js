/*
 * Rules runtime.
 *
 * A rule maps a condition to a weighted contribution on one evaluation
 * dimension (e.g. frequency, burden, ownerDependency, repeatability,
 * standardizability, economicLeverage, feasibility).
 *
 * Rule shape (config, see config/rules.js):
 *   {
 *     id: 'r_owner_does_everything',
 *     processId: 'p_example' | undefined,   // optional scope to one process
 *     when: <condition>,
 *     then: { dimension: 'ownerDependency', weight: 2 }
 *   }
 *
 * This runtime contains no business knowledge — it only interprets rule data.
 */

import { evaluateCondition } from './conditions.js';

/**
 * Apply a set of rules to a context and accumulate dimension scores.
 * @param {Array} rules - rule objects
 * @param {object} context - { answers, profile, processId, dimensions }
 * @returns {object} dimension -> accumulated numeric score
 */
export function applyRules(rules, context) {
  const scores = {};

  for (const rule of rules) {
    // Respect optional process scoping.
    if (rule.processId && rule.processId !== context.processId) continue;
    if (!evaluateCondition(rule.when, context)) continue;

    const { dimension, weight } = rule.then || {};
    if (!dimension || typeof weight !== 'number') continue;

    scores[dimension] = (scores[dimension] || 0) + weight;
  }

  return scores;
}
