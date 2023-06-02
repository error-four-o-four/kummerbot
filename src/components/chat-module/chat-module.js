import router from '../../router/router.js';
import renderer from '../../renderer/renderer.js';
import templates from '../../controller/templates.js';

import { MESSAGE_TAG, CONTACT_TAG, LINK_TAG } from '../components.js';
import { ERROR_KEY } from '../../controller/error-controller.js';
import { setAttribute } from '../utils.js';

import {
  cloneFragment,
  createFragment,
  createErrorFragment,
  injectContactsData,
} from './renderer.js';

import { CUSTOM_ATTR, CUSTOM_TAG } from './config.js';

export class ChatModule extends HTMLElement {
  static get observedAttributes() {
    return [CUSTOM_ATTR.NEXT];
  }

  constructor() {
    super();
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
    return [...this.querySelectorAll(MESSAGE_TAG)];
  }
  get contacts() {
    return [...this.querySelectorAll(CONTACT_TAG)];
  }
  get links() {
    return [...this.querySelectorAll(LINK_TAG)];
  }

  // methods

  async render(relativeKeys) {
    // moduleKey represents the file name
    // special case: /contact route (one file stores several message templates)
    const prevModuleKey = relativeKeys[0];
    const moduleKey = router.isContactRoute
      ? [renderer.keys[0], renderer.keys[1]].join('-')
      : relativeKeys[1];
    const nextModuleKey = relativeKeys[2];

    const cacheId = templates.getId(CUSTOM_TAG, moduleKey);
    const isCached = templates.isCached(cacheId);

    console.log(
      `rendering a ${
        isCached ? 'cached' : 'new'
      } ${cacheId} ChatModule ${moduleKey}`
    );

    // debugger

    const fragment = isCached
      ? cloneFragment(templates.get(cacheId).content, prevModuleKey, moduleKey)
      : await createFragment(prevModuleKey, moduleKey);

    if (!fragment) {
      this.key = ERROR_KEY;
      this.append(createErrorFragment(this.key, router.prevRoute));
      this.next = null;
      return;
    }

    this.key = moduleKey;
    this.append(fragment);

    const deferCache = !!this.contacts.length;

    if (!isCached && !deferCache) {
      templates.set(cacheId, this);
    }

    if (!isCached && deferCache) {
      injectContactsData(this.contacts).then(() => {
        templates.set(cacheId, this, true);
      });
    }

    router.isChatRoute && (this.next = nextModuleKey);
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
