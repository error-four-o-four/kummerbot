import router from '../../router/router.js';
import elements from '../../elements/elements.js';
import renderer from '../../renderer/renderer.js';

import historyController from '../../controller/history-controller.js';
import formController from '../../controller/form/form-controller.js';
import { CONTACT_VAL } from '../../controller/form/config.js';
import { ORIGIN, ROUTES } from '../../router/config.js';
// import { post, pre } from './event-handler.js';

export default (e) => {
  e.preventDefault();

  // @dev
  // pre(e);

  // submitted message
  if (
    formController.check(CONTACT_VAL[0]) &&
    !elements.form.element.reportValidity()
  ) {
    return;
  }

  if (formController.check(CONTACT_VAL[0])) {
    formController.setMessage();
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

  // @dev
  // post();
};

// async function submitCaptchaForm() {
//   const isValid = captchaValidator.validate();

//   if (!isValid) {
//     elements.form.captcha.setCustomValidity(captchaValidator.message);
//     elements.form.checkValidity();
//     elements.form.captcha.setCustomValidity('');
//     return;
//   }

//   //   elements.form.captcha.removeEventListener(
//   //     'input',
//   //     captchaValidator.onInput.bind(captchaValidator)
//   //   );

//   state.next();
//   // renderer.update(router.state);

//   const response = await sendMessage(messageData.email, messageData.message);

//   if (!response.ok) {
//     errorController.set(
//       'Leider konnte deine Nachricht nicht versendet werden.'
//     );
//     router.update(ROUTES.ERROR);
//     renderer.update();
//     return;
//   }

//   messageData.reset();

//   state.next();
//   // renderer.update(router.state);
// }

// // pseudo functionality
// async function sendMessage(email, message) {
//   await delay(5000);
//   console.log('send', email, message);

//   return {
//     ok: true,
//     // ok: false,
//   };
// }
