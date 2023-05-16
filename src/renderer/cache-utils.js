import { KEYS } from '../router/config.js';
import { LINK_TAG, LINK_ATTR } from '../components/chat-link/index.js';

import templates, { TMPL_ATTR } from './templates.js';
import router from '../router/router.js';

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
    if (messageElement.hasAttribute(TMPL_ATTR.INFO)) {
      messageElement.innerHTML = templates[TMPL_ATTR.INFO];
      return;
    }

    if (messageElement.hasAttribute(TMPL_ATTR.SHARE)) {
      const href = router.getHrefToViewPage();
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
    if (messageElement.hasAttribute(TMPL_ATTR.LIST)) {
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
  // @consider
  // for (const linkElement of template.content.children) {
  //   const nextKey = linkElement.getAttribute(LINK_ATTR.TARGET_KEY);

  //   if (nextKey in templates.text) {
  //     linkElement.setAttribute(LINK_ATTR.TEXT, templates.text[nextKey]);
  //   }
  // }

  if (!prevKey) return;

  // insert back anchor if necessary
  // after the anchor /home
  // before other options

  const position =
    template.content.children[0].getAttribute(LINK_ATTR.TARGET_KEY) ===
    KEYS.ROOT
      ? 1
      : 0;

  // creates a back button by default
  const link = document.createElement(LINK_TAG);
  template.content.insertBefore(link, template.content.children[position]);
}
