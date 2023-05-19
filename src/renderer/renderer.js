import { MODULE_TAG } from '../components/chat-module/index.js';

import router, { fetchData } from '../router/router.js';

import cache from './cache-controller.js';
import templates from './templates.js';

import { insertChatLinkToPreviousModule } from './renderer-utils.js';

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

    const path = router.getPathToChatFile(keys[1]);
    const { error, data } = await fetchData(path);

    if (error) {
      // @todo
      // handle / display error
      // renderer-utils createErrorChatMessage()
      // @consider
      // document.createElement(ChatMessage) (?)
      module.key = 'error';
      module.innerHTML = templates.getErrorTemplate(error);

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
    // injectChatMessagesContents(module); // => utils.js
    insertChatLinkToPreviousModule(module, keys[0]);

    cache.set(templateId, module);

    return {
      error,
      module,
    };
  }

  createPageLoadingIndicator() {
    const indicator = document.createElement('span');
    indicator.id = 'page-loading-indicator';
    indicator.innerHTML = `<svg><use xlink:href="#message-pending"></use></svg>`;
    return indicator;
  }

  removePageLoadingIndicator() {
    const indicator = document.getElementById('page-loading-indicator');
    indicator.remove();
  }
}

export default new Renderer();
