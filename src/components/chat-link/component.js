import { KEYS } from '../../router/config.js';
import router from '../../router/router.js';
import templates from '../../renderer/templates.js';

export const CUSTOM_ATTR = {
  REJECTED: 'rejected',
  SELECTED: 'selected',
  TARGET_KEY: 'target',
};

const selector = {
  parentLink: 'parent-link',
  targetLink: 'target-link',
};

const getParentLinkHtml = (text) => `
<div>
  <a class="${selector.parentLink}">✖</a>
  <span>${text}<span>
</div>`;

const getTargetLinkHtml = (text) => `
<a class="${selector.targetLink}">${text}</a>`;

export class ChatLink extends HTMLElement {
  constructor() {
    super();

    this.linkToParent = null;
    this.linkToTarget = null;
  }

  get target() {
    return this.getAttribute(CUSTOM_ATTR.TARGET_KEY);
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

  render() {
    // set by ChatModule
    // called after constructer
    const keyToTarget = this.getAttribute(CUSTOM_ATTR.TARGET_KEY);
    const text = !!this.innerText
      ? this.innerText
      : templates.text[keyToTarget];
    if (![KEYS.ROOT, KEYS.BACK].includes(keyToTarget)) {
      this.innerHTML = getParentLinkHtml(text);
    }
    this.innerHTML += getTargetLinkHtml(text);

    this.linkToParent = this.querySelector('.' + selector.parentLink);
    this.linkToTarget = this.querySelector('.' + selector.targetLink);
  }

  set(hrefToParent) {
    const keyToTarget = this.getAttribute(CUSTOM_ATTR.TARGET_KEY);

    if (keyToTarget === KEYS.ROOT) {
      const href = router.origin + router.routes[KEYS.ROOT];
      this.linkToTarget.href = href;
      return;
    }

    if (keyToTarget === KEYS.BACK) {
      const keyOfParent = hrefToParent.split('/').at(-1);
      const indexOfTarget = router.getIndex(keyOfParent) - 1;
      const href = router.getHref(indexOfTarget);
      this.linkToTarget.href = href;
      return;
    }

    // component has link to parent
    const hrefToTarget = hrefToParent + '/' + keyToTarget;
    this.linkToParent.href = hrefToParent;
    this.linkToTarget.href = hrefToTarget;
  }
}
