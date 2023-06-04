import router from '../router/router.js';
import elements from '../elements/elements.js';

import formController from '../controller/form/form-controller.js';

import { ORIGIN, ROUTES } from '../router/config.js';
import { TARGET_VAL } from '../components/components.js';
import { ERROR_KEY } from '../controller/error-controller.js';

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

    if (router.hasChanged) {
      // update about link
      if (router.isAboutRoute) {
        const target =
          !!router.prevRoute && !router.prevRoute.includes(ERROR_KEY)
            ? router.prevRoute
            : ROUTES.HOME;
        elements.header.link.active = target;
      } else {
        elements.header.link.active = false;
      }

      // hide contact form
      !router.isContactRoute && elements.form.visible && elements.form.hide();
    }

    // case:
    // called renderer in popstate event
    if (this.transition) {
      console.log('@todo renderer is active');
      return;
    }

    // to prevent clicking transparent elements
    // @todo add css attribute to reset pointer
    this.transition = true;

    router.hasChanged || router.isContactRoute || router.hasError
      ? await removeAllEllements()
      : await removeElements();

    router.isChatRoute
      ? await renderElementsDelayed()
      : await renderElementsImmediately();

    // hides and shows input elements
    router.isContactRoute && formController.update();

    this.transition = false;

    console.log('transition end');
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
