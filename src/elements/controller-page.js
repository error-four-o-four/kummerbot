import router, { fetchData } from '../router/router.js';

import cache from '../renderer/cache-controller.js';
import renderer from '../renderer/renderer.js';

import elements from './elements.js';
import { KEYS } from '../router/config.js';

export async function updatePageElements() {
  elements.outlet.append(renderer.createPageLoadingIndicator());

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
