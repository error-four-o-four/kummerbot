import { KEYS } from '../router/config.js';
import { createTemplateContainerChild } from './contents.js';

import {
  createTemplateId,
  injectChatLinksContents,
  injectChatMessagesContents,
} from './utils.js';

class Controller {
  constructor() {
    this.container = document.getElementById('templates-container');
    this.cachedIds = {};
  }

	createTemplateId([prevKey, key]) {
		return (key === KEYS.SHARE) ? `${key}-${prevKey}` : key;
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
    return wrapper.children[messagesId].content.cloneNode(true);
  }

  cloneLinks(wrapperId) {
		const wrapper = this.container.children[wrapperId];
		const linksId = this.cachedIds[wrapperId].links;
		return wrapper.children[linksId].content.cloneNode(true);
	}
}

export default new Controller();
