import router from '../../router/router.js';

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
    const isAboutRoute = window.location.pathname.startsWith(
      router.routes.about
    );

    this.child = document.createElement('a');
    this.child.href = router.routes.about;
    this.child.innerHTML = htmlInactive;

    this.appendChild(this.child);

    if (isAboutRoute) {
      this.active = true;
    }
  }

  attributeChangedCallback(_, prev, next) {
    if (prev === null && typeof next === 'string') {
      this.child.href = router.prev ? router.prev : router.routes.home;
      this.child.innerHTML = htmlActive;
      return;
    }

    this.child.href = router.routes.about;
    this.child.innerHTML = htmlInactive;
  }
}
