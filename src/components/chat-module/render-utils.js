// import { isMobileDevice } from '../../renderer/utils.js';

import templates from '../../templates/templates.js';
import router from '../../router/router.js';

import {
  MESSAGE_TAG,
  MESSAGE_ATTR,
  CONTACT_TAG,
  CONTACT_ATTR,
  LINK_TAG,
  LINK_ATTR,
  TARGET_VAL,
} from '../components.js';

export const createModuleFragment = (parsedElements, properties) => {
  const output = new DocumentFragment();
  console.log(
    `rendering a ${properties.wasCached ? 'cached' : 'new'} ${
      properties.moduleKey
    } ChatModule`
  );

  for (const parsedElement of parsedElements) {
    // message-pending indicator
    // if (
    //   ![MESSAGE_TAG, CONTACT_TAG, LINK_TAG].includes(parsedElement.localName)
    // ) {
    //   continue;
    // }

    const element = constructElement(parsedElement, properties);
    output.appendChild(element);
  }

  adjustChatLinksToRoute(output, properties);

  return output;
};

function constructElement(template, properties) {
  // @todo clean before caching
  // needless attributes
  const obsoletAttributes = [
    MESSAGE_ATTR.PENDING,
    CONTACT_ATTR.LOADING,
    LINK_ATTR.REJECTED,
    LINK_ATTR.SELECTED,
  ];
  // needless classes
  const obsoleteClasses = ['is-transparent'];

  // @reminder
  // call constructor to make setters, getters and methods available
  // although constructor resets properties
  // const test = template.cloneNode(true);
  // console.log(test.target, test.getAttribute(LINK_ATTR.TARGET_KEY));
  const element = document.createElement(template.localName);

  // skip needless classes
  for (const item of obsoleteClasses) {
    element.classList.remove(item);
  }

  // skip needless attributes
  for (const { name, value } of template.attributes) {
    if (obsoletAttributes.includes(name)) continue;
    element.setAttribute(name, value);
  }

  // always copy contents
  element.innerHTML = template.innerHTML;

  // call methods 'render()' and 'update()' if necessary
  if (element.localName === MESSAGE_TAG) {
    // call render if ChatMessage has dynamic content
    // ChatMessage depends on key to inject dynamic contents
    element.attributes.length > 0 && element.render(properties);
    return element;
  }

  if (element.localName === CONTACT_TAG) {
    !properties.moduleWasCached && element.render();
    return element;
  }

  // ChatLink depends on href
  if (!properties.moduleWasCached) {
    element.render();
  }

  console.log(element);
  element.update(properties.moduleHref);
  return element;
}

function adjustChatLinksToRoute(output, properties) {
  const links = [...output.querySelectorAll(LINK_TAG)];
  const hasLinks = links.length > 0;
  const hasContacts = output.querySelectorAll(CONTACT_TAG).length > 0;
  const [
    [hasChatLinkHome, chatLinkHome],
    [hasChatLinkBack, chatLinkBack],
    [hasChatLinkShare, chatLinkShare],
  ] = [TARGET_VAL.HOME, TARGET_VAL.BACK, TARGET_VAL.SHARE].map((value) => {
    const link = links.find((link) => link.target === value);
    return [!!link, link];
  });

  const { prevKey, moduleKey, moduleHref } = properties;

  // always insert ChatLink back
  // and doublecheck position
  if (router.isChatRoute && !!prevKey && !hasChatLinkBack) {
    const element = constructChatLink(TARGET_VAL.BACK, moduleHref);

    if (!hasLinks) {
      output.appendChild(element);
    } else {
      const position = hasChatLinkHome ? 'after' : 'before';
      links[0][position](element);
    }
  }

  // insert ChatLink share when
  // first view was /shared
  // bc cached module does not have share link
  if (router.isChatRoute && hasContacts && !hasChatLinkShare) {
    const element = constructChatLink(TARGET_VAL.SHARE, moduleHref);
    output.appendChild(element);
  }

  // insert ChatLink Back
  // if routed from /chat
  // and it's not the first view
  if (router.isSharedRoute && !!router.prev && !hasChatLinkBack) {
    const element = constructChatLink(TARGET_VAL.BACK, moduleHref);
    output.appendChild(element);
  }

  // remove ChatLink Share
  // if it's the first view
  if (router.isSharedRoute && !router.prev && hasChatLinkShare) {
    chatLinkShare.remove();
  }

  // @todo isContactRoute

  // @consider isAboutRoute
}

function constructChatLink(value, href) {
  const element = document.createElement(LINK_TAG);
  element.setAttribute(LINK_ATTR.TARGET_KEY, value);
  element.render();
  element.update(href);
  return element;
}
