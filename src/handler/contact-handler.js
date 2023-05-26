import router from '../router/router.js';
import renderer from '../renderer/renderer.js';

import elements from '../elements/elements.js';
import { delay } from '../renderer/animation.js';

import { TARGET_VAL } from '../components/components.js';

let requiredEmailValue = null;
let requiredCaptchaValue = null;
let submittedCaptchaValue = null;
let requiredTextareaValue = null;

let processingMessage = false;

const sendMessage = async () => {
  // @todo
  // pseudo functionality
  await delay(5000);
  console.log('send', requiredEmailValue, requiredTextareaValue);

  requiredEmailValue = null;
  requiredCaptchaValue = null;
  submittedCaptchaValue = null;
  requiredTextareaValue = null;
};

export default {
  set email(value) {
    requiredEmailValue = value;
  },
  get email() {
    return requiredEmailValue;
  },
  set captcha(value) {
    requiredCaptchaValue = value;
  },
  get captcha() {
    return requiredCaptchaValue;
  },
  get processing() {
    return processingMessage;
  },
  addEventListeners() {
    elements.form.element.addEventListener('submit', submitMessageForm);
    elements.form.textarea.addEventListener('input', adjustTextareaValue);
  },
  addCaptchaListener() {
    elements.form.captcha.addEventListener('input', onCaptchaInput);
  },
  removeCaptchaListener() {
    elements.form.captcha.removeEventListener('input', onCaptchaInput);
  },
};

const customValidities = [
  'Leider nein.',
  'Nope!',
  'Nööö',
  'Kann es sein, dass du kein Mensch bist?',
];

let index = 0;

const increment = () => {
  index = (index + 1) % customValidities.length;
};

function onCaptchaInput(e) {
  submittedCaptchaValue = e.target.valueAsNumber;
}

function submitMessageForm(e) {
  const { form } = elements;

  e.preventDefault();

  // @todo validate email
  // with regex

  // @todo
  // in router before rendering ChatModule message !!
  // in updateChatElements()

  if (requiredCaptchaValue !== submittedCaptchaValue) {
    // set validity on captcha
    form.captcha.setCustomValidity(customValidities[index]);
    increment();
  }

  const valid = form.element.reportValidity();

  if (!valid) {
    // reset validity on captcha
    form.captcha.setCustomValidity('');
    return;
  }

  requiredTextareaValue = form.textarea.value;
  form.element.reset();

  // @todo
  // set attribute 'pending' of ChatMessage
  processingMessage = true;
  sendMessage().then(() => (processingMessage = false));

  const route =
    '/' + router.keys.slice(0, -1).join('/') + '/' + TARGET_VAL.PROCESSED;
  router.setLocation(route);
  renderer.update();
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
