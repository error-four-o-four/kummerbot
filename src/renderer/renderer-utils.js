import { KEYS } from '../router/config.js';
import { LINK_TAG, LINK_ATTR } from '../components/chat-link/index.js';
import { MESSAGE_TAG } from '../components/chat-message/index.js';

import templates, { TMPL_ATTR } from './templates.js';
import router from '../router/router.js';

export function injectChatMessagesContents(module) {
  // @todo test module.messages
  // shouldn't work bc isConnected === false

  for (const messageElement of module.querySelectorAll(MESSAGE_TAG)) {
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

export function injectChatLinksContents(module, prevKey) {
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
  const firstLinkElement = module.querySelector(LINK_TAG);
  const backLinkElement = document.createElement(LINK_TAG);

  if (firstLinkElement.getAttribute(LINK_ATTR.TARGET_KEY) === KEYS.ROOT) {
    firstLinkElement.after(backLinkElement);
  } else {
    firstLinkElement.before(backLinkElement);
  }
}
