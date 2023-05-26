import renderer from '../renderer/renderer.js';
import { state } from '../renderer/utils.js';

import router from '../router/router.js';

import formHandler from './contact-handler.js';

import { handleButtonEvents } from './button-handler.js';
import { eltSelector } from '../components/contact-item/utils.js';

function init() {
  window.addEventListener('popstate', (e) => {
    // @todo
    // console.log('animating:', state.transition);
    // abort all animations
    if (state.transition) {
      e.preventDefault();
      return;
    }

    router.update();
    renderer.update();
  });

  window.addEventListener('click', handle);

  // input change
  // form submit
  formHandler.addEventListeners();
}

function handle(e) {
  // e.preventDefault();
  // console.log('clicked', e.target);

  if (e.target.classList.contains(eltSelector.btn)) {
    handleButtonEvents(e);
  }

  if (router.isRouterLink(e.target)) {
    //   if (key === KEYS.SHARE) {
    //     console.log(navigator.canShare);
    //     // clipBoard etc
    //     return;
    //   }

    router.handle(e);
    renderer.update();
    return;
  }
}

export default {
  init,
};
