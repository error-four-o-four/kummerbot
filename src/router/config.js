// export const routes = 'home contact view code about error'
//   .split(' ')
//   .reduce((all, key) => {
//     all[key] = '/' + key;
//     return all;
//   }, {});

export const ROUTES = {
  HOME: '/chat',
  ABOUT: '/about',
  SHARED: '/display',
  CONTACT: '/contact',
  ERROR: '/error',
};

export const ORIGIN = window.location.origin;
