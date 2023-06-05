import messageForm from '../../elements/form-message.js';
import captchaForm from '../../elements/form-captcha.js';
import captchaValidator from './captcha-validator.js';

import { CONTACT_VAL, messageData } from './config.js';

// import { delay } from '../../renderer/animation/utils.js';

let state = 0;

export default {
  hasContactData() {
    return messageData.mail !== null;
  },
  setContactData(contact) {
    messageForm.element.reset();
    messageData.reset();
    messageData.set(contact);
  },
  setMessage() {
    messageData.message = messageForm.get();
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
  getRandomCaptchaValues() {
    const numA = Math.floor(5 + Math.random() * 9);
    const numB = Math.floor(1 + Math.random() * 9);

    captchaValidator.required = numA + numB;

    return [numA, numB];
  },

  check(value) {
    const index = CONTACT_VAL.indexOf(value);
    return state === index;
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
  },
  forward() {
    state = Math.min(state + 1, CONTACT_VAL.length);
    hideElements();
  },

  // update() is called after renderer.update()
  update() {
    messageForm.init();
    captchaForm.init();

    showElements();
  },
};

function hideElements() {
  state === 1 && messageForm.visible && messageForm.hide();

  state === 2 && captchaForm.hide();
}

function showElements() {
  state === 0 && messageForm.show();

  state === 1 && captchaForm.show();
}
