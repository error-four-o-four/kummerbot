import { ROUTES } from '../router/config.js';
import { anchorClass } from '../components/chat-link/utils.js';

const header = document.querySelector('header');

const headerHeight = header.offsetHeight + 8;
document.documentElement.style.setProperty(
  '--scroll-padding',
  headerHeight + 'px'
);

const htmlPending = 'Schreibt ...';
const htmlWaiting = 'Online';
const indicator = document.getElementById('status-indicator');
const indicatorClass = 'pending';
// indicator.innerText = htmlWaiting;

const checkPathname = (pathname) => pathname.startsWith(ROUTES.ABOUT);
const htmlInactive = 'Details';
const htmlActive = 'zur&uuml;ck';

let isActive = checkPathname(window.location.pathname);

const link = header.lastElementChild.appendChild(document.createElement('a'));
link.classList.add(anchorClass.routed);
link.innerHTML = isActive ? htmlActive : htmlInactive;
link.href = isActive ? ROUTES.HOME : ROUTES.ABOUT;

export default {
  updateLink(pathname = null) {
    if (pathname === null && link.pathname === ROUTES.ABOUT) return;

    if (!!pathname) {
      link.innerHTML = htmlActive;
      link.pathname = pathname;
      return;
    }

    link.innerHTML = htmlInactive;
    link.pathname = ROUTES.ABOUT;
  },
  setIndicatorPending() {
    indicator.innerText = htmlPending;
    header.classList.add(indicatorClass);
  },
  setIndicatorWaiting() {
    indicator.innerText = htmlWaiting;
    header.classList.remove(indicatorClass);
  },
};
