import { MODULE_TAG } from '../components/chat-module/index.js';

import router, { fetchData } from '../router/router.js';
import cache from './cache-controller.js';

import {
  injectChatLinksContents,
  injectChatMessagesContents,
} from './renderer-utils.js';

import templates from './templates.js';

// import elements from '../elements.js';

// const loadingIndicatorId = 'loading-indicator';

// export function appendLoadingIndicator() {
//   // @todo animated spinner
//   const elt = document.createElement('div');
//   elt.id = loadingIndicatorId;
//   elt.innerHTML = 'Loading ...';

//   elements.outlet.append(elt);
// }

// export function removeLoadingIndicator() {
//   const elt = document.getElementById(loadingIndicatorId);

//   if (!elt) return;

//   elt.remove();
// }


class Renderer {
  constructor() {
    this.initial = true;
    this.transition = false;
  }

  async createChatModule(keys) {
    // when key equals KEYS.SHARE
    // the id contains the prevKey too
    const templateId = cache.getTemplateId(keys);

    if (cache.isCached(templateId)) {
      // clone cached template
      return {
        error: null,
        module: cache.get(templateId),
      };
    }

    const module = document.createElement(MODULE_TAG);

    // get data with current key of the module
    const path = router.getPathToChatFile(keys[1]);
    const { error, data } = await fetchData(path);

    if (error) {
      // @todo
      // handle / display error
      module.key = 'error';
      module.innerHTML = templates.getErrorTemplate();

      return {
        error,
        module,
      };
    }

    module.key = keys[1];
    module.innerHTML = data;

    // @todo @consider
    // who should be responsible
    // renderer or component ?
    injectChatMessagesContents(module);
    injectChatLinksContents(module, ...keys);

    cache.set(templateId, module);

    return {
      error,
      module,
    };
  }
}

export default new Renderer();