import router from '../router/router.js';
import elements from '../elements/elements.js';
import formHandler from '../handler/contact-handler.js';

import { TARGET_VAL } from '../components/components.js';

import { removeElements, removeAllEllements } from './removeElements.js';
import { renderElements, renderElementDirectly } from './renderElements.js';
import { state } from './utils.js';

export default {
  state,
  update,
};

async function update() {
  const [
    routeHasChanged,
    routeIsChatRoute,
    routeIsAboutRoute,
    routeIsSharedRoute,
    routeIsContactRoute,
  ] = router.state;

  if (routeHasChanged) {
    state.initial = true;
    // @consider => elements/header.js
    // @todo convert into function
    elements.header.link.active = router.isAboutRoute;
  }

  // @todo catch /contact route errors in router
  // it should not be possible to render /contact/captcha/delivered initially
  // /contact route without a set value 'requiredEmailValue'
  // should redirect to /error route
  if (routeHasChanged && !routeIsContactRoute) {
    elements.form.visible && elements.form.hide();
  }

  if (!routeHasChanged && routeIsContactRoute) {
    // redirect /contact/captcha => /contact/delivered
    // @consider display subitted message in captcha ChatModule
    // remove listener if captcha input exists before it's removed
    formHandler.captcha && formHandler.removeCaptchaListener();
  }

  // to prevent clicking transparent elements
  state.transition = true;

  if (routeHasChanged) {
    await removeAllEllements();
  } else {
    await removeElements();
  }

  // @todo on first render
  // @todo hide app
  // @todo show app when last element was rendered
  // improves UX

  if (routeHasChanged) {
    // adds a delayed chained animation
    if (routeIsChatRoute || routeIsContactRoute) {
      await renderElements();
    }

    // without delayed chained animation
    if (routeIsSharedRoute || routeIsAboutRoute) {
      await renderElementDirectly();
    }

    // show contact form
    if (routeIsContactRoute) {
      !elements.form.visible && elements.form.show();
    }
  } else {
    // affects only /chat and /contact route
    await renderElements();

    // add Listener
    if (routeIsContactRoute && router.keys.includes(TARGET_VAL.CAPTCHA)) {
      formHandler.addCaptchaListener();
    }
  }

  state.transition = false;

  if (state.initial) state.initial = false;
}
