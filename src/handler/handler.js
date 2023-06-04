import buttonHandler from './button-handler.js';
import eventHandler from './event/event-handler.js';

export default {
  init() {
    for (const [key, fn] of Object.entries(buttonHandler)) {
      window.addEventListener(key, fn);
    }

    for (const [key, fn] of Object.entries(eventHandler)) {
      window.addEventListener(key, fn);
    }
  },
};
