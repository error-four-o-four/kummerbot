import { setBooleanAttribute } from '../utils.js';

import { CUSTOM_ATTR, CUSTOM_VAL } from './config.js';

import {
  html,
  selector,
  getParentLinkHtml,
  getTargetLinkHtml,
} from './utils.js';

import router from '../../router/router.js';

export class ChatLink extends HTMLElement {
  constructor() {
    super();
  }

  // @todo setBooleanAttribute
  get target() {
    return this.getAttribute(CUSTOM_ATTR.TARGET_KEY);
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

  update(hrefToParent) {
    const targetKey = this.target;
    const linkToTarget = this.querySelector('.' + selector.targetLink);

    if (targetKey === CUSTOM_VAL.HOME && linkToTarget.href) {
      return;
    }

    if (targetKey === CUSTOM_VAL.HOME && !linkToTarget.href) {
      linkToTarget.href = router.origin + router.routes.home;
      // console.log('updated', CUSTOM_VAL.HOME, linkToTarget.href, this);
      return;
    }

    if (targetKey === CUSTOM_VAL.BACK) {
      // set href value in renderElement loop
      // relative to previous ChatModule
      if (router.isChatRoute) {
        const keyOfParentModule = hrefToParent.split('/').at(-1);
        const indexOfPreviousModule = router.getIndex(keyOfParentModule) - 1;
        linkToTarget.href = router.getHref(indexOfPreviousModule);
        return;
      }

      if (router.prev) {
        linkToTarget.href = router.origin + router.prev;
        return;
      }

      console.warn(
        '@todo: Missed a case in `update(hrefToParent)` of ChatLink back'
      );
      return;
    }

    // component has link to parent
    const linkToParent = this.querySelector('.' + selector.parentLink);

    // @todo
    if (linkToParent === null) {
      console.warn('@todo: Missed a case in `update(hrefToParent)`', this);
      return;
    }

    if (linkToParent.href === hrefToParent) return;

    linkToParent.href = hrefToParent;
    linkToTarget.href = hrefToParent + '/' + targetKey;
    // console.log('updated', this.target, linkToTarget.href, this);
  }
}
