import router from '../router/router.js';

import { removeElements, removeAllEllements } from './removeElements.js';

import {
  renderElementsDelayed,
  renderElementsImmediately,
} from './renderElements.js';

import { state } from './utils.js';

export default {
  state,
  update,
};

async function update() {
  const route = router.state;
  // @todo on first render
  // @todo hide app
  // @todo show app when last element was rendered
  // improves UX
  if (route.hasChanged) {
    state.initial = true;
  }

  // to prevent clicking transparent elements
  // @todo add css attribute to reset pointer
  state.transition = true;

  route.hasChanged || route.isContactRoute || route.hasError
    ? await removeAllEllements()
    : await removeElements();

  route.isChatRoute
    ? await renderElementsDelayed()
    : await renderElementsImmediately();

  state.transition = false;

  if (state.initial) state.initial = false;
}
