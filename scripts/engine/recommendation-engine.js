/*
 * Recommendation Engine — assembles a report model from modular blocks.
 *
 * Business-free: it only combines the engine result with the configured
 * building blocks (config/recommendations.js) into a structured report model.
 * It never contains report prose itself and never names a tool or vendor.
 *
 * Per Standards/report-design.md the model follows the fixed dramaturgy:
 *   1 recognized -> 2 meaning (4-block insights) -> 3 potentials
 *   -> 4 synthesis ("roter Faden") -> 5 limits -> 6 next step (neutral, no CTA in RC1).
 *
 * The output is a plain data model; the report screen renders it.
 */

/**
 * @param {object} result  - engine result (processScores, detectedPatterns, prioritized, overall)
 * @param {object} config  - full config bundle
 * @param {object} answers - raw answers, for modular personalisation only
 * @returns {object} report model
 */
export function buildReport(result, config, answers = {}) {
  const rec = config.recommendations;

  const scoreById = new Map(result.processScores.map((ps) => [ps.processId, ps]));
  const active = result.processScores.filter((ps) => ps.active);

  // Split active areas into notable potentials (real levers) and quiet areas,
  // using the centrally configured threshold. Non-relevant chapters are already
  // excluded via `active`. Quiet areas are never shown as "geringes Potenzial".
  const threshold = rec.display?.noticeableFrom ?? 5;
  const notable = active.filter((ps) => ps.score >= threshold);
  const quiet = active.filter((ps) => ps.score < threshold);
  const maxNotable = Math.max(1, ...notable.map((ps) => ps.score));

  // 1. Recognized processes (what we looked at).
  const recognized = active.map((ps) => ({ processId: ps.processId, label: ps.label }));

  // 2. Meaning: detected patterns joined with their modular blocks. Where a
  // block offers language variants (e.g. `beobachtung`), the concrete answer
  // that most sharply distinguishes the pattern picks the variant — so the
  // same pattern reads differently depending on how pronounced it actually
  // is, while staying reproducible for the same answers (see VARIANT_SELECTORS).
  const patterns = result.detectedPatterns
    .map((p) => {
      const block = rec.patternBlocks[p.id];
      if (!block) return null;
      const beobachtung = resolveVariant(block.beobachtung, p.id, answers);
      return { id: p.id, label: p.label, ...block, beobachtung };
    })
    .filter(Boolean);

  // 3. Potentials: prioritised NOTABLE areas only (real levers, top first).
  const notableIds = new Set(notable.map((ps) => ps.processId));
  const potentials = result.prioritized
    .filter((pid) => notableIds.has(pid))
    .map((pid) => {
      const ps = scoreById.get(pid);
      return {
        processId: pid,
        label: ps.label,
        levelId: ps.level.id,
        levelLabel: ps.level.label,
        score: ps.score,
      };
    });

  // Potenzial-Kompass: only notable levers, normalised against the top lever.
  const compass = notable
    .slice()
    .sort((a, b) => b.score - a.score)
    .map((ps) => ({
      processId: ps.processId,
      label: ps.label,
      levelId: ps.level.id,
      levelLabel: ps.level.label,
      score: ps.score,
      pct: Math.max(6, Math.round((ps.score / maxNotable) * 100)),
    }));

  // Relevant but unremarkable areas — listed compactly, not as low potential.
  const quietAreas = quiet.map((ps) => ({ processId: ps.processId, label: ps.label }));

  // 4. Assessment: honest overall statement for the reached level.
  const overallLevelId = result.overall?.level?.id || 'low';
  const assessment = rec.overallByLevel[overallLevelId] || rec.overallByLevel.low;

  // Modular personalisation: assemble a short statement from the original
  // reason for self-employment ("damals") and the first motivation ("heute").
  // Missing answers are simply omitted; differing values are never framed as a
  // contradiction. Nothing here is a hardcoded finished sentence.
  const personal = buildPersonalStatement(rec.personalization, answers);

  // Synthesis ("roter Faden"): assembled from the actually detected patterns'
  // `impact` clauses (see buildSynthesis below) — not a lookup table of
  // pre-written combinations. Every combination of detected patterns produces
  // its own text; only the true zero-pattern case uses a fixed fallback.
  const synthesis = buildSynthesis(rec, result.detectedPatterns);

  return {
    opening: rec.sections.opening,
    personal,
    synthesis,
    disclaimer: rec.sections.disclaimer,
    noFindings: rec.sections.noFindings,
    steps: rec.sections.steps,
    recognized,
    patterns,
    potentials,
    compass,
    quietAreas,
    quietAreasTitle: rec.display?.quietAreasTitle || 'Aktuell unauffällige Bereiche',
    quietAreasNote: rec.display?.quietAreasNote || '',
    noNotablePotentials: rec.display?.noNotablePotentials || '',
    assessment: { levelId: overallLevelId, ...assessment },
    nextStepQuestions: rec.sections.nextStepQuestions,
    nextStepClosing: rec.sections.nextStepClosing,
    versions: result.versions,
  };
}

