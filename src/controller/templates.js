import {
  MODULE_TAG,
  MESSAGE_TAG,
  MESSAGE_ATTR,
  LIST_TAG,
  LINK_TAG,
  LINK_ATTR,
} from '../components/components.js';

const cachedIds = [];

export default {
  getId(localName, key) {
    // prefix chat-module
    // @doublecheck
    // at the moment this function os only called by ChatModule component
    return localName === MODULE_TAG ? ['module', key].join('-') : key;
  },
  isCached(id) {
    return cachedIds.includes(id);
  },
  hasGlobalTemplates(fragment) {
    let doRequest = false;
    let i = 0;

    const messages = fragment.querySelectorAll(MESSAGE_TAG);

    while (i < messages.length) {
      const attr = messages[i].getAttribute(MESSAGE_ATTR.TEMPLATE);

      if (attr && !this.isCached(attr)) {
        doRequest = true;
        break;
      }

      i += 1;
    }

    return doRequest;
  },
  get(id) {
    return document.head.children[id];
  },
  set(id, element, tidy = false) {
    // the element is a template of a ChatMessage component
    // templates are attached to the fetched .html files
    // and stored when the file is fetched
    // but before the ChatModule is rendered
    const isChatModule = element.localName === MODULE_TAG;
    const template = isChatModule
      ? document.createElement('template')
      : element;

    // store all children of a ChatModule
    // in a template element
    // and append it to the head
    // const template = document.createElement('template');
    if (isChatModule) {
      for (const child of element.children) {
        // skip obsolete elements like a pending-indicator
        if (![MESSAGE_TAG, LIST_TAG, LINK_TAG].includes(child.localName)) {
          continue;
        }
        // clone child in order to call the constructor
        const clone = child.cloneNode(true);
        tidy && tidyAttributes(clone);
        template.content.appendChild(clone);
      }
    } else {
      id = 'tmpl-' + id;
    }

    template.id = id;
    cachedIds.push(id);
    document.head.appendChild(template);
  },
};

const obsoleteAttributes = [
  MESSAGE_ATTR.PENDING,
  LINK_ATTR.REJECTED,
  LINK_ATTR.SELECTED,
];

function tidyAttributes(clone) {
  clone.classList.remove('is-transparent');

  for (const name of obsoleteAttributes) {
    clone.removeAttribute(name);
  }
}
