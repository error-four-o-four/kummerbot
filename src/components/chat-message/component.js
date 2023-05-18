import templates, { TMPL_ATTR } from '../../renderer/templates.js';
import router from '../../router/router.js';

// used to handle animation
const CUSTOM_ATTR = 'pending';

export class ChatMessage extends HTMLElement {
  static get observedAttributes() {
    return [CUSTOM_ATTR];
  }
  // inject templates
  // hanlde animation
  constructor() {
    super();

    // for (const attribute of Object.values(TMPL_ATTR).filter(
    //   // @todo rename TMPL_ATTR
    //   (attr) => attr !== TMPL_ATTR.LIST
    // )) {
    for (const attribute of [TMPL_ATTR.INFO]) {
      if (!this.hasAttribute(attribute)) continue;

      this.innerHTML = templates[attribute];
      break;
    }
  }

  connectedCallback() {
    if (this.hasAttribute(TMPL_ATTR.SHARE)) {
      const href = router.getHrefToViewPage();
      const anchor = this.querySelector('a');

      anchor.href = href;
      anchor.innerHTML = `${href}<svg><use href="#icon-share"></use></svg>`;
      anchor.classList.add('has-icon');
    }
  }

  set pending(value) {
    this.toggleAttribute(CUSTOM_ATTR, !!value);
  }
  get pending() {
    this.getAttribute(CUSTOM_ATTR);
  }

  attributeChangedCallback(_, prev, next) {
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
}
