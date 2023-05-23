const wrap = document.querySelector('footer');
const element = document.querySelector('footer form');
const textarea = document.querySelector('footer textarea');

const attributes = {
  visbile: 'visible',
  hidden: 'aria-hidden',
};

const selectors = {
  formId: element.id,
  captchaId: 'contact-captcha',
};

export default {
  // props
  visible: false,
  rowsCount: 1,
  // dom elements
  wrap,
  element,
  textarea,
  createCaptchaHtml() {
    return `<input
  id="${selectors.captchaId}"
  name="${selectors.captchaId}"
  form="${selectors.formId}"
  type="number"
  required/>
    `;
  },
  get captcha() {
    return document.getElementById(selectors.captchaId);
  },
  // methods
  show() {
    this.visible = true;
    // css styles
    this.wrap.removeAttribute(attributes.hidden);
    this.wrap.setAttribute(attributes.visbile, true);
    this.textarea.focus();

    this.rowsCount = this.textarea.value.split('\n').length;
  },
  hide() {
    this.visible = false;
    // css styles
    this.wrap.removeAttribute(attributes.visbile);
    this.wrap.setAttribute(attributes.hidden, true);
  },
};
