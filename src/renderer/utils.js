import router from '../router/router.js';
import elements, { ATTR } from '../elements/elements.js';

export function clearOutlet() {
  elements.outlet.innerHTML = '';
}

export function filterOutlet() {
  let i = 0;

  while (i < router.keys.length) {
    // compare router keys
    // with the keys of the rendered sections
    const section = elements.outlet.children[i];

    // there are less sections rendered than required
    // no need to remove any sections
    if (!section) return;

    const currentKey = router.keys[i];
    const sectionKey = section.getAttribute(ATTR.SECTION_KEY);

    // break if there's an incorrect section
    if (currentKey !== sectionKey) break;

    i += 1;
  }

  // and remove all subsequent sections
  for (let j = elements.outlet.children.length - 1; j >= i; j -= 1) {
    elements.outlet.children[j].remove();
  }
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
