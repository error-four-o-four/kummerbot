import elements from '../../elements/elements.js';
import captchaValidator from './captcha-validator.js';

import { CONTACT_VAL, messageData } from './config.js';

// import { delay } from '../../renderer/animation/utils.js';

const state = {
  prev: 0,
  index: 0,
};

let initiated = false;

export default {
  hasContactData() {
    return messageData.mail !== null;
  },
  setContactData(contact) {
    messageData.reset();
    messageData.set(contact);
  },
  setMessage() {
    messageData.message = elements.form.textarea.value;
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
    return state.index === index;
  },
  get() {
    return CONTACT_VAL[state.index];
  },
  // set(), back() and forward() are called before renderer.update()
  set(value) {
    state.prev = state.index;
    state.index = CONTACT_VAL.indexOf(value);
  },
  back() {
    state.prev = state.index;
    state.index = Math.max(state.index - 1, 0);

    hideElements();
  },
  forward() {
    state.prev = state.index;
    state.index = Math.min(state.index + 1, CONTACT_VAL.length);

    hideElements();
  },

  // update() is called after renderer.update()
  update() {
    if (!initiated) {
      // @consider => code splitting!
      !initiated &&
        elements.form.textarea.addEventListener('input', adjustTextareaValue);

      initiated = true;
    }

    showElements();
  },
};

function hideElements() {
  state.index === 1 && elements.form.visible && elements.form.hide();

  state.index === 2 && console.log('submitted captcha');
}

function showElements() {
  state.index === 0 && elements.form.show();

  // @todo call adjustTextareaValue

  // @todo
  // _state.index === 1 && elements.form.captcha.show()
}
