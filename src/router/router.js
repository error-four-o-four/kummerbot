import { routes, getData } from './helpers.js';

class Router {
	constructor() {
		this.root = window.location.origin;
		this.path = null;
		this.keys = null;

		this.update();

		// at root: redirect to chat
		if (this.path === '/') {
			window.location.replace(`./${routes.chat}/intro/`);
			this.update();
		}

		// @todo '/view'
		// show last element
	}

	update() {
		// get current location
		const url = window.location.href;

		// const path = url.replace(this.root, '');
		// this.path = path.endsWith('/') ? path.slice(0, -1) : path;
		this.path = url.replace(this.root, '');

		this.keys = [
			...this.path
				.substring(1)
				.split('/')
				.filter((key) => key && key !== 'chat'),
		];

		console.log(this);
	}

	route(e) {
		e = e || window.event;
		e.preventDefault();
		window.history.pushState({}, '', e.target.href);
		this.update();
	}

	async get(key) {
		// if (this.keys[0] === routes.chat) {}
		const step = this.keys.indexOf(key);
		const file = `${this.root}/steps/${step > 0 ? `step-${step}/` : ``}${key}.html`;
		return await getData(file);

		// if (this.keys[0] === routes.view
		// && this.keys[1].beginsWith('step')) {
		// @todo
		// }
	}

	getPrevUrl(step) {
		const path = this.keys.slice(0, step + 1).join('/');
		return `${this.root}/${path}`;
	}

	getNextUrl(key) {
		return `${this.root}${this.path}/${key}`;
	}
}

export default new Router();
