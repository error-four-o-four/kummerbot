import templates, { MESSAGE_TMPL_KEY } from '../../renderer/templates.js';
import router from '../../router/router.js';

import { MESSAGE_TAG } from '../chat-message/index.js';
import { CONTACT_TAG } from '../contact-item/index.js';
import { LINK_TAG } from '../chat-link/index.js';

import { createModuleFragment } from './render.js';
import { setAttribute, getData, injectContactsData } from './utils.js';

const CUSTOM_ATTR = {
  KEY: 'key',
  NEXT: 'next',
};

export class ChatModule extends HTMLElement {
  static get observedAttributes() {
    return [CUSTOM_ATTR.NEXT];
  }

  constructor() {
    super();

    this._href = null;
  }

  // Setters and Getters

  set key(value) {
    setAttribute(this, CUSTOM_ATTR.KEY, value);
  }
  get key() {
    return this.getAttribute(CUSTOM_ATTR.KEY);
  }

  set next(value) {
    setAttribute(this, CUSTOM_ATTR.NEXT, value);
  }
  get next() {
    return this.getAttribute(CUSTOM_ATTR.NEXT);
  }

  get messages() {
    return [...this.querySelectorAll(`${MESSAGE_TAG}, ${CONTACT_TAG}`)];
  }
  get contacts() {
    return [...this.querySelectorAll(CONTACT_TAG)];
  }
  get links() {
    return [...this.querySelectorAll(LINK_TAG)];
  }

  // methods

  async render(keys) {
    const [prevKey, componentKey, nextKey] = keys;
    this._href = router.getHref(componentKey);

    // when key equals TARGTE_KEY.SHARE
    // the id contains the prevKey too
    const templateId = templates.hash(componentKey);

    // fetch data or get cached data
    const { error, data, wasCached } = await getData(templateId, componentKey);

    if (error) {
      // @todo error template
      const element = document.createElement(MESSAGE_TAG);
      element.setAttribute(MESSAGE_TMPL_KEY.ERROR, '');
      element.render();
      this.key = 'error';

      return;
    }

    this.append(
      createModuleFragment(data, wasCached, prevKey, componentKey, this._href)
    );

    this.key = componentKey;
    this.next = nextKey;

    // console.log('module', this.key, this._href);

    if (wasCached) return;

    if (this.contacts.length === 0) {
      templates.set(templateId, this);
      return;
    }

    injectContactsData(this.contacts, this._href).then(() => {
      templates.set(templateId, this);
    });
  }

  attributeChangedCallback(name, _, next) {
    if (name !== CUSTOM_ATTR.NEXT) return;

    if (next === null) {
      for (const link of this.links) {
        link.rejected = false;
        link.selected = false;
      }
      return;
    }

    for (const link of this.links) {
      if (link.target === next) {
        link.rejected = false;
        link.selected = true;
        continue;
      }

      link.rejected = true;
      link.selected = false;
    }
  }
}
