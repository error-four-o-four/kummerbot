import templates from './templates.js';

const { pending, waiting } = templates.text.indicator;

const app = document.getElementById('app');

const header = {
  elt: document.querySelector('header'),
  svg: document.getElementById('avatar-svg'),
  span: document.getElementById('status-indicator'),
  link: document.querySelector('about-link'),
  setIndicatorPending() {
    this.span.innerText = pending;
    this.elt.classList.add('pending');
  },
  setIndicatorWaiting() {
    this.span.innerText = waiting;
    this.elt.classList.remove('pending');
  },
};

const outlet = document.getElementById('outlet');

export default {
  app,
  header,
  outlet,
};
