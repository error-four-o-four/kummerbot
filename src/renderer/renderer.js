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

async function update(route) {
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

  route.hasChanged || route.isContactRoute
    ? await removeAllEllements(route)
    : await removeElements(route);

  route.isChatRoute
    ? await renderElementsDelayed(route)
    : await renderElementsImmediately(route);

  state.transition = false;

  if (state.initial) state.initial = false;
}
