import { setBooleanAttribute } from '../utils.js';

import { CUSTOM_ATTR, CUSTOM_VAL } from './config.js';

import {
  html,
  selector,
  getParentLinkHtml,
  getTargetLinkHtml,
} from './utils.js';

import router, { ROUTES } from '../../router/router.js';

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
    const linkToParent = this.querySelector('.' + selector.parentLink);
    const linkToTarget = this.querySelector('.' + selector.targetLink);

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

    const route = router.state;

    if (route.isChatRoute) {
      const parentKey = parentHref.split('/').at(-1);
      const prevIndex = route.keys.indexOf(parentKey) - 1;
      const prevModuleHref = router.getHref(route.keys[prevIndex]);

      linkToTarget.href !== prevModuleHref &&
        (linkToTarget.href = prevModuleHref);
      return;
    }

    // linkBack exists only in /chat and /contact route

    // @todo
    // add cases
    // nope
    if (route.isContactRoute) {
      linkToTarget.href = route.prevRoute;
    }
  }
}
