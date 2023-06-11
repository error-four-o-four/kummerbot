import router from '../../router/router.js';
import renderer from '../../renderer/renderer.js';

import historyController from '../../controller/history-controller.js';
import errorController from '../../controller/error-controller.js';
import formController from '../../controller/form/form-controller.js';

import { ORIGIN, ROUTES } from '../../router/config.js';
import { CONTACT_VAL } from '../../controller/form/config.js';
import { delay } from '../../renderer/animation/utils.js';

export default async (e) => {
  e.preventDefault();

  // check user input
  const isValid = formController.checkValidity();

  if (!isValid) return;

  // update state
  let formState = formController.forward();
  let pathname = ROUTES.CONTACT + '/' + formState;

  // push: /contact/captcha
  // update historyController index
  if (formState === CONTACT_VAL[1]) {
    historyController.add(pathname);
    const href = ORIGIN + pathname;
    router.replace({ href, pathname });
    renderer.update();
    return;
  }

  // go: /contact/message - 1
  // restore: /contact/requesting
  if (formState === CONTACT_VAL[2]) {
    historyController.go(ROUTES.CONTACT + '/' + CONTACT_VAL[0]);
    const prevPathname = historyController.get(-1);
    await router.restore(prevPathname, pathname);
    renderer.update();

    // dispatch another submit event
    // when message has been send
    const response = await sendMessage();

    if (response.ok) {
      formState = formController.forward();
      formController.resetContactData();
      pathname = ROUTES.CONTACT + '/' + formState;
    } else {
      // @todo
      // fix: message is not displayed (?)
      errorController.set(
        'Leider konnte deine Nachricht nicht zugestellt werden.'
      );
      pathname = ROUTES.ERROR;
    }

    const href = ORIGIN + pathname;
    router.replace({ href, pathname });
    renderer.update();
  }
};

async function sendMessage() {
  await delay(1500);

  return {
    ok: true,
  };
}
