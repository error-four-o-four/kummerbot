import { ROUTES } from '../../router/config.js';
import { setAttribute } from '../utils.js';
import { anchorClass } from '../chat-link/utils.js';

const htmlInactive = 'Details';
const htmlActive = 'zur&uuml;ck';

const CUSTOM_ATTR = 'route';

export class AboutLink extends HTMLElement {
  static get observedAttributes() {
    return [CUSTOM_ATTR];
  }
  constructor() {
    super();

    this.child = null;
  }

  get href() {
    return this.child.href;
  }

  set active(value) {
    setAttribute(this, CUSTOM_ATTR, value);
  }
  get active() {
    return this.hasAttribute(CUSTOM_ATTR);
  }

  connectedCallback() {
    this.child = document.createElement('a');
    this.child.href = ROUTES.ABOUT;
    this.child.innerHTML = htmlInactive;
    this.classList.add(anchorClass.routed);

    this.appendChild(this.child);
    this.active = window.location.pathname.startsWith(ROUTES.ABOUT)
      ? ROUTES.HOME
      : false;
  }

  attributeChangedCallback(_, prev, next) {
    if (!!next) {
      this.child.href = next;
      this.child.innerHTML = htmlActive;
      return;
    }

    this.child.href = ROUTES.ABOUT;
    this.child.innerHTML = htmlInactive;
  }
}
