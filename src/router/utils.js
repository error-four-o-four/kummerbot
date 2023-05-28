import contactHandler from '../handler/contact-handler.js';
import errorHandler from '../handler/error-handler.js';

import { ROUTES } from './config.js';

export const fetchData = async (file) => {
  try {
    let data = await fetch(file);

    if (data.ok) {
      return await data.text();
    }

    throw new Error('Die angegebene Adresse ist nicht erreichbar.');
  } catch (error) {
    // handle
    errorHandler.set(error);
    return null;
  }
};

export const check = (route, request) => !!route && route.startsWith(request);

export const validate = (pathname) => {
  const route = '/' + pathname.substring(1).split('/')[0];

  if (route === '/') return true;

  if (check(route, ROUTES.CONTACT) && !contactHandler.hasContactData()) {
    return false;
  }

  return Object.values(ROUTES).reduce(
    (matched, valid) => (valid === route ? true : matched),
    false
  );
};
