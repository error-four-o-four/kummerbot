import elements, { ATTR } from '../elements/elements.js';

import {
  appendLoadingIndicator,
  clearOutlet,
  removeLoadingIndicator,
} from './utils.js';

import router, {
  fetchData,
  getKeyOfPageSection,
  getPathToPageFile,
  getPathToViewFile,
} from '../router/router.js';

export async function renderPage() {
  clearOutlet();
  appendLoadingIndicator();

  // get contents
  const file = router.isViewRoute ? getPathToViewFile() : getPathToPageFile();
  const { error, data } = await fetchData(file);

  if (error) {
    // @todo pass error message / wrong url as params
    console.error(`Error: ${error}`);
    router.setLocation(router.routes.error);
    return;
  }

  removeLoadingIndicator();

  // create section element
  const key = getKeyOfPageSection();
  const elt = document.createElement('section');
  elt.setAttribute(ATTR.SECTION_KEY, key);
  elt.innerHTML = data;
  elements.outlet.append(elt);
}
