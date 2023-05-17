import { MESSAGE_TAG } from '../chat-message/index.js';
import { LINK_TAG } from '../chat-link/index.js';

const CUSTOM_ATTR = {
  KEY: 'key',
  NEXT: 'next',
};

const svgPendingHtml = `
<svg viewBox="0 0 90 90">
  <g fill="currentColor">
    <circle cx="15" cy="45" r="10" />
    <circle cx="45" cy="45" r="10" />
    <circle cx="75" cy="45" r="10" />
  </g>
</svg>`;

// @todo
function createPendingIndicator() {
  const elt = document.createElement('span');
  // elt.classList.add('is-hidden');
  elt.id = 'pending-indicator';
  elt.innerHTML = svgPendingHtml;
  return elt;
}

export class ChatModule extends HTMLElement {
  static get observedAttributes() {
    return [CUSTOM_ATTR.NEXT];
  }
  static setter(inst, attr, value) {
    !!value ? inst.setAttribute(attr, value) : inst.removeAttribute(attr);
  }

  constructor() {
    super();
  }

  set key(value) {
    ChatModule.setter(this, CUSTOM_ATTR.KEY, value);
  }
  get key() {
    return this.getAttribute(CUSTOM_ATTR.KEY);
  }

  set next(value) {
    ChatModule.setter(this, CUSTOM_ATTR.NEXT, value);
  }
  get next() {
    return this.getAttribute(CUSTOM_ATTR.NEXT);
  }

  get messages() {
    return [...this.querySelectorAll(MESSAGE_TAG)];
  }

  get links() {
    return [...this.querySelectorAll(LINK_TAG)];
  }

  connectedCallback() {
    if (!this.next) return;

    this.updateLinks(this.next);
  }

  attributeChangedCallback(name, _, next) {
    if (name !== CUSTOM_ATTR.NEXT) return;

    this.updateLinks(next);
  }

  updateLinks(next) {
    if (next === null) {
      for (const link of this.links) {
        link.rejected = false;
        link.selected = false;
      }
      return;
    }

    for (const link of this.links) {
      if (link.keyToTarget === next) {
        link.rejected = false;
        link.selected = true;
        continue;
      }

      link.rejected = true;
      link.selected = false;
    }
  }
}
