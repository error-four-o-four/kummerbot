import { MESSAGE_TAG } from '../chat-message/index.js';
import { CONTACT_TAG } from '../contact-item/index.js';
import { LINK_TAG } from '../chat-link/index.js';

import cache from '../../renderer/cache-controller.js';
import templates from '../../renderer/templates.js';
import router, { fetchData } from '../../router/router.js';

import { renderData } from './config.js';

const CUSTOM_ATTR = {
  KEY: 'key',
  NEXT: 'next',
};

export class ChatModule extends HTMLElement {
  static get observedAttributes() {
    return [CUSTOM_ATTR.NEXT];
  }
  static setter(inst, attr, value) {
    !!value ? inst.setAttribute(attr, value) : inst.removeAttribute(attr);
  }

  constructor() {
    super();
  }

  set key(value) {
    ChatModule.setter(this, CUSTOM_ATTR.KEY, value);
  }
  get key() {
    return this.getAttribute(CUSTOM_ATTR.KEY);
  }

  set next(value) {
    ChatModule.setter(this, CUSTOM_ATTR.NEXT, value);
  }
  get next() {
    return this.getAttribute(CUSTOM_ATTR.NEXT);
  }

  get messages() {
    return [...this.querySelectorAll(`${MESSAGE_TAG}, ${CONTACT_TAG}`)];
  }

  get links() {
    return [...this.querySelectorAll(LINK_TAG)];
  }

  async render(keys) {
    const [prevKey, moduleKey, nextKey] = keys;

    // when key equals KEYS.SHARE
    // the id contains the prevKey too
    const templateId = cache.getTemplateId(keys);

    if (cache.isCached(templateId)) {
      const cloned = cache.clone(templateId);
      this.append(...cloned.children);
      // @todo seems hacky
      this.querySelectorAll(CONTACT_TAG).forEach(
        (child) => (child.loading = false)
      );

      this.key = moduleKey;
      if (nextKey) {
        this.next = nextKey;
      }
      return;
    }

    const path = router.getPathToChatFile(moduleKey);
    const { error, data } = await fetchData(path);

    if (error) {
      // @todo
      // handle / display error
      // renderer-utils createErrorChatMessage()
      // @consider
      // document.createElement(ChatMessage) (?)
      this.key = 'error';
      this.innerHTML = templates.getErrorTemplate(error);

      return;
    }

    const moduleHref = router.getHref(moduleKey);

    this.key = moduleKey;
    this.append(renderData(data, moduleHref, prevKey));

    const contacts = [...this.querySelectorAll(CONTACT_TAG)];
    // fetch contacts data
    if (contacts.length > 0) {
      import('../../data/index.js').then(async (module) => {
        contacts.forEach((contact) => {
          if (!contact.data) contact.loading = true;
        });

        // @todo error handling
        const { error, data } = await module.default();
        contacts.forEach((contact) => {
          contact.update(error, data);
          contact.loading = false;
        });

        cache.set(templateId, this);
      });
    } else {
      cache.set(templateId, this);
    }

    if (nextKey) {
      this.next = nextKey;
    }
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
