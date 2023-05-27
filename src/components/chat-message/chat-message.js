import { CUSTOM_ATTR } from './config.js';

import router from '../../router/router.js';
import templates from '../../templates/templates.js';
import errorHandler from '../../handler/error-handler.js';
import contactHandler from '../../handler/contact-handler.js';

import { MODULE_VAL, TARGET_VAL } from '../components.js';
import { setBooleanAttribute } from '../utils.js';

import { createErrorTemplate, createShareLinkHtml } from './utils.js';

createErrorTemplate();

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
    this.innerHTML = templates.get(templateId).innerHTML;

    if (moduleKey === MODULE_VAL.ERROR) {
      const error = errorHandler.get();

      !!error && (this.firstElementChild.innerHTML += `<br />${error}`);

      return;
    }

    if (![TARGET_VAL.SHARE, MODULE_VAL.CONTACT].includes(moduleKey)) return;

    setBooleanAttribute(this, CUSTOM_ATTR.DYNAMIC);

    if (moduleKey === TARGET_VAL.SHARE) {
      const href = router.getShareUrl();
      this.innerHTML += createShareLinkHtml(href);
    }

    if (moduleKey === MODULE_VAL.CONTACT) {
      console.log('@todo render', contactHandler);
    }
  }

  update(moduleKey) {
    if (moduleKey === TARGET_VAL.SHARE) {
      const href = router.getShareUrl();
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

    if (moduleKey === MODULE_VAL.CONTACT) {
      console.log('@todo update', contactHandler);
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
      console.log(this);
      return;
    }

    if (this.previousElementSibling.id === 'message-pending-indicator') {
      this.previousElementSibling.remove();
    }
  }
}
