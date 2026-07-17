/*
 * Application configuration.
 *
 * Product release: 1.0.0. As of this release, versioning is unified at the
 * product level (see CHANGELOG.md) instead of advancing independently per
 * domain — every field below and in `activeVersions` intentionally reads the
 * same number. Future changes bump all of them together per the rules
 * documented in CHANGELOG.md.
 *
 * Global, environment-facing settings that must be changeable without touching
 * engine code: feature flags and the set of active domain versions the app
 * runs with. No CTA target — the free Business-Potenzialanalyse does not link
 * to the paid KI-Potenzialanalyse yet (see recommendations.js sections.nextStep).
 */

export const appConfig = {
  version: '1.0.0',

  featureFlags: {
    showSystemSelfTest: false, // diagnostics screen — off for production
    // Prepared extension point for the future funnel step (Business-Potenzialanalyse
    // -> Lead Capture -> Alfima -> E-Mail-Funnel). Inactive by design: no fields,
    // no API, no logic beyond the guard in screens/lead-capture.js.
    leadCapture: false,
  },

  // Which domain versions this build is expected to run with. Used for the
  // footer summary and to make every future report reproducible.
  activeVersions: {
    engine: '1.0.0',
    knowledgeBase: '1.0.0',
    rules: '1.0.0',
    patterns: '1.0.0',
    questions: '1.0.0',
    recommendations: '1.0.0',
    scoring: '1.0.0',
    configuration: '1.0.0',
    content: '1.0.0',
  },
};
