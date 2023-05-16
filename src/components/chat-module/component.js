import router from '../../router/router.js';
import { LINK_TAG } from '../chat-link/index.js';

const CUSTOM_ATTR = 'selected';

export class ChatModule extends HTMLElement {
  static get observedAttributes() {
    return [CUSTOM_ATTR];
  }
  constructor() {
    super();

    this.key = null;
    this.next = null;
  }

  get messages() {
    // @todo templates/utils.js#injectChatMessagesContents()
    return [...this.querySelectorAll('.chat-message')];
  }

  get links() {
    return [...this.querySelectorAll(LINK_TAG)];
  }

  setKeyToNextModule(next) {
    if (this.next === next) return;

    this.next = next;

    if (this.next) {
      this.setAttribute(CUSTOM_ATTR, this.next);
    } else {
      this.removeAttribute(CUSTOM_ATTR);
    }
  }

  setHrefOfLinks() {
    const href = router.getHref(this.key);
    for (const link of this.links) {
      link.setHref(href);
    }
  }

  attributeChangedCallback(name, prev, next) {
    // unnecessary
    if (name !== CUSTOM_ATTR) return;

    if (next === null) {
      for (const link of this.links) {
        link.rejected = false;
        link.selected = false;
      }
      console.log('reset links');
      return;
    }

    for (const link of this.links) {
      if (link.key === next) {
        link.rejected = false;
        link.selected = true;
        continue;
      }

      link.rejected = true;
      link.selected = false;
    }
  }
}
