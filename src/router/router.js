import errorHandler from '../handler/error-handler.js';

import { TARGET_VAL } from '../components/components.js';

import { routes } from './config.js';
import { validate } from './utils.js';

export { fetchData } from './utils.js';

class Router {
  constructor() {
    this.origin = window.location.origin;
    this.path = null;
    this.keys = null;
    this.prev = null;

    this.routes = routes;

    // on page load
    // redirect from '/' to '/chat'
    if (window.history.state === null && window.location.pathname === '/') {
      const href = this.origin + routes.home;
      window.history.replaceState({ href }, '', href);
    }
  }

  // @todo doublcheck references
  // @refactor
  get isChatRoute() {
    return this.path.startsWith(routes.home);
  }
  get isAboutRoute() {
    return this.path.startsWith(routes.about);
  }
  get isSharedRoute() {
    return this.path.startsWith(routes.shared);
  }
  get isContactRoute() {
    return this.path.startsWith(routes.contact);
  }

  get hasError() {
    return this.keys.includes('error');
  }
  get hasChanged() {
    return !this.prev
      ? true
      : this.keys[0] !== this.prev.substring(1).split('/')[0];
  }

  get state() {
    const isSharedRoute = this.isSharedRoute;

    const keys = isSharedRoute ? this.keys.slice(2) : this.keys;

    // @refactor
    return {
      keys,
      hasError: this.hasError,
      hasChanged: this.hasChanged,
      prevRoute: this.prev,
      isChatRoute: this.isChatRoute,
      isAboutRoute: this.isAboutRoute,
      isSharedRoute,
      isContactRoute: this.isContactRoute,
    };
  }

  isRouterLink(link) {
    const href = link.href;
    return href && href.startsWith(this.origin);
  }

  getIndex(key) {
    return this.keys.indexOf(key);
  }

  getHref(value) {
    const index = typeof value === 'string' ? this.getIndex(value) : value;
    const path = '/' + this.keys.slice(0, index + 1).join('/');
    return this.origin + path;
  }

  getShareUrl = () => {
    const indexShareKey = this.keys.indexOf(TARGET_VAL.SHARE);
    const moduleKey = this.keys.at(indexShareKey - 1);
    const index = this.keys.indexOf(moduleKey);

    return `${this.origin}${routes.shared}/${index}/${moduleKey}`;
  };

  getFileUrl(moduleKey) {
    // @reminder
    // errors in /chat route are handled by renderer

    const base = '/views';
    const file = '/' + moduleKey + '.html';

    // gnaaaa
    if (
      this.isChatRoute &&
      (moduleKey === this.keys[0] || moduleKey === TARGET_VAL.SHARE)
    ) {
      return base + '/chat' + file;
    }

    if (this.isContactRoute) {
      return base + '/contact.html';
    }

    if (this.isChatRoute || this.isSharedRoute) {
      // const index = this.isSharedRoute
      // ? this.path.split('/').filter((item) => !!item && !isNaN(item))[0]
      // : this.keys.indexOf(moduleKey);
      const index = this.isSharedRoute
        ? 1 * this.keys[1]
        : this.keys.indexOf(moduleKey);
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

    this.prev = this.path;
    this.path = pathname;

    this.keys = [
      ...this.path
        .substring(1)
        .split('/')
        .filter((key) => key),
    ];
  }
}

export default new Router();
