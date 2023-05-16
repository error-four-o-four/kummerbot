// import { getContact } from '../data/index.js';
import elements from '../elements.js';
import { LINK_ATTR, LINK_TAG } from '../components/chat-link/index.js';
import templates, { TMPL_ATTR } from './contents.js';
import { ATTR } from './config.js';
import { getHrefToViewPage } from '../router/utils.js';
import { KEYS } from '../router/config.js';

export function createTemplateElement(html = null) {
  const elt = document.createElement('template');

  if (html) elt.innerHTML = html;

  return elt;
}

export function createTemplateContainerChild(html = null) {
  const elt = document.createElement('div');

  if (html) elt.innerHTML = html;

  return elt;
}

export const createTemplateId = (type, prevKey, key) =>
  key === KEYS.SHARE
    ? [key, prevKey, type, 'tmpl'].join('-')
    : [key, type, 'tmpl'].join('-');


export function injectChatMessagesContents(template) {
  for (const messageElement of template.content.children) {
    messageElement.classList.add('chat-message');

    if (messageElement.hasAttribute(TMPL_ATTR.INFO)) {
      messageElement.innerHTML = templates[TMPL_ATTR.INFO];
      return;
    }

    if (messageElement.hasAttribute(TMPL_ATTR.SHARE)) {
      const href = getHrefToViewPage();
      // @todo error handling
      // @todo listener and router should be responsible
      // and pass error messages to the renderer
      // try {
      //   await navigator.clipboard.writeText(href);

      // } catch (err) {
      //   console.error('Failed to copy: ', err);
      // }

      const content = templates.getShareLinkTemplate(href);
      messageElement.append(content);
      return;
    }

    // @todo special case: all contacts (!)
    // update and convert contact links if possible
    if (messageElement.hasAttribute(ATTR.LIST)) {
      // for (const child of element.children) {
      //   // refactor get single contact
      //   const key = child.innerHTML;
      //   const contact = await getContact(key);
      //   console.log(contact);
      // }
      // const contacts = await getContacts(keys);
      // console.log(contacts);
      // const keys = [...element.children].map((child) => child.innerText);
      // element.innerHTML = '<p>Lädt ...</p>';
      // const contacts = await getContacts(keys);
      // console.log(contacts);
    }
  }
}

export function injectChatLinksContents(template, prevKey, key) {
  for (const linkElement of template.content.children) {
    const nextKey = linkElement.getAttribute(LINK_ATTR.TARGET_KEY);

    linkElement.classList.add('chat-link');

    if (nextKey in templates.text) {
      linkElement.setAttribute(LINK_ATTR.TEXT, templates.text[nextKey]);
    }
  }

  if (!prevKey) return;

  // insert back anchor if necessary
  // after the anchor /home
  // before other options

  const position =
    template.content.children[0].getAttribute(LINK_ATTR.TARGET_KEY) ===
    KEYS.ROOT
      ? 1
      : 0;

  const link = document.createElement(LINK_TAG);
  link.setAttribute(LINK_ATTR.TARGET_KEY, KEYS.BACK);
  link.setAttribute(LINK_ATTR.TEXT, templates.text[KEYS.BACK]);

  template.content.insertBefore(link, template.content.children[position]);
}

export async function renderChatTemplates(element) {
  // insert templates if necessary
  // for (const attr of [ATTR.INFO]) {
  //   if (contentRow.hasAttribute(attr)) {
  //     contentRow.innerHTML = templates[attr];
  //   }
  // }

  if (element.hasAttribute(ATTR.INFO)) {
    element.innerHTML = templates[ATTR.INFO];
    return;
  }

  if (element.hasAttribute(ATTR.SHARE)) {
    const href = getHrefToViewPage();
    // @todo error handling
    // @todo listener and router should be responsible
    // and pass error messages to the renderer
    // try {
    //   await navigator.clipboard.writeText(href);

    // } catch (err) {
    //   console.error('Failed to copy: ', err);
    // }

    const content = templates.getShareLinkTemplate(href);
    element.append(content);
  }

  // @todo special case: all contacts (!)
  // update and convert contact links if possible
  if (element.hasAttribute(ATTR.LIST)) {
    // for (const child of element.children) {
    //   // refactor get single contact
    //   const key = child.innerHTML;
    //   const contact = await getContact(key);
    //   console.log(contact);
    // }
    // const contacts = await getContacts(keys);
    // console.log(contacts);
    // const keys = [...element.children].map((child) => child.innerText);
    // element.innerHTML = '<p>Lädt ...</p>';
    // const contacts = await getContacts(keys);
    // console.log(contacts);
  }
}
