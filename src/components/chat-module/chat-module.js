import { CUSTOM_ATTR, CUSTOM_VAL } from './config.js';

import templates from '../../templates/templates.js';
import router from '../../router/router.js';

import { MESSAGE_TAG, CONTACT_TAG, LINK_TAG } from '../components.js';
import { setAttribute } from '../utils.js';

import {
  cloneFragment,
  createFragment,
  createErrorFragment,
  injectContactsData,
  adjustLinks,
} from './utils.js';

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

  async render(keys, route) {
    const [prevKey, moduleKey, nextKey] = keys;

    this.key = moduleKey;

    const cacheId = templates.getId(this);
    const isCached = templates.isCached(cacheId);
    console.log(
      `rendering a ${isCached ? 'cached' : 'new'} ${cacheId} ChatModule`
    );

    if (isCached) {
      const fragment = templates.get(cacheId).content;
      this.append(cloneFragment(fragment));
      this.update(prevKey, route);
      this.next = nextKey;
      return;
    }

    // calls method render() of every child
    const fragment = await createFragment(moduleKey);

    if (!fragment) {
      this.key = CUSTOM_VAL.ERROR;
      this.append(createErrorFragment(this.key));
      this.update(prevKey, route);
      this.next = null;
      return;
    }

    this.append(fragment);
    this.update(prevKey, route);
    this.next = nextKey;
  }

  update(prevModuleKey, route) {
    const moduleHref = router.getHref(this.key);
    const deferCache = !!this.contacts.length;

    // update share link
    // update captcha
    this.messages
      .filter((message) => message.requiresUpdate)
      .forEach((message) => message.update(key));

    // insert/remove links depending on routerState
    adjustLinks(this, deferCache, prevModuleKey, route);

    // update created links
    this.links.forEach((link) => link.update(this.key, moduleHref, route));

    const cacheId = templates.getId(this);
    const isCached = templates.isCached(cacheId);

    if (isCached) return;

    if (!deferCache) {
      templates.set(cacheId, this);
      return;
    }

    injectContactsData(this.contacts).then(() => {
      templates.set(cacheId, this, true);
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
