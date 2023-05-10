import { KEYS, routes } from './config.js';
import { ATTR } from '../elements/elements.js';

class Router {
  constructor() {
    this.root = window.location.origin;
    this.path = null;
    this.steps = null;
  }

  get isChatRoute() {
    return this.path.startsWith(routes[KEYS.CHAT]);
  }

  get isViewRoute() {
    return this.path.startsWith(routes[KEYS.VIEW]);
  }

  get isAboutRoute() {
    return this.path.startsWith(routes.about);
  }

  isCurrentRoute(route) {
    return this.path.startsWith(route);
  }

  handle(e) {
    // called on click event
    // adds a history state
    // key is the data-route value of the anchor
    const key = e.target.getAttribute(ATTR.ROUTE);

    // return error route by default
    let route = '/error';

    e = e || new Event('route');
    e.preventDefault();

    if (Object.values(KEYS).includes(key)) {
      // handle special cases
      if (key === KEYS.BACK) {
        // this.update() is called in popstate event
        window.history.back();
        return;
      }

      if (key === KEYS.RESET) {
        const choice = e.target.nextElementSibling.getAttribute(ATTR.ROUTE);
        const index = this.steps.indexOf(choice);
        route = '/' + this.steps.slice(0, index).join('/');
      }

      if (key === KEYS.CHAT) {
        route = routes[key];
      }

      if (key === KEYS.SHARE) {
        route = this.path + '/' + key;
      }

      if (key === KEYS.VIEW) {
        const choice = this.steps[this.steps.length - 2];
        const index = this.steps.indexOf(choice);
        route = routes[key] + '/' + index + '/' + choice;
      }
    }

    if (!Object.values(KEYS).includes(key) && !key.startsWith('/')) {
      // chat route
      route = this.path + '/' + key;
      console.log(route);
    }

    if (Object.values(routes).includes(key) && key.startsWith('/')) {
      // value is a route to another view
      // compare pathname with valid routes
      route = key;
    }

    window.history.pushState({}, '', route);
    this.update();
  }

  replace(route) {
    // called programmatically
    // does not add a history state
    const e = new Event('route');
    e.preventDefault();

    window.location.replace(route);
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

    // redirect to /home from root
    if (pathname === '/') {
      pathname = routes.home;
    }

    if (pathname !== window.location.pathname) {
      window.location.replace(pathname);
    }

    this.path = pathname;
    this.steps = [
      ...this.path
        .substring(1)
        .split('/')
        .filter((key) => key),
    ];

    // console.log(this);
  }
}

export * from './config.js';
export * from './utils.js';

export default new Router();
