import router from '../../router/router.js';
import renderer from '../../renderer/renderer.js';

import { anchorClass } from '../../components/chat-link/utils.js';
import { buttonClass } from '../../components/contact-list/utils.js';
import { LINK_ATTR, TARGET_VAL } from '../../components/components.js';
import { checkAttribute } from '../../components/utils.js';

import historyController from '../../controller/history-controller.js';
import formController from '../../controller/form/form-controller.js';
import { CONTACT_VAL } from '../../controller/form/config.js';

// import { pre, post } from './event-handler.js';

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

  // @dev
  // pre(e);

  // add /chat entry
  // homeLink is hidden in /contact route
  // when formController.state === 1
  if (isHomeLink(element)) {
    router.push(element);
    renderer.update();
    // @dev
    // post();
    return;
  }

  if (!router.isContactRoute) {
    // clicked link to /contact route
    if (isContactLink(element)) {
      // @todo use identifier
      formController.setContactData(element.getAttribute('data-email'));
      formController.set(CONTACT_VAL[0]);

      console.log(formController.get(), formController.getContactData());
    }

    if (
      !isHistoryLink(element) &&
      !isBackLink(element) &&
      !router.isAboutRoute
    ) {
      // @reminder routed link href is /contact/message
      // push a history entry
      router.push(element);
    } else {
      // history.back()
      router.pop(element);
    }

    // handle /contact route explicetly
    renderer.update();
    // @dev
    // post();
    return;
  }

  // homeLink was handled in advance
  // clicked element will be the linkBack

  if (formController.check(CONTACT_VAL[0])) {
    // replace/push is handled by handleSubmit()
    // call history.back()
    router.pop(element);
  }

  // always use replaceState in /contact route
  // to prevent popstate forward !
  // but push a history entry
  // to make ChatLinks (esp. back) work (href is retrieved from historyController)
  if (formController.check(CONTACT_VAL[1])) {
    const index = historyController.pop();
    formController.set(CONTACT_VAL[0]);
    router.replace({ href: element.href, index });
  }

  renderer.update();
  // @dev
  // post();
};
