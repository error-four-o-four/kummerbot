import elements from '../elements/elements.js';

import {
  appendLoadingIndicator,
  clearOutlet,
  createOutletChild,
  removeLoadingIndicator,
} from './utils.js';

import router, {
  fetchData,
  getPathToPageFile,
  getPathToViewFile,
  // getIdFromPath,
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

  // @todo url params
  removeLoadingIndicator();

  // create section element
  // const id = getIdFromPath();
  const wrap = createOutletChild(id, data);
  elements.outlet.append(wrap);
}
