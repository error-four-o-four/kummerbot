import router from '../router/router.js';
import renderer from '../renderer/renderer.js';
import { state } from '../renderer/utils.js';

import elements from '../elements/elements.js';

import errorHandler from './error-handler.js';
import contactHandler from './contact-handler.js';
import buttonHandler from './button-handler.js';

export default {
  init,
};

function init() {
  window.addEventListener('popstate', (e) => {
    // @todo
    // console.log('animating:', state.transition);
    // abort all animations
    if (state.transition) {
      e.preventDefault();
      return;
    }

    console.warn('@todo handle popstate');
    router.update();
    renderer.update();
  });

  window.addEventListener('click', handle);
}

async function handle(e) {
  if (state.transition) {
    e.preventDefault();
    console.log('clicked', e.target);
    return;
  }

  if (e.target.localName === 'button') {
    buttonHandler.handle(e);
    return;
  }

  if (!router.isRouterLink(e.target)) return;

  if (e.target.href.endsWith(router.routes.contact)) {
    contactHandler.setEmail(e.target.getAttribute('value'));
    console.log('set email');
  }

  // update state
  const route = router.handle(e);

  if (route.isContactRoute) {
    // if (route.hasChanged) {
    //   await contactHandler.adopt(e, route);
    // } else {
    //   await contactHandler.handle(e, route);
    // }
  } else {
    if (route.hasChanged) {
      state.initial = true;
      // @consider => elements/header.js
      // @todo convert into function
      elements.header.link.active = route.isAboutRoute;
      elements.form.visible && elements.form.hide();
    }

    await renderer.update(route);
  }

  if (errorHandler.get()) errorHandler.set(null);
}
