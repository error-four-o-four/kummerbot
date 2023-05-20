import { KEYS } from '../../router/config.js';
import { MESSAGE_TAG } from '../chat-message/index.js';
import { CONTACT_TAG } from '../contact-item/index.js';
import { LINK_TAG, LINK_ATTR } from '../chat-link/index.js';

export const renderData = (data, href, prev) => {
  const fragment = new DocumentFragment();

  const template = document.createElement('template');
  template.innerHTML = data;

  for (const child of template.content.children) {
    // @reminder
    // cloning an element does not call the constructor
    const element = document.createElement(child.localName);
    element.innerHTML = child.innerHTML;

    for (const { name, value } of child.attributes) {
      element.setAttribute(name, value);
    }

    fragment.appendChild(element);

    if (element.localName === MESSAGE_TAG) {
      element.render();
      continue;
    }

    if (element.localName === CONTACT_TAG) {
      element.render();
      continue;
    }

    if (element.localName === LINK_TAG) {
      element.render();
      element.set(href);
    }
  }

  if (!!prev) {
    const popstateLink = document.createElement(LINK_TAG);
    popstateLink.setAttribute(LINK_ATTR.TARGET_KEY, KEYS.BACK);

    popstateLink.render();
    popstateLink.set(href);

    for (let i = fragment.children.length - 1; i >= 0; i -= 1) {
      const element = fragment.children[i];
      const sibling = fragment.children[i - 1];

      if (element.localName === LINK_TAG && sibling.localName === LINK_TAG) {
        continue;
      }

      // if (
      //   element.localName === LINK_TAG &&
      //   (sibling.localName === MESSAGE_TAG || sibling.localName === CONTACT_TAG)
      // ) {
      // }

      const position =
        element.getAttribute(LINK_ATTR.TARGET_KEY) === KEYS.ROOT
          ? 'after'
          : 'before';

      element[position](popstateLink);
      break;
    }
  }

  return fragment;
};

export function createErrorChatMessage() {}
