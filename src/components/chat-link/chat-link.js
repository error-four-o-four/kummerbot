import { setBooleanAttribute } from '../utils.js';

import { CUSTOM_ATTR, CUSTOM_VAL } from './config.js';

import {
  html,
  anchorClass,
  getParentLinkHtml,
  getTargetLinkHtml,
} from './utils.js';

import router from '../../router/router.js';
import renderer from '../../renderer/renderer.js';

import { ROUTES } from '../../router/config.js';

export class ChatLink extends HTMLElement {
  constructor() {
    super();
  }

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

  update(parentHref) {
    const targetKey = this.target;
    const linkToParent = this.querySelector('.' + anchorClass.toParent);
    const linkToTarget = this.querySelector('.' + anchorClass.toTarget);

    if (!!linkToParent && !!parentHref) {
      // was cached
      if (linkToParent.href === parentHref) return;

      linkToParent.href = parentHref;
      linkToTarget.href = parentHref + '/' + targetKey;
      return;
    }

    if (targetKey === CUSTOM_VAL.HOME) {
      linkToTarget.href !== ROUTES.HOME && (linkToTarget.href = ROUTES.HOME);
      return;
    }

    if (targetKey !== CUSTOM_VAL.BACK && linkToParent === null) {
      console.warn("@todo: Missed a case in 'update(hrefToParent)'");
      console.log(targetKey, parentHref, linkToParent, linkToTarget, this);
      return;
    }

    if (router.isChatRoute) {
      const parentKey = parentHref.split('/').at(-1);
      const prevIndex = renderer.keys.indexOf(parentKey) - 1;
      const prevModuleHref = renderer.getPathnameUrl(renderer.keys[prevIndex]);

      linkToTarget.href !== prevModuleHref &&
        (linkToTarget.href = prevModuleHref);
      return;
    }

    // linkBack exists only in /chat and /contact route

    // @todo
    // add cases
    // nope
    if (router.isContactRoute) {
      linkToTarget.href = router.prevRoute;
    }
  }
}
