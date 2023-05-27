import errorHandler from '../handler/error-handler.js';

import { TARGET_VAL, MODULE_VAL } from '../components/components.js';

import { routes } from './config.js';
import { validate } from './utils.js';

export { fetchData } from './utils.js';

class Router {
  constructor() {
    this.routes = routes;
    this.origin = window.location.origin;

    this._path = null;
    this._keys = null;
    this._prev = null;

    // on page load
    // redirect from '/' to '/chat'
    if (window.history.state === null && window.location.pathname === '/') {
      const href = this.origin + routes.home;
      window.history.replaceState({ href }, '', href);
    }
  }

  get hasError() {
    return this._keys.includes('error');
  }
  get hasChanged() {
    return !this._prev
      ? true
      : this._keys[0] !== this._prev.substring(1).split('/')[0];
  }

  get state() {
    const [isChatRoute, isAboutRoute, isSharedRoute, isContactRoute] = [
      routes.home,
      routes.about,
      routes.shared,
      routes.contact,
    ].map((route) => this._path.startsWith(route));

    return {
      keys: isSharedRoute ? this._keys.slice(2) : this._keys,
      hasError: this._keys.includes(MODULE_VAL.ERROR),
      hasChanged: !this._prev
        ? true
        : this._keys[0] !== this._prev.substring(1).split('/')[0],
      prevRoute: this._prev,
      isChatRoute,
      isAboutRoute,
      isSharedRoute,
      isContactRoute,
    };
  }

  isRouterLink(link) {
    const href = link.href;
    return href && href.startsWith(this.origin);
  }

  getIndex(key) {
    return this._keys.indexOf(key);
  }

  getHref(value) {
    const index = typeof value === 'string' ? this.getIndex(value) : value;
    const path = '/' + this._keys.slice(0, index + 1).join('/');
    return this.origin + path;
  }

  getShareUrl = () => {
    const indexShareKey = this._keys.indexOf(TARGET_VAL.SHARE);
    const moduleKey = this._keys.at(indexShareKey - 1);
    const index = this._keys.indexOf(moduleKey);

    return `${this.origin}${routes.shared}/${index}/${moduleKey}`;
  };

  getFileUrl(moduleKey) {
    // @reminder
    // errors in /chat route are handled by renderer
    const { isChatRoute, isSharedRoute, isContactRoute } = this.state;

    const base = '/views';
    const file = '/' + moduleKey + '.html';

    // gnaaaa
    if (
      isChatRoute &&
      (moduleKey === this._keys[0] || moduleKey === TARGET_VAL.SHARE)
    ) {
      return base + '/chat' + file;
    }

    if (isContactRoute) {
      return base + '/contact.html';
    }

    if (isChatRoute || isSharedRoute) {
      const index = isSharedRoute
        ? 1 * this._keys[1]
        : this._keys.indexOf(moduleKey);
      return base + '/chat-' + index + file;
    }

    // keys map to file names
    return base + file;
  }

  setLocation(route) {
    // called programmatically
    // does not add a history state
    // const e = new Event('route');
    // e.preventDefault();

    const href = this.origin + route;

    // console.log(href);
    window.history.replaceState({ href }, '', href);
    // window.location.replace(route);
    this.update();

    return this.state;
  }

  handle(e) {
    // called on event
    // adds a history state
    e.preventDefault();

    const { href } = e.target;
    window.history.pushState({ href }, '', href);
    this.update();

    return this.state;
  }

  update() {
    // get current location
    // populate path and query
    let { pathname } = window.location;

    if (/\/\//.test(pathname)) {
      pathname = pathname.replaceAll('//', '/');
    }

    if (pathname !== '/' && pathname.endsWith('/')) {
      pathname = pathname.slice(0, -1);
    }

    if (!validate(pathname)) {
      errorHandler.set('Die angegebene Adresse ist nicht erreichbar.');
      pathname = routes.error;
    }

    if (pathname !== window.location.pathname) {
      const href = this.origin + pathname;
      window.history.replaceState({ href }, '', href);
    }

    this._prev = this._path;
    this._path = pathname;

    this._keys = [
      ...this._path
        .substring(1)
        .split('/')
        .filter((key) => key),
    ];
  }
}

export default new Router();
