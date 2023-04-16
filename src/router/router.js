import { isChatRoute, fetchData } from './helpers.js';
import { routes } from './config.js';

class Router {
  constructor() {
    this.root = window.location.origin;
    this.path = null;
    this.query = null;
  }

  handle(e) {
    // called on click event
    e = e || new Event();
    e.preventDefault();
    window.history.pushState({}, '', e.target.href);
    this.update();
  }

  set(route) {
    // called programmatically
    const e = new Event('route');
    e.preventDefault();
    window.location.replace(route);
    this.update();
  }

  update() {
    // get current location
    const { pathname } = window.location;

    // set pathname
    this.path = pathname;

    // @todo url params ??
    if (pathname !== '/' && pathname.endsWith('/')) {
      this.path = this.path.slice(0, -1);
    }

    // necessary?
    if (/\/\//.test(this.path)) {
      this.path = this.path.replaceAll('//', '/');
    }

    if (this.path !== pathname) {
      window.location.replace(this.path);
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
      this.set(routes.home);
      return routes.home;
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
}

export { routes, isChatRoute, fetchData };

export default new Router();
