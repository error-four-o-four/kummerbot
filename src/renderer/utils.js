import router from '../router/router.js';
import elements from '../elements/elements.js';

export function clearOutlet() {
  elements.outlet.innerHTML = '';
}

export function filterOutlet() {
  for (let i = elements.outletChildren.length - 1; i >= 0; i -= 1) {
    const section = elements.outletChildren[i];
    const { id } = section;

    if (router.steps.includes(id)) continue;

    section.remove();
  }
}

export function createOutletChild(id, html) {
  const elt = document.createElement('section');
  elt.id = id;
  elt.innerHTML = html;
  return elt;
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
