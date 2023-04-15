import { ATTR_ROUTE, elements } from './config.js';
import { insertSingleSection, appendSingleSection, setCurrentSection } from './helpers.js';
import { hideChoices, showChoices, showContent } from './transition.js';

import router, { routes, fetchData } from '../router/router.js';

const getPath = (key) => {
	const step = router.query.indexOf(key);
	return router.root + '/views' + (step > 0 ? `/chat-${step}/` : '/') + key + '.html';
};

const getRoute = (step) => {
	const path = router.query.slice(0, step + 1).join('/');
	return router.root + '/' + path;
};

const getNextRoute = (key) => router.root + router.path + '/' + key;

// called onpopstate/onpushstate
export async function renderChat() {
	// @todo on first render
	const isFirstRender = elements.app.children.length === 0 && router.query.length > 0;

	if (isFirstRender) {
		// @todo hide app
		// @todo show app when last element was rendered
		console.log('first render');
	}

	// remove incorrect sections
	if (elements.app.children.length > 0) {
		filterRenderedSections();
	}

	// compare router query [intern, option-a, ...]
	// with the ids of the rendered sections
	for (let step = 0, steps = router.query.length; step < steps; step += 1) {
		setCurrentSection(elements.app.children[step]);

		const id = elements.section?.id;
		const key = router.query[step];

		const isLastSection = step === steps - 1;

		const values = {
			step,
			isLastSection,
		};

		// correct section was rendered
		if (id && id === key) {
			updateChoicesElement(values);
			continue;
		}

		// @todo
		// check position of section and insertBefore if necessary
		// insertSingleSection(step, key);

		// section was not rendered yet
		appendSingleSection(key);

		// get contents
		const file = getPath(key);
		const { error, data } = await fetchData(file);

		// if (fetched.error) {
		// 	// @todo? remove listeners?
		// 	app.innerHTML = '';
		// 	const section = appendSection('error');
		// 	section.innerHTML = '';
		// 	section.append(createErrorFragment(router.root + '/chat'));
		// 	return;
		// }

		// @todo
		if (error) {
			console.error(`Error: ${error}`);
			router.set(routes.error);
			return;
		}

		// create elements 'content', 'choices', 'chosen'
		renderSectionContents(data);

		// update visiblity and href values
		updateChoicesElement(values);

		if (!values.isLastSection) continue;

		await animateSectionContents();
	}
}

function filterRenderedSections() {
	for (let i = elements.app.children.length - 1; i >= 0; i -= 1) {
		setCurrentSection(elements.app.children[i]);

		const id = elements.section.id;
		const key = router.query[i];

		if (!key || id !== key) {
			elements.section.remove();
			elements.section = null;
		}
	}
}

function renderSectionContents(data) {
	const template = document.createElement('template');
	template.innerHTML = data;

	// data has two template elements
	const content = createContentElement(template);
	const choices = createChoicesElement(template);
	const chosen = createChosenElement();

	// use DocumentFragment for performance
	const fragment = document.createDocumentFragment();
	fragment.append(content, choices, chosen);

	// get last section
	const { section } = elements;
	section.innerHTML = '';
	section.append(fragment);
}

async function animateSectionContents() {
	// @todo add animation / scroll to bottom

	// animation
	const [content, choices] = [...elements.section.children];
	hideChoices(choices);
	await showContent(content);
	await showChoices(choices);
}

function createContentElement(template) {
	const elt = template.content.firstElementChild.cloneNode(true);
	elt.classList.add('row', 'content');

	return elt;
}

function createChoicesElement(template) {
	const elt = template.content.lastElementChild.cloneNode(true);
	elt.classList.add('row', 'choices');

	// update children
	for (const child of elt.children) {
		const key = child.getAttribute(ATTR_ROUTE);
		const text = child.innerText;

		child.innerHTML = `<a href="#" ${ATTR_ROUTE}="${key}">${text}</a>`;
		child.removeAttribute(ATTR_ROUTE);
	}

	return elt;
}

function updateChoicesElement({ step, isLastSection }) {
	const { section } = elements;
	const [, choices, chosen] = section.children;
	const anchors = [...choices.querySelectorAll('a')];

	// add back button
	if (step > 0 && anchors[0]?.getAttribute(ATTR_ROUTE) !== 'back') {
		// @todo
		console.log('insert back button');

		// const btn = document.createElement('div');
		// btn.innerHTML = `<a href="#" ${ATTR_ROUTE}="back">zur&uuml;ck</a>`;
		// elt.insertBefore(btn, elt.children[0]);
	}

	if (isLastSection) {
		// show all choices
		choices.classList.remove('is-hidden');
		chosen.classList.add('is-hidden');

		// update href
		for (const elt of anchors) {
			const key = elt.getAttribute(ATTR_ROUTE);
			elt.href = getNextRoute(key);
		}
		return;
	}

	// use key to get text from choices / anchor elements
	const key = router.query[step + 1];
	const text = anchors.find((elt) => elt.getAttribute(ATTR_ROUTE) === key)?.innerText;
	const href = getRoute(step);

	updateChosenElement(chosen, href, text);

	// hide choices
	choices.classList.add('is-hidden');
	chosen.classList.remove('is-hidden');

	// update href
	for (const elt of anchors) {
		elt.href = getRoute(step);
	}
}

function createChosenElement() {
	const elt = document.createElement('div');
	elt.classList.add('row', 'chosen');

	return elt;
}

function updateChosenElement(elt, href, text) {
	const anchorWrap = document.createElement('div');
	anchorWrap.innerHTML = `<a href="${href}" ${ATTR_ROUTE}="reset">✖</a>`;

	const textWrap = document.createElement('div');
	textWrap.innerText = text;

	const fragment = document.createDocumentFragment();
	fragment.append(anchorWrap, textWrap);

	elt.innerHTML = '';
	elt.append(fragment);
}