/**
 * Picks which language variant of a pattern block field to show, based on a
 * single concrete answer that best reflects how pronounced this specific
 * pattern actually is. Deterministic (same answers -> same report), not
 * random — the wording sharpens as the underlying signal intensifies rather
 * than varying arbitrarily.
 */
const VARIANT_SELECTORS = {
  pat_owner_dependency: (answers) => (answers.q_own_phone_off === 'nein' ? 1 : 0),
  pat_missing_delegation: (answers) => (answers.q_inq_who === 'gemeinsam' || answers.q_off_who === 'gemeinsam' ? 1 : 0),
  pat_delayed_handling: (answers) => (answers.q_inq_speed === 'naechster_tag' ? 1 : 0),
  pat_lost_inquiries: (answers) => (answers.q_inq_unanswered === 'haeufig' ? 1 : 0),
  pat_recurring_communication: (answers) => (answers.q_inq_repetitive === 'sehr_haeufig' ? 1 : 0),
  pat_manual_scheduling: (answers) => (answers.q_sched_phone === 'fast_immer' ? 1 : 0),
  pat_recurring_offers: (answers) => (answers.q_off_repetitive === 'sehr_haeufig' ? 1 : 0),
  pat_admin_overload: (answers) => (answers.q_adm_interrupt === 'sehr_haeufig' ? 1 : 0),
  pat_growth_bottleneck: (answers) => (answers.q_leads_regularity === 'kaum_planbar' ? 1 : 0),
};

function resolveVariant(value, patternId, answers) {
  if (!Array.isArray(value)) return value;
  const selector = VARIANT_SELECTORS[patternId];
  const index = selector ? selector(answers) : 0;
  return value[index] ?? value[0];
}

/**
 * Assembles the cross-area synthesis ("roter Faden") from the patterns
 * actually detected for this report, using each pattern's short `impact`
 * clause. Zero patterns -> the fixed fallback. One pattern -> a single-clause
 * sentence. Two or more -> the two strongest (by detection order, which
 * follows config/patterns.js — roughly severity-descending) are connected via
 * one of two sentence shells, chosen deterministically from which patterns
 * fired, so the sentence structure itself varies, not only the content.
 */
function buildSynthesis(rec, detectedPatterns) {
  const withImpact = detectedPatterns
    .map((p) => ({ id: p.id, label: p.label, impact: rec.patternBlocks[p.id]?.impact }))
    .filter((p) => p.impact);

  if (!withImpact.length) return rec.synthesisFallback.none;

  if (withImpact.length === 1) {
    const [a] = withImpact;
    return `${a.label} zieht sich wie ein roter Faden durch Ihre Angaben: Das ${a.impact}.`;
  }

  const [a, b] = withImpact;
  const shellIndex = (a.id.length + b.id.length) % 2;
  return shellIndex === 0
    ? `${a.label} und ${b.label} hängen bei Ihnen enger zusammen, als es auf den ersten Blick wirkt: Das eine ${a.impact}, das andere ${b.impact}.`
    : `Zwei Ihrer Antworten ergeben zusammen ein deutliches Bild: Das eine ${a.impact}, das andere ${b.impact} — und beides verstärkt sich gegenseitig.`;
}

/**
 * Build a short, modular personal statement from configured phrase maps.
 * Returns null when neither reason nor motivation is available.
 */
function buildPersonalStatement(p, answers) {
  if (!p) return null;
  const parts = [];

  const reason = answers.q_own_reason;
  if (reason && p.reasonLabel && p.reasonLabel[reason]) {
    parts.push(`${p.reasonPrefix}${p.reasonLabel[reason]}.`);
  }

  const motivation = answers.motivation;
  if (motivation && p.motivationLabel && p.motivationLabel[motivation]) {
    parts.push(`${p.todayPrefix}${p.motivationLabel[motivation]}${p.todaySuffix}`);
  }

  return parts.length ? parts.join(' ') : null;
}
