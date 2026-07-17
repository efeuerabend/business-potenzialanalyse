/*
 * Lead Capture — prepared extension point for the next build-out stage:
 *
 *   Business-Potenzialanalyse -> (optional) Lead Capture -> Alfima -> E-Mail-Funnel -> Ende
 *
 * Inactive by design (RC1): no input fields, no API call, no logic beyond the
 * feature-flag guard below. Enable via config/app-config.js
 * featureFlags.leadCapture once the funnel step is actually built; until then
 * this route simply forwards back to the report.
 */

export function leadCaptureScreen({ config }) {
  if (!config.appConfig.featureFlags.leadCapture) {
    window.location.hash = '#/report';
  }
  return document.createElement('div');
}
