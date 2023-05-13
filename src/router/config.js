// export const routes = 'home contact view code about error'
//   .split(' ')
//   .reduce((all, key) => {
//     all[key] = '/' + key;
//     return all;
//   }, {});

export const KEYS = {
  ROOT: 'root',
  BACK: 'popstate',
  RESET: 'resetstate',
  VIEW: 'view',
  SHARE: 'share',
};

export const routes = {
  [KEYS.ROOT]: '/chat',
  [KEYS.VIEW]: '/view',
  about: '/about',
  code: '/code',
  contact: '/contact',
  error: '/error',
};
