// export const routes = 'home contact view code about error'
//   .split(' ')
//   .reduce((all, key) => {
//     all[key] = '/' + key;
//     return all;
//   }, {});

export const routes = {
  home: '/chat',
  about: '/about',
  shared: '/display',
  contact: '/contact',
  error: '/error',
};
