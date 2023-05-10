import router from '../router/router.js';

import {
  createNavbarAnchor,
  updateNavbarAnchor,
} from '../elements/elements.js';

import { renderChat } from './render.chat.js';
import { renderPage } from './render.page.js';

export let isInitialRender = true;

async function update() {
  if (isInitialRender) createNavbarAnchor();

  updateNavbarAnchor();

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

export * from './utils.js';
