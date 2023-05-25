import { CUSTOM_ATTR } from './config.js';

import templates from '../../templates/templates.js';
import router from '../../router/router.js';

import {
  MESSAGE_TAG,
  CONTACT_TAG,
  LINK_TAG,
  TARGET_VAL,
} from '../components.js';

import {
  setAttribute,
  getModuleElements,
  injectContactsData,
} from './utils.js';

import { createModuleFragment } from './render-utils.js';

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
    const [prevKey, moduleKey, nextKey] = keys;
    const moduleHref = router.getHref(moduleKey);

    // when key equals TARGTE_KEY.SHARE
    // the id contains the prevKey too
    const templateId = templates.hash(moduleKey);

    // fetch data or get cached data
    const { error, moduleElements, moduleWasCached } = await getModuleElements(
      templateId,
      moduleKey
    );

    if (error) {
      // @todo pass error message as argument
      const element = document.createElement(MESSAGE_TAG);
      // element.setAttribute(MESSAGE_TMPL_KEY.ERROR, '');
      // element.render();
      element.innerHTML = '<p>@todo Fehler</p>';
      this.key = TARGET_VAL.ERROR;

      return;
    }

    const properties = {
      prevKey,
      moduleKey,
      moduleHref,
      moduleWasCached,
    };

    this.append(createModuleFragment(moduleElements, properties));

    this.key = moduleKey;
    this.next = nextKey;

    if (moduleWasCached) return;

    if (this.contacts.length === 0) {
      templates.set(this, templateId);
      return;
    }

    // @todo this._href should be obsolete
    injectContactsData(this.contacts).then(() => {
      templates.set(this, templateId, true);
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
