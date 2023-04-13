import './style.css';

// import { render } from './renderer/renderer.js';
// import { listen } from './listener/listener.js';

const app = document.getElementById('app');

(async () => {
	app.innerHTML = window.location.toString();
	// await render();
	// listen();
})();
