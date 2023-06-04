import { ORIGIN, ROUTES } from './config.js';

import historyController from '../controller/history-controller.js';
import errorController, { ERROR_KEY } from '../controller/error-controller.js';
import formController from '../controller/form/form-controller.js';

const entries = {
  isChatRoute: ROUTES.HOME,
  isAboutRoute: ROUTES.ABOUT,
  isSharedRoute: ROUTES.SHARED,
  isContactRoute: ROUTES.CONTACT,
};

const getPathname = () => window.location.pathname;

export default {
  route: null,
  prevRoute: null,
  hasError: false,
  hasPopped: false,
  hasChanged: false,
  isChatRoute: false,
  isAboutRoute: false,
  isSharedRoute: false,
  isContactRoute: false,

  init() {
    let pathname = getPathname();

    if (window.history.state === null) {
      window.history.replaceState({ isFirstState: true }, '', null);
    }

    if (!this.validate(pathname)) {
      errorController.set('Die angegebene Adresse ist nicht erreichbar.');
      pathname = ROUTES.ERROR;
    }

    // on page load => event-handler
    // redirect from '/' to '/chat'
    pathname = pathname === '/' ? ROUTES.HOME : pathname;

    // @todo case
    // popped back from another page
    // example.com - history.back() - this
    // replace state removes the possibility
    // to invoke a popstate forward
    const href = ORIGIN + pathname;
    const index = historyController.push(pathname);
    window.history.pushState({ href, index }, '', href);

    this.update(pathname);
  },

  update(pathname) {
    let tmp = this.route;
    this.route = pathname;

    Object.entries(entries).forEach(
      ([key, value]) => (this[key] = this.check(this.route, value))
    );

    // @todo doublecheck conditions
    // historyController.index < historyController.values.length - 1
    this.prevRoute = !this.isContactRoute
      ? tmp
      : historyController.values[historyController.index - 1];

    this.hasError = this.route.includes(ERROR_KEY);

    if (!this.prevRoute) {
      this.hasChanged = true;
    } else {
      // case router.hasPopped back in /chat route
      const prevRouteKey =
        '/' + this.prevRoute?.split('/').filter((key) => !!key)[0] || null;
      this.hasChanged = !this.check(this.route, prevRouteKey);
    }
  },

  push({ href, pathname }) {
    // @reminder
    // /contact route is handled in even-handler.js
    if (historyController.get() === ROUTES.ERROR) {
      const index = historyController.index;
      historyController.values[index] = pathname;
      window.history.replaceState({ href, index }, '', href);
    } else {
      const index = historyController.push(pathname);
      window.history.pushState({ href, index }, '', href);
    }

    // this.update() depends on historyController
    this.update(pathname);
    this.hasPopped = false;
  },

  pop({ href, pathname }) {
    // @reminder
    // /contact route is handled by event-handler and this.set()

    // when the historyController has no prior entries
    // case: first view was /chat route with multiple rendered ChatModule components
    if (historyController.index === 0) {
      let prevHref = ORIGIN + historyController.get();
      historyController.values.unshift(pathname);
      window.history.replaceState({ href, index: 0 }, '', href);
      // @consider
      // push a state for each existing entry?
      window.history.pushState({ href: prevHref, index: 1 }, '', href);
      window.history.go(-1);
      this.update(pathname);
      this.hasPopped = true;
      return;
    }

    // called when user clicked on ChatLink Back or ChatLink linkToParent
    // updates the current historyController.index
    let delta = historyController.set(pathname);

    // @todo
    if (historyController.index < 0) {
      console.log('wat?', e, this);
    }

    // @doublecheck
    // is a popstate event dispatched ??
    window.history.go(delta);

    this.update(pathname);
    this.hasPopped = true;
  },

  replace({ href, index }) {
    const pathname = href.replace(ORIGIN, '');
    window.history.replaceState({ href, index }, '', href);

    this.update(pathname);
  },

  check(route, request) {
    return !!route && route.startsWith(request);
  },

  validate(pathname) {
    const route = '/' + pathname.substring(1).split('/')[0];

    if (route === '/') return true;

    if (this.check(route, ROUTES.CONTACT) && !formController.getContactData()) {
      return false;
    }

    return Object.values(ROUTES).reduce(
      (matched, valid) => (valid === route ? true : matched),
      false
    );
  },
};
