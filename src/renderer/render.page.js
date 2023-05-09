import elements, { contents } from '../elements/elements.js';
import { removeAllSections, appendSingleSection } from './helpers.js';

import router, { routes, fetchData } from '../router/router.js';

const getId = () => router.path.slice(1);

const getPathToPageFile = () => '/views' + router.path + '.html';

const getPathToViewFile = () => {
  const [, index, file] = router.query;
  return '/views/chat-' + index + '/' + file + '.html';
};

export async function renderPage() {
  // clear innerHTML of 'main#app'
  removeAllSections();

  // create section element
  // store as value of 'elements'
  const id = getId();
  appendSingleSection(id);

  // get contents
  const file = router.isViewRoute ? getPathToViewFile() : getPathToPageFile();
  const { error, data } = await fetchData(file);

  if (error) {
    console.error(`Error: ${error}`);
    router.replace(routes.error);
    return;
  }

  // @todo url params
  renderSectionContents(data);
}

function renderSectionContents(html) {
  // @todo ?? handle undefined ?? fallback
  elements.section.innerHTML = html;
  // @todo add back anchor
}
