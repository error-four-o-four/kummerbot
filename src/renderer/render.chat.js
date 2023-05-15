import router, {
  KEYS,
  fetchData,
  getPathToChatFile,
} from '../router/router.js';

import renderer, { clearOutlet } from './renderer.js';
import templates, {
  ATTR,
  createTemplateElement,
  renderChatTemplates,
} from '../templates/templates.js';
import elements from '../elements.js';

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

import { CUSTOM_ATTR, CUSTOM_TAG } from '../components/chat-link/config.js';

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

    let section = elements.outlet.children[step];

    // section is rendered or
    // wasn't removed in filterOutlet()
    if (section) {
      updateChatSection(section, ...keys);

      // @todo animation !!

      // cases: isInitialRender or isLastSection
      // scrollChatSectionIntoView();
      // await animateChatOptions();

      continue;
    }

    const { error, elt: newSection } = await renderChatSection(keys);

    if (error) {
      scrollNextSectionIntoView(newSection);
      newSection.previousElementSibling &&
      removeFixedHeight(newSection.previousElementSibling.lastElementChild);
      return;
    }

    if (keys[2] !== null) continue;

    toggleLoadingIndicator();

    // set fixed height of current section links wrap
    // required to smoothen scroll animation
    setFixedHeight(newSection.lastElementChild);

    scrollNextSectionIntoView(newSection);
    await playSectionFadeInAnimation(newSection);

    toggleLoadingIndicator();
  }
}

async function renderChatSection(keys) {
  const [prevKey, key, nextKey] = keys;

  // get contents
  const file = getPathToChatFile(key);
  const { error, data } = await fetchData(file);

  // create section element
  const elt = document.createElement('section');
  elt.setAttribute(ATTR.SECTION_KEY, key);

  if (nextKey) {
    elt.setAttribute(ATTR.SELECTED_KEY, nextKey);
  }

  const fragment = document.createDocumentFragment();
  fragment.append(elt);

  if (error) {
    // @todo
    // handle error
    elt.innerHTML = templates.getErrorTemplate();
    elements.outlet.append(fragment);

    elt.previousElementSibling && removeFixedHeight(elt.previousElementSibling);
    return {
      error,
      elt,
    };
  }

  renderContent(elt, data, prevKey);
  elements.outlet.append(fragment);

  // remove fixed height of prev section links wrap
  if (prevKey !== null && elt.previousElementSibling) {
    removeFixedHeight(elt.previousElementSibling.lastElementChild);
    // const prevLinksRow = elements.outlet.children[step - 1].lastElementChild;
    // removeFixedHeight(prevLinksRow);
  }

  return {
    error,
    elt,
  };
}

// @todo should also used in view route
function renderContent(section, data, prevKey) {
  const template = createTemplateElement(data);

  // data has two template elements
  // the first one renders content rows
  // the second one renders the possible answers / links
  const [clonedContentRows, clonedLinks] = [
    ...template.content.cloneNode(true).children,
  ]
    .map((template) => template.content.cloneNode(true))
    .map((cloned) => [...cloned.children]);

  for (const contentRow of clonedContentRows) {
    contentRow.classList.add('row', 'content');

    renderChatTemplates(contentRow);
  }

  const linksRow = document.createElement('div');
  linksRow.classList.add('row', 'links');

  for (const link of clonedLinks) {
    linksRow.appendChild(link);
  }

  section.append(...clonedContentRows, linksRow);

  if (!prevKey) return;
  // insert back anchor if necessary
  // after the anchor /home
  // before other options

  const links = linksRow.children;

  const position =
    links[0]?.getAttribute(CUSTOM_ATTR.TARGET_KEY) === KEYS.ROOT ? 1 : 0;

  const link = document.createElement(CUSTOM_TAG);
  link.setAttribute(CUSTOM_ATTR.TARGET_KEY, KEYS.BACK);
  link.setAttribute(CUSTOM_ATTR.TEXT, templates.text[KEYS.BACK]);

  linksRow.insertBefore(link, links[position]);
}

function updateChatSection(elt, ...keys) {
  const selectedKey = elt.getAttribute(ATTR.SELECTED_KEY);
  const nextKey = keys[2]; // @todo refactor

  if (nextKey && selectedKey && nextKey === selectedKey) {
    // section was rendered correctely
    return;
  }

  if (nextKey && nextKey !== selectedKey) {
    // section was rendered incorrectely
    elt.setAttribute(ATTR.SELECTED_KEY, nextKey);
  }

  if (!nextKey && selectedKey) {
    // make sure to show all options
    elt.removeAttribute(ATTR.SELECTED_KEY);
  }

  // update links
  for (const link of elt.lastElementChild.children) {
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
    const sectionKey = section.getAttribute(ATTR.SECTION_KEY);

    // break if there's an incorrect section
    if (currentKey !== sectionKey) break;

    i += 1;
  }

  return [i - 1, [...elements.outlet.children].slice(i)];
}

async function removeSections() {
  if (elements.outlet.children.length === 0) return;

  const firstSection = elements.outlet.children[0];

  if (firstSection.getAttribute(ATTR.SECTION_KEY) !== router.keys[0]) {
    renderer.isInitialRender = true;
    clearOutlet();
    return;
  }

  const [index, filtered] = filterChatSections();

  if (filtered === null) return;

  const lastSection = elements.outlet.children[index];

  updateChatSection(lastSection, []);

  scrollPreviousSectionIntoView(lastSection);
  await playSectionsFadeOutAnimation(filtered);

  for (const section of filtered) {
    section.remove();
  }
}
