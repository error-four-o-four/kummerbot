import router, { routes, KEYS } from '../router/router.js';
import elements, { contents } from './elements.js';

export const ATTR = {
  ROUTE: 'data-route',
  RESET: 'data-reset',
  CHOICE: 'data-choice',
  INFO: 'data-info-contacts',
};

export function createNavbarAnchor() {
  const anchor = document.createElement('a');
  anchor.setAttribute(ATTR.ROUTE, routes.about);
  anchor.innerHTML = contents.text.headerAnchorAbout;

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
    anchor.innerHTML = contents.text.headerAnchorBack;
  } else {
    anchor.setAttribute(ATTR.ROUTE, routes.about);
    anchor.innerHTML = contents.text.headerAnchorAbout;
  }
}

export function createOptionAnchor(key, text) {
  const elt = document.createElement('a');
  elt.setAttribute(ATTR.ROUTE, key);
  elt.innerHTML = text;
  return elt;
}

export function createAnchor(key) {
  if (key === KEYS.SHARE || key === KEYS.HOME) {
    const elt = document.createElement('a');
    elt.setAttribute(ATTR.ROUTE, key);
    elt.innerHTML = contents.text[key];
    return elt;
  }

  const elt = document.createElement('div');
  elt.innerHTML = `<a ${ATTR.ROUTE}="${key}">${contents.text[key]}</a>`;
  return elt;
}
