import { ContactItem } from './component.js';

const CUSTOM_TAG = 'contact-item';

if (!window.customElements.get(CUSTOM_TAG)) {
  window.customElements.define(CUSTOM_TAG, ContactItem);
}

export { CUSTOM_TAG as CONTACT_TAG };
