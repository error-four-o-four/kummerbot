import router from '../../router/router.js';
import renderer from '../../renderer/renderer.js';
import templates from '../../controller/templates.js';

import { ERROR_KEY } from '../../controller/error-controller.js';
import { CONTACT_VAL } from '../../controller/form/config.js';
import { MESSAGE_ATTR, MESSAGE_TAG, TARGET_VAL } from '../components.js';
import { setBooleanAttribute } from '../utils.js';

import {
  isFetched,
  getData,
  getFilePath,
} from '../../controller/data-controller.js';

import {
  parseDataString,
  seperateNodes,
  constructChildren,
  renderChildren,
  updateChildren,
  createChatLink,
  getContactTmplAttributes,
} from './utils.js';

export function cloneFragment(input, prevModuleKey, moduleKey, moduleHref) {
  const fragment = new DocumentFragment();

  constructChildren(fragment, input.children);
  updateChildren(fragment, prevModuleKey, moduleKey, moduleHref);

  return fragment;
}

export async function createFragment(prevModuleKey, moduleKey, moduleHref) {
  // handle /error route
  if (moduleKey === ERROR_KEY) return null;

  let path = getFilePath(moduleKey);
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

  if (router.isContactRoute && renderer.keys[1] !== CONTACT_VAL[0]) {
    const contactAttributes = getContactTmplAttributes(renderer.keys[1]);
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
    updateChildren(fragment, prevModuleKey, moduleKey, moduleHref);
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
  updateChildren(fragment, prevModuleKey, moduleKey, moduleHref);

  return fragment;
}

export function createErrorFragment(moduleHref) {
  // message template is cached by iife
  // in chat-message/utils.js
  const message = document.createElement(MESSAGE_TAG);
  const link = createChatLink(TARGET_VAL.HOME);

  setBooleanAttribute(message, MESSAGE_ATTR.DYNAMIC, true);
  message.innerHTML = templates.get('tmpl-' + ERROR_KEY).innerHTML;

  const fragment = new DocumentFragment();
  fragment.appendChild(message);
  fragment.appendChild(link);

  updateChildren(fragment, [null, ERROR_KEY, null], moduleHref);

  return fragment;
}
