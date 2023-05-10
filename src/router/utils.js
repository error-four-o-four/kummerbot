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
  const step = router.steps.indexOf(key);

  // return first section or share section
  return step === 0 || key === KEYS.SHARE
    ? '/views/chat/' + key + '.html'
    : '/views/chat-' + step + '/' + key + '.html';
};

export const getPathToPageFile = () => '/views' + router.path + '.html';

export const getPathToViewFile = () => {
  const [, index, file] = router.steps;
  return '/views/chat-' + index + '/' + file + '.html';
};

export const getIdFromPath = () => router.steps[0];
