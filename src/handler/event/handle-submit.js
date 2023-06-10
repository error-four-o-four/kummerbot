import router from '../../router/router.js';
import renderer from '../../renderer/renderer.js';

import historyController from '../../controller/history-controller.js';
import errorController from '../../controller/error-controller.js';
import formController from '../../controller/form/form-controller.js';
import messageForm from '../../elements/form-message.js';

import { CONTACT_VAL, SUBMIT_ATTR } from '../../controller/form/config.js';
import { ORIGIN, ROUTES } from '../../router/config.js';
import { delay } from '../../renderer/animation/utils.js';

export default (e) => {
  e.preventDefault();

  const isValid = formController.checkValidity();

  if (!isValid) return;

  // update state
  const formState = formController.forward();

  // set route
  let pathname = ROUTES.CONTACT + '/' + formState;

  // push: /contact/message, /contact/captcha
  // update historyController index
  if (formState === CONTACT_VAL[1]) {
    historyController.add(pathname);
  }

  // /contact/message
  // pop: /contact/requesting
  if (formState === CONTACT_VAL[2]) {
    historyController.back();
    // dispatch another submit event
    // when message has been send
    sendMessage();
  }

  // replace: /contact/responded
  if (formState === CONTACT_VAL[3]) {
    // check response status
    // sendMessage adds attribute to submitter 'form'
    if (e.submitter.hasAttribute(SUBMIT_ATTR)) {
      e.submitter.removeAttribute(SUBMIT_ATTR);
      formController.resetContactData();
    } else {
      // message was send
      // but an error occured
      // @todo
      // fix: message is not displayed (?)
      errorController.set(
        'Leider konnte deine Nachricht nicht zugestellt werden.'
      );
      pathname = ROUTES.ERROR;
    }
  }

  const href = ORIGIN + pathname;
  router.replace({ href, pathname });
  renderer.update();
};

async function sendMessage() {
  await delay(1500);

  // handle error
  // only set attribute when response status was ok
  messageForm.element.setAttribute(SUBMIT_ATTR, true);

  const e = new SubmitEvent('submit', { submitter: messageForm.element });
  window.dispatchEvent(e);
}
