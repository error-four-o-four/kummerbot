import router from '../../router/router.js';
import renderer from '../../renderer/renderer.js';
import templates from '../../controller/templates.js';
import formController from '../../controller/form-controller.js';

import { TARGET_VAL } from '../components.js';
import { setBooleanAttribute } from '../utils.js';

import { CUSTOM_ATTR } from './config.js';
import { createShareLinkHtml } from './utils.js';

export class ChatMessage extends HTMLElement {
  static get observedAttributes() {
    return [CUSTOM_ATTR.PENDING];
  }

  constructor() {
    super();
  }

  get requiresRender() {
    return !this.innerHTML && this.hasAttribute(CUSTOM_ATTR.TEMPLATE);
  }

  get requiresUpdate() {
    return this.hasAttribute(CUSTOM_ATTR.DYNAMIC);
  }

  render(moduleKey) {
    const templateId = this.getAttribute(CUSTOM_ATTR.TEMPLATE);
    this.innerHTML = templates.get('tmpl-' + templateId).innerHTML;

    if (!router.isContactRoute && moduleKey !== TARGET_VAL.SHARE) {
      return;
    }

    setBooleanAttribute(this, CUSTOM_ATTR.DYNAMIC);

    if (moduleKey === TARGET_VAL.SHARE) {
      const href = renderer.getShareUrl();
      this.innerHTML += createShareLinkHtml(href);
    }
  }

  update(moduleKey) {
    if (moduleKey === TARGET_VAL.SHARE) {
      const href = renderer.getShareUrl();
      const anchor = this.querySelector('a');

      if (anchor.href === href) return;

      this.querySelectorAll('button').forEach((button) =>
        button.setAttribute('value', href)
      );
      anchor.href = href;
      anchor.innerText = href;
      // console.log('updated share link');
      return;
    }

    if (router.isContactRoute) {
      console.log('@todo update', formController.get());
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

    // @consider
    // make renderer responsible for appending indicator

    if (prev === null && typeof next === 'string') {
      const indicator = document.createElement('span');
      indicator.id = 'message-pending-indicator';
      indicator.innerHTML = `<svg><use xlink:href="#message-pending"></use></svg>`;
      this.before(indicator);
      return;
    }

    // skip if message is cloned by templates.set
    if (!this.isConnected) {
      // console.log(this);
      return;
    }

    if (this.previousElementSibling.id === 'message-pending-indicator') {
      this.previousElementSibling.remove();
    }
  }
}
