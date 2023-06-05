import router from '../../router/router.js';
import renderer from '../../renderer/renderer.js';

import historyController from '../../controller/history-controller.js';
import formController from '../../controller/form/form-controller.js';
import messageForm from '../../elements/form-message.js';
import captchaForm from '../../elements/form-captcha.js';
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
    !messageForm.element.reportValidity()
  ) {
    return;
  }

  if (formController.check(CONTACT_VAL[0])) {
    formController.setMessage();
  }

  // submitted captcha
  if (formController.check(CONTACT_VAL[1])) {
    const isValid = captchaForm.validate();

    if (!isValid) return;
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
