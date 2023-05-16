import renderer from '../renderer/renderer.js';
import router from '../router/router.js';

import { updateChatElements } from './controller-chat.js';
import { updatePageElements } from './controller-page.js';

const app = document.getElementById('app');

const header = {
  elt: document.querySelector('header'),
  svg: document.getElementById('avatar-svg'),
  span: document.getElementById('status-indicator'),
  link: document.querySelector('about-link'),
};

const outlet = document.getElementById('outlet');

// @todo svgs ?

async function update(prevPathname = null) {
  if (router.isChatRoute) {
    renderer.transition = true;
    await updateChatElements();
    renderer.transition = false;

    if (renderer.initial) renderer.initial = false;
  } else {
    updatePageElements();
  }

  if (prevPathname !== null) {
    header.link.update(prevPathname);
  }
}

function clearOutlet() {
  outlet.innerHTML = '';
}

export default {
  app,
  header,
  outlet,
  clearOutlet,
  update,
};
