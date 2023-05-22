import templates, { HEADER_TMPL_KEY } from './templates.js';

const app = document.getElementById('app');

const htmlPending = templates.html[HEADER_TMPL_KEY.indicatorPending];
const htmlWaiting = templates.html[HEADER_TMPL_KEY.indicatorWaiting];

const header = {
  elt: document.querySelector('header'),
  svg: document.getElementById('avatar-svg'),
  span: document.getElementById('status-indicator'),
  link: document.querySelector('about-link'),
  setIndicatorPending() {
    this.span.innerText = htmlPending;
    this.elt.classList.add('pending');
  },
  setIndicatorWaiting() {
    this.span.innerText = htmlWaiting;
    this.elt.classList.remove('pending');
  },
};

const outlet = document.getElementById('outlet');

export default {
  app,
  header,
  outlet,
};
