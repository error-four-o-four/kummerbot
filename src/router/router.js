import { ORIGIN, ROUTES } from './config.js';

import historyController from '../controller/history-controller.js';
import errorController, { ERROR_KEY } from '../controller/error-controller.js';
// import formController from '../controller/form/form-controller.js';

import handlePopstate from '../handler/event/handle-popstate.js';

const title = document.title;

const entries = {
  isChatRoute: ROUTES.HOME,
  isAboutRoute: ROUTES.ABOUT,
  isSharedRoute: ROUTES.SHARED,
  isContactRoute: ROUTES.CONTACT,
};

const getPathname = () => window.location.pathname;

export default {
  pathname: null,
  prevPathname: null,
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

    if (!validate(pathname)) {
      // user went to an invalid url
      errorController.set('Die angegebene Adresse ist nicht erreichbar.');
      pathname = ROUTES.ERROR;
    }

    // on page load => event-handler
    // redirect from '/' and '/contact' to '/chat'
    pathname =
      pathname === '/' || this.check(pathname, ROUTES.CONTACT)
        ? ROUTES.HOME
        : pathname;

    // @todo case
    // popped back from another page
    // example.com - history.back() - this
    // pushState removes the possibility
    // to invoke a popstate forward
    const href = ORIGIN + pathname;
    const index = historyController.add(pathname);
    window.history.pushState({ href, index }, '', href);

    this.update(pathname);
  },

  update(pathname) {
    this.prevPathname = this.pathname;
    this.pathname = pathname;

    Object.entries(entries).forEach(
      ([key, value]) => (this[key] = this.check(this.pathname, value))
    );

    this.hasError = this.pathname.includes(ERROR_KEY);

    if (this.prevPathname === null) {
      this.hasChanged = true;
    } else {
      // case router.hasPopped back in /chat route
      // const prevRouteKey =
      //   '/' + this.prevPathname?.split('/').filter((key) => !!key)[0] || null;
      const prevRouteKey = '/' + getKey(this.prevPathname);
      this.hasChanged = !this.check(this.pathname, prevRouteKey);
    }

    if (this.hasChanged) {
      const routeKey = getKey(this.pathname);
      document.title = title + ' - ' + routeKey;
    }
  },

  push({ href, pathname }) {
    // @todo doublecheck error route
    if (historyController.get() === ROUTES.ERROR) {
      const index = historyController.replace(pathname);
      window.history.replaceState({ href, index }, '', href);
    } else {
      const index = historyController.add(pathname);
      window.history.pushState({ href, index }, '', href);
    }

    // this.update() depends on historyController
    this.hasPopped = pathname === ROUTES.HOME ? true : false;
    this.update(pathname);
  },

  pop({ href, pathname }) {
    removePopstateListener();
    this.hasPopped = true;

    return new Promise((resolve) => {
      // when the historyController has no prior entries
      // case: first view was /chat route with multiple rendered ChatModule components
      if (historyController.index === 0) {
        // @todo await history.go() timeout
        historyUnshiftState(href, pathname);
        this.update(pathname);
        restorePopstateListener(resolve);
        return;
      }

      // called when user clicked on ChatLink Back or ChatLink linkToParent
      // updates the current historyController.index
      const delta = historyController.go(pathname);

      // @todo use pushState when routing from /contact/message to /about
      if (historyController.index < 0) {
        console.log('wat?', this);
      }

      window.history.go(delta);

      this.update(pathname);
      restorePopstateListener(resolve);
    });
  },

  restore(prevPathname, nextPathname) {
    removePopstateListener();

    return new Promise((resolve) => {
      const delta = !!prevPathname
        ? historyController.go(prevPathname)
        : -1 * historyController.index - 1;

      window.history.go(delta);

      setTimeout(() => {
        console.log(window.history.state);

        const index = !!prevPathname ? historyController.add(nextPathname) : 0;
        const href = ORIGIN + nextPathname;
        window.history.pushState({ href, index }, '', href);

        this.update(nextPathname);
        restorePopstateListener(resolve);
      }, 10);
    });
  },

  replace({ href, pathname }) {
    const index = historyController.replace(pathname);
    window.history.replaceState({ href, index }, '', href);

    this.update(pathname);
  },

  check(route, request) {
    return !!route && route.startsWith(request);
  },

  // @dev
  log() {
    return [
      ...Object.keys(this).reduce((all, key) => {
        if (typeof this[key] === 'function' || !this[key]) return all;
        typeof this[key] === 'boolean'
          ? all.push(key)
          : all.push(`${key}:`, this[key]);
        return all;
      }, []),
    ];
  },
};

function getKey(pathname) {
  return pathname.split('/').filter((key) => !!key)[0];
}

function validate(pathname) {
  const route = '/' + pathname.substring(1).split('/')[0];

  if (route === '/') return true;

  return Object.values(ROUTES).reduce(
    (matched, valid) => (valid === route ? true : matched),
    false
  );
}

function historyUnshiftState(href, pathname) {
  let prevHref = ORIGIN + historyController.get();
  historyController.values.unshift(pathname);
  // @todo add isFirstState
  window.history.replaceState({ href, index: 0 }, '', href);
  // @consider
  // push a state for each existing entry?
  window.history.pushState({ href: prevHref, index: 1 }, '', href);
  window.history.go(-1);
}

function removePopstateListener() {
  window.removeEventListener('popstate', handlePopstate);
}

function restorePopstateListener(resolvePromise) {
  setTimeout(() => {
    window.addEventListener('popstate', handlePopstate);
    resolvePromise();
  }, 50);
}
