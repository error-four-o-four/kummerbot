import router from '../../router/router.js';
import renderer from '../../renderer/renderer.js';

import historyController from '../../controller/history-controller.js';
import formController from '../../controller/form/form-controller.js';
import { CONTACT_VAL } from '../../controller/form/config.js';
import { ORIGIN, ROUTES } from '../../router/config.js';

export default (e) => {
  // user reached initial state
  // redirect him to previous url
  // thi is only the case if there's a referrer url
  if (e.state.isFirstState) {
    console.log('go back');
    window.history.go(-1);
    return;
  }

  if (!e.state) {
    console.log('popped in');
    return;
  }

  e.preventDefault();

  // compare current and previous index
  // to determine direction
  const poppedBack = e.state.index < historyController.index;

  if (poppedBack && historyController.index === 0) {
    console.log('go back');
    window.history.go(-1);
    return;
  }

  // console.log(
  //   e.state.pathname,
  //   e.state.index,
  //   historyController.index,
  //   poppedBack,
  //   ...router.log(),
  //   ...historyController.log()
  // );

  if (poppedBack) {
    historyController.back();
  } else {
    historyController.index += 1;
  }

  const wasContactRoute = router.isContactRoute;
  const formState = formController.get();

  let pathname = e.state.pathname;

  // went from /contact/captcha to /contcat/message
  if (wasContactRoute && formState === CONTACT_VAL[1]) {
    formController.back();
    pathname = ROUTES.CONTACT + '/' + formController.get();
    const href = ORIGIN + pathname;
    const index = historyController.index;
    window.history.pushState({ pathname, index }, '', href);
  }

  // @todo /contact/requesting

  router.update(pathname);
  router.isPopstateEvent = true;
  renderer.update();
};
