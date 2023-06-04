import elements from '../../elements/elements.js';

export const messageData = {
  email: null,
  message: null,
  reset() {
    this.email = null;
    this.message = null;
    elements.form.element.reset();
  },
};

export const CONTACT_VAL = 'message captcha requesting responded'.split(' ');
