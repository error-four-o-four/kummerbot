import { KEYS } from '../../router/config.js';
import router from '../../router/router.js';
import templates from '../../renderer/templates.js';

import { CUSTOM_ATTR, IDS, createTemplate } from './config.js';

export class ChatLink extends HTMLElement {
  static get observedAttributes() {
    return [CUSTOM_ATTR.SELECTED];
  }

  constructor() {
    super();

    // create back ChatLink component by default
    // get default contents in constructor
    this.keyToTarget = this.getAttribute(CUSTOM_ATTR.TARGET_KEY) || KEYS.BACK;

    const text = !!this.innerText
      ? this.innerText
      : templates.text[this.keyToTarget];
    this.innerHTML = '';

    this.attachShadow({ mode: 'open' });

    const template = createTemplate(this.keyToTarget, text);
    for (const child of template.content.children) {
      this.shadowRoot.appendChild(child.cloneNode(true));
    }

    this.linkToParent = this.shadowRoot.getElementById(IDS.parentLink);
    this.linkToTarget = this.shadowRoot.getElementById(IDS.targetLink);
  }

  set selected(value) {
    value
      ? this.setAttribute(CUSTOM_ATTR.SELECTED, value)
      : this.removeAttribute(CUSTOM_ATTR.SELECTED);
  }
  get selected() {
    return this.hasAttribute(CUSTOM_ATTR.SELECTED);
  }

  set rejected(value) {
    value
      ? this.setAttribute(CUSTOM_ATTR.REJECTED, value)
      : this.removeAttribute(CUSTOM_ATTR.REJECTED);
  }
  get rejected() {
    return this.hasAttribute(CUSTOM_ATTR.REJECTED);
  }

  set href(hrefToParent) {
    if (this.keyToTarget === KEYS.ROOT) {
      const href = router.origin + router.routes[KEYS.ROOT];
      this.linkToTarget.href = href;
      return;
    }

    if (this.keyToTarget === KEYS.BACK) {
      const indexOfTarget = router.getIndex(this.keyToTarget) - 1;
      const href = router.getHref(indexOfTarget);
      this.linkToTarget.href = href;
      return;
    }

    // component has link to parent
    const hrefToTarget = hrefToParent + '/' + this.keyToTarget;
    this.linkToParent.href = hrefToParent;
    this.linkToTarget.href = hrefToTarget;
  }

  get href() {
    // used by router to check type of link => SPA
    return this.selected ? this.linkToParent.href : this.linkToTarget.href;
  }

  connectedCallback() {
    // not required
    if (this.keyToTarget === KEYS.BACK) {
      this.setAttribute(CUSTOM_ATTR.TARGET_KEY, this.keyToTarget);
    }
  }
}
