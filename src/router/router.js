import { isChatRoute, fetchData } from './helpers.js';
import { routes } from './config.js';

class Router {
  constructor() {
    this.root = window.location.origin;
    this.path = null;
    this.query = null;
  }

  update() {
    // get current location
    const { pathname } = window.location;

    // set pathname
    this.path = pathname;

    // trailing slash is required to handle popstate for chat route
    // if (isChatRoute(this.path) && !pathname.endsWith('/')) {
    // 	this.path = this.path + '/';
    // }

    // @todo url params
    if (pathname !== '/' && pathname.endsWith('/')) {
      this.path = this.path.slice(0, -1);
    }

    // necessary?
    if (/\/\//.test(this.path)) {
      this.path = this.path.replaceAll('//', '/');
    }

    if (this.path !== pathname) {
      window.location.replace(this.root + this.path);
    }

    this.query = [
      ...this.path
        .substring(1)
        .split('/')
        .filter((key) => key),
    ];
  }

  validate() {
    // redirect from root to chat
    if (this.path === '/') {
      this.set(routes.chat);
      return routes.chat;
    }

    // compare pathname with valid routes
    // return error route by default
    const validRoutes = Object.values(routes);
    const matchedRoute = validRoutes.reduce(
      (route, valid) => (this.path.startsWith(valid) ? this.path : route),
      routes.error
    );

    // update location if necessary
    if (this.path !== matchedRoute) {
      this.set(matchedRoute);
    }

    return matchedRoute;
  }

  handle(e) {
    e = e || window.event;
    e.preventDefault();
    window.history.pushState({}, '', e.target.href);
    // this.update();
  }

  set(route) {
    const href = this.root + route;
    // @todo prevent reload / fouc
    window.history.pushState({}, '', href);
    window.location.replace(href);
    this.update();
  }
}

export { routes, isChatRoute, fetchData };

export default new Router();
