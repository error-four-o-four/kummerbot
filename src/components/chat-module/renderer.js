import router, { isFetched, getData } from '../../router/router.js';
import templates from '../../templates/templates.js';

import { ERROR_KEY } from '../../handler/error-handler.js';

import { MESSAGE_ATTR, MESSAGE_TAG, TARGET_VAL } from '../components.js';
import { setBooleanAttribute } from '../utils.js';

import {
  parseDataString,
  seperateNodes,
  constructChildren,
  renderChildren,
  updateChildren,
  createChatLink,
  getContactTmplAttribute as getContactTmplAttributes,
} from './utils.js';
import { CONTACT_VAL } from '../../handler/contact-handler.js';

export function cloneFragment(input, prevModuleKey, moduleKey) {
  const fragment = new DocumentFragment();

  constructChildren(fragment, input.children);
  updateChildren(fragment, prevModuleKey, moduleKey);

  return fragment;
}

export async function createFragment(prevModuleKey, moduleKey) {
  // handle /error route
  if (moduleKey === ERROR_KEY) return null;

  let path = router.getFileUrl(moduleKey);
  let data = await getData(path);

  if (!data) {
    return null;
  }

  const nodes = parseDataString(data);
  const [componentNodes, templateNodes] = seperateNodes(nodes);

  const fragment = new DocumentFragment();
  constructChildren(fragment, componentNodes);

  // cache attached template elements
  if (!isFetched(path)) {
    for (const node of templateNodes) {
      templates.set(node.id, node);
    }
  }

  const route = router.state;

  if (route.isContactRoute && route.keys[1] !== CONTACT_VAL[0]) {
    const contactAttributes = getContactTmplAttributes(route.keys[1]);
    // module isn't cached yet
    // componentNodes have initial state
    // (<chat-message template="awaiting-message"></chat-message>)
    // therefore it's necessary to remove the children
    [...fragment.querySelectorAll(MESSAGE_TAG)].forEach((message) =>
      fragment.removeChild(message)
    );

    for (let i = contactAttributes.length - 1; i >= 0; i -= 1) {
      const child = document.createElement(MESSAGE_TAG);
      child.setAttribute(MESSAGE_ATTR.TEMPLATE, contactAttributes[i]);
      fragment.prepend(child);
    }
  }

  if (!templates.hasGlobalTemplates(fragment)) {
    renderChildren(fragment, moduleKey);
    updateChildren(fragment, prevModuleKey, moduleKey);
    return fragment;
  }
  // check global templates
  path = '/views/templates.html';

  if (isFetched(path)) return;

  data = await getData(path);

  if (!data) return null;

  const globalTemplates = parseDataString(data);
  for (const element of globalTemplates) {
    templates.set(element.id, element);
  }

  renderChildren(fragment, moduleKey);
  updateChildren(fragment, prevModuleKey, moduleKey);

  return fragment;
}

export async function injectContactsData(contacts) {
  const imported = await import('../../handler/data-handler.js');
  const { error, data } = await imported.default();

  contacts.forEach((contact) => {
    contact.injectData(error, data);
  });
}

export function createErrorFragment() {
  // @todo check module cache
  // gnaaa dafuq
  const message = document.createElement(MESSAGE_TAG);
  const link = createChatLink(TARGET_VAL.HOME);

  setBooleanAttribute(message, MESSAGE_ATTR.DYNAMIC, true);
  message.innerHTML = templates.get('tmpl-' + ERROR_KEY).innerHTML;

  const fragment = new DocumentFragment();
  fragment.appendChild(message);
  fragment.appendChild(link);

  updateChildren(fragment, [null, ERROR_KEY, null]);

  return fragment;
}
