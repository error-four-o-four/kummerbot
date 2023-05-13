const app = document.getElementById('app');
const header = document.querySelector('header');
const outlet = document.getElementById('outlet');

export default {
  app,
  header,
  headerLink: null,
  outlet,
};

export * from './config.js';
export * from './navbar.js';
