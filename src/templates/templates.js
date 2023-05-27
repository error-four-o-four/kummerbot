import {
  CONTACT_ATTR,
  CONTACT_TAG,
  LINK_ATTR,
  LINK_TAG,
  MESSAGE_ATTR,
  MESSAGE_TAG,
  MODULE_TAG,
} from '../components/components.js';

const cachedIds = [];

export default {
  getId(element) {
    // prefix chat-module
    // template has id
    return element.localName === MODULE_TAG
      ? ['module', element.key].join('-')
      : element.id;
  },
  isCached(id) {
    return cachedIds.includes(id);
  },
  get(id) {
    return document.head.children[id];
  },
  set(id, element, tidy = false) {
    // the element is a template of a ChatMessage component
    // templates are attached to the fetched .html files
    // and stored when the file is fetched
    // but before the ChatModule is rendered
    const template =
      element.localName === 'template'
        ? element
        : document.createElement('template');
    template.id = id;

    // store all children of a ChatModule
    // in a template element
    // and append it to the head
    // const template = document.createElement('template');
    if (element.localName !== 'template') {
      for (const child of element.children) {
        // skip obsolete elements like a pending-indicator
        if (![MESSAGE_TAG, CONTACT_TAG, LINK_TAG].includes(child.localName)) {
          continue;
        }
        // clone child in order to call the constructor
        const clone = child.cloneNode(true);
        tidy && tidyAttributes(clone);
        template.content.appendChild(clone);
      }
    }
    cachedIds.push(id);
    document.head.appendChild(template);
  },
};

const obsoleteAttributes = [
  MESSAGE_ATTR.PENDING,
  CONTACT_ATTR.LOADING,
  LINK_ATTR.REJECTED,
  LINK_ATTR.SELECTED,
];

function tidyAttributes(clone) {
  clone.classList.remove('is-transparent');

  for (const name of obsoleteAttributes) {
    clone.removeAttribute(name);
  }
}
