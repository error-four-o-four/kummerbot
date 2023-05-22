import router from '../../router/router.js';

import { isMobileDevice } from '../../renderer/utils.js';

import { MODULE_KEY } from '../../renderer/templates.js';
import { MESSAGE_TAG, MESSAGE_ATTR } from '../chat-message/index.js';
import { CONTACT_TAG, CONTACT_ATTR } from '../contact-item/index.js';
import { LINK_TAG, LINK_ATTR } from '../chat-link/index.js';

export const createModuleFragment = (input, wasCached, prev, key, href) => {
  const output = new DocumentFragment();

  const template = wasCached ? input : createTemplate(input);

  console.log(`rendering a ${wasCached ? 'cached' : 'new'} ChatModule`, key);

  // call constructor to make setters, getters and methods available
  // although constructor resets properties
  // @reminder
  // const test = template.content.children[template.content.children.length - 1].cloneNode(true);
  // console.log(test.target, test.getAttribute(LINK_ATTR.TARGET_KEY));
  for (const child of template.content.children) {
    const element = document.createElement(child.localName);
    copyAttributes(child, element);

    output.appendChild(element);
    // doublecheck if element is required
    // /chat vs /shared route
    // if (!appendChild(fragment, element)) continue;

    // determine if the element should be rendered
    if (!wasCached || !element.innerHTML) element.render();

    // ChatMessage component has no dynamic props
    if (element.localName === MESSAGE_TAG) continue;

    // determine if the element should be updated
    // ContactItem depends on href of ChatModule
    // only update if contacts data has been fetched
    // otherwise it's updated in
    // injectContactsData()
    if (element.localName === CONTACT_TAG && element.loaded && !element.error) {
      element.update(href);
      continue;
    }

    // ChatLink depends on href of ChatModule
    if (element.localName === LINK_TAG) {
      element.update(href);
    }
  }

  if (key === MODULE_KEY.SHARE) insertShareLink(output);

  insertChatLinks(output, prev, key, href);
  removeChatLinks(output, prev, key, href);

  return output;
};

function createTemplate(html) {
  const template = document.createElement('template');
  template.innerHTML = html;
  return template;
}

function copyAttributes(original, copied) {
  // skip unwanted attributes
  const obsoletAttributes = [
    MESSAGE_ATTR.PENDING,
    CONTACT_ATTR.LOADING,
    LINK_ATTR.REJECTED,
    LINK_ATTR.SELECTED,
  ];

  for (const { name, value } of original.attributes) {
    if (obsoletAttributes.includes(name)) continue;
    copied.setAttribute(name, value);
  }

  const obsoleteClasses = ['is-transparent'];
  for (const item of obsoleteClasses) {
    copied.classList.remove(item);
  }

  copied.innerHTML = original.innerHTML;
}

function insertChatLinks(fragment, prevKey, moduleKey, moduleHref) {
  const links = [...fragment.querySelectorAll(LINK_TAG)];
  const hasLinks = links.length > 0;
  const hasContacts = fragment.querySelectorAll(CONTACT_TAG).length > 0;
  const chatLinkHome = links.find((link) => link.target === MODULE_KEY.HOME);
  const chatLinkBack = links.find((link) => link.target === MODULE_KEY.BACK);
  const chatLinkShare = links.find((link) => link.target === MODULE_KEY.SHARE);
  const hasChatLinkHome = !!chatLinkHome || false;
  const hasChatLinkBack = !!chatLinkBack || false;
  const hasChatLinkShare = !!chatLinkShare || false;

  // insert ChatLink back
  // @todo refactor
  if (!!prevKey && !hasChatLinkBack) {
    const element = document.createElement(LINK_TAG);
    element.setAttribute(LINK_ATTR.TARGET_KEY, MODULE_KEY.BACK);
    element.render();
    element.update(moduleHref);

    if (!hasLinks) {
      fragment.appendChild(element);
    } else {
      const position = hasChatLinkHome ? 'after' : 'before';
      links[0][position](element);
    }
  }

  // insert ChatLink home in /shared route
  if (!prevKey && !hasChatLinkHome && router.isSharedRoute) {
    const element = document.createElement(LINK_TAG);
    element.setAttribute(LINK_ATTR.TARGET_KEY, MODULE_KEY.HOME);
    element.render();
    element.update(moduleHref);

    fragment.appendChild(element);
  }

  // insert ChatLink share in /chat route
  if (hasContacts && !hasChatLinkShare && router.isChatRoute) {
    const element = document.createElement(LINK_TAG);
    element.setAttribute(LINK_ATTR.TARGET_KEY, MODULE_KEY.SHARE);
    element.render();
    element.update(moduleHref);

    fragment.appendChild(element);
  }
}

function removeChatLinks(fragment, prevKey, moduleKey) {
  const links = [...fragment.querySelectorAll(LINK_TAG)];

  // const hasLinks = links.length > 0;
  // const chatLinkHome = links.find((link) => link.target === TARGET_KEY.HOME);
  const chatLinkBack = links.find((link) => link.target === MODULE_KEY.BACK);
  const chatLinkShare = links.find((link) => link.target === MODULE_KEY.SHARE);
  // const hasChatLinkHome = !!chatLinkHome || false;
  const hasChatLinkBack = !!chatLinkBack || false;
  const hasChatLinkShare = !!chatLinkShare || false;

  // possible condition: hasContactItems

  // remove ChatLink share in /shared route
  if (!prevKey && hasChatLinkShare && router.isSharedRoute) {
    chatLinkShare.remove();
  }

  // remove ChatLink back in /shared route
  if (!prevKey && hasChatLinkBack && router.isSharedRoute) {
    chatLinkBack.remove();
  }
}

function insertShareLink(output) {
  const href = router.getShareUrl();
  const paraLink = document.createElement('p');
  paraLink.innerHTML = `
  <a href="${href}">${href}</a>`;

  const paraBtns = document.createElement('p');
  paraBtns.innerHTML = `
  <button
  class="btn-copy has-icon"
  value="${href}"
  type="button"
  >URL Kopieren<svg><use href="#icon-copy-svg"></use></svg></button>`;

  // if (isMobileDevice) {
  // }

  // paraBtns.innerHTML += `
  // <button
  // class="btn-share has-icon"
  // value="${href}"
  // type="button"
  // >URL Teilen<svg><use href="#icon-share-svg"></use></svg></button>`;

  const element = output
    .querySelectorAll(MESSAGE_TAG)[1]
    .append(paraLink, paraBtns);
}
