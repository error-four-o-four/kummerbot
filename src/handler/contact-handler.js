import router from '../router/router.js';
import renderer from '../renderer/renderer.js';

import elements from '../elements/elements.js';
import { delay } from '../renderer/animation.js';

import { LINK_TAG, TARGET_VAL } from '../components/components.js';
import errorHandler from './error-handler.js';

let initiated = false;

const captchaValidator = {
  required: null,
  submitted: null,
  index: 0,
  messages: [
    'Leider nein.',
    'Nope!',
    'Nö',
    'Kann es sein, dass du kein Mensch bist?',
  ],
  get message() {
    this.index = (this.index + 1) % this.messages.length;
    return this.messages[this.index - 1];
  },
  onInput(e) {
    this.submitted = e.target.valueAsNumber;
  },
  isValid() {
    return this.required === this.submitted;
  },
};

const requiredValue = {
  email: null,
  message: null,
  reset() {
    this.email = null;
    this.message = null;
  },
};

const messageTmplAttributes = [
  ['message-tmpl-awaiting-message'],
  ['message-tmpl-preview-recipient', 'message-tmpl-awaiting-captcha'],
  ['message-tmpl-awaiting-response'],
  ['message-tmpl-response-success'],
];

const state = {
  index: 0,
  prev() {
    this.index = Math.max(this.index - 1, 0);
  },
  next() {
    this.index = Math.min(this.index + 1, this.values.length);
  },
};

export default {
  setEmail(value) {
    requiredValue.email = value;
  },
  getTemplateIds() {
    return messageTmplAttributes[state.index];
  },
  async adopt(e, route) {
    e.preventDefault();

    if (!requiredValue.email) {
      errorHandler.set('Die angegebene Adresse ist nicht erreichbar.');
      route = router.setLocation(router.routes.error);
      await renderer.update(route);
      return;
    }

    if (!initiated) {
      elements.form.element.addEventListener('submit', submitMessageForm);
      elements.form.textarea.addEventListener('input', adjustTextareaValue);
      initiated = true;
    }

    elements.form.show();
    renderer.update(route);
  },
  async handle(e, route) {
    const { target } = e;

    e.preventDefault();

    if (target.localName === LINK_TAG && target.target === TARGET_VAL.BACK) {
      state.prev();
    }
    renderer.update(route);

    if (state.index === 1) {
      // captcha
      return;
    }

    if (state.index === 0) {
      elements.form.show();
      return;
    }
  },
};

// @todo validate email
// with regex

function submitMessageForm(e) {
  e.preventDefault();

  const isValid = elements.form.element.reportValidity();

  if (!isValid) return;

  requiredValue.text = elements.form.textarea.value;
  elements.form.hide();
  state.next();

  renderer.update(router.state);

  // add captcha listener
  //   elements.form.captcha.addEventListener(
  //     'input',
  //     captchaValidator.onInput.bind(captchaValidator)
  //   );
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
  renderer.update(router.state);

  const response = await sendMessage(
    requiredValue.email,
    requiredValue.message
  );

  if (!response.ok) {
    const route = router.setLocation(router.routes.error);
    errorHandler.set('Leider konnte deine Nachricht nicht versendet werden.');
    renderer.update(route);
    return;
  }

  elements.form.element.reset();
  requiredValue.reset();

  state.next();
  renderer.update(router.state);
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
