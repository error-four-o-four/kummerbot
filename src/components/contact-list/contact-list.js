import { ChatMessage } from '../chat-message/chat-message.js';
import { setBooleanAttribute } from '../utils.js';

import { ERROR_KEY } from '../../controller/error-controller.js';
import { MESSAGE_ATTR } from '../components.js';
import { CUSTOM_ATTR, CUSTOM_VAL } from './config.js';
import { createItemHtml } from './utils.js';

import utils from '../../renderer/animation/utils.js';
import config from '../../renderer/animation/config.js';

import { getContactsData } from '../../controller/data-controller.js';

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
    this.resolvePromise = null;
    this.loadedPromise = new Promise(
      (resolve) => (this.resolvePromise = resolve)
    );

    // const { getContactsData } = await import(
    //   '../../controller/data-controller.js'
    // );
    const { error, data } = await getContactsData();

    if (error) {
      // meh
      setBooleanAttribute(this, MESSAGE_ATTR.DYNAMIC, true);
      this.loaded = true;
      this.innerHTML = templates.get('tmpl-' + ERROR_KEY).innerHTML;
      this.update();

      this.classList.add(config.isTransparentClass);
      utils.createFadeInAnimation(this).play();
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
    this.loaded = true;
    this.resolvePromise();
  }
}
