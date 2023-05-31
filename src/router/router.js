import { ORIGIN, ROUTES } from './config.js';
import { check, validate } from './utils.js';

import errorController, { ERROR_KEY } from '../controller/error-controller.js';
import formController, { CONTACT_VAL } from '../controller/form-controller.js';
import { TARGET_VAL } from '../components/components.js';

export { ORIGIN, ROUTES };

let _keys = [];

const state = {
  keys: [],
  hasError: false,
  hasChanged: false,
  route: null,
  prevRoute: null,
  isChatRoute: false,
  isAboutRoute: false,
  isSharedRoute: false,
  isContactRoute: false,
};

const update = () => {
  // populate path and query
  state.prevRoute = state.route;
  state.route = window.location.pathname;

  state.hasChanged = !state.prevRoute
    ? true
    : !check(state.route, state.prevRoute);

  _keys = [
    ...state.route
      .substring(1)
      .split('/')
      .filter((key) => key),
  ];

  state.hasError = _keys.includes(ERROR_KEY);

  const routes = {
    isChatRoute: ROUTES.HOME,
    isAboutRoute: ROUTES.ABOUT,
    isSharedRoute: ROUTES.SHARED,
    isContactRoute: ROUTES.CONTACT,
  };

  // update values
  Object.entries(routes).forEach(
    ([key, value]) => (state[key] = check(state.route, value))
  );

  state.keys = state.isSharedRoute ? _keys.slice(2) : _keys;

  return state;
};

export default {
  get state() {
    return state;
  },
  init() {
    // on page load
    // redirect from '/' to '/chat'
    if (window.history.state === null && window.location.pathname === '/') {
      this.replace(ROUTES.HOME);
      return;
    }

    if (!validate(window.location.pathname)) {
      errorController.set('Die angegebene Adresse ist nicht erreichbar.');
      this.replace(ROUTES.ERROR);
      return;
    }

    update();
  },

  getShareUrl() {
    const indexShareKey = _keys.indexOf(TARGET_VAL.SHARE);
    const moduleKey = _keys.at(indexShareKey - 1);
    const index = _keys.indexOf(moduleKey);

    return `${ORIGIN}${ROUTES.SHARED}/${index}/${moduleKey}`;
  },

  getHref(value) {
    // @doublecheck isContactRoute

    // const index = typeof value === 'string' ? this.getIndex(value) : value;
    const index = _keys.indexOf(value);
    const pathname = '/' + _keys.slice(0, index + 1).join('/');
    return pathname;
  },

  check,

  replace(pathname) {
    const href = ORIGIN + pathname;
    window.history.replaceState({ href }, '', href);

    return update();
  },

  push(pathname) {
    const href = ORIGIN + pathname;
    window.history.pushState({ href }, '', href);

    return update();
  },

  handle(e) {
    // const { target, type } = e;
    // e.preventDefault();
    // if (type !== 'submit') {
    //   // get target location
    //   const pathname =
    //     type === 'popstate' ? window.location.pathname : target.pathname; // @todo submit
    //   const isContactRoute = check(pathname, ROUTES.CONTACT);
    //   const wasContactRoute = check(state.route, ROUTES.CONTACT);
    //   // just preventDefault and pushState
    //   if (!isContactRoute || (isContactRoute && !wasContactRoute)) {
    //     const href =
    //       // routed from ContactItem
    //       isContactRoute && !wasContactRoute
    //         ? ORIGIN + ROUTES.CONTACT + '/' + CONTACT_VAL[0]
    //         : target.href;
    //     window.history.pushState({ href }, '', href);
    //     update();
    //     return state;
    //   }
    //   const href = ORIGIN + ROUTES.CONTACT + '/' + formController.step;
    //   window.history.pushState({ href }, '', href);
    //   update();
    //   return state;
    // }
    // // @todo
    // // handle submit
    // // if step < CONTACT_VAL[1] => pushState
    // // else replaceState
    // const href = ORIGIN + ROUTES.CONTACT + '/' + formController.step;
    // window.history.pushState({ href }, '', href);
    // update();
    // return state;
    // if (type === 'popstate') {
    //   validate(window.location.pathname)
    //     ? serialize()
    //     : this.replace(ROUTES.ERROR);
    //   return state;
    // }
    // if (type === 'submit') {
    //   const href = ORIGIN + ROUTES.CONTACT + '/' + contactHandler.step;
    //   // @todo
    //   // use replaceState when message was send
    //   window.history.pushState({ href }, '', href);
    //   serialize();
    //   return state;
    // }
  },
};
