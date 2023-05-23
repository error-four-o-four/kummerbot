import templates, { HEADER_TMPL_KEY } from '../renderer/templates.js';

import form from './form.js';

const app = document.getElementById('app');

const htmlPending = templates.html[HEADER_TMPL_KEY.indicatorPending];
const htmlWaiting = templates.html[HEADER_TMPL_KEY.indicatorWaiting];

const classIndicator = 'pending';

const header = {
  elt: document.querySelector('header'),
  svg: document.getElementById('avatar-svg'),
  span: document.getElementById('status-indicator'),
  link: document.querySelector('about-link'),
  setIndicatorPending() {
    this.span.innerText = htmlPending;
    this.elt.classList.add(classIndicator);
  },
  setIndicatorWaiting() {
    this.span.innerText = htmlWaiting;
    this.elt.classList.remove(classIndicator);
  },
};

const outlet = document.getElementById('outlet');

export default {
  app,
  header,
  outlet,
  form,
};
