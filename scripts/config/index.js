/*
 * Configuration aggregator.
 *
 * Bundles every independently-versioned config domain into a single object that
 * the engine consumes. This is the ONLY place that assembles the domains; the
 * engine receives the bundle and never imports individual config files itself.
 */

import { knowledgeBase } from './knowledge-base.js';
import { questions } from './questions.js';
import { rules } from './rules.js';
import { patterns } from './patterns.js';
import { recommendations } from './recommendations.js';
import { scoring } from './scoring.js';
import { appConfig } from './app-config.js';
import { content } from './content.js';

export const config = {
  knowledgeBase,
  questions,
  rules,
  patterns,
  recommendations,
  scoring,
  appConfig,
  content,
};
