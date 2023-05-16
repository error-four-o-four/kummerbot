import { KEYS } from '../../router/config.js';
import router from '../../router/router.js';
import contents from '../../templates/contents.js';

import { CUSTOM_ATTR, IDS, createTemplate } from './config.js';

export class ChatLink extends HTMLElement {
  static get observedAttributes() {
    return [CUSTOM_ATTR.TARGET_KEY];
  }

  constructor() {
    super();

    // create back ChatLink component by default
    this.key = this.getAttribute(CUSTOM_ATTR.TARGET_KEY) || KEYS.BACK;

    const text = !!this.innerText ? this.innerText : contents.text[this.key];
    this.innerHTML = '';

    this.attachShadow({ mode: 'open' });

    const template = createTemplate(this.key, text);
    for (const child of template.content.children) {
      this.shadowRoot.appendChild(child.cloneNode(true));
    }

    this.linkToParent = this.shadowRoot.getElementById(IDS.parentLink);
    this.linkToTarget = this.shadowRoot.getElementById(IDS.targetLink);
  }

  set selected(value) {
    this.toggleAttribute(CUSTOM_ATTR.SELECTED, !!value);
  }
  get selected() {
    return this.hasAttribute(CUSTOM_ATTR.SELECTED);
  }

  set rejected(value) {
    this.toggleAttribute(CUSTOM_ATTR.REJECTED, !!value);
  }
  get rejected() {
    return this.hasAttribute(CUSTOM_ATTR.REJECTED);
  }

  setHref(hrefToParent) {
    if (!this.key) this.key = this.getAttribute(CUSTOM_ATTR.TARGET_KEY);

    const keyOfTarget = this.key;

    if (keyOfTarget === KEYS.ROOT) {
      this.linkToTarget.href = router.routes[KEYS.ROOT];
      return;
    }

    if (keyOfTarget === KEYS.BACK) {
      const indexOfTarget = router.getIndex(keyOfTarget) - 1;
      this.linkToTarget.href = router.getHref(indexOfTarget);
      return;
    }

    // component has link to parent
    this.linkToParent.href = hrefToParent;
    this.linkToTarget.href = this.linkToParent.href + '/' + keyOfTarget;
  }

  get href() {
    return this.selected ? this.linkToParent.href : this.linkToTarget.href;
  }
}
