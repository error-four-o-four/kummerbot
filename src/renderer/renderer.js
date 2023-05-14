import router from '../router/router.js';
import elements from '../elements/elements.js';

import { renderChat } from './render.chat.js';
import { renderPage } from './render.page.js';

let initial = true;
let transition = false;

async function update(prevPathname = null) {
  if (router.isChatRoute) {
    transition = true;
    await renderChat();
    transition = false;

    if (initial) initial = false;
  } else {
    renderPage();
  }

  if (prevPathname !== null) {
    elements.header.link.update(prevPathname);
  }
}

export default {
  update,
  set isInitialRender(bool) {
    initial = bool;
  },
  get isInitialRender() {
    return initial;
  },
  set isTransitioning(bool) {
    transition = bool;
  },
  get isTransitioning() {
    return transition;
  },
};

export * from './templates.js';
export * from './utils.js';
