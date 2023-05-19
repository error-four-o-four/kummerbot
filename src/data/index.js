import { delay } from '../renderer/animation.js';
let contacts;

const resolver = async (resolve) => {
  console.log('resolving');
  const data = await import('./contacts.js');
  resolve(data.default);
};

const resolveContact = (key) => {
  const data = contacts.filter((item) => key === item.key)[0] || null;
  const error = !!data ? null : 'Keine Daten vorhanden.';
  return {
    error,
    data,
  };
};

export default async (key) => {
  if (!contacts) {
    await delay(5000);
    return new Promise(resolver)
      .then((data) => {
        contacts = data;
        return resolveContact(key);
      })
      .catch((error) => {
        console.warn(error);
        return {
          error: 'An Error occured. Please try to refresh the page',
          data: null,
        };
      });
    // fetch again ??
  }

  return resolveContact(key);
};
