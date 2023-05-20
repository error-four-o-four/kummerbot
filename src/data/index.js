import { delay } from '../renderer/animation.js';
let contacts;

const resolver = async (resolve) => {
  console.log('resolving');
  const data = await import('./contacts.js');
  resolve(data.default);
};

export default async () => {
  if (!contacts) {
    await delay(3000);
    return new Promise(resolver)
      .then((data) => {
        contacts = data;
        return {
          error: null,
          data,
        };
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

  return { error: null, data: contacts };
};
