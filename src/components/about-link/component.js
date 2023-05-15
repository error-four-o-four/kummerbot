import router from '../../router/router.js';

import { TEXT } from './config.js';

export class AboutLink extends HTMLAnchorElement {
  constructor() {
    super();

    this.active = false;
    this.prevPathname = router.routes.root;
  }

  get href() {
    return this.active
      ? router.root + this.prevPathname
      : router.root + router.routes.about;
  }

  get displayedText() {
    return this.active ? TEXT.BACK : TEXT.ABOUT;
  }

  connectedCallback() {
    const isAboutRoute = window.location.pathname.startsWith(
      router.routes.about
    );

    if (isAboutRoute) {
      this.active = true;
    }

    const anchor = document.createElement('a');
    anchor.href = this.href;
    anchor.innerHTML = this.displayedText;

    this.appendChild(anchor);
  }

  update(prevPathname) {
    if (this.active && router.isAboutRoute) return;

    if (!this.active && !router.isAboutRoute) return;

    this.active = !this.active;
    this.prevPathname = prevPathname;

    const anchor = this.querySelector('a');
    anchor.href = this.href;
    anchor.innerHTML = this.displayedText;
  }
}
