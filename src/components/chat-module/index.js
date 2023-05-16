import { ChatModule } from './component.js';

const CUSTOM_TAG = 'chat-module';

if (!window.customElements.get(CUSTOM_TAG)) {
  window.customElements.define(CUSTOM_TAG, ChatModule);
}

export { CUSTOM_TAG as MODULE_TAG };
