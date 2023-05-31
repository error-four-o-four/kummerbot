import router, { ROUTES } from '../router/router.js';
import elements from '../elements/elements.js';
import renderer from '../renderer/renderer.js';
import { delay } from '../renderer/animation.js';

import errorController from './error-controller.js';

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
    elements.form.element.reset();
  },
};

const VALUES = 'message captcha requesting responded'.split(' ');

const state = {
  prev: 0,
  index: 0,
};

export { VALUES as CONTACT_VAL };

let initiated = false;
let referrer = null;

export default {
  setContactData(value) {
    _requiredValue.reset();
    _requiredValue.email = value;
  },
  getContactData() {
    return _requiredValue.email;
  },
  setMessage() {
    _requiredValue.message = elements.form.textarea.value;
  },
  getMessage() {
    return _requiredValue.message;
  },
  hasCaptcha() {
    return false;
    // @todo
    // return !!_requiredValue.email;
  },

  get() {
    return VALUES[state.index];
  },
  set(value) {
    state.prev = state.index;
    state.index = VALUES.indexOf(value);
  },
  back() {
    state.prev = state.index;
    state.index = Math.max(state.index - 1, 0);
  },
  forward() {
    state.prev = state.index;
    state.index = Math.min(state.index + 1, VALUES.length);

    state.index === 1 && elements.form.hide();

    state.index === 2 && console.log('submitted captcha');
  },

  update(value) {
    // called post render
    if (!initiated) {
      // @consider => code splitting!
      !initiated &&
        elements.form.textarea.addEventListener('input', adjustTextareaValue);

      initiated = true;
    }

    const route = router.state;
    if (
      referrer !== route.prevRoute &&
      !router.check(route.prevRoute, ROUTES.CONTACT)
    ) {
      // update linkBack if state.index === 0;
      referrer = route.prevRoute;
    }

    if (!!value && value !== this.get()) {
      this.set(value);
    }

    if (state.index === 0) {
      const linkBack = elements.outlet.querySelector('chat-link[target=back]');
      !!linkBack && (linkBack.firstElementChild.href = referrer);
      elements.form.show();
    }

    // @todo
    // _state.index === 1 && elements.form.captcha.show()
  },
};

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

  const response = await sendMessage(
    _requiredValue.email,
    _requiredValue.message
  );

  if (!response.ok) {
    const route = router.replace(ROUTES.ERROR);
    errorController.set(
      'Leider konnte deine Nachricht nicht versendet werden.'
    );
    renderer.update(route);
    return;
  }

  _requiredValue.reset();

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
