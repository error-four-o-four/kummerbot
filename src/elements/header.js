import { ROUTES } from '../router/config.js';
import { anchorClass } from '../components/chat-link/utils.js';

import { id, useSymbol, setSymbolPath } from './svgs.js';

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

const checkPathname = (pathname) => pathname.startsWith(ROUTES.ABOUT);

header.lastElementChild.innerHTML = useSymbol(id.about);
const icon = header.querySelector('use');

let isActive = checkPathname(window.location.pathname);

// let linkAltText = isActive ? 'zurück zur vorheri' : 'De'
const link = header.lastElementChild.appendChild(document.createElement('a'));
link.classList.add(anchorClass.routed);
link.href = ROUTES.ABOUT;

export default {
  updateLink(pathname = null) {
    if (pathname === null && link.pathname === ROUTES.ABOUT) return;

    if (!!pathname) {
      link.pathname = pathname;
      setSymbolPath(icon, id.back);
      return;
    }

    link.pathname = ROUTES.ABOUT;
    setSymbolPath(icon, id.about);
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
