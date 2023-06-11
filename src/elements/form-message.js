import footer from './footer.js';

const id = {
  form: 'contact-message-form',
  textarea: 'contact-message-textarea',
};

const label = {
  placeholder: 'Nachricht',
  button: 'Absenden',
};

const attributes = {
  maxlength: 1000,
};

const form = footer.element.appendChild(document.createElement('form'));

form.id = id.form;
form.innerHTML = `
  <div>
    <textarea
      id="${id.textarea}"
      name="${id.textarea}"
      required
      rows="1"
      placeholder="${label.placeholder}"
      maxlength="${attributes.maxlength}"></textarea>
  </div>
  <div>
    <button type="submit">${label.button}</button>
  </div>`;

const textarea = form.querySelector('textarea');

let initiated = false;

export default {
  element: form,
  visible: false,
  // props
  get() {
    return textarea.value;
  },
  // methods
  init() {
    if (initiated) return;

    initiated = true;
    textarea.addEventListener('input', adjustTextareaHeight);
  },
  show() {
    this.visible = true;
    this.element.style.display = 'grid';
    footer.show();
    textarea.focus();
  },
  async hide() {
    await footer.hide();
    this.element.style.display = 'none';
    this.visible = false;
  },
};

const px2num = (string) => 1 * string.replace('px', '');

const computed = window.getComputedStyle(textarea);

const [lineHeight, paddingTop, paddingBottom] = [
  'lineHeight',
  'paddingTop',
  'paddingBottom',
].map((prop) => px2num(computed[prop]));

const verticalPadding = paddingTop + paddingBottom;

let scrollHeight = textarea.scrollHeight;
let deltaHeight = 0;

function adjustTextareaHeight() {
  textarea.rows = 1;

  scrollHeight = textarea.scrollHeight;
  deltaHeight = scrollHeight - verticalPadding;
  const lines = Math.round(deltaHeight / lineHeight);
  textarea.rows = Math.max(1, Math.min(lines, 20));
}
