import router from '../../router/router.js';
import renderer from '../../renderer/renderer.js';

import historyController from '../../controller/history-controller.js';
import formController from '../../controller/form/form-controller.js';
import { CONTACT_VAL } from '../../controller/form/config.js';
import { ORIGIN, ROUTES } from '../../router/config.js';

// import { post, pre } from './event-handler.js';

export default (e) => {
  // debugger;
  // user reached initial state
  // redirect him to previous url
  // thi is only the case if there's a referrer url
  if (e.state.isFirstState && historyController.index === 0) {
    console.log('go back');
    window.history.go(-1);
    return;
  }

  if (!e.state) {
    console.log('popped in');
    return;
  }

  if (e.state.index === historyController.index) {
    // router.pop() (sometimes) invokes a popstate event
    // prevent calling renderer.update() twice
    // @todo case:
    // do not return when first view was /chat route with multiple rendered modules
    return;
  }

  e.preventDefault();
  // pre(e);

  // compare current and previous index
  // to determine direction
  const poppedBack = e.state.index < historyController.index;
  const wasContactRoute = router.isContactRoute;

  // previous state was /contact route
  if (wasContactRoute) {
    // it should not be possible to pop forward
    // bc of replaceState
    if (!poppedBack) {
      return;
    }

    // adjust formController and historyController
    if (poppedBack && formController.check(CONTACT_VAL[0])) {
      const { href, index } = e.state;
      const pathname = href.replace(ORIGIN, '');
      historyController.index = index;
      router.hasPopped = false;
      router.update(pathname);
      renderer.update();
      return;
    }

    // remove history entry
    // when previous route was /contact/captcha
    if (poppedBack && formController.check(CONTACT_VAL[1])) {
      // const { href } = e.state;
      // const pathname = href.replace(ORIGIN, '');
      const index = historyController.pop();
      const pathname = historyController.get();
      const href = ORIGIN + pathname;
      formController.set(CONTACT_VAL[0]);
      window.history.go(1);

      // @todo
      setTimeout(() => {
        window.history.replaceState({ href, index }, '', href);
        router.hasPopped = false;
        router.update(pathname);
        renderer.update();
        // @dev
        // post();
      }, 50);

      return;
    }
  }

  let { href, index } = e.state;
  let pathname = href.replace(ORIGIN, '');

  // went forward to /contact route
  if (!poppedBack && router.check(pathname, ROUTES.CONTACT)) {
    pathname = ROUTES.CONTACT + '/' + CONTACT_VAL[0];
    href = ORIGIN + pathname;
    historyController.index = index;
    historyController.values[index] = pathname;
    window.history.replaceState({ href, index }, '', href);
    router.hasPopped = false;
    router.update(pathname);
    renderer.update();

    // @dev
    // post();
    return;
  }

  // set historyController.index
  // but do not change the entries
  historyController.index = index;
  // update router props
  router.hasPopped = poppedBack;
  router.update(pathname);
  renderer.update();

  // @dev
  // post();
  // console.log(router);
};
