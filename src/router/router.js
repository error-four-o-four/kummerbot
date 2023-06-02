import { ORIGIN, ROUTES } from './config.js';

import historyController from '../controller/history-controller.js';
import errorController, { ERROR_KEY } from '../controller/error-controller.js';
import formController from '../controller/form-controller.js';

import renderer from '../renderer/renderer.js';

const getPathname = () => window.location.pathname;

const router = {
  route: null,
  // @todo => getter historyController.values[historyController.index - 1]
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

    if (!this.validate(pathname)) {
      errorController.set('Die angegebene Adresse ist nicht erreichbar.');
      pathname = ROUTES.ERROR;
    }

    // on page load
    // redirect from '/' to '/chat'
    // @consider condition ? history.state or historyItems.values.length
    if (window.history.state === null) {
      pathname = pathname === '/' ? ROUTES.HOME : pathname;
    }

    const href = ORIGIN + pathname;
    const index = historyController.push(pathname);
    window.history.replaceState({ href, index }, '', href);

    updateProps(pathname);
  },

  push({ href, pathname }) {
    // @todo
    // adjust pathname and href
    // call formController.forward()
    // const { isContactRoute: wasContactRoute } = renderer.props;
    // const isContactRoute = router.check(pathname, ROUTES.CONTACT);

    const index = historyController.push(pathname);
    window.history.pushState({ href, index }, '', href);

    console.log(index, historyController.values);

    this.hasPopped = false;
    updateProps(pathname);

    // console.log(
    //   `post\n${historyItems.join(
    //     ', '
    //   )}\nlocation.pathname: ${getRoute()}\nthis.route: ${
    //     this.route
    //   }\nthis.prevRoute: ${this.prevRoute}\nhistory:`,
    //   window.history.length,
    //   window.history.state
    // );
  },

  replace({ href, pathname }) {
    // called when user clicked on ChatLink Back or ChatLink linkToParent
    let [delta, index] = historyController.set(pathname);

    // @todo
    // call formController.back()
    // const { isContactRoute: wasContactRoute } = renderer.props;
    // const isContactRoute = router.check(pathname, ROUTES.CONTACT);

    if (!!delta) {
      window.history.go(delta);
      window.history.replaceState({ href, index }, '', href);
    } else {
      // case
      // first view was /chat route with multiple rendered ChatModule components
      index = historyController.push(pathname);
      window.history.pushState({ href, index }, '', href);
    }

    this.hasPopped = true;
    updateProps(pathname);
  },

  onSubmit(e) {},

  onPopstate(e) {
    const { href, index } = e.state;
    const pathname = href.replace(ORIGIN, '');

    if (renderer.transition) {
      e.preventDefault();

      // check direction
      const direction =
        e.state.index < historyController.index ? 'forward' : 'back';

      // go reversed direction
      window.history[direction]();

      // @todo finish animations
      // instead of this
      // @bug too many api calls
      renderer.transition = false;
      return;
    }

    historyController.index = index;

    // @todo
    // validate contact page
    // do not move forward in /contact/message route
    // history.back();

    this.hasPopped = true;
    updateProps(pathname);
  },

  validate(pathname) {
    const route = '/' + pathname.substring(1).split('/')[0];

    if (route === '/') return true;

    // @todo move to formController and call historyController
    if (this.check(route, ROUTES.CONTACT) && !formController.getContactData()) {
      return false;
    }

    return Object.values(ROUTES).reduce(
      (matched, valid) => (valid === route ? true : matched),
      false
    );
  },

  check(route, request) {
    return !!route && route.startsWith(request);
  },
};

export default router;

const entries = {
  isChatRoute: ROUTES.HOME,
  isAboutRoute: ROUTES.ABOUT,
  isSharedRoute: ROUTES.SHARED,
  isContactRoute: ROUTES.CONTACT,
};

function updateProps(pathname) {
  // @todo
  // prevRoute =
  //    isChatRoute &&
  //    !historyItems.values[historyItems.index - 1]
  //      ?
  //      :
  router.prevRoute = router.route;
  router.route = pathname;

  Object.entries(entries).forEach(
    ([key, value]) => (router[key] = router.check(router.route, value))
  );

  router.hasError = router.route.includes(ERROR_KEY);
  router.hasChanged = !router.prevRoute
    ? true
    : !router.check(router.route, router.prevRoute);
}

// handle(e) {
// const { target, type } = e;
// e.preventDefault();
// if (type !== 'submit') {
//   // get target location
//   const pathname =
//     type === 'popstate' ? window.location.pathname : target.pathname;
//   const isContactRoute = check(pathname, ROUTES.CONTACT);
//   const wasContactRoute = check(state.route, ROUTES.CONTACT);
//   // just preventDefault and pushState
//   if (!isContactRoute || (isContactRoute && !wasContactRoute)) {
//     const href =
//       // routed from ContactItem
//       isContactRoute && !wasContactRoute
//         ? ORIGIN + ROUTES.CONTACT + '/' + CONTACT_VAL[0]
//         : target.href;
//     window.history.pushState({ href }, '', href);
//     update();
//     return state;
//   }
//   const href = ORIGIN + ROUTES.CONTACT + '/' + formController.step;
//   window.history.pushState({ href }, '', href);
//   update();
//   return state;
// }
// // handle submit
// // if step < CONTACT_VAL[1] => pushState
// // else replaceState
// const href = ORIGIN + ROUTES.CONTACT + '/' + formController.step;
// window.history.pushState({ href }, '', href);
// update();
// return state;
// if (type === 'popstate') {
//   validate(window.location.pathname)
//     ? serialize()
//     : this.replace(ROUTES.ERROR);
//   return state;
// }
// if (type === 'submit') {
//   const href = ORIGIN + ROUTES.CONTACT + '/' + contactHandler.step;
//   // use replaceState when message was send
//   window.history.pushState({ href }, '', href);
//   serialize();
//   return state;
// }
// },
