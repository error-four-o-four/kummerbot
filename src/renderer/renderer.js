import router, { KEYS } from '../router/router.js';
import elements from './elements.js';

import { updateChatElements } from './renderer-chat.js';
import { updatePageElements } from './renderer-page.js';

class Renderer {
  constructor() {
    this.initial = true;
    this.transition = false;
  }

  clearOutlet() {
    elements.outlet.innerHTML = '';
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

  async update() {
    this.transition = true;

    if (router.isChatRoute) {
      // clear outlet when previous route wasn't chat route
      if (router.prev && !router.prev.startsWith(router.routes[KEYS.ROOT])) {
        this.clearOutlet();
        this.initial = true;
        elements.header.link.active = false;
      }

      // if (router.prev && router.prev.startsWith(router.routes.about)) {
      //   header.link.active = false;
      // }

      await updateChatElements.call(this);
    } else {
      // clear outlet by default
      this.clearOutlet();
      updatePageElements.call(this);
    }
    this.transition = false;

    if (this.initial) this.initial = false;

    if (
      (router.isAboutRoute || router.isViewRoute) &&
      router.prev &&
      !router.prev.startsWith(router.routes.about)
    ) {
      elements.header.link.active = true;
    }
  }
}

export default new Renderer();
