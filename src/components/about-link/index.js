import { CUSTOM_TAG } from './config.js';
import { AboutLink } from './component.js';

if (!window.customElements.get(CUSTOM_TAG)) {
  window.customElements.define(CUSTOM_TAG, AboutLink, { extends: 'a' });
}
