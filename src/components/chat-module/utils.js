import router from '../../router/router.js';
import renderer from '../../renderer/renderer.js';
import formController from '../../controller/form/form-controller.js';
import { CONTACT_VAL } from '../../controller/form/config.js';

import { MESSAGE_TAG, LINK_TAG, LINK_ATTR, TARGET_VAL } from '../components.js';

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

// const getTargetLinks = (links, ...values) =>
//   links.filter((all, link) =>
//     values.reduce(
//       (bool, value) =>
//         bool ? bool : checkAttribute(link, LINK_ATTR.TARGET_KEY, value),
//       false
//     )
//   );
const getTargetLinks = (links, ...values) =>
  values.map((value) => links.find((link) => link.target === value));

export function renderChildren(fragment, moduleKey) {
  const [messages, links] = getComponents(fragment, MESSAGE_TAG, LINK_TAG);

  messages
    .filter((message) => message.requiresRender)
    .forEach((message) => message.render(moduleKey));

  links.forEach((link) => link.render());

  return fragment;
}

export function updateChildren(fragment, prevModuleKey, moduleKey, moduleHref) {
  const [messages] = getComponents(fragment, MESSAGE_TAG);

  // update share link
  // update preview and captcha in /contact route
  messages
    .filter((message) => message.requiresUpdate)
    .forEach((message) => message.update(moduleKey));

  const links = adjustLinks(fragment, prevModuleKey);
  links
    .filter((link) => !link.isBackLink)
    .forEach((link) => link.update(moduleHref));

  const [linkBack] = getTargetLinks(links, TARGET_VAL.BACK);

  if (!linkBack || (router.isChatRoute && !prevModuleKey)) return;

  if (router.isChatRoute) {
    const prevModuleHref = renderer.getPathnameUrl(prevModuleKey);
    linkBack.update(prevModuleHref);
    return;
  }

  router.prevRoute && linkBack.update(router.prevRoute);
}

function adjustLinks(fragment, prevModuleKey) {
  // const hasContacts = !!fragment.querySelector(LIST_TAG);
  const [links] = getComponents(fragment, LINK_TAG);

  if (router.isAboutRoute) return [];

  // always insert ChatLink back
  // and doublecheck position
  if ((router.isChatRoute && !!prevModuleKey) || !router.isChatRoute) {
    let [linkHome, linkBack] = getTargetLinks(
      links,
      TARGET_VAL.HOME,
      TARGET_VAL.BACK
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

  return links;
}

export function createChatLink(value) {
  const element = document.createElement(LINK_TAG);
  element.setAttribute(LINK_ATTR.TARGET_KEY, value);
  element.render();
  return element;
}

// @todo refactor ChatLink setters
// use a single state value instead of two boolean atttributes ??
// these functions could be ChatLink methods
function hideLink(link) {
  link.rejected = true;
  link.selected = false;
}
function showLink(link) {
  link.rejected = false;
  link.selected = false;
}

export function showSelectedLink(links, target) {
  for (const link of links) {
    if (link.target === target) {
      link.rejected = false;
      link.selected = true;
      continue;
    }

    hideLink(link);
  }
}

export function showAllLinks(module) {
  const links = module.links;
  const hasContacts = !!module.list;

  if (router.isChatRoute && !hasContacts) {
    for (const link of links) {
      showLink(link);
    }
    return;
  }

  let [linkHome, linkBack, linkShare] = getTargetLinks(
    links,
    TARGET_VAL.HOME,
    TARGET_VAL.BACK,
    TARGET_VAL.SHARE
  );

  if (router.isChatRoute && hasContacts) {
    // gnaaaaaa
    // one single case: view all contacts
    // a home link is inserted
    // if /shared route is the first view
    // but it's obsolete in /chat route
    // if (!linkHome && !linkBack) {
    const linkHomeHref = linkHome.firstElementChild.href;
    const linkBackHref = linkBack.firstElementChild.href;

    // hide it by comparing their href values
    // which isn't possible in adjustLinks()
    // bc href value isn't set / is set here
    if (linkHomeHref === linkBackHref) {
      hideLink(linkHome);
      showLink(linkBack);
    } else {
      showLink(linkHome);
      showLink(linkBack);
    }
    showLink(linkShare);
    // }
    return;
  }

  if (router.isSharedRoute) {
    showLink(linkHome);
    hideLink(linkShare);

    if (!linkBack) {
      console.log('@todo');
      return;
    }

    !router.prevRoute ? hideLink(linkBack) : showLink(linkBack);
    return;
  }

  // hide/show homeLink depending on formController status
  if (router.isContactRoute) {
    // show
    formController.check(CONTACT_VAL[0]) && showLink(linkHome);
    // hide
    formController.check(CONTACT_VAL[1]) && hideLink(linkHome);
  }

  if (!router.isChatRoute && !!linkBack) {
    // hide / show
    !router.prevRoute ? hideLink(linkBack) : showLink(linkBack);
  }
}

const contactTmplAttributes = [
  ['awaiting-message'],
  ['preview-recipient', 'awaiting-captcha'],
  ['awaiting-response'],
  ['response-success'],
];

export function getContactTmplAttributes(value) {
  const index = CONTACT_VAL.indexOf(value);
  return contactTmplAttributes[index];
}
