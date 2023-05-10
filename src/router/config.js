// export const routes = 'home contact view code about error'
//   .split(' ')
//   .reduce((all, key) => {
//     all[key] = '/' + key;
//     return all;
//   }, {});

export const KEYS = {
  CHAT: 'home',
  BACK: 'back',
  VIEW: 'view',
  SHARE: 'share',
  RESET: 'reset',
};

export const routes = {
  [KEYS.CHAT]: '/chat',
  [KEYS.VIEW]: '/view',
  about: '/about',
  code: '/code',
  contact: '/contact',
  error: '/error',
};
