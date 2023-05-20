import { ChatMessage } from '../chat-message/component.js';

import { renderHtml, injectData, renderError } from './config.js';

export const CUSTOM_ATTR = {
  KEY: 'key',
  LOADING: 'loading',
};

export class ContactItem extends ChatMessage {
  static get observedAttributes() {
    return [CUSTOM_ATTR.LOADING];
  }
  constructor() {
    super();

    this.key = null;
    this.data = null;

    // this.key = this.getAttribute(CUSTOM_ATTR.KEY);
    // this.innerHTML = renderHtml(this.key);
  }

  set loading(value) {
    this.toggleAttribute(CUSTOM_ATTR.LOADING, !!value);
  }
  get loading() {
    return this.hasAttribute(CUSTOM_ATTR.LOADING);
  }

  render() {
    this.key = this.getAttribute(CUSTOM_ATTR.KEY);
    this.innerHTML = renderHtml(this.key);
  }

  update(error, contacts) {
    if (error) {
      // @todo
      renderError.call(this, error);
      return;
    }

    const data = contacts.filter((item) => item.key === this.key)[0];

    if (!data) {
      renderError.call(this, 'Keine Daten vorhanden');
      this.data = 'error';
      return;
    }

    this.data = data;
    injectData.call(this);

    // const data = contacts.filter((item) => item.key === this.key)[0];
  }
}
