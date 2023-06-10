import messageForm from '../../elements/form-message.js';
import captchaForm from '../../elements/form-captcha.js';
import captchaValidator from './captcha-validator.js';

import { CONTACT_VAL, messageData } from './config.js';

let state = 0;

export default {
  resetContactData() {
    messageData.reset();
    messageForm.element.reset();
    captchaForm.element.reset();
  },
  setContactData(contact) {
    this.resetContactData();
    messageData.set(contact);
  },
  hasContactData() {
    return messageData.mail !== null;
  },
  getRandomCaptchaValues() {
    const numA = Math.floor(5 + Math.random() * 9);
    const numB = Math.floor(1 + Math.random() * 9);

    captchaValidator.required = numA + numB;

    return [numA, numB];
  },
  get name() {
    return messageData.name;
  },
  get mail() {
    return messageData.mail;
  },
  get message() {
    return messageData.message;
  },

  get() {
    return CONTACT_VAL[state];
  },
  // set(), back() and forward() are called before renderer.update()
  set(value) {
    state = CONTACT_VAL.indexOf(value);
  },
  back() {
    state = Math.max(state - 1, 0);
    hideElements();

    // @todo popstate event captcha => message
    // hide captcha => handle popstate
  },
  forward() {
    state = Math.min(state + 1, CONTACT_VAL.length);
    hideElements();

    return CONTACT_VAL[state];
  },
  checkValidity() {
    if (state === 0) {
      // /contact/message
      if (!messageForm.element.reportValidity()) {
        return false;
      } else {
        messageData.message = messageForm.get();
        return true;
      }
    }

    if (state === 1) {
      // /contact/captcha
      return captchaForm.validate();
    }

    return true;
  },

  // update() is called after renderer.update()
  update() {
    messageForm.init();
    captchaForm.init();

    state === 0 && messageForm.show();
    state === 1 && captchaForm.show();
  },
};

function hideElements() {
  messageForm.visible && messageForm.hide();
  captchaForm.visible && captchaForm.hide();
}
