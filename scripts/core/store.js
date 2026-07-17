/*
 * Central application state.
 *
 * Nothing leaves the device (data minimisation) — but the state is mirrored
 * into sessionStorage so a reload during the questionnaire does not lose the
 * user's answers. sessionStorage is tab-scoped: it is gone as soon as the tab
 * closes, so no extra cleanup is needed once the report is reached.
 */

import { createReportMeta } from './report-meta.js';

const STORAGE_KEY = 'fokusone.bpa.state.v1';

function createInitialState() {
  return {
    profile: {},        // company profile fields
    answers: {},        // questionId -> value (string | string[] | number)
    result: null,        // last engine result
    reportMeta: null,    // { id, createdAt } — set together with `result`
    meta: {
      startedAt: null,
      analysisShown: false, // whether the analyzing sequence already played for this result
    },
  };
}

function loadPersisted() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return { ...createInitialState(), ...JSON.parse(raw) };
  } catch {
    return null;
  }
}

function persist(state) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage unavailable (private browsing, quota) — degrade silently, the
    // session simply behaves as before (in-memory only for this tab).
  }
}

export function createStore() {
  let state = loadPersisted() || createInitialState();
  const listeners = new Set();

  function notify() {
    persist(state);
    for (const listener of listeners) listener(state);
  }

  return {
    getState() {
      return state;
    },

    /** Merge a partial profile update. */
    setProfileField(key, value) {
      state = { ...state, profile: { ...state.profile, [key]: value } };
      notify();
    },

    /** Record a single answer by question id. */
    setAnswer(questionId, value) {
      state = { ...state, answers: { ...state.answers, [questionId]: value } };
      notify();
    },

    setResult(result) {
      state = { ...state, result, reportMeta: createReportMeta() };
      notify();
    },

    markStarted() {
      if (!state.meta.startedAt) {
        state = { ...state, meta: { ...state.meta, startedAt: new Date().toISOString() } };
      }
    },

    /** Marks the analyzing sequence as already played, so a browser back/forward
     * pass through '#/analyzing' does not replay the full animation. */
    markAnalysisShown() {
      if (!state.meta.analysisShown) {
        state = { ...state, meta: { ...state.meta, analysisShown: true } };
        notify();
      }
    },

    reset() {
      state = createInitialState();
      notify();
    },

    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}
