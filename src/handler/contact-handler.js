import router, { ROUTES } from '../router/router.js';
import elements from '../elements/elements.js';
import renderer from '../renderer/renderer.js';
import { delay } from '../renderer/animation.js';

import errorHandler from './error-handler.js';
import { handleEvent } from './event-handler.js';

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

const _requiredValue = {
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

const _state = {
  values: 'message captcha requesting responded'.split(' '),
  index: 0,
  get current() {
    return this.values[this.index];
  },
  prev() {
    this.index = Math.max(this.index - 1, 0);
  },
  next() {
    this.index = Math.min(this.index + 1, this.values.length);
  },
};

export default {
  setContactData(value) {
    _requiredValue.email = value;
  },
  hasContactData() {
    return !!_requiredValue.email;
  },
  get step() {
    return _state.current;
  },
  getTemplateIds() {
    return messageTmplAttributes[_state.index];
  },
  handle() {
    if (_state.index === 0) {
      elements.form.show();

      // @consider
      !initiated &&
        elements.form.element.addEventListener('submit', submitMessageForm);
      !initiated &&
        elements.form.textarea.addEventListener('input', adjustTextareaValue);

      initiated = true;
    }

    if (_state.index === 1) {
      // attach captcha listener
    }
  },
};

// @todo validate email
// with regex

function submitMessageForm(e) {
  const isValid = elements.form.element.reportValidity();

  if (!isValid) return;

  _requiredValue.text = elements.form.textarea.value;

  elements.form.hide();
  _state.next();

  handleEvent(e);
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

  _state.next();
  renderer.update(router.state);

  const response = await sendMessage(
    _requiredValue.email,
    _requiredValue.message
  );

  if (!response.ok) {
    const route = router.replace(ROUTES.ERROR);
    errorHandler.set('Leider konnte deine Nachricht nicht versendet werden.');
    renderer.update(route);
    return;
  }

  elements.form.element.reset();
  _requiredValue.reset();

  _state.next();
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
