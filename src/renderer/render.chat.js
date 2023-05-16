import router, {
  fetchData,
  getPathToChatFile,
} from '../router/router.js';

import renderer, { clearOutlet } from './renderer.js';

import templates from '../templates/templates.js';
import contents from '../templates/contents.js';

import elements, { MODULE_ATTR } from '../elements.js';

import {
  isInitialRender,
  templates,
  filterOutlet,
  appendLoadingIndicator,
  removeLoadingIndicator,
} from './renderer.js';

import {
  scrollNextSectionIntoView,
  scrollPreviousSectionIntoView,
  playSectionFadeInAnimation,
  playSectionsFadeOutAnimation,
  toggleLoadingIndicator,
  setFixedHeight,
  removeFixedHeight,
} from './transition.js';

// called onpopstate/onpushstate via renderer.update()
export async function renderChat() {
  // remove page / incorrect sections
  // plays fade out animation
  // set isInitialRender
  await removeSections();

  if (renderer.isInitialRender) {
    // @todo on first render
    // @todo hide app
    // @todo show app when last element was rendered
    console.log('initial render');
    console.log('first render');
  }

  // remove incorrect sections
  if (elements.outlet.children.length > 0) {
    // @todo fadeOut animation
    filterOutlet();
  }

  // compare router query [intern, option-a, ...]
  // with the ids of the rendered sections
  // get prev, current and next key
  for (let step = 0, steps = router.keys.length; step < steps; step += 1) {
    const keys = [step - 1, step, step + 1].map(
      (step) => router.keys[step] || null
    );

    const moduleIsRendered = !!elements.outlet.children[step];

    // section is rendered or
    // wasn't removed in filterOutlet()
    if (moduleIsRendered) {
      const module = elements.outlet.children[step];
      updateChatModule(module, keys[2]);

      if (keys[2] !== null) continue;

      // @todo animation !!

      // cases: isInitialRender or isLastSection
      // scrollChatSectionIntoView();
      // await animateChatOptions();

      continue;
    }

    // fetch data
    // cache contents
    // set MODUL_ATTR.KEY (attribute isn't observed)
    const { error, module } = await getChatModule(keys);

    if (error) {
      elements.outlet.append(module);
      // scrollNextSectionIntoView(newModule);
      // module.previousElementSibling &&
      //   removeFixedHeight(module.previousElementSibling);
      // newModule.previousElementSibling &&
      //   removeFixedHeight(newModule.previousElementSibling.lastElementChild);
      return;
    }

    // set attribute MODUL_ATTR.NEXT
    // updates ChatLinks
    // via onConnectedCallback()
    updateChatModule(module, keys[2]);
    elements.outlet.append(module);

    if (keys[2] !== null) continue;

    console.log(module);

    // @todo animation !!

    // remove fixed height of prev section links wrap
    // if (prevKey !== null && module.previousElementSibling) {
    //   removeFixedHeight(module.previousElementSibling.lastElementChild);
    //   // const prevLinksRow = elements.outlet.children[step - 1].lastElementChild;
    //   // removeFixedHeight(prevLinksRow);
    // }

    // toggleLoadingIndicator();

    // // set fixed height of current section links wrap
    // // required to smoothen scroll animation
    // setFixedHeight(newModule.lastElementChild);

    // scrollNextSectionIntoView(newModule);
    // await playSectionFadeInAnimation(newModule);

    // toggleLoadingIndicator();
  }
}

async function getChatModule(keys) {
  const module = document.createElement('div');
  module.classList.add('chat-module');

  // get data with current key of the module
  const path = getPathToChatFile(keys[1]);
  const { error, data } = await fetchData(path);

  if (error) {
    // @todo
    // handle / display error
    module.innerHTML = contents.getErrorTemplate();

    return {
      error,
      module,
    };
  }

  // when key equals KEYS.SHARE
  // the id contains the prevKey too
  const templateId = templates.createTemplateId(keys);

  // cache template key
  // inject contents
  if (!templates.isCached(templateId)) {
    templates.cache(templateId, keys, data);
  }

  module.setAttribute(MODULE_ATTR.KEY, keys[1]);
  module.append(templates.cloneMessages(templateId));
  module.append(templates.cloneLinks(templateId));

  return {
    error,
    module,
  };
}

function updateChatModule(module, nextKey) {
  const selectedKey = module.getAttribute(MODULE_ATTR.NEXT);

  if (nextKey === selectedKey) {
    return;
  }

  if (nextKey && !selectedKey) {
    // section was rendered incorrectely
    module.setAttribute(MODULE_ATTR.NEXT, nextKey);
  }

  if (!nextKey && selectedKey) {
    // make sure to show all options
    module.removeAttribute(MODULE_ATTR.NEXT);
  }

  for (const link of module.lastElementChild.children) {
    link.update();
  }
}

// #############################

function filterChatSections() {
  let i = 0;

  while (i < router.keys.length) {
    // compare router keys
    // with the keys of the rendered sections
    const section = elements.outlet.children[i];

    // there are less sections rendered than required
    // no need to remove any sections
    if (!section) return [-1, null];

    const currentKey = router.keys[i];
    const sectionKey = section.getAttribute(MODULE_ATTR.KEY);

    // break if there's an incorrect section
    if (currentKey !== sectionKey) break;

    i += 1;
  }

  return [i - 1, [...elements.outlet.children].slice(i)];
}

async function removeSections() {
  if (elements.outlet.children.length === 0) return;

  const firstSection = elements.outlet.children[0];

  if (firstSection.getAttribute(MODULE_ATTR.KEY) !== router.keys[0]) {
    renderer.isInitialRender = true;
    clearOutlet();
    return;
  }

  const [index, filtered] = filterChatSections();

  if (filtered === null) return;

  const lastSection = elements.outlet.children[index];

  updateChatModule(lastSection, []);

  scrollPreviousSectionIntoView(lastSection);
  await playSectionsFadeOutAnimation(filtered);

  for (const section of filtered) {
    section.remove();
  }
}
