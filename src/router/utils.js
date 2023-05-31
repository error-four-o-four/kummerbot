import formController from '../controller/form-controller.js';

import { ROUTES } from './config.js';

export const check = (route, request) => !!route && route.startsWith(request);

export const validate = (pathname) => {
  const route = '/' + pathname.substring(1).split('/')[0];

  if (route === '/') return true;

  if (check(route, ROUTES.CONTACT) && !formController.getContactData()) {
    return false;
  }

  return Object.values(ROUTES).reduce(
    (matched, valid) => (valid === route ? true : matched),
    false
  );
};
