import elements, { ATTR } from '../elements/elements.js';

export function clearOutlet() {
  elements.outlet.innerHTML = '';
}

const loadingIndicatorId = 'loading-indicator';

export function appendLoadingIndicator() {
  // @todo animated spinner
  const elt = document.createElement('div');
  elt.id = loadingIndicatorId;
  elt.innerHTML = 'Loading ...';

  elements.outlet.append(elt);
}

export function removeLoadingIndicator() {
  const elt = document.getElementById(loadingIndicatorId);

  if (!elt) return;

  elt.remove();
}
