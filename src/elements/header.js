const htmlPending = 'Schreibt ...';
const htmlWaiting = 'Online';

const classIndicator = 'pending';

const header = document.querySelector('header');
const indicator = document.getElementById('status-indicator');

const headerHeight = header.offsetHeight + 8;
document.documentElement.style.setProperty(
  '--scroll-padding',
  headerHeight + 'px'
);

export default {
  link: document.querySelector('about-link'),
  setIndicatorPending() {
    indicator.innerText = htmlPending;
    header.classList.add(classIndicator);
  },
  setIndicatorWaiting() {
    indicator.innerText = htmlWaiting;
    header.classList.remove(classIndicator);
  },
};
