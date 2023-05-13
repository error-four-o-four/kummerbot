import { KEYS, routes } from './config.js';
import { ATTR } from '../elements/elements.js';

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
    return this.path.startsWith(routes[KEYS.VIEW]);
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

    // // return error route by default
    // let route = '/error';

    // // e = e || new Event('route');
    // // e.preventDefault();

    // if (Object.values(KEYS).includes(key)) {
    //   // handle special cases
    //   if (key === KEYS.BACK) {
    //     // this.update() is called in popstate event
    //     window.history.back();
    //     return;
    //   }

    //   if (key === KEYS.RESET) {
    //     const choice = e.target.nextElementSibling.getAttribute(ATTR.ROUTE);
    //     const index = this.steps.indexOf(choice);
    //     route = '/' + this.steps.slice(0, index).join('/');
    //   }

    //   if (key === KEYS.ROOT) {
    //     route = routes[key];
    //   }

    //   if (key === KEYS.SHARE) {
    //     route = this.path + '/' + key;
    //   }

    //   if (key === KEYS.VIEW) {
    //     const choice = this.steps[this.steps.length - 2];
    //     const index = this.steps.indexOf(choice);
    //     route = routes[key] + '/' + index + '/' + choice;
    //   }
    // }

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

    // console.log(this);
  }
}

export default new Router();
