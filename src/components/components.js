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

import {
  CUSTOM_TAG as CONTACT_TAG,
  CUSTOM_ATTR as CONTACT_ATTR,
} from './contact-item/config.js';

import {
  CUSTOM_TAG as MODULE_TAG,
  CUSTOM_ATTR as MODULE_ATTR,
  CUSTOM_VAL as MODULE_VAL,
} from './chat-module/config.js';

export {
  LINK_TAG,
  LINK_ATTR,
  TARGET_VAL,
  MESSAGE_TAG,
  MESSAGE_ATTR,
  CONTACT_TAG,
  CONTACT_ATTR,
  MODULE_TAG,
  MODULE_ATTR,
  MODULE_VAL,
};

import { ChatMessage } from './chat-message/chat-message.js';
import { ContactItem } from './contact-item/contact-item.js';
import { ChatLink } from './chat-link/chat-link.js';

import { ChatModule } from './chat-module/chat-module.js';

const components = {
  [MESSAGE_TAG]: ChatMessage,
  [CONTACT_TAG]: ContactItem,
  [LINK_TAG]: ChatLink,
  [MODULE_TAG]: ChatModule,
};

for (const [tag, component] of Object.entries(components)) {
  defineComponent(tag, component);
}
