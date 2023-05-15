import { KEYS, routes } from './config.js';
import { validate } from './utils.js';

export { KEYS };

export * from './utils.js';

class Router {
  constructor() {
    this.root = window.location.origin;
    this.path = null;
    this.keys = null;

    this.routes = routes;

    // on page load
    // redirect from '/' to '/chat'
    if (window.history.state === null && window.location.pathname === '/') {
      const href = this.root + routes.root;
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

  isRouterLink({ href }) {
    return href && href.startsWith(this.root);
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

    const { href } = e.target;
    e.preventDefault();
    window.history.pushState({ href }, '', href);
    this.update();

    // if (!Object.values(KEYS).includes(key) && !key.startsWith('/')) {
    //   // chat route
    //   route = this.path + '/' + key;
    //   console.log(route);
    // }

    // if (Object.values(routes).includes(key) && key.startsWith('/')) {
    //   // value is a route to another view
    //   // compare pathname with valid routes
    //   route = key;
    // }
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
      const href = this.root + pathname;
      window.history.replaceState({ href }, '', href);
    }

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
