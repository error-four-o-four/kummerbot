import elements from '../elements/elements.js';

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
