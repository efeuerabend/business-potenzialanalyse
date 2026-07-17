/*
 * Pattern runtime.
 *
 * Patterns turn combinations of answers and derived dimension scores into
 * named operational patterns (e.g. "high owner dependency", "delayed handling
 * of leads"). A single answer is never a finished recommendation on its own —
 * patterns are what make the analysis more than a sum of individual answers.
 *
 * Pattern shape (config, see config/patterns.js):
 *   {
 *     id: 'pat_owner_dependency',
 *     label: 'Hohe Unternehmerabhängigkeit',
 *     when: <condition>,                  // evaluated against answers + dimensions
 *     potentialHint: 'high' | undefined   // optional bias for scoring (Sprint 3)
 *   }
 *
 * This runtime contains no business knowledge — it only interprets pattern data.
 */

import { evaluateCondition } from './conditions.js';

/**
 * Detect which patterns are present in a context.
 * @param {Array} patterns - pattern objects
 * @param {object} context - { answers, profile, dimensions }
 * @returns {Array} matched pattern objects (shallow copies with id + label)
 */
export function detectPatterns(patterns, context) {
  const matched = [];

  for (const pattern of patterns) {
    if (evaluateCondition(pattern.when, context)) {
      matched.push({
        id: pattern.id,
        label: pattern.label,
        potentialHint: pattern.potentialHint || null,
      });
    }
  }

  return matched;
}
