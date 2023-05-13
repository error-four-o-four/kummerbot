// @todo create custom component

import { templates } from '../renderer/renderer.js';
import router, { KEYS } from '../router/router.js';
import elements, { ATTR } from './elements.js';

export function createNavbarAnchor() {
  const anchor = document.createElement('a');
  anchor.href = router.routes.about;
  anchor.innerHTML = templates.text.headerAnchorAbout;

  elements.headerLink = anchor;
  elements.header.appendChild(anchor);
}

export function updateNavbarAnchor(prevRoute) {
  if (!prevRoute) {
    // first render is aboute page
    elements.headerLink.href = router.routes[KEYS.ROOT];
    elements.headerLink.innerHTML = templates.text.headerAnchorBack;
    return;
  }

  const aboutRoute = router.routes.about;
  const isAboutRoute = router.isAboutRoute;
  const isAboutLink = elements.headerLink.href.includes(aboutRoute);

  if ((isAboutLink && !isAboutRoute) || (!isAboutLink && isAboutRoute)) return;

  elements.headerLink.href = isAboutLink ? prevRoute : aboutRoute;
  elements.headerLink.innerHTML = isAboutLink
    ? templates.text.headerAnchorBack
    : templates.text.headerAnchorAbout;
}
