import templates, { TMPL_ATTR } from '../../renderer/templates.js';
import router from '../../router/router.js';

// used to handle animation
const CUSTOM_ATTR = 'pending';

export class ChatMessage extends HTMLElement {
  static get observedAttributes() {
    return [CUSTOM_ATTR];
  }

  constructor() {
    super();
  }

  set pending(value) {
    this.toggleAttribute(CUSTOM_ATTR, !!value);
  }
  get pending() {
    this.getAttribute(CUSTOM_ATTR);
  }

  attributeChangedCallback(name, prev, next) {
    // ContactItem component extends ChatMessage
    // which doesn't use this loading indicator
    if (name !== CUSTOM_ATTR) return;

    if (prev === null && typeof next === 'string') {
      const indicator = document.createElement('span');
      indicator.id = 'message-pending-indicator';
      indicator.innerHTML = `<svg><use xlink:href="#message-pending"></use></svg>`;
      this.before(indicator);
      return;
    }

    // guard case necessary ?
    this.previousElementSibling.remove();
  }

  render() {
    if (this.hasAttribute(TMPL_ATTR.INFO)) {
      this.innerHTML = templates[TMPL_ATTR.INFO];
      return;
    }

    if (this.hasAttribute(TMPL_ATTR.SHARE)) {
      const href = router.getHrefToViewPage();
      const anchor = this.querySelector('a');

      anchor.href = href;
      anchor.innerHTML = href;
      anchor.innerHTML = `${href}<svg><use href="#icon-share-svg"></use></svg>`;
      anchor.classList.add('has-icon', 'icon-share');

      // @wat not working
      // const svg = document.createElement('svg');
      // svg.classList.add('inline-svg-icon')
      // svg.innerHTML = `<use href="#icon-share-svg"></use>`

      // anchor.after(svg);

      return;
    }
  }
}
