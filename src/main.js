import './style/main.css';

import './components/about-link/index.js';
import './components/components.js';

import router from './router/router.js';
import elements from './elements/elements.js';
import renderer from './renderer/renderer.js';

import eventHandler from './handler/event-handler.js';

const headerHeight = elements.header.elt.offsetHeight + 8;
document.documentElement.style.setProperty(
  '--scroll-padding',
  headerHeight + 'px'
);

router.update();

(async () => {
  await renderer.update(router.state);
  eventHandler.init();
})();
