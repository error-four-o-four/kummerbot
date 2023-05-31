import errorHandler from '../handler/error-handler.js';
import contactHandler from '../handler/contact-handler.js';

import { ROUTES } from './config.js';

const fetchedData = {};

export const isFetched = (file) => file in fetchedData;

const setData = (file, text) => (fetchedData[file] = text);

export const getData = async (path) => {
  const file = path.split('/').at(-1);

  if (isFetched(file)) return fetchedData[file];

  try {
    let data = await fetch(path);

    if (data.ok) {
      const text = await data.text();
      setData(file, text);
      return text;
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

  if (check(route, ROUTES.CONTACT) && !contactHandler.getContactData()) {
    return false;
  }

  return Object.values(ROUTES).reduce(
    (matched, valid) => (valid === route ? true : matched),
    false
  );
};
