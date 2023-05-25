import { CUSTOM_ATTR } from './config.js';

import router from '../../router/router.js';
import templates from '../../templates/templates.js';

import { TARGET_VAL } from '../components.js';

export class ChatMessage extends HTMLElement {
  static get observedAttributes() {
    return [CUSTOM_ATTR.PENDING];
  }

  constructor() {
    super();
  }

  render(properties) {
    const { moduleWasCached, moduleKey } = properties;
    const templateId = this.attributes[0].name;

    // @consider
    // get contents via attributes
    if (!this.innerHTML) {
      this.innerHTML = templates.get(templateId);
      return;
    }

    // if (!moduleWasCached && moduleKey !== TARGET_VAL.SHARE) {
    // }

    if (!moduleWasCached && moduleKey === TARGET_VAL.SHARE) {
      // @todo compare links ???
      console.log('create share link');
      return;
    }

    if (moduleWasCached && moduleKey === TARGET_VAL.SHARE) {
      // @todo compare links ???
      console.log('update share link');
      return;
    }
  }

  set pending(value) {
    this.toggleAttribute(CUSTOM_ATTR.PENDING, !!value);
  }
  get pending() {
    this.getAttribute(CUSTOM_ATTR.PENDING);
  }

  attributeChangedCallback(name, prev, next) {
    // ContactItem component extends ChatMessage
    // which doesn't use this loading indicator
    if (name !== CUSTOM_ATTR.PENDING) return;

    if (prev === null && typeof next === 'string') {
      const indicator = document.createElement('span');
      indicator.id = 'message-pending-indicator';
      indicator.innerHTML = `<svg><use xlink:href="#message-pending"></use></svg>`;
      this.before(indicator);
      return;
    }

    // guard case necessary ?
    this.previousElementSibling.remove();
  }
}
