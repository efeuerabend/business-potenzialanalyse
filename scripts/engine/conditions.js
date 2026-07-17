/*
 * Condition interpreter — the shared, config-driven predicate language.
 *
 * The same condition format is used by three domains:
 *   - Questions   (when should an adaptive follow-up question be shown?)
 *   - Rules       (when does a rule contribute to a dimension score?)
 *   - Patterns    (when is an operational pattern present?)
 *
 * A condition is a plain data object (lives in config, never in code):
 *
 *   Leaf:   { fact: 'answers.q_channels', op: 'includes', value: 'instagram' }
 *   Group:  { all: [ ...conditions ] }   // logical AND
 *           { any: [ ...conditions ] }   // logical OR
 *           { not: condition }           // negation
 *
 * "fact" is a dot-path resolved against the evaluation context, e.g.
 *   answers.q_channels        -> state.answers.q_channels
 *   profile.employees         -> state.profile.employees
 *   dimensions.ownerDependency-> derived dimension score (in rule/pattern ctx)
 *
 * Supported operators: equals, notEquals, includes, includesAny, exists,
 * gte, lte, gt, lt.
 *
 * The interpreter is pure and side-effect free.
 */

function resolveFact(path, context) {
  return path.split('.').reduce((acc, key) => {
    if (acc == null) return undefined;
    return acc[key];
  }, context);
}

function compareLeaf(cond, context) {
  const actual = resolveFact(cond.fact, context);
  const expected = cond.value;

  switch (cond.op) {
    case 'exists':
      return actual !== undefined && actual !== null && actual !== '';
    case 'equals':
      return actual === expected;
    case 'notEquals':
      return actual !== expected;
    case 'includes':
      return Array.isArray(actual) && actual.includes(expected);
    case 'includesAny':
      return Array.isArray(actual) && Array.isArray(expected)
        && expected.some((v) => actual.includes(v));
    case 'gte':
      return typeof actual === 'number' && actual >= expected;
    case 'lte':
      return typeof actual === 'number' && actual <= expected;
    case 'gt':
      return typeof actual === 'number' && actual > expected;
    case 'lt':
      return typeof actual === 'number' && actual < expected;
    default:
      // Unknown operator -> fail closed, never throw at runtime.
      return false;
  }
}

/**
 * Evaluate a condition tree against a context.
 * An undefined/empty condition evaluates to `true` (always applies).
 * @param {object|undefined} condition
 * @param {object} context - { answers, profile, dimensions, ... }
 * @returns {boolean}
 */
export function evaluateCondition(condition, context) {
  if (!condition) return true;

  if (Array.isArray(condition.all)) {
    return condition.all.every((c) => evaluateCondition(c, context));
  }
  if (Array.isArray(condition.any)) {
    return condition.any.some((c) => evaluateCondition(c, context));
  }
  if (condition.not) {
    return !evaluateCondition(condition.not, context);
  }
  if (typeof condition.fact === 'string') {
    return compareLeaf(condition, context);
  }
  // Malformed condition -> fail closed.
  return false;
}
