import router from '../router/router.js';
import elements from '../elements/elements.js';

import { renderChat } from './render.chat.js';
import { renderPage } from './render.page.js';

// @todo reset initalRender on postate
// routed from page
let isInitialRender = true;

async function update(prevPathname = null) {
  if (router.isChatRoute) {
    renderChat();
  } else {
    renderPage();
  }

  if (prevPathname !== null) {
    elements.aboutLink.update(prevPathname);
  }

  if (isInitialRender) isInitialRender = false;
}

export default {
  update,
};

export { isInitialRender };

export * from './templates.js';
export * from './utils.js';
