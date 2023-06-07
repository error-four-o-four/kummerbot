import './style/main.css';

import './components/about-link/index.js';
import './components/components.js';

import router from './router/router.js';
import handler from './handler/handler.js';
import renderer from './renderer/renderer.js';

router.init();
handler.init();

renderer.update();
