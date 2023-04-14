import { ATTR_ROUTE, chat } from './renderer.js';

export function appendSection(id) {
	const elt = document.createElement('section');
	elt.id = id;
	elt.append(createLoadingIndicator());

	chat.append(elt);
	return elt;
}

function createLoadingIndicator() {
	// @todo animated spinner
	const elt = document.createElement('div');
	elt.innerHTML = 'Loading ...';
	return elt;
}

export function createSectionFragment(data) {
	const template = document.createElement('template');
	template.innerHTML = data;

	// data has two template elements
	// convert templates to div.row elements
	const contents = [...template.content.querySelectorAll('template')].map((template) => template.content);
	const main = createRow(contents[0]);
	main.classList.add('content');

	const choices = createRow();
	// @todo add back button
	// dafuq
	choices.innerHTML = [...contents[1].children].reduce((html, child) => {
		const key = child.getAttribute(ATTR_ROUTE);
		const text = child.innerText;
		return (html += `<div><a href="#" ${ATTR_ROUTE}="${key}">${text}</a></div>`);
	}, '');
	choices.classList.add('choices');

	const chosen = createRow();
	chosen.classList.add('chosen');

	// append elements
	const fragment = document.createDocumentFragment();
	fragment.append(main, choices, chosen);

	return fragment;
}

function createRow(content = null) {
	const elt = document.createElement('div');
	elt.classList.add('row');

	if (content) {
		elt.append(content);
	}

	return elt;
}

export function createChosenFragment(href, text) {
	const anchorWrap = document.createElement('div');
	anchorWrap.innerHTML = `<a href="${href}" ${ATTR_ROUTE}="reset">✖</a>`;

	const textWrap = document.createElement('div');
	textWrap.innerText = text;

	const fragment = document.createDocumentFragment();
	fragment.append(anchorWrap, textWrap);

	return fragment;
}

export function createErrorFragment(href) {
	const warn = document.createElement('p');
	warn.innerHTML = '&#x26A0; Ein Fehler ist aufgetreten.'

	const info = document.createElement('p');
	info.innerHTML = 'Bitte überpr&uuml;fen Sie die eingegeben Adresse oder<br>'
	info.innerHTML += `kehren Sie zur <a href="${href}" ${ATTR_ROUTE}="home">Startseite</a> zur&uuml;ck.`

	const fragment = document.createDocumentFragment();
	fragment.append(warn, info);

	return fragment;
}