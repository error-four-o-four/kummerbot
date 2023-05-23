import router, { fetchData } from '../router/router.js';
import elements from '../elements/elements.js';

import { createLoadingIndicator } from './utils.js';

// bound to renderer
export async function updatePageElements() {
  elements.outlet.append(createLoadingIndicator());

  const path = router.getFileUrl();
  const { error, data } = await fetchData(path);

  if (error) {
    // @todo pass error message / wrong url as params
    console.error(`Error: ${error}`);
    router.setLocation(router.routes.error);
    return;
  }

  elements.outlet.innerHTML = data;
}
