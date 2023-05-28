import { ORIGIN, ROUTES } from './config.js';
import { check, validate } from './utils.js';

import errorHandler from '../handler/error-handler.js';
import contactHandler from '../handler/contact-handler.js';
import { TARGET_VAL, MODULE_VAL } from '../components/components.js';

export { ROUTES };
export { fetchData } from './utils.js';

let _prevRoute = null;
let _route = null;
let _keys = [];

const dict = {
  isChatRoute: ROUTES.HOME,
  isAboutRoute: ROUTES.ABOUT,
  isSharedRoute: ROUTES.SHARED,
  isContactRoute: ROUTES.CONTACT,
};

const _state = {
  keys: [],
  hasError: false,
  hasChanged: true,
  prevRoute: _prevRoute,
  isChatRoute: false,
  isAboutRoute: false,
  isSharedRoute: false,
  isContactRoute: false,
};

const serialize = () => {
  // populate path and query
  _prevRoute = _route;
  _route = window.location.pathname;

  _keys = [
    ..._route
      .substring(1)
      .split('/')
      .filter((key) => key),
  ];

  // update values
  Object.entries(dict).forEach(
    ([key, value]) => (_state[key] = check(_route, value))
  );

  _state.keys = _state.isSharedRoute ? _keys.slice(2) : _keys;
  _state.hasError = _keys.includes(MODULE_VAL.ERROR);
  _state.hasChanged = !_prevRoute
    ? true
    : _keys[0] !== _prevRoute.substring(1).split('/')[0];

  return _state;
};

// update values onload
serialize();

export default {
  get state() {
    return _state;
  },

  init() {
    // on page load
    // redirect from '/' to '/chat'
    console.log(_route, history);

    if (window.history.state === null && _route === '/') {
      this.replace(ROUTES.HOME);
      return;
    }

    if (!validate(_route)) {
      errorHandler.set('Die angegebene Adresse ist nicht erreichbar.');
      this.replace(ROUTES.ERROR);
    }
  },
  // @doublecheck
  getIndex(key) {
    return _keys.indexOf(key);
  },
  getHref(value) {
    const index = typeof value === 'string' ? this.getIndex(value) : value;
    const pathname = '/' + _keys.slice(0, index + 1).join('/');
    return ORIGIN + pathname;
  },
  getShareUrl() {
    const indexShareKey = _keys.indexOf(TARGET_VAL.SHARE);
    const moduleKey = _keys.at(indexShareKey - 1);
    const index = _keys.indexOf(moduleKey);

    return `${ORIGIN}${ROUTES.SHARED}/${index}/${moduleKey}`;
  },
  getFileUrl(moduleKey) {
    // @reminder
    // errors in /chat route are handled by renderer
    const { isChatRoute, isSharedRoute, isContactRoute } = this.state;

    const base = '/views';
    const file = '/' + moduleKey + '.html';

    // gnaaaa
    if (
      isChatRoute &&
      (moduleKey === _keys[0] || moduleKey === TARGET_VAL.SHARE)
    ) {
      return base + '/chat' + file;
    }

    if (isContactRoute) {
      return base + '/contact.html';
    }

    if (isChatRoute || isSharedRoute) {
      const index = isSharedRoute ? 1 * _keys[1] : _keys.indexOf(moduleKey);
      return base + '/chat-' + index + file;
    }

    // keys map to file names
    return base + file;
  },
  getData() {
    // @todo
    // called by ChatModule
    // set ErrorHandler
  },

  replace(route) {
    const href = ORIGIN + route;
    window.history.replaceState({ href }, '', href);

    return serialize();
  },

  handle(e) {
    const { target, type } = e;

    e.preventDefault();

    if (type === 'popstate') {
      return serialize();
    }

    if (type === 'submit') {
      const href = ORIGIN + ROUTES.CONTACT + '/' + contactHandler.step;

      window.history.pushState({ href }, '', href);
      return serialize();
    }

    const isContactRoute = check(target.pathname, ROUTES.CONTACT);
    const wasContactRoute = check(_route, ROUTES.CONTACT);

    const href =
      isContactRoute && !wasContactRoute
        ? ORIGIN + ROUTES.CONTACT + '/' + contactHandler.step
        : target.href;

    window.history.pushState({ href }, '', href);

    return serialize();
  },
};
