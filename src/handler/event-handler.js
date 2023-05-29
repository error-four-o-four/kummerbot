import router from '../router/router.js';
import renderer from '../renderer/renderer.js';
import elements from '../elements/elements.js';
import { state } from '../renderer/utils.js';

import { ORIGIN } from '../router/config.js';
import { LINK_ATTR, TARGET_VAL } from '../components/components.js';
import { buttonKey, buttonSelector } from '../components/contact-item/utils.js';

import contactHandler from './contact-handler.js';

export default {
  popstate: handlePopstate,
  click: handleClick,
};

async function handlePopstate(e) {
  // state.transition && (await handleAnimations(e));
  handleEvent(e);
}

const isRouterLink = (element) =>
  element.href && element.href.startsWith(ORIGIN);

const isContactLink = (element) =>
  element.classList.contains(buttonSelector[buttonKey.message]);

const isBackLink = (element) =>
  element.getAttribute(LINK_ATTR.TARGET_KEY) === TARGET_VAL.BACK;

async function handleClick(e) {
  const element = e.target;

  if (state.transition) {
    e.preventDefault();
    return;
  }

  // if (element.localName === 'a') console.log(element);

  if (!isRouterLink(element)) return;

  if (isContactLink(element)) {
    contactHandler.setContactData(e.target.getAttribute('value'));
    // await import contacts data
  }

  if (isBackLink(element)) {
    // contactHandler
  }

  handleEvent(e);
}

export async function handleEvent(e) {
  const route = router.handle(e);

  if (route.hasChanged) {
    state.initial = true;
    // @consider => elements/header.js
    // @todo convert into function
    elements.header.link.active = route.isAboutRoute ? route.prevRoute : false;
    elements.form.visible && elements.form.hide();
  }

  await renderer.update(route);

  route.isContactRoute && contactHandler.handle(route);
}
