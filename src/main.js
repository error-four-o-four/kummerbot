import './style/main.css';

import './components/about-link/index.js';
import './components/chat-link/index.js';
import './components/chat-message/index.js';
import './components/chat-module/index.js';

import router from './router/router.js';
import elements from './elements/elements.js';
import listener from './listener/listener.js';

router.update();

(async () => {
  await elements.update();
  listener.init();
})();
