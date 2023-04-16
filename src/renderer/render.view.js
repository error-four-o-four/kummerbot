import { elements } from './config.js';
import { removeAllSections, appendSingleSection } from './helpers.js';

import router, { routes, fetchData } from '../router/router.js';

const getId = () => router.path.slice(1);

const getPath = () => router.root + '/views' + router.path + '.html';

export async function renderView() {
  // clear innerHTML of 'main#app'
  removeAllSections();

  // create section element
  // store as value of 'elements'
  const id = getId();
  appendSingleSection(id);

  // get contents
  const file = getPath();
  const { error, data } = await fetchData(file);

  if (error) {
    console.error(`Error: ${error}`);
    router.set(routes.error);
    return;
  }

  // @todo url params
  renderSectionContents(data);
}

function renderSectionContents(html) {
  // @todo ?? handle undefined ?? fallback
  elements.section.innerHTML = html;
}
