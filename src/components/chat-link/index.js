import { CUSTOM_TAG, CUSTOM_ATTR } from './config.js';
import { ChatLink } from './component.js';

if (!window.customElements.get(CUSTOM_TAG)) {
  window.customElements.define(CUSTOM_TAG, ChatLink);
}

export { CUSTOM_ATTR as LINK_ATTR, CUSTOM_TAG as LINK_TAG };
