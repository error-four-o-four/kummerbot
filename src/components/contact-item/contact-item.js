import { ChatMessage } from '../chat-message/chat-message.js';

import { setBooleanAttribute } from '../utils.js';

import { CUSTOM_ATTR } from './config.js';
import { createFragment, injectContactData } from './utils.js';

export class ContactItem extends ChatMessage {
  static get observedAttributes() {
    return [CUSTOM_ATTR.LOADING];
  }

  constructor() {
    super();
  }

  get key() {
    return this.getAttribute(CUSTOM_ATTR.KEY);
  }

  set loading(value) {
    this.toggleAttribute(CUSTOM_ATTR.LOADING, !!value);
    this.lastElementChild.lastElementChild.classList.toggle(
      'is-transparent',
      !!value
    );
  }
  get loading() {
    return this.hasAttribute(CUSTOM_ATTR.LOADING);
  }

  set loaded(value) {
    setBooleanAttribute(this, CUSTOM_ATTR.LOADED, value);
  }
  get loaded() {
    return this.hasAttribute(CUSTOM_ATTR.LOADED);
  }

  set error(value) {
    setBooleanAttribute(this, CUSTOM_ATTR.ERROR, value);
  }
  get error() {
    return this.hasAttribute(CUSTOM_ATTR.ERROR);
  }

  render() {
    this.append(createFragment(this.key));
  }

  renderError(message) {
    this.lastElementChild.classList.add('error');
    this.lastElementChild.firstElementChild.innerText = message;
  }

  injectData(error, contacts) {
    if (error) {
      this.renderError(error);
      this.error = true;
      return;
    }

    const contactData = contacts.filter((item) => item.key === this.key)[0];

    if (!contactData) {
      this.renderError('Keine Daten vorhanden');
      this.error = true;
    } else {
      injectContactData(this, contactData);
    }

    this.loading = false;
    this.loaded = true;
  }
}
