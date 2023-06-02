import router from '../router/router.js';
import elements from '../elements/elements.js';
import renderer from '../renderer/renderer.js';

// import { ROUTES } from '../router/config.js';

import { anchorClass } from '../components/chat-link/utils.js';
import { buttonKey, buttonClass } from '../components/contact-item/utils.js';
import { LINK_ATTR, TARGET_VAL } from '../components/components.js';

import formController, { CONTACT_VAL } from '../controller/form-controller.js';

export default {
  click: handleClick,
  submit: handleSubmit,
  popstate: handlePopstate,
};

const isLink = (element) => element.localName === 'a';

const isRouterLink = (element) =>
  isLink(element) && element.classList.contains(anchorClass.routed);

const isHistoryLink = (element) =>
  element.classList.contains(anchorClass.toParent);

const isBackLink = (element) =>
  element.classList.contains(anchorClass.toTarget) &&
  element.parentElement.getAttribute(LINK_ATTR.TARGET_KEY) === TARGET_VAL.BACK;

const isContactLink = (element) =>
  isLink(element) && element.classList.contains(buttonClass[buttonKey.message]);

function handleClick(e) {
  const element = e.target;

  if (renderer.transition) {
    e.preventDefault();
    return;
  }

  if (!isRouterLink(element)) return;

  e.preventDefault();

  if (isContactLink(element)) {
    formController.setContactData(element.getAttribute('value'));
  }

  isHistoryLink(element) || isBackLink(element)
    ? router.replace(element)
    : router.push(element);

  renderer.update();
}

// @todo
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
  // if (pathname === router.route) {
  //   console.log(pathname, e);
  //   return;
  // }
  // // check pathname and prev route
  // // to see if it was a back event
  // // and call contactHandler.backward()
  // const isBackEvent = pathname === router.prevRoute;
  // if (isBackEvent) {
  //   formController.back();
  // }
  // const contactState = hasChanged ? CONTACT_VAL[0] : formController.get();
  // pathname = ROUTES.CONTACT + '/' + contactState;
  // if (hasChanged) {
  //   router.push(pathname);
  // } else {
  //   router.replace(pathname);
  // }
  // router.update(pathname);
  // await renderer.update();
  // formController.update(contactState);
}

function handlePopstate(e) {
  router.onPopstate(e);
  renderer.update();
}

// function handleEvent(e, pathname) {

// const { isContactRoute: wasContactRoute } = renderer.props;
// const isContactRoute = router.check(pathname, ROUTES.CONTACT);

// router.handle(e, pathname);

// if (isContactRoute) {
//   // await import contacts data
//   handleContactPage(e, pathname, wasContactRoute !== isContactRoute);
//   return;
// }

// const route =
//   e.type === 'popstate' ? router.replace(pathname) : router.push(pathname);

// if (route.hasChanged) {
//   // @consider => elements/header.js
//   elements.header.link.active = route.isAboutRoute ? route.prevRoute : false;
// }

//   renderer.update();
// }
