import { ROUTES } from '../../router/config.js';
import { checkAttribute, setBooleanAttribute } from '../utils.js';

import { CUSTOM_ATTR, CUSTOM_VAL } from './config.js';

import {
  html,
  anchorClass,
  getParentLinkHtml,
  getTargetLinkHtml,
} from './utils.js';

export class ChatLink extends HTMLElement {
  constructor() {
    super();
  }

  get target() {
    return this.getAttribute(CUSTOM_ATTR.TARGET_KEY);
  }

  get isBackLink() {
    return checkAttribute(this, CUSTOM_ATTR.TARGET_KEY, CUSTOM_VAL.BACK);
  }

  set selected(value) {
    setBooleanAttribute(this, CUSTOM_ATTR.SELECTED, value);
  }
  get selected() {
    return this.hasAttribute(CUSTOM_ATTR.SELECTED);
  }

  set rejected(value) {
    setBooleanAttribute(this, CUSTOM_ATTR.REJECTED, value);
  }
  get rejected() {
    return this.hasAttribute(CUSTOM_ATTR.REJECTED);
  }

  render() {
    const targetKey = this.target;
    const text = !!this.innerText ? this.innerText : html[targetKey];

    // do not render Link to parent ChatModule component
    // when the link redirects to another route
    if (targetKey !== CUSTOM_VAL.HOME && targetKey !== CUSTOM_VAL.BACK) {
      this.innerHTML = getParentLinkHtml(text);
    }

    this.innerHTML += getTargetLinkHtml(text);
  }

  update(customPathname) {
    // @todo refactor href vs pathname
    const targetKey = this.target;
    const linkToParent = this.querySelector('.' + anchorClass.toParent);
    const linkToTarget = this.querySelector('.' + anchorClass.toTarget);

    if (!!linkToParent && !!customPathname) {
      // was cached
      if (linkToParent.pathname === customPathname) return;

      linkToParent.href = customPathname;
      linkToTarget.href = customPathname + '/' + targetKey;
      return;
    }

    if (targetKey === CUSTOM_VAL.HOME) {
      linkToTarget.pathname !== ROUTES.HOME &&
        (linkToTarget.href = ROUTES.HOME);
      return;
    }

    if (targetKey !== CUSTOM_VAL.BACK && linkToParent === null) {
      console.warn("@todo: Missed a case in 'update(hrefToParent)'");
      console.log(targetKey, customPathname, linkToParent, linkToTarget, this);
      return;
    }

    if (!!customPathname && linkToTarget.pathname === customPathname) {
      return;
    }

    if (!!customPathname) {
      linkToTarget.href = customPathname;
      return;
    }

    console.warn("@todo: Missed a case in 'update(hrefToParent)'");
    console.log(
      targetKey,
      customPathname,
      linkToParent?.pathname,
      linkToTarget.pathname,
      this
    );
  }
}
