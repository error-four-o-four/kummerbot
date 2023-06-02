import router from '../router/router.js';
import elements from '../elements/elements.js';

import { ORIGIN, ROUTES } from '../router/config.js';
import { TARGET_VAL } from '../components/components.js';

import { removeElements, removeAllEllements } from './removeElements.js';

import {
  renderElementsDelayed,
  renderElementsImmediately,
} from './renderElements.js';

export default {
  // @todo move to animation.js
  transition: false,
  keys: [],
  getKeys() {
    return router.isSharedRoute ? this.keys.slice(2) : this.keys;
  },
  async update() {
    // @todo on first render
    // @todo hide app
    // @todo show app when last element was rendered
    // improves UX

    // keys of rendered modules
    this.keys = [
      ...router.route
        .substring(1)
        .split('/')
        .filter((key) => key),
    ];

    !router.isContactRoute && elements.form.visible && elements.form.hide();

    router.hasChanged &&
      (elements.header.link.active = router.isAboutRoute
        ? router.prevRoute
        : false);

    // to prevent clicking transparent elements
    // @todo add css attribute to reset pointer
    this.transition = true;

    router.hasChanged || router.isContactRoute || router.hasError
      ? await removeAllEllements()
      : await removeElements();

    router.isChatRoute
      ? await renderElementsDelayed()
      : await renderElementsImmediately();

    this.transition = false;
  },

  getShareUrl() {
    const indexShareKey = this.keys.indexOf(TARGET_VAL.SHARE);
    const moduleKey = this.keys.at(indexShareKey - 1);
    const index = this.keys.indexOf(moduleKey);

    return `${ORIGIN}${ROUTES.SHARED}/${index}/${moduleKey}`;
  },

  getPathnameUrl(value) {
    // @doublecheck isContactRoute

    // const index = typeof value === 'string' ? this.getIndex(value) : value;
    const index = this.keys.indexOf(value);
    const pathname = '/' + this.keys.slice(0, index + 1).join('/');
    return pathname;
  },
};
