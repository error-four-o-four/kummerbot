import router from '../router/router.js';
import animator from './animation/animator.js';

import header from '../elements/header.js';
import messageForm from '../elements/form-message.js';
import captchaForm from '../elements/form-captcha.js';
import formController from '../controller/form/form-controller.js';
import historyController from '../controller/history-controller.js';

import { ORIGIN, ROUTES } from '../router/config.js';
import { TARGET_VAL } from '../components/components.js';
import { ERROR_KEY } from '../controller/error-controller.js';

import { removeElements, removeAllEllements } from './removeElements.js';

import {
  renderElementsDelayed,
  renderElementsImmediately,
} from './renderElements.js';

export default {
  outlet: document.getElementById('outlet'),
  keys: [],
  getKeys() {
    return router.isSharedRoute ? this.keys.slice(2) : this.keys;
  },
  async update() {
    // @todo on first render
    // hide app and show app when last element was loaded and rendered
    // improves UX
    // => code splitting

    console.log(...router.log(), ...historyController.log());

    // keys of rendered modules
    this.keys = [
      ...router.pathname
        .substring(1)
        .split('/')
        .filter((key) => key),
    ];

    if (router.hasChanged) {
      // update about link
      if (router.isAboutRoute) {
        // @consider use historyController
        const target =
          !!router.prevPathname && !router.prevPathname.includes(ERROR_KEY)
            ? router.prevPathname
            : ROUTES.HOME;
        header.updateLink(target);
      } else {
        header.updateLink();
      }

      if (!router.isContactRoute) {
        // hide contact form
        messageForm.visible && messageForm.hide();
        captchaForm.visible && captchaForm.hide();
      }
    }

    // e.g. renderer is already in transition state
    // 'popstate' event called renderer.update() again
    const interrupt = animator.active;

    // public property to prevent clicking transparent elements
    // @todo add css attribute to reset pointer
    animator.active = true;

    // router.hasChanged && (await removeAllEllements(interrupt));

    if (!router.isChatRoute || (router.isChatRoute && router.hasChanged)) {
      await removeAllEllements(interrupt);
    }

    if (router.isChatRoute && !router.hasChanged && router.hasPopped) {
      await removeElements(interrupt);
    }

    header.setIndicatorPending();

    router.isChatRoute
      ? await renderElementsDelayed(interrupt)
      : await renderElementsImmediately(interrupt);

    header.setIndicatorWaiting();

    // hides and shows input elements
    router.isContactRoute && formController.update();

    animator.active = false;

    // console.log('transition end');
  },

  getShareUrl() {
    const indexShareKey = this.keys.indexOf(TARGET_VAL.SHARE);
    const moduleKey = this.keys.at(indexShareKey - 1);
    const index = this.keys.indexOf(moduleKey);

    return `${ORIGIN}${ROUTES.SHARED}/${index}/${moduleKey}`;
  },

  getPathnameUrl(value) {
    // const index = typeof value === 'string' ? this.getIndex(value) : value;
    const index = this.keys.indexOf(value);
    const pathname = '/' + this.keys.slice(0, index + 1).join('/');
    return pathname;
  },
};
