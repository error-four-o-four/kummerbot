import router from './router.js';
import { KEYS } from './config.js';

export const fetchData = async (file) => {
  const data = await fetch(file);
  if (data.ok) {
    return {
      error: null,
      data: await data.text(),
    };
  }

  return {
    error: `Unable to fetch data from ${file}`,
    data: null,
  };
};

export const getPathToChatFile = (key) => {
  const step = router.keys.indexOf(key);

  // return first section or share section
  return step === 0 || key === KEYS.SHARE
    ? '/views/chat/' + key + '.html'
    : '/views/chat-' + step + '/' + key + '.html';
};

export const getPathToPageFile = () => '/views' + router.path + '.html';

export const getPathToViewFile = () => {
  const [, index, file] = router.keys;
  return '/views/chat-' + index + '/' + file + '.html';
};

// @todo currently used in renderPage to set id of section
// but renderChat uses custom attributes
// export const getIdFromPath = () => router.keys[0];
