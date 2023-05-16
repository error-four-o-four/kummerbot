import { routes } from './config.js';

export const fetchData = async (file) => {
  let data = null;
  let error = null;
  try {
    data = await fetch(file);

    if (data.ok) {
      return {
        error,
        data: await data.text(),
      };
    }

    return {
      error: `Unable to fetch data from ${file}`,
      data,
    };
  } catch (error) {
    return {
      error,
      data,
    };
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
