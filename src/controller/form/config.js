export const CONTACT_VAL = 'message captcha requesting responded'.split(' ');

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
  },
};
