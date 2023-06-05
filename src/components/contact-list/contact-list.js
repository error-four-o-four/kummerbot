import { ChatMessage } from '../chat-message/chat-message.js';
import { setBooleanAttribute } from '../utils.js';

import { CUSTOM_ATTR, CUSTOM_VAL } from './config.js';
import { createItemHtml } from './utils.js';

import contacts from '../../data/contacts.js';

export class ContactList extends ChatMessage {
  constructor() {
    super();
  }

  get key() {
    return this.getAttribute(CUSTOM_ATTR.KEY);
  }

  get loaded() {
    return this.hasAttribute(CUSTOM_ATTR.LOADED);
  }
  set loaded(value) {
    setBooleanAttribute(this, CUSTOM_ATTR.LOADED, !!value);
  }

  async render() {
    const filteredContacts =
      this.key === CUSTOM_VAL.ALL
        ? contacts
        : contacts.filter((item) => item.tag.includes(this.key));

    const fragment = new DocumentFragment();

    for (const item of filteredContacts) {
      const element = document.createElement('div');
      element.classList.add('contact-item');
      element.innerHTML = createItemHtml(item);
      fragment.append(element);
    }

    this.append(fragment);
  }
}
