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

// @todo window resized listener
// set cols of footer textarea

// function adjustTextareaValue() {
//   const { form } = elements;
//   const maxColsCount = form.textarea.cols * 1;

//   const output = [];

//   let rows = form.textarea.value.split('\n');

//   for (let i = 0; i < rows.length; i += 1) {
//     let line = rows[i];

//     if (line.length <= maxColsCount) {
//       output.push(line);
//       continue;
//     }

//     output.push(line.slice(0, maxColsCount), line.slice(maxColsCount));
//   }

//   // @todo split if there's no seperating space !
//   // @todo set row by calculating lineHeight / scrollHeight !!

//   if (form.rowsCount !== output.length) {
//     form.rowsCount = Math.min(10, output.length);
//     form.textarea.rows = form.rowsCount;
//     // form.textarea.value = output.join('\n');
//   }
// }
