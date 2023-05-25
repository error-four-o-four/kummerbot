import {
  CONTACT_ATTR,
  CONTACT_TAG,
  LINK_ATTR,
  LINK_TAG,
  MESSAGE_ATTR,
  MESSAGE_TAG,
} from '../components/components.js';

export const cleanAttributes = (clone) => {
  const obsoleteClasses = ['is-transparent'];
  const obsoleteAttributes = [
    MESSAGE_ATTR.PENDING,
    CONTACT_ATTR.LOADING,
    LINK_ATTR.REJECTED,
    LINK_ATTR.SELECTED,
  ];

  for (let i = clone.content.children.length - 1; i >= 0; i -= 1) {
    const element = clone.content.children[i];

    // skip needless elements
    if (![MESSAGE_TAG, CONTACT_TAG, LINK_TAG].includes(element.localName)) {
      element.remove();
      continue;
    }
    // skip needless attributes
    for (const item of obsoleteClasses) {
      element.classList.remove(item);
    }
    // skip needless classes
    for (const name of obsoleteAttributes) {
      element.removeAttribute(name);
    }
  }

  return clone;
};

const wrap = document.getElementById('templates-container');

// dynamic contents
const cachedModuleIds = [];
const cachedMessageIds = [];

export default {
  hash(key) {
    // matches template ids
    // tmpl-module-share
    // tmpl-module-message => send message
    return `module-tmpl-${key}`;
  },
  isCachedMessage(id) {
    return cachedMessageIds.includes(id);
  },
  isCachedModule(id) {
    return cachedModuleIds.includes(id);
  },
  get(id) {
    // @todo meh
    return wrap.children[id].innerHTML;
  },
  set(element, id = null, clean = false) {
    // store all children of a ChatModule
    // in a template element
    // and append it to the wrapper
    // if an id was passed as an argument
    if (!!id) {
      const template = document.createElement('template');
      template.id = id;
      template.innerHTML = element.innerHTML;

      clean && cleanAttributes(template);

      wrap.appendChild(template);
      cachedModuleIds.push(id);
      return;
    }

    // the element is a template of a ChatMessage component
    // templates are attached to the fetched .html files
    // and stored when the file is fetched
    // but before the ChatModule is rendered
    wrap.appendChild(element);
    cachedMessageIds.push(element.id);
  },
};
