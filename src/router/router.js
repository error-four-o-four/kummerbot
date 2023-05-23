import { MODULE_KEY } from '../renderer/templates.js';
import { LINK_ATTR, LINK_TAG } from '../components/chat-link/index.js';

import { routes } from './config.js';
import { validate } from './utils.js';

export { fetchData } from './utils.js';

class Router {
  constructor() {
    this.origin = window.location.origin;
    this.path = null;
    this.prev = null;
    this.keys = null;

    this.routes = routes;

    // on page load
    // redirect from '/' to '/chat'
    if (window.history.state === null && window.location.pathname === '/') {
      const href = this.origin + routes.home;
      window.history.replaceState({ href }, '', href);
    }
  }

  get isChatRoute() {
    return this.path.startsWith(routes.home);
  }
  get isAboutRoute() {
    return this.path.startsWith(routes.about);
  }
  get isSharedRoute() {
    return this.path.startsWith(routes.shared);
  }
  get isPageRoute() {
    return !this.isChatRoute && !this.isSharedRoute;
  }

  get hasChanged() {
    const key = this.path.substring(1).split('/')[0];
    return !(this.prev && this.prev.includes(key));
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
    const path = this.keys.slice(0, index + 1).join('/');
    const shared = this.isSharedRoute
      ? '/' +
        this.path
          .split('/')
          .filter((key) => !!key)
          .slice(0, 2)
          .join('/')
      : '';

    return this.origin + shared + '/' + path;
  }

  getShareUrl = () => {
    const indexShareKey = this.keys.indexOf(MODULE_KEY.SHARE);
    const moduleKey = this.keys.at(indexShareKey - 1);
    const index = this.keys.indexOf(moduleKey);

    return `${this.origin}${routes.shared}/${index}/${moduleKey}`;
  };

  getFileUrl(key) {
    // @reminder
    //  errors are handled by renderer
    if (this.isPageRoute) {
      return '/views' + this.path + '.html';
    }

    const file = key + '.html';
    const index = this.isSharedRoute
      ? this.path.split('/').filter((item) => !!item && !isNaN(item))[0]
      : this.keys.indexOf(key);

    return (this.isChatRoute && index === 0) ||
      key === MODULE_KEY.SHARE ||
      key === MODULE_KEY.MESSAGE
      ? '/views/chat/' + file
      : '/views/chat-' + index + '/' + file;
  }

  setLocation(route) {
    // called programmatically
    // does not add a history state
    // const e = new Event('route');
    // e.preventDefault();

    const href = this.origin + route;

    console.log(href);
    window.history.replaceState({ href }, '', href);
    // window.location.replace(route);
    this.update();
  }

  handle(e) {
    // called on event
    // adds a history state
    e.preventDefault();

    const { href } = e.target;
    window.history.pushState({ href }, '', href);
    this.update();
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
      pathname = routes.error;
    }

    // @todo
    // validate footer.email.value is set

    if (pathname !== window.location.pathname) {
      const href = this.origin + pathname;
      window.history.replaceState({ href }, '', href);
    }

    this.prev = this.path;
    this.path = pathname;

    const keys = [
      ...this.path
        .substring(1)
        .split('/')
        .filter((key) => key),
    ];

    this.keys = this.isSharedRoute ? keys.slice(2) : keys;
  }
}

export default new Router();
