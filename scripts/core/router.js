/*
 * Minimal hash-based router.
 *
 * Hash routing is used deliberately: it works identically on Cloudflare Pages,
 * on any static host, and via a local dev server, without server-side rewrite
 * rules. Routes render into a single container element.
 *
 * The router is content-agnostic: it knows nothing about the questionnaire or
 * the engine. Screens are plain functions (context) -> HTMLElement | string.
 */

export function createRouter({ root, routes, fallback }) {
  function currentPath() {
    const hash = window.location.hash || '#/';
    return hash.replace(/^#/, '') || '/';
  }

  function render() {
    const path = currentPath();
    const screen = routes[path] || fallback;
    if (!screen) return;

    const output = screen({ path });
    root.replaceChildren();
    if (typeof output === 'string') {
      root.innerHTML = output;
    } else if (output instanceof Node) {
      root.appendChild(output);
    }
    // Move focus to the top of the freshly rendered screen for a11y.
    root.focus?.();
    window.scrollTo(0, 0);
  }

  function navigate(path) {
    window.location.hash = `#${path}`;
  }

  function start() {
    window.addEventListener('hashchange', render);
    render();
  }

  return { start, navigate, render, currentPath };
}
