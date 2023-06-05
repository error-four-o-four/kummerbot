import router from '../../router/router.js';
import renderer from '../../renderer/renderer.js';
import templates from '../../controller/templates.js';
import formController from '../../controller/form/form-controller.js';

import { TARGET_VAL } from '../components.js';
import { setBooleanAttribute } from '../utils.js';
import { getContactTmplAttributes } from '../chat-module/utils.js';

import { CONTACT_VAL } from '../../controller/form/config.js';
import { CUSTOM_ATTR } from './config.js';

import {
  createShareLinkHtml,
  injectContactMessage,
  injectContactName,
  setCaptchaValue,
  updateShareLink,
} from './utils.js';

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

    setBooleanAttribute(this, CUSTOM_ATTR.DYNAMIC, true);

    if (moduleKey === TARGET_VAL.SHARE) {
      const href = renderer.getShareUrl();
      this.innerHTML += createShareLinkHtml(href);
    }
  }

  update(moduleKey) {
    if (moduleKey === TARGET_VAL.SHARE) {
      const href = renderer.getShareUrl();
      updateShareLink(this, href);
      return;
    }

    if (router.isContactRoute) {
      const attributeValue = this.getAttribute(CUSTOM_ATTR.TEMPLATE);
      const templateValues = getContactTmplAttributes(formController.get());

      if (!formController.hasContactData()) {
        console.log('@todo route to /error');
        return;
      }

      if (formController.check(CONTACT_VAL[0])) {
        injectContactName(this);
        return;
      }

      if (
        formController.check(CONTACT_VAL[1]) &&
        attributeValue === templateValues[0]
      ) {
        // message was set in handleSubmit()
        injectContactName(this);
        injectContactMessage(this);
        return;
      }

      if (
        formController.check(CONTACT_VAL[1]) &&
        attributeValue === templateValues[1]
      ) {
        setCaptchaValue(this);
        return;
      }
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

    const indicatorId = 'message-pending-indicator';
    // @consider
    // make renderer responsible for appending indicator
    if (prev === null && typeof next === 'string') {
      const indicator = document.createElement('span');
      indicator.id = indicatorId;
      indicator.innerHTML = `<svg><use xlink:href="#message-pending"></use></svg>`;
      this.before(indicator);
      return;
    }

    // skip if message is cloned by templates.set
    if (!this.isConnected) {
      // console.log(this);
      return;
    }

    if (this.previousElementSibling.id === indicatorId) {
      this.previousElementSibling.remove();
    }
  }
}
