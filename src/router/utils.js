import errorHandler from '../handler/error-handler.js';

import { routes } from './config.js';

export const fetchData = async (file) => {
  try {
    let data = await fetch(file);

    if (data.ok) {
      return await data.text();
    }

    throw new Error(`Daten können nicht gefunden werden`);
  } catch (error) {
    // handle
    errorHandler.set(error);
    return null;
  }
};

export const validate = (pathname) => {
  const requested = '/' + pathname.substring(1).split('/')[0];

  if (requested === '/') return true;

  return Object.values(routes).reduce(
    (matched, valid) => (valid === requested ? true : matched),
    false
  );
};
