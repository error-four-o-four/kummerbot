import { ChatMessage } from '../chat-message/chat-message.js';
import { setBooleanAttribute } from '../utils.js';

import { CUSTOM_ATTR } from './config.js';
import { createItemHtml } from './utils.js';

export class ContactList extends ChatMessage {
  constructor() {
    super();
  }

  get loaded() {
    return this.hasAttribute(CUSTOM_ATTR.LOADED);
  }
  set loaded(value) {
    setBooleanAttribute(this, CUSTOM_ATTR.LOADED, !!value);
  }

  render(filteredContacts) {
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
