import router from '../router/router.js';
import elements from './elements.js';

import { updatePageElements } from './renderer-page.js';
import { updateChatElements } from './renderer-chat.js';

import { state, clearOutlet } from './utils.js';

async function update() {
  // clear outlet when previous route wasn't chat route
  if (router.hasChanged) {
    clearOutlet();
    state.initial = true;
    elements.header.link.active = router.isAboutRoute;
  }

  // @todo on first render
  // @todo hide app
  // @todo show app when last element was rendered
  // improves UX

  // prevent clicking transparent elements
  state.transition = true;

  if (router.isChatRoute || router.isSharedRoute) {
    await updateChatElements();
  } else {
    await updatePageElements();
  }

  state.transition = false;

  if (state.initial) state.initial = false;
}

export default {
  state,
  update,
};
