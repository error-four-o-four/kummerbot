import { delay } from '../renderer/animation.js';

import router from '../router/router.js';
import renderer from '../renderer/renderer.js';
import errorController from '../controller/error-controller.js';

import { TARGET_VAL } from '../components/components.js';

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
    errorController.set(error);
    return null;
  }
};

export function getFilePath(moduleKey) {
  const base = '/views';
  const file = '/' + moduleKey + '.html';

  if (
    router.isChatRoute &&
    (moduleKey === renderer.keys[0] || moduleKey === TARGET_VAL.SHARE)
  ) {
    return base + '/chat' + file;
  }

  if (router.isChatRoute || router.isSharedRoute) {
    const index = router.isSharedRoute
      ? renderer.keys[1]
      : renderer.keys.indexOf(moduleKey);

    return base + '/chat-' + index + file;
  }

  if (router.isContactRoute) {
    return base + '/contact.html';
  }

  // keys map to file names
  return base + file;
}

// ########################################

let contacts;

export async function getContactsData() {
  const resolver = async (resolve) => {
    const data = await import('../data/contacts.js');
    resolve(data.default);
  };

  if (!contacts) {
    await delay(1000);
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
}
