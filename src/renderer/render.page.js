import {
  ATTR,
  createTemplateElement,
  renderChatTemplates,
} from '../templates/templates.js';
import elements from '../elements.js';

import router, {
  fetchData,
  getKeyOfPageSection,
  getPathToPageFile,
  getPathToViewFile,
} from '../router/router.js';

import {
  clearOutlet,
  appendLoadingIndicator,
  removeLoadingIndicator,
} from './utils.js';

export async function renderPage() {
  clearOutlet();
  appendLoadingIndicator();

  // get contents
  const file = router.isViewRoute ? getPathToViewFile() : getPathToPageFile();
  const { error, data } = await fetchData(file);

  if (error) {
    // @todo pass error message / wrong url as params
    console.error(`Error: ${error}`);
    router.setLocation(router.routes.error);
    return;
  }

  removeLoadingIndicator();

  // create section element
  const key = getKeyOfPageSection();
  const elt = document.createElement('section');
  elt.setAttribute(ATTR.SECTION_KEY, key);

  if (router.isViewRoute) {
    // @todo wat
    // @todo refactor !!!
    // @todo similar to renderContent in renderer.chat
    // @todo move to renderer utils
    const clonedContentRows = createTemplateElement(data)
      .content.cloneNode(true)
      .children[0].content.cloneNode(true).children;

    for (const contentRow of clonedContentRows) {
      contentRow.classList.add('row', 'content');
      renderChatTemplates(contentRow);
      elt.append(contentRow);
    }
  } else {
    elt.innerHTML = data;
  }

  elements.outlet.append(elt);
}
