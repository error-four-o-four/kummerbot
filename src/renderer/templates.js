import text from '../templates.html?raw';

// const data = await fetch('/views/templates.html');
// const text = await data.text();

const parser = new DOMParser();
const templates = [...parser.parseFromString(text, 'text/html').head.children];

const wrap = document.getElementById('templates-container');
wrap.append(...templates.slice(9));

// used as ChatLink 'target' attribute value
export const MODULE_KEY = {
  HOME: 'home', // has to be key of /chat route
  BACK: 'back',
  SHARE: 'share',
  MESSAGE: 'message',
  PROCESSED: 'processed',
};

// @todo refactor
export const HEADER_TMPL_KEY = {
  indicatorPending: templates[0].id,
  indicatorWaiting: templates[1].id,
  aboutInactive: templates[2].id,
  aboutActive: templates[3].id,
};

export const MESSAGE_TMPL_KEY = {
  CONTACTS: templates[7].id,
  ERROR: templates[8].id,
};
// static contents
const html = {
  // Header
  [HEADER_TMPL_KEY.indicatorPending]: templates[0].innerHTML,
  [HEADER_TMPL_KEY.indicatorWaiting]: templates[1].innerHTML,
  [HEADER_TMPL_KEY.aboutInactive]: templates[2].innerHTML,
  [HEADER_TMPL_KEY.aboutActive]: templates[3].innerHTML,
  // ChatLink
  [MODULE_KEY.HOME]: templates[4].innerHTML,
  [MODULE_KEY.BACK]: templates[5].innerHTML,
  [MODULE_KEY.SHARE]: templates[6].innerHTML,
  // ChatMessage
  [MESSAGE_TMPL_KEY.CONTACTS]: templates[7].innerHTML,
  [MESSAGE_TMPL_KEY.ERROR]: templates[8].innerHTML,
};

// dynamic contents
const cachedIds = [templates[9].id, templates[10].id, templates[11].id];

export default {
  wrap,
  html,
  hash(key) {
    // matches template ids
    // tmpl-module-share
    // tmpl-module-message => send message
    return ['tmpl-module', key].join('-');
  },
  isCached(id) {
    return cachedIds.includes(id);
  },
  get(id) {
    return wrap.children[id];
  },
  set(id, component) {
    const template = document.createElement('template');
    template.id = id;
    template.innerHTML = component.innerHTML;

    wrap.appendChild(template);
    cachedIds.push(id);
  },
};
