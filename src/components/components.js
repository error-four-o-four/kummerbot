import { defineComponent } from './utils.js';

import {
  CUSTOM_TAG as LINK_TAG,
  CUSTOM_ATTR as LINK_ATTR,
  CUSTOM_VAL as TARGET_VAL,
} from './chat-link/config.js';

import {
  CUSTOM_TAG as MESSAGE_TAG,
  CUSTOM_ATTR as MESSAGE_ATTR,
} from './chat-message/config.js';

import { CUSTOM_TAG as LIST_TAG } from './contact-list/config.js';

import {
  CUSTOM_TAG as MODULE_TAG,
  CUSTOM_ATTR as MODULE_ATTR,
} from './chat-module/config.js';

export {
  MODULE_TAG,
  MODULE_ATTR,
  MESSAGE_TAG,
  MESSAGE_ATTR,
  LIST_TAG,
  LINK_TAG,
  LINK_ATTR,
  TARGET_VAL,
};

import { ChatMessage } from './chat-message/chat-message.js';
import { ContactList } from './contact-list/contact-list.js';
import { ChatLink } from './chat-link/chat-link.js';
import { ChatModule } from './chat-module/chat-module.js';

const components = {
  [MESSAGE_TAG]: ChatMessage,
  [LIST_TAG]: ContactList,
  [LINK_TAG]: ChatLink,
  [MODULE_TAG]: ChatModule,
};

for (const [tag, component] of Object.entries(components)) {
  defineComponent(tag, component);
}
