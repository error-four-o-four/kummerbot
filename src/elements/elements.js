const app = document.getElementById('app');
const header = document.querySelector('header');
const outlet = document.getElementById('outlet');

export default {
  app,
  header,
  headerAnchor: null,
  outlet,
  get outletChildren() {
    return outlet.children;
  },
};

export * from './config.js';
export * from './templates.js';
export * from './navbar.js';
