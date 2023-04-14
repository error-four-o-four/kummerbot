import './style.css';

import { render } from './renderer/renderer.js';
import { listen } from './listener/listener.js';

(async () => {
	await render();
	listen();
})();
