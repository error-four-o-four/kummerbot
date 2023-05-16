import { KEYS } from '../router/config.js';
import { createTemplateContainerChild } from './cache-utils.js';

import {
  createTemplateId,
  injectChatLinksContents,
  injectChatMessagesContents,
} from './cache-utils.js';

class Controller {
  constructor() {
    this.container = document.getElementById('templates-container');
    this.cachedIds = {};
  }

  createTemplateId([prevKey, key]) {
    return key === KEYS.SHARE ? `${key}-${prevKey}` : key;
  }

  isCached(wrapperId) {
    return wrapperId in this.cachedIds;
  }

  cache(wrapperId, [prevKey, key], html) {
    const templatesWrapper = createTemplateContainerChild(html);

    const chatMessagesTemplate = templatesWrapper.firstElementChild;
    chatMessagesTemplate.id = createTemplateId('message', prevKey, key);
    injectChatMessagesContents(chatMessagesTemplate);

    const chatLinksTemplate = templatesWrapper.lastElementChild;
    chatLinksTemplate.id = createTemplateId('links', prevKey, key);
    injectChatLinksContents(chatLinksTemplate, prevKey, key);

    templatesWrapper.id = wrapperId;
    this.cachedIds[templatesWrapper.id] = {
      messages: chatMessagesTemplate.id,
      links: chatLinksTemplate.id,
    };
    this.container.appendChild(templatesWrapper);
  }

  cloneMessages(wrapperId) {
    const wrapper = this.container.children[wrapperId];
    const messagesId = this.cachedIds[wrapperId].messages;
    return [...wrapper.children[messagesId].content.children].map((child) =>
      child.cloneNode(true)
    );
  }

  cloneLinks(wrapperId) {
    const wrapper = this.container.children[wrapperId];
    const linksId = this.cachedIds[wrapperId].links;
    return [...wrapper.children[linksId].content.children].map((child) =>
      child.cloneNode(true)
    );
  }
}

export default new Controller();
