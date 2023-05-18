import renderer from '../renderer/renderer.js';
import router, { KEYS } from '../router/router.js';

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
  renderer.transition = true;

  if (router.isChatRoute) {
    // clear outlet when previous route wasn't chat route
    if (
      prevPathname &&
      !prevPathname.startsWith(router.routes[KEYS.ROOT])
    ) {
      clearOutlet();
      renderer.initial = true;
    }

    await updateChatElements();
  } else {
    renderer.clearOutlet();
    updatePageElements();
  }
  renderer.transition = false;

  if (renderer.initial) renderer.initial = false;

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
