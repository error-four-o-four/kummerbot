import { ChatMessage } from '../chat-message/component.js';

import { CUSTOM_ATTR, injectData, renderHtml } from './config.js';

export class ContactItem extends ChatMessage {
  static get observedAttributes() {
    return [CUSTOM_ATTR.KEY];
  }
  constructor() {
    super();

    this.data = null;
    this.key = null;

    this.key = this.getAttribute(CUSTOM_ATTR.KEY);
    this.innerHTML = renderHtml(this.key);

    const onImport = async (module) => {
      const { error, data } = await module.default(this.key);

      this.data = !!error ? error : data;
      // @reminder
      // also injects data to components in template container
      injectData(this);

      if (this.loading) this.loading = false;
    };

    import('../../data/index.js').then(onImport);
  }

  set loading(value) {
    this.toggleAttribute(CUSTOM_ATTR.LOADING, !!value);
  }
  get loading() {
    return this.hasAttribute(CUSTOM_ATTR.LOADING);
  }

  // connectedCallback() {
  // 	if (this.data !== null) {
  // 		console.log('cloned', this.data);
  // 		return;
  // 	}
  // }

  // attributeChangedCallback(name, prev, next) {
  // 	// ContactItem component extends ChatMessage
  //   // which doesn't use this loading indicator
  //   if (name !== CUSTOM_ATTR.LOADING) return;
  // }
}
