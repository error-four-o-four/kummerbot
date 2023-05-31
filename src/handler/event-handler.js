import router from '../router/router.js';
import renderer from '../renderer/renderer.js';
import elements from '../elements/elements.js';
import { state } from '../renderer/utils.js';

import { ORIGIN, ROUTES } from '../router/config.js';
import { buttonKey, buttonSelector } from '../components/contact-item/utils.js';

import formController, { CONTACT_VAL } from '../controller/form-controller.js';

export default {
  popstate: handlePopstate,
  click: handleClick,
  submit: handleSubmit,
};

function handlePopstate(e) {
  // state.transition && (await handleAnimations(e));

  handleEvent(e, window.location.pathname);
}

function handleClick(e) {
  const element = e.target;

  if (state.transition) {
    e.preventDefault();
    return;
  }

  if (!isRouterLink(element)) return;

  if (isContactLink(element)) {
    formController.setContactData(element.getAttribute('value'));
  }

  e.preventDefault();
  handleEvent(e, element.pathname);
}

export function handleEvent(e, pathname) {
  const { isContactRoute: wasContactRoute } = router.state;
  const isContactRoute = router.check(pathname, ROUTES.CONTACT);

  if (isContactRoute) {
    // await import contacts data
    handleContactPage(e, pathname, wasContactRoute !== isContactRoute);
    return;
  }

  const route =
    e.type === 'popstate' ? router.replace(pathname) : router.push(pathname);

  if (route.hasChanged) {
    state.initial = true;
    // @consider => elements/header.js
    // @todo convert into function
    elements.header.link.active = route.isAboutRoute ? route.prevRoute : false;
    elements.form.visible && elements.form.hide();
  }

  renderer.update();
}

// @consider css selector ??
function isRouterLink(element) {
  return element.href && element.href.startsWith(ORIGIN);
}

function isContactLink(element) {
  return element.classList.contains(buttonSelector[buttonKey.message]);
}

function handleSubmit(e) {
  e.preventDefault();

  // submitted message
  if (formController.get() === CONTACT_VAL[0]) {
    if (!elements.form.element.reportValidity()) return;
    formController.setMessage();
  }

  formController.forward();
  handleContactPage(e);
}

async function handleContactPage(e, pathname, hasChanged) {
  if (pathname === router.state.route) {
    console.log(pathname, e);
    return;
  }
  // check pathname and prev route
  // to see if it was a back event
  // and call contactHandler.backward()
  const isBackEvent = pathname === router.state.prevRoute;

  if (isBackEvent) {
    formController.back();
  }

  const contactState = hasChanged ? CONTACT_VAL[0] : formController.get();
  pathname = ROUTES.CONTACT + '/' + contactState;

  if (hasChanged) {
    router.push(pathname);
  } else {
    router.replace(pathname);
  }

  await renderer.update();
  formController.update(contactState);
}
