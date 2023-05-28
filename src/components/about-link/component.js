import router, { ROUTES } from '../../router/router.js';

const htmlInactive = 'Details';
const htmlActive = 'zur&uuml;ck';

const CUSTOM_ATTR = 'active';

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
    this.toggleAttribute(CUSTOM_ATTR, !!value);
  }
  get active() {
    return this.hasAttribute(CUSTOM_ATTR);
  }

  connectedCallback() {
    this.child = document.createElement('a');
    this.child.href = ROUTES.ABOUT;
    this.child.innerHTML = htmlInactive;

    this.appendChild(this.child);

    if (router.state.isAboutRoute) {
      this.active = true;
    }
  }

  attributeChangedCallback(_, prev, next) {
    const { prevRoute } = router.state;
    if (prev === null && typeof next === 'string') {
      this.child.href = !!prevRoute ? prevRoute : ROUTES.HOME;
      this.child.innerHTML = htmlActive;
      return;
    }

    this.child.href = ROUTES.ABOUT;
    this.child.innerHTML = htmlInactive;
  }
}
