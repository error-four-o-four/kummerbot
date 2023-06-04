import router from '../../router/router.js';
import elements from '../../elements/elements.js';
import renderer from '../../renderer/renderer.js';

import historyController from '../../controller/history-controller.js';
import formController from '../../controller/form/form-controller.js';
import { CONTACT_VAL } from '../../controller/form/config.js';
import { ORIGIN, ROUTES } from '../../router/config.js';
import { post, pre } from './event-handler.js';

export default (e) => {
  e.preventDefault();

  pre(e);

  // submitted message
  if (
    formController.check(CONTACT_VAL[0]) &&
    !elements.form.element.reportValidity()
  ) {
    return;
  }

  // submitted captcha
  if (
    formController.check(CONTACT_VAL[1])
    // !elements.form.element.reportValidity()
  ) {
    return;
  }

  formController.forward();

  const pathname = ROUTES.CONTACT + '/' + formController.get();
  const href = ORIGIN + pathname;

  const index = historyController.push(pathname);
  router.replace({ href, index });
  renderer.update();

  post();
};
