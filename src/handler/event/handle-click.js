import router from '../../router/router.js';
import renderer from '../../renderer/renderer.js';

import { anchorClass } from '../../components/chat-link/utils.js';
import { buttonClass } from '../../components/contact-list/utils.js';
import { buttonAttribute } from '../button-handler.js';
import { LINK_ATTR, TARGET_VAL } from '../../components/components.js';
import { checkAttribute } from '../../components/utils.js';

import historyController from '../../controller/history-controller.js';
import formController from '../../controller/form/form-controller.js';
import contacts from '../../data/contacts.js';
import { CONTACT_VAL } from '../../controller/form/config.js';
import { ORIGIN, ROUTES } from '../../router/config.js';

const isLink = (element) => element.localName === 'a';

const isRouterLink = (element) =>
  isLink(element) && element.classList.contains(anchorClass.routed);

const isHistoryLink = (element) =>
  element.classList.contains(anchorClass.toParent);

const isHomeLink = (element) =>
  element.classList.contains(anchorClass.toTarget) &&
  checkAttribute(element.parentElement, LINK_ATTR.TARGET_KEY, TARGET_VAL.HOME);

const isBackLink = (element) =>
  element.classList.contains(anchorClass.toTarget) &&
  checkAttribute(element.parentElement, LINK_ATTR.TARGET_KEY, TARGET_VAL.BACK);

const isContactLink = (element) =>
  isLink(element) && element.classList.contains(buttonClass.message);

export default (e) => {
  const element = e.target;

  if (renderer.transition) {
    e.preventDefault();
    return;
  }

  if (!isRouterLink(element)) return;

  e.preventDefault();
  e.stopImmediatePropagation();

  if (router.hasError) {
    console.log('@todo check state.isFirstPage, historyController.values');
  }

  if (!router.isContactRoute) {
    if (isContactLink(element)) {
      // clicked link to /contact route
      handleLinkToContact(element);
      return;
    }

    if (
      !isHistoryLink(element) &&
      !isBackLink(element) &&
      !router.isAboutRoute
    ) {
      // push a history state
      router.push(element);
    } else {
      // uses history.go();
      // temporarily removes popstate listener (setTimeout(_, 50))
      // to prevent calling renderer.update() twice
      router.pop(element);
    }
    renderer.update();
    return;
  }

  // handle /contact route explicetly
  // use history.replaceState and history.pushState to prevent popstate events
  const formState = formController.get();

  if (isBackLink(element)) {
    handleContactBackLink(element, formState);
    return;
  }

  if (isHomeLink(element)) {
    handleContactHomeLink(element);
    return;
  }

  router.push(element);
  renderer.update();
};

function handleLinkToContact(element) {
  // used in /chat or /shared route => /contact/message
  const id = 1 * element.getAttribute(buttonAttribute.id);
  const contact = contacts.find((contact) => contact._id === id);

  // handle error
  if (!contact) {
    const state = {
      href: ORIGIN + ROUTES.ERROR,
      pathname: ROUTES.ERROR,
    };
    // @todo replace?
    router.push(state);
    renderer.update();
    return;
  }

  // @todo
  // alert when previous message has not been send

  // reset state, email etc
  formController.setContactData(contact);
  formController.set(CONTACT_VAL[0]);
  router.push(element);
  renderer.update();
}

async function handleContactHomeLink(element) {
  // the user should NOT be able to go back to the massage form
  // [/chat/**/*, (/CONTACT/MESSAGE || /CONTACT/RESPONDED)] => [/chat/**/*, /chat]
  // @todo router.hasChanged => history.state !!! ?
  const prevPathname = historyController.get(-1);
  await router.restore(prevPathname, element.pathname);
  renderer.update();
}

async function handleContactBackLink(element, state) {
  // backlink was clicked in /contact/*
  if (state === CONTACT_VAL[0]) {
    // the user should be able to go back to the massage form
    // [/chat/**/*, /CONTACT/MESSAGE] => [/CHAT/**/*, /contact/message]
    const nextPathname = historyController.get();
    // temporarily remove popstate listener
    // special case: clicked about link inbetween
    await router.restore(element.pathname, nextPathname);
    await router.pop(element);
  }

  if (state === CONTACT_VAL[1]) {
    // the user should NOT be able to go back to the captcha form
    // [/chat/**/*, /contact/message,  /CONTACT/CAPTCHA] => [/chat/**/*, /CONTACT/MESSAGE]
    formController.back();
    historyController.go(ROUTES.CONTACT + '/' + formController.get());
    const prevPathname = historyController.get(-1);
    await router.restore(prevPathname, element.pathname);
  }

  // state === CONTACT_VAL[2] does not have any links

  if (state === CONTACT_VAL[3]) {
    // the user should NOT be able to go back to /contact/responded
    // [/chat, /chat/contacts, /CONTACT/RESPONDED] => [/chat, /CHAT/CONTACTS]
    // special case /shared route: there's no history state before /shared
    const nextPathname = historyController.get(-1);
    const prevPathname = historyController.get(-2);
    await router.restore(prevPathname, nextPathname);
  }
  renderer.update();
}
