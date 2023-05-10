import router, { routes, KEYS } from '../router/router.js';
import elements, { templates, ATTR } from './elements.js';

export function createNavbarAnchor() {
  const anchor = document.createElement('a');
  anchor.setAttribute(ATTR.ROUTE, routes.about);
  anchor.innerHTML = templates.text.headerAnchorAbout;

  elements.headerAnchor = anchor;
  elements.header.appendChild(anchor);
}

export function updateNavbarAnchor() {
  const isAboutRoute = router.isAboutRoute;
  const isAboutAnchor =
    elements.headerAnchor.getAttribute(ATTR.ROUTE) === routes.about;

  if (!isAboutRoute && isAboutAnchor) return;

  const anchor = elements.headerAnchor;

  if (isAboutRoute) {
    anchor.setAttribute(ATTR.ROUTE, KEYS.BACK);
    anchor.innerHTML = templates.text.headerAnchorBack;
  } else {
    anchor.setAttribute(ATTR.ROUTE, routes.about);
    anchor.innerHTML = templates.text.headerAnchorAbout;
  }
}
