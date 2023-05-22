import router from '../../router/router.js';
import templates, { MODULE_KEY } from '../../renderer/templates.js';

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
  <span>${text}</span>
</div>`;

const getTargetLinkHtml = (text) => `
<a class="${selector.targetLink}">${text}</a>`;

export class ChatLink extends HTMLElement {
  constructor() {
    super();
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

  render() {
    const keyToTarget = this.target;
    const text = !!this.innerText
      ? this.innerText
      : templates.html[keyToTarget];

    if (![MODULE_KEY.HOME, MODULE_KEY.BACK].includes(keyToTarget)) {
      this.innerHTML = getParentLinkHtml(text);
    }
    this.innerHTML += getTargetLinkHtml(text);
  }

  update(hrefToParent) {
    const keyToTarget = this.target;
    const linkToTarget = this.querySelector('.' + selector.targetLink);

    // console.log('calling update', hrefToParent, linkToTarget);

    if (keyToTarget === MODULE_KEY.HOME && !linkToTarget.href) {
      linkToTarget.href = router.origin + router.routes.home;
      console.log('updated', MODULE_KEY.HOME, linkToTarget.href, this);
      return;
    }

    // if (keyToTarget === TARGET_KEY.BACK && router.isSharedRoute) {
    //   this.linkToTarget.href = router.prev ? router.prev : router.origin + router.routes.home;
    //   return;
    // }

    // @todo
    if (keyToTarget === MODULE_KEY.BACK) {
      const keyOfParent = hrefToParent.split('/').at(-1);
      const indexOfTarget = router.getIndex(keyOfParent) - 1;
      linkToTarget.href = router.getHref(indexOfTarget);
      // console.log('updated', TARGET_KEY.BACK, linkToTarget.href, this);
      return;
    }

    // component has link to parent
    const linkToParent = this.querySelector('.' + selector.parentLink);

    // @todo
    if (linkToParent === null) {
      // console.warn('Missed a case in `update(hrefToParent)`', this);
      return;
    }

    if (linkToParent.href === hrefToParent) return;

    linkToParent.href = hrefToParent;
    linkToTarget.href = hrefToParent + '/' + keyToTarget;
    // console.log('updated', this.target, linkToTarget.href, this);
  }
}
