import router from '../../router/router.js';
import elements from '../../elements/elements.js';
import renderer from '../../renderer/renderer.js';

import { ROUTES } from '../../router/config.js';

import errorController from '../error-controller.js';
import captchaValidator from './captcha-validator.js';

import { CONTACT_VAL, messageData } from './config.js';

import { delay } from '../../renderer/animation.js';

const state = {
  prev: 0,
  index: 0,
};

let initiated = false;

export default {
  setContactData(value) {
    messageData.reset();
    messageData.email = value;
  },
  getContactData() {
    return messageData.email;
  },
  setMessage() {
    messageData.message = elements.form.textarea.value;
  },
  getMessage() {
    return messageData.message;
  },
  hasCaptcha() {
    return false;
    // @todo
    // return !!_requiredValue.email;
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

  // @todo
  // _state.index === 1 && elements.form.captcha.show()
}

async function submitCaptchaForm() {
  const isValid = captchaValidator.validate();

  if (!isValid) {
    elements.form.captcha.setCustomValidity(captchaValidator.message);
    elements.form.checkValidity();
    elements.form.captcha.setCustomValidity('');
    return;
  }

  //   elements.form.captcha.removeEventListener(
  //     'input',
  //     captchaValidator.onInput.bind(captchaValidator)
  //   );

  state.next();
  // renderer.update(router.state);

  const response = await sendMessage(messageData.email, messageData.message);

  if (!response.ok) {
    errorController.set(
      'Leider konnte deine Nachricht nicht versendet werden.'
    );
    router.update(ROUTES.ERROR);
    renderer.update();
    return;
  }

  messageData.reset();

  state.next();
  // renderer.update(router.state);
}

// pseudo functionality
async function sendMessage(email, message) {
  await delay(5000);
  console.log('send', email, message);

  return {
    ok: true,
    // ok: false,
  };
}

// @todo window resized listener
// set cols of footer textarea

function adjustTextareaValue() {
  const { form } = elements;
  const maxColsCount = form.textarea.cols * 1;

  const output = [];

  let rows = form.textarea.value.split('\n');

  for (let i = 0; i < rows.length; i += 1) {
    let line = rows[i];

    if (line.length <= maxColsCount) {
      output.push(line);
      continue;
    }

    output.push(line.slice(0, maxColsCount), line.slice(maxColsCount));
  }

  if (form.rowsCount !== output.length) {
    form.rowsCount = Math.min(10, output.length);
    form.textarea.rows = form.rowsCount;
    form.textarea.value = output.join('\n');
  }
}
