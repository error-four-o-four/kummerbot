import router, { KEYS, fetchData } from '../router/router.js';
import elements from './elements.js';

import cache from './cache-controller.js';

// bound to renderer
export async function updatePageElements() {
  elements.outlet.append(this.createPageLoadingIndicator());

  // if (error) {
  //   // @todo pass error message / wrong url as params
  //   console.error(`Error: ${error}`);
  //   router.setLocation(router.routes.error);
  //   return;
  // }

  if (router.isViewRoute) {
    // will always be redirected from share ChatModule
    const key = router.keys.at(-1);
    const templateId = cache.getTemplateId([key, KEYS.SHARE]);

    if (cache.isCached(templateId)) {
      console.log('loading cached', templateId);
      return;
    }

    const template = document.createElement('template');

    // @todo error handling
    const path = router.getPathToViewFile();
    const { error, data } = await fetchData(path);

    template.innerHTML = data;
  } else {
    // @todo error handling
    const path = router.getPathToPageFile();
    const { error, data } = await fetchData(path);

    elements.outlet.innerHTML = data;
  }
}
