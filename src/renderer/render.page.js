import elements, { templates } from '../elements/elements.js';
import {
  appendLoadingIndicator,
  clearOutlet,
  createOutletChild,
  removeLoadingIndicator,
} from './utils.js';
// import { removeAllSections, appendSingleSection } from './helpers.js';

import router, {
  routes,
  fetchData,
  getPathToPageFile,
  getPathToViewFile,
  getIdFromPath,
} from '../router/router.js';

export async function renderPage() {
  clearOutlet();
  appendLoadingIndicator();

  // get contents
  const file = router.isViewRoute ? getPathToViewFile() : getPathToPageFile();
  const { error, data } = await fetchData(file);

  if (error) {
    console.error(`Error: ${error}`);
    router.replace(routes.error);
    return;
  }

  // @todo url params
  removeLoadingIndicator();

  // create section element
  const id = getIdFromPath();
  const wrap = createOutletChild(id, data);
  elements.outlet.append(wrap);
}
