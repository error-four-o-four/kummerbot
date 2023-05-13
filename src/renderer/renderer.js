import router from '../router/router.js';

import {
  createNavbarAnchor,
  updateNavbarAnchor,
} from '../elements/elements.js';

import { renderChat } from './render.chat.js';
import { renderPage } from './render.page.js';

let isInitialRender = true;

async function update(prevRoute = null) {
  if (isInitialRender) {
    createNavbarAnchor();
  }

  if ((isInitialRender && router.isAboutRoute) || prevRoute) {
    updateNavbarAnchor(prevRoute);
  }

  if (router.isChatRoute) {
    renderChat();
  } else {
    renderPage();
  }

  if (isInitialRender) isInitialRender = false;
}

export default {
  update,
};

export { isInitialRender };

export * from './templates.js';
export * from './utils.js';
