import './style.css';

import router from './router/router.js';
import renderer from './renderer/renderer.js';
import listener from './listener/listener.js';

router.update();

(async () => {
	await renderer.update();
	listener.init();
})();
