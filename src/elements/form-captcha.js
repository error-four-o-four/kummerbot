import captchaValidator from '../controller/form/captcha-validator.js';
import footer from './footer.js';

const id = {
  form: 'contact-captcha-form',
  input: 'contact-captcha-input',
};

const label = {
  button: 'OK',
};

const form = footer.element.appendChild(document.createElement('form'));

form.id = id.form;
form.style.display = 'none';
form.innerHTML = `
  <div>
		<input
      id="${id.input}"
      name="${id.input}"
			type="number"
			min="0"
			max="9999"
			required>
  </div>
  <div>
    <button type="submit">${label.button}</button>
  </div>`;

const input = form.querySelector('input');

let initiated = false;

export default {
  element: form,
  visible: false,
  // props
  get() {
    return input.value;
  },
  init() {
    if (initiated) return;

    initiated = true;
    input.addEventListener('input', setInputValue);
  },
  show() {
    this.visible = true;
    this.element.style.display = 'grid';
    footer.show();
    input.focus();
  },
  async hide() {
    await footer.hide();
    this.element.style.display = 'none';
    this.visible = false;
  },
  validate() {
    if (captchaValidator.isValid()) return true;

    input.setCustomValidity(captchaValidator.message);
    form.reportValidity();
    input.setCustomValidity('');

    return false;
  },
};

function setInputValue(e) {
  captchaValidator.submitted = e.target.valueAsNumber;
}
