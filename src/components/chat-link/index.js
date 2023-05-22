import { ChatLink } from './component.js';

const CUSTOM_TAG = 'chat-link';

if (!window.customElements.get(CUSTOM_TAG)) {
  window.customElements.define(CUSTOM_TAG, ChatLink);
}

export { CUSTOM_TAG as LINK_TAG };

export { CUSTOM_ATTR as LINK_ATTR } from './component.js';
