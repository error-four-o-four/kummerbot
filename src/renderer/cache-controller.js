import { KEYS } from '../router/config.js';

class Controller {
  constructor() {
    this.container = document.getElementById('templates-container');
    this.cachedIds = [];
  }

  getTemplateId([prevKey, key]) {
    return key === KEYS.SHARE
      ? [key, prevKey, 'tmpl'].join('-')
      : [key, 'tmpl'].join('-');
  }

  isCached(templateId) {
    return this.cachedIds.includes(templateId);
  }

  get(templateId) {
    // console.log('cloning cached', templateId);
    const cachedTemplate = this.container.children[templateId];
    return cachedTemplate.content.firstElementChild.cloneNode(true);
  }

  set(templateId, module) {
    // const wrapper = document.createElement('div');
    // wrapper.id = moduleWrapperId;
    // wrapper.appendChild(module.cloneNode(true));

    const template = document.createElement('template');
    template.id = templateId;
    template.content.appendChild(module.cloneNode(true));

    this.cachedIds.push(templateId);
    // this.container.appendChild(wrapper);
    this.container.appendChild(template);
  }

  // cloneMessages(templateId) {
  //   console.log('clone messages');
  //   const wrapper = this.container.children[templateId];
  //   const messagesId = this.cachedIds[templateId].messages;
  //   return [...wrapper.children[messagesId].content.children].map((child) =>
  //     child.cloneNode(true)
  //   );
  // }
}

export default new Controller();
