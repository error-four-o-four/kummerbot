import templates, { MESSAGE_TMPL_KEY } from '../../renderer/templates.js';

// used to handle animation and render templates
export const CUSTOM_ATTR = {
  PENDING: 'pending',
};

export class ChatMessage extends HTMLElement {
  static get observedAttributes() {
    return [CUSTOM_ATTR.PENDING];
  }

  constructor() {
    super();
  }

  render() {
    const id = Object.values(MESSAGE_TMPL_KEY).reduce(
      (result, current) =>
        !!result ? result : this.hasAttribute(current) ? current : undefined,
      undefined
    );

    if (!id) return;

    this.innerHTML = templates.html[id];

    // this.innerHTML = Object.values(TMPL_KEY).reduce(
    //   (html, key) =>
    //     html ? html : this.hasAttribute(key) ? templates.html[key] : undefined,
    //   undefined
    // );

    // for (const { name } of this.attributes) {
    //   if (!(name in templates.html)) continue;

    //   this.innerHTML = templates.html[name];
    //   break;
    // }
  }

  set pending(value) {
    this.toggleAttribute(CUSTOM_ATTR.PENDING, !!value);
  }
  get pending() {
    this.getAttribute(CUSTOM_ATTR.PENDING);
  }

  attributeChangedCallback(name, prev, next) {
    // ContactItem component extends ChatMessage
    // which doesn't use this loading indicator
    if (name !== CUSTOM_ATTR.PENDING) return;

    if (prev === null && typeof next === 'string') {
      const indicator = document.createElement('span');
      indicator.id = 'message-pending-indicator';
      indicator.innerHTML = `<svg><use xlink:href="#message-pending"></use></svg>`;
      this.before(indicator);
      return;
    }

    // guard case necessary ?
    this.previousElementSibling.remove();
  }
}
