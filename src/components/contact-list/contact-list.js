import { ChatMessage } from '../chat-message/chat-message.js';
import { setBooleanAttribute } from '../utils.js';

import { CUSTOM_ATTR, CUSTOM_VAL } from './config.js';
import { createItemHtml } from './utils.js';

export class ContactList extends ChatMessage {
  static get observedAttributes() {
    // pending ??
    // return [CUSTOM_ATTR.LOADED];
  }

  constructor() {
    super();
  }

  get key() {
    return this.getAttribute(CUSTOM_ATTR.KEY);
  }

  set loading(value) {
    this.toggleAttribute(CUSTOM_ATTR.LOADING, !!value);
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

  async render() {
    const { getContactsData } = await import(
      '../../controller/data-controller.js'
    );
    const { error, data } = await getContactsData();

    if (error) {
      // meh
      setBooleanAttribute(this, MESSAGE_ATTR.DYNAMIC, true);
      this.innerHTML = templates.get('tmpl-' + ERROR_KEY).innerHTML;
      this.update();
      return;
    }

    const contacts =
      this.key === CUSTOM_VAL.ALL
        ? data
        : data.filter((item) => item.tag.includes(this.key));

    const fragment = new DocumentFragment();

    for (const item of contacts) {
      const element = document.createElement('div');
      element.classList.add('contact-item');
      element.innerHTML = createItemHtml(item);
      fragment.append(element);
    }

    this.append(fragment);
  }
}
