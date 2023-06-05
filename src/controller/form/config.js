import elements from '../../elements/elements.js';

export const messageData = {
  name: null,
  mail: null,
  message: null,
  set({ name, mail }) {
    this.name = name;
    this.mail = mail;
  },
  reset() {
    this.mail = null;
    this.message = null;
    elements.form.element.reset();
  },
};

export const CONTACT_VAL = 'message captcha requesting responded'.split(' ');
