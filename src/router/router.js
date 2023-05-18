import { LINK_ATTR, LINK_TAG } from '../components/chat-link/index.js';
import { KEYS, routes } from './config.js';
import { validate } from './utils.js';

export { KEYS } from './config.js';
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
      const href = this.origin + routes.root;
      window.history.replaceState({ href }, '', href);
    }
  }

  get isChatRoute() {
    return this.path.startsWith(routes[KEYS.ROOT]);
  }

  get isViewRoute() {
    return this.path.startsWith(routes.view);
  }

  get isAboutRoute() {
    return this.path.startsWith(routes.about);
  }

  // isCurrentRoute(route) {
  //   return this.path.startsWith(route);
  // }

  isRouterLink(link) {
    const href = link.href;
    return href && href.startsWith(this.origin);
  }

  getIndex(key) {
    return this.keys.indexOf(key);
  }

  getHref(value) {
    const index = typeof value === 'string' ? this.getIndex(value) : value;
    return this.origin + '/' + this.keys.slice(0, index + 1).join('/');
  }

  getHrefToViewPage = () => {
    const key = this.keys.at(-2);
    const index = this.keys.indexOf(key);

    return `${this.origin}${routes.view}/${index}/${key}`;
  };

  getPathToChatFile(key) {
    const step = this.keys.indexOf(key);

    // return first section or share section
    return step === 0 || key === KEYS.SHARE
      ? '/views/chat/' + key + '.html'
      : '/views/chat-' + step + '/' + key + '.html';
  }

  getPathToPageFile() {
    return '/views' + this.path + '.html';
  }

  getPathToViewFile() {
    const [, index, file] = this.keys;
    return '/views/chat-' + index + '/' + file + '.html';
  }

  setLocation(route) {
    // called programmatically
    // does not add a history state
    // const e = new Event('route');
    // e.preventDefault();

    // const href = this.root + route;
    // window.history.replaceState({ href }, '', href);
    window.location.replace(route);
    this.update();
  }

  handle(e) {
    // called on event
    // adds a history state
    e.preventDefault();

    // @todo doublecheck
    if (
      e.target.localName === LINK_TAG &&
      e.target.hasAttribute(LINK_ATTR.SELECTED) &&
      e.composedPath()[0].localName === 'span'
    ) {
      console.log('nop');
      return;
    }

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
