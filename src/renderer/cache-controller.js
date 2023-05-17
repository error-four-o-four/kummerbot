import { KEYS } from '../router/config.js';

import {
  injectChatLinksContents,
  injectChatMessagesContents,
} from './renderer-utils.js';

class Controller {
  constructor() {
    this.container = document.getElementById('templates-container');
    this.cachedIds = [];
  }

  createTemplateId([prevKey, key]) {
    return key === KEYS.SHARE
      ? [key, prevKey, 'tmpl'].join('-')
      : [key, 'tmpl'].join('-');
  }

  // createTemplateId([prevKey, key]) {
  //   return key === KEYS.SHARE ? `${key}-${prevKey}` : key;
  // }

  isCached(templateId) {
    return this.cachedIds.includes(templateId);
  }

  cache(templateId, module) {
    const template = document.createElement('template');
    template.id = templateId;
    template.content.appendChild(module.cloneNode(true));

    this.cachedIds.push(templateId);
    this.container.appendChild(template);
  }

  cloneMessages(templateId) {
    console.log('clone messages');
    // const wrapper = this.container.children[templateId];
    // const messagesId = this.cachedIds[templateId].messages;
    // return [...wrapper.children[messagesId].content.children].map((child) =>
    //   child.cloneNode(true)
    // );
  }

  // cloneLinks(wrapperId) {
  //   const wrapper = this.container.children[wrapperId];
  //   const linksId = this.cachedIds[wrapperId].links;
  //   return [...wrapper.children[linksId].content.children].map((child) =>
  //     child.cloneNode(true)
  //   );
  // }
}

export default new Controller();
