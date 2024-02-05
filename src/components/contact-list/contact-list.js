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
    // @todo quick hardcoded hack:
    // just remove all children
    if (this.children.length > 0) {
      console.log('removing rendered children');
      for (let i = this.children.length - 1; i >= 0; i -= 1) {
        this.children[i].remove();
      }
    }

    // @todo compare rendered children
    // remove unnecessary ones
    // add required ones
    // utilise attribute (like this.rendered etc.)

    const fragment = new DocumentFragment();

    for (const item of filteredContacts) {
      const element = document.createElement('div');
      // element.id = `item-${item._id}`;
      element.classList.add('contact-item');
      element.innerHTML = createItemHtml(item);
      fragment.append(element);
    }

    this.append(fragment);
  }
}
