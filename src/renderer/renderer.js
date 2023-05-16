import { MODULE_TAG } from '../components/chat-module/index.js';

import router, { fetchData } from '../router/router.js';

import controller from './cache-controller.js';
import templates from './templates.js';

class Renderer {
  constructor() {
    this.initial = true;
    this.transition = false;
  }

  async createChatModule(keys) {
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

    // when key equals KEYS.SHARE
    // the id contains the prevKey too
    const templateId = controller.createTemplateId(keys);

    // cache template key
    // inject contents
    if (!controller.isCached(templateId)) {
      controller.cache(templateId, keys, data);
    } else {
      console.log('loaded cached');
    }

    // order matters
    module.key = keys[1];
    module.append(...controller.cloneMessages(templateId));
    module.append(...controller.cloneLinks(templateId));

    return {
      error,
      module,
    };
  }
}

export default new Renderer();

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
