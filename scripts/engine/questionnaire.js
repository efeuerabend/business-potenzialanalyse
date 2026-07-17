/*
 * Questionnaire runtime — adaptive flow control.
 *
 * Fully generic and business-free: given the question catalogue and the current
 * answers, it computes which questions are currently visible (their condition
 * holds), in configured order. The wizard renders one visible question at a
 * time and recomputes the flow after every answer, so adaptive follow-ups
 * appear/disappear correctly (e.g. no Instagram follow-up if Instagram was not
 * selected).
 *
 * It knows nothing about specific processes, channels or industries.
 */

import { evaluateCondition } from './conditions.js';

/**
 * Compute the ordered list of currently visible questions.
 * A question is visible when its `condition` (if any) evaluates to true against
 * the current answers.
 * @param {Array} questions
 * @param {object} answers
 * @returns {Array} visible questions in catalogue order
 */
export function getVisibleQuestions(questions, answers) {
  const context = { answers };
  return questions.filter((q) => evaluateCondition(q.condition, context));
}

/**
 * Is a question considered answered?
 * Multi-select requires at least one selection unless the question is optional.
 * @param {object} question
 * @param {object} answers
 */
export function isAnswered(question, answers) {
  const value = answers[question.id];
  if (question.optional) return true;
  if (question.type === 'multi') return Array.isArray(value) && value.length > 0;
  return value !== undefined && value !== null && value !== '';
}

/**
 * Progress relative to the visible flow.
 * @returns {{ total:number, answered:number, remaining:number, index:number }}
 *   index = position of the first unanswered visible question (0-based),
 *   or total when everything is answered.
 */
export function getProgress(questions, answers) {
  const visible = getVisibleQuestions(questions, answers);
  const answered = visible.filter((q) => isAnswered(q, answers)).length;
  const firstUnanswered = visible.findIndex((q) => !isAnswered(q, answers));
  return {
    total: visible.length,
    answered,
    remaining: visible.length - answered,
    index: firstUnanswered === -1 ? visible.length : firstUnanswered,
  };
}

/**
 * Whether the whole visible flow is complete.
 */
export function isComplete(questions, answers) {
  return getVisibleQuestions(questions, answers).every((q) => isAnswered(q, answers));
}
