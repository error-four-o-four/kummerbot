import { AboutLink } from './component.js';

const CUSTOM_TAG = 'about-link';

if (!window.customElements.get(CUSTOM_TAG)) {
  window.customElements.define(CUSTOM_TAG, AboutLink);
}
