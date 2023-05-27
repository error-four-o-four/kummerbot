import router, { fetchData } from '../../router/router.js';
import templates from '../../templates/templates.js';

import {
  CONTACT_TAG,
  LINK_ATTR,
  LINK_TAG,
  MESSAGE_ATTR,
  MESSAGE_TAG,
  TARGET_VAL,
} from '../components.js';

const parser = new DOMParser();

const parseDataString = (string) => {
  const parsed = parser.parseFromString(string, 'text/html');
  return parsed.body.children.length > 0
    ? [...parsed.body.children]
    : [...parsed.head.children];
};

export function cloneFragment(input) {
  const fragment = new DocumentFragment();

  for (const node of input.children) {
    const child = constructChildFromNode(node);
    fragment.appendChild(child);
  }

  return fragment;
}

export async function createFragment(moduleKey) {
  // fetch data
  let path = router.getFileUrl(moduleKey);
  let data = await fetchData(path);

  if (!data) {
    return null;
  }

  const fragment = new DocumentFragment();
  const nodes = parseDataString(data);

  // cache attached template elements
  for (const node of nodes) {
    if (node.localName === 'template' && !templates.isCached(node.id)) {
      templates.set(node.id, node);
      continue;
    }

    const child = constructChildFromNode(node);
    fragment.appendChild(child);
  }

  const requestGlobalTemplates = checkGlobalTemplates(fragment);

  if (requestGlobalTemplates) {
    path = '/views/templates.html';
    data = await fetchData(path);

    if (!data) return null;

    const globalTemplates = parseDataString(data);
    for (const element of globalTemplates) {
      templates.set(element.id, element);
    }
  }

  renderChildren(fragment, moduleKey);

  return fragment;
}

function constructChildFromNode(node) {
  const child = document.createElement(node.localName);
  node.hasAttributes() && copyAttributes(node, child);
  child.innerHTML = node.innerHTML;

  return child;
}

function copyAttributes(node, element) {
  for (const { name, value } of node.attributes) {
    // @todo @refactor styles 'is-hidden'
    // @consider do not add any class attributes
    if (name === 'class') continue;

    element.setAttribute(name, value);
  }
}

function checkGlobalTemplates(fragment) {
  let doRequest = false;
  let i = 0;

  const messages = fragment.querySelectorAll(MESSAGE_TAG);

  while (i < messages.length) {
    const attr = messages[i].getAttribute(MESSAGE_ATTR.TEMPLATE);

    if (attr && !templates.isCached(attr)) {
      doRequest = true;
      break;
    }

    i += 1;
  }

  return doRequest;
}

function renderChildren(fragment, moduleKey) {
  const [messages, contacts, links] = [MESSAGE_TAG, CONTACT_TAG, LINK_TAG].map(
    (tag) => [...fragment.querySelectorAll(tag)]
  );

  messages
    .filter((message) => message.requiresRender)
    .forEach((message) => message.render(moduleKey));

  contacts.forEach((contact) => contact.render());

  links.forEach((link) => link.render());
}

export function adjustLinks(module, moduleHasContacts, prevModuleKey, route) {
  const links = module.links;

  const [linkHome, linkBack, linkShare] = [
    TARGET_VAL.HOME,
    TARGET_VAL.BACK,
    TARGET_VAL.SHARE,
  ].map((value) => links.find((link) => link.target === value));

  // @todo @refactor
  const { isChatRoute, isSharedRoute, prevRoute } = route;

  // always insert ChatLink back
  // and doublecheck position
  if (isChatRoute && !!prevModuleKey && !linkBack) {
    const element = createChatLink(TARGET_VAL.BACK);

    if (!links.length) {
      module.appendChild(element);
    } else {
      const position = linkHome ? 'after' : 'before';
      links[0][position](element);
    }
  }

  // insert ChatLink share when
  // first view was /shared
  // bc cached module does not have share link
  if (isChatRoute && moduleHasContacts && !linkShare) {
    module.appendChild(createChatLink(TARGET_VAL.SHARE));
  }

  if (isChatRoute && moduleHasContacts && !!linkHome) {
    linkHome.remove();
  }

  // insert ChatLink Back
  // if routed from /chat to /shared, /about, /error, /contact
  // and it's not the first view
  if (!isChatRoute && !!prevRoute && !linkBack) {
    module.appendChild(createChatLink(TARGET_VAL.BACK));
  }

  // insert ChatLink home
  // to ChatModule with ContactItems
  if (isSharedRoute && !linkHome) {
    module.append(createChatLink(TARGET_VAL.HOME));
  }

  // remove ChatLink Share
  // if it's the first view
  if (isSharedRoute && !!linkShare) {
    linkShare.remove();
  }

  // @todo isContactRoute
}

function createChatLink(value) {
  const element = document.createElement(LINK_TAG);
  element.setAttribute(LINK_ATTR.TARGET_KEY, value);
  element.render();
  return element;
}

export async function injectContactsData(contacts) {
  const imported = await import('../../handler/data-handler.js');
  const { error, data } = await imported.default();

  contacts.forEach((contact) => {
    contact.injectData(error, data);
  });
}

export function createErrorFragment(moduleKey) {
  const element = document.createElement(MESSAGE_TAG);
  element.setAttribute(MESSAGE_ATTR.TEMPLATE, moduleKey);
  element.render(moduleKey);

  const fragment = new DocumentFragment();
  fragment.appendChild(element);

  return fragment;
}

// @todo
export function createContactFragment(moduleKey) {
  // const element = document.createElement(MESSAGE_TAG);
  // element.setAttribute(MESSAGE_ATTR.TEMPLATE, moduleKey);
  // element.render(moduleKey);

  const fragment = new DocumentFragment();
  // fragment.appendChild(element);

  return fragment;
}
