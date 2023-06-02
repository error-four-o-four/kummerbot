import router from '../../router/router.js';
import renderer from '../../renderer/renderer.js';
import { CONTACT_VAL } from '../../controller/form-controller.js';

import {
  MESSAGE_TAG,
  LIST_TAG,
  LINK_TAG,
  LINK_ATTR,
  TARGET_VAL,
} from '../components.js';

import { setBooleanAttribute } from '../utils.js';

const parser = new DOMParser();

export function parseDataString(string) {
  const parsed = parser.parseFromString(string, 'text/html');
  return parsed.body.children.length > 0
    ? [...parsed.body.children]
    : [...parsed.head.children];
}

export function seperateNodes(nodes) {
  return nodes.reduce(
    (arrays, node) => {
      const index = node.localName === 'template' ? 1 : 0;
      arrays[index].push(node);
      return arrays;
    },
    [[], []]
  );
}

const constructChild = (node) => {
  const child = document.createElement(node.localName);

  if (!node.hasAttributes()) {
    child.innerHTML = node.innerHTML;
    return child;
  }

  for (const { name, value } of node.attributes) {
    // @todo @refactor styles 'is-hidden'
    // @consider do not add any class attributes
    if (name === 'class') continue;

    child.setAttribute(name, value);
  }
  child.innerHTML = node.innerHTML;
  return child;
};

export function constructChildren(fragment, children) {
  for (const node of children) {
    fragment.appendChild(constructChild(node));
  }
}

const getComponents = (fragment, ...tags) =>
  tags.map((tag) => [...fragment.querySelectorAll(tag)]);

export function renderChildren(fragment, moduleKey) {
  const [messages, links] = getComponents(fragment, MESSAGE_TAG, LINK_TAG);

  messages
    .filter((message) => message.requiresRender)
    .forEach((message) => message.render(moduleKey));

  links.forEach((link) => link.render());

  return fragment;
}

export function updateChildren(fragment, prevModuleKey, moduleKey) {
  const [messages] = getComponents(fragment, MESSAGE_TAG);

  const moduleHref = renderer.getPathnameUrl(moduleKey);
  // update share link
  // update preview and captcha in /contact route
  messages
    .filter((message) => message.requiresUpdate)
    .forEach((message) => message.update(moduleKey));

  const links = adjustLinks(fragment, prevModuleKey);
  links.forEach((link) => link.update(moduleHref));

  // gnaaaaaa
  // one single case: view all contacts
  // a home link is inserted
  // if /shared route is the first view
  // but it's obsolete in /chat route
  let [linkHome, linkBack] = [TARGET_VAL.HOME, TARGET_VAL.BACK].map((value) =>
    links.find((link) => link.target === value)
  );

  // remove it by comparing their href values
  // which isn't possible in adjustLinks()
  // bc href value isn't set / is set here
  if (!!linkHome && !!linkBack) {
    const linkHomeHref = linkHome.firstElementChild.href;
    const linkBackHref = linkBack.firstElementChild.href;
    linkHomeHref === linkBackHref && linkHome.remove();
  }
}

// @todo
function adjustLinks(fragment, prevModuleKey) {
  const hasContacts = !!fragment.querySelector(LIST_TAG);
  const [links] = getComponents(fragment, LINK_TAG);

  // always insert ChatLink back
  // and doublecheck position
  if (
    (router.isChatRoute && !!prevModuleKey) ||
    (!router.isChatRoute && !!router.prevRoute)
  ) {
    let [linkHome, linkBack] = [TARGET_VAL.HOME, TARGET_VAL.BACK].map((value) =>
      links.find((link) => link.target === value)
    );

    if (!linkBack) {
      linkBack = createChatLink(TARGET_VAL.BACK);
      !!linkHome
        ? linkHome.after(linkBack)
        : !!links[0]
        ? links[0].before(linkBack)
        : fragment.appendChild(linkBack);
      links.push(linkBack);
    }
  }

  if (router.isChatRoute && hasContacts) {
    const linkShare = links.find((link) => link.target === TARGET_VAL.SHARE);
    setBooleanAttribute(linkShare, LINK_ATTR.REJECTED, false);
    setBooleanAttribute(linkShare, LINK_ATTR.SELECTED, false);
  }

  if (router.isSharedRoute) {
    const linkShare = links.find((link) => link.target === TARGET_VAL.SHARE);
    setBooleanAttribute(linkShare, LINK_ATTR.REJECTED, true);

    // gnaaaaaa
    // one single case: view all contacts
    let linkHome = links.find((link) => link.target === TARGET_VAL.HOME);

    if (!router.prevRoute && !linkHome) {
      linkHome = createChatLink(TARGET_VAL.HOME);
      links[0].before(linkHome);
      links.push(linkHome);
    }
  }

  return links;
}

export function createChatLink(value) {
  const element = document.createElement(LINK_TAG);
  element.setAttribute(LINK_ATTR.TARGET_KEY, value);
  element.render();
  return element;
}

const contactTmplAttributes = [
  ['awaiting-message'],
  ['preview-recipient', 'awaiting-captcha'],
  ['awaiting-response'],
  ['response-success'],
];

export function getContactTmplAttribute(value) {
  const index = CONTACT_VAL.indexOf(value);
  return contactTmplAttributes[index];
}
