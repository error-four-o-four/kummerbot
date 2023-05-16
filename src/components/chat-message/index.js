import { ChatMessage } from './component.js';

const CUSTOM_TAG = 'chat-message';

if (!window.customElements.get(CUSTOM_TAG)) {
  window.customElements.define(CUSTOM_TAG, ChatMessage);
}

export { CUSTOM_TAG as MESSAGE_TAG };
