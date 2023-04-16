import { ATTR_ROUTE, elements } from './config.js';

export function removeAllSections() {
  elements.app.innerHTML = '';
  elements.section = null;
}

function createSection(id) {
  const elt = document.createElement('section');
  elt.id = id;
  elt.append(createLoadingIndicator());

  return elt;
}

export function insertSingleSection(step, id) {
  const elt = createSection(id);

  // @todo
  // child insertBefore
  // elements.app.append(section);
  elements.section = elt;
  return elt;
}

export function appendSingleSection(id) {
  const elt = createSection(id);

  elements.app.append(elt);
  elements.section = elt;
  return elt;
}

export function setCurrentSection(elt) {
  elements.section = elt;
}

function createLoadingIndicator() {
  // @todo animated spinner
  const elt = document.createElement('div');
  elt.innerHTML = 'Loading ...';
  return elt;
}

export function createErrorFragment(href) {
  const warn = document.createElement('p');
  warn.innerHTML = '&#x26A0; Ein Fehler ist aufgetreten.';

  const info = document.createElement('p');
  info.innerHTML = 'Bitte überpr&uuml;fen Sie die eingegeben Adresse oder<br>';
  info.innerHTML += `kehren Sie zur <a href="${href}" ${ATTR_ROUTE}="home">Startseite</a> zur&uuml;ck.`;

  const fragment = document.createDocumentFragment();
  fragment.append(warn, info);

  return fragment;
}
