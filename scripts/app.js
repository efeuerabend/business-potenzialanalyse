/*
 * Application bootstrap (Sprint 1).
 *
 * Wires the platform together: creates the store, assembles routes, sets the
 * header/footer chrome and starts the router. Deliberately thin — it holds no
 * business logic and no engine internals.
 */

import { createStore } from './core/store.js';
import { createRouter } from './core/router.js';
import { buildVersionSnapshot } from './core/version.js';
import { runAnalysis } from './engine/engine.js';
import { config } from './config/index.js';
import { startScreen } from './screens/start.js';
import { systemScreen } from './screens/system.js';
import { analyseScreen } from './screens/analyse.js';
import { analyzingScreen } from './screens/analyzing.js';
import { reportScreen } from './screens/report.js';
import { leadCaptureScreen } from './screens/lead-capture.js';

// Central state — provided now so Sprint 2 screens can subscribe to it.
const store = createStore();

const root = document.getElementById('app-root');
root.setAttribute('tabindex', '-1');

const routes = {
  '/': () => startScreen({ config }),
  '/analyse': () => analyseScreen({ store, config, runAnalysis }),
  '/analyzing': () => analyzingScreen({ store, config }),
  '/report': () => reportScreen({ store, config }),
  // Datenschutz/Impressum sind eigenständige statische Seiten (datenschutz.html,
  // impressum.html), kein SPA-Screen — siehe app-footer Links in index.html.
  // Prepared, deactivated extension point for the future funnel step — see
  // config/app-config.js featureFlags.leadCapture.
  '/lead-capture': () => leadCaptureScreen({ config }),
  // Diagnostics screen — gated behind a feature flag, off in production.
  '/system': () => (config.appConfig.featureFlags.showSystemSelfTest
    ? systemScreen({ config, runAnalysis })
    : startScreen({ config })),
};

const router = createRouter({
  root,
  routes,
  fallback: () => startScreen({ config }),
});

// Header meta + footer version summary.
const versionSnapshot = buildVersionSnapshot({
  knowledgeBase: config.knowledgeBase.version,
  rules: config.rules.version,
  patterns: config.patterns.version,
  questions: config.questions.version,
  recommendations: config.recommendations.version,
  scoring: config.scoring.version,
  configuration: config.appConfig.version,
});

// User-facing chrome stays consultative, not technical. The full version
// snapshot remains available in the data model and via the system self-test.
document.getElementById('engine-meta').textContent = 'Business- & KI-Consulting';
document.getElementById('app-footer-note').textContent = config.content.privacyNote;

router.start();

// Expose a tiny handle for manual inspection during development only.
window.__fokusone = { store, config, runAnalysis, versionSnapshot };
