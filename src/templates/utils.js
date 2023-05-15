// import { getContact } from '../data/index.js';
import templates from './templates.js';
import { ATTR } from './config.js';
import { getHrefToViewPage } from '../router/utils.js';

export function createTemplateElement(html = null) {
  const elt = document.createElement('template');

  if (html) elt.innerHTML = html;

  return elt;
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
