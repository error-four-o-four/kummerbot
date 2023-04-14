import router from '../router/router.js';
import { ATTR_ROUTE, render } from '../renderer/renderer.js';

export function listen() {
	window.onpopstate = () => {
		router.update();
		render();
	};

	window.addEventListener('click', (e) => {
		const { target } = e;

		if (target.tagName !== 'A') return;

		if (!target.hasAttribute(ATTR_ROUTE)) return;

		router.route(e);
		render();
	});
}
