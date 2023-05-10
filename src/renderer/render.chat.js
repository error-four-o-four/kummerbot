import elements, { templates, ATTR } from '../elements/elements.js';

import {
  scrollIntoViewOptions,
  hideContent,
  showContent,
  hideChoices,
  showChoices,
} from './transition.js';

import router, {
  getPathToChatFile,
  fetchData,
  KEYS,
} from '../router/router.js';

import {
  isInitialRender,
  filterOutlet,
  appendLoadingIndicator,
  removeLoadingIndicator,
} from './renderer.js';

// called onpopstate/onpushstate via renderer.update()
export async function renderChat() {
  if (isInitialRender) {
    // @todo on first render
    // @todo hide app
    // @todo show app when last element was rendered
    console.log('first render');
  }

  // remove incorrect sections
  if (elements.outletChildren.length > 0) {
    filterOutlet();
  }

  for (let step = 0, steps = router.steps.length; step < steps; step += 1) {
    const section = elements.outletChildren[step];

    // compare router query [intern, option-a, ...]
    // with the ids of the rendered sections
    const id = section?.id;
    const key = router.steps[step];

    // required to trigger scrollIntoView animation
    const isLastSection = step === steps - 1;

    // correct section was rendered
    if (id && id === key) {
      updateOptions(section.lastElementChild, step, isLastSection);

      // if (!isLastSection) continue;

      // scrollChatSectionIntoView();
      // await animateChatOptions();

      continue;
    }

    // section was not rendered yet
    appendLoadingIndicator();

    // get contents
    const file = getPathToChatFile(key);
    const { error, data } = await fetchData(file);

    removeLoadingIndicator();

    // @todo
    // check position of section and insertBefore if necessary
    // insertSingleSection(step, key);

    // create elements 'content', 'options'
    // handle error
    // update visiblity of 'options'
    appendChatPart(key, step, data);

    if (error) {
      console.error(`Error: ${error}`);
      // scrollChatSectionIntoView();
      return;
    }

    const options = elements.outletChildren[step].lastElementChild;
    updateOptions(options, step, isLastSection);

    // if (!condition.isLastSection) continue;

    // scrollChatSectionIntoView();
    // await animateSectionContents();
  }
}

function appendChatPart(key, step, data) {
  // use DocumentFragment for performance
  const fragment = document.createDocumentFragment();

  // e.g. section#help
  const wrap = document.createElement('section');
  wrap.id = key;
  fragment.append(wrap);

  if (!data) {
    wrap.innerHTML = templates.getErrorTemplate();
    elements.outlet.append(fragment);
    return;
  }

  // data has two template elements
  // the first one renders the question
  // the second one renders the possible answers
  wrap.innerHTML = data;

  renderContent(wrap);
  renderOptions(wrap, step);

  elements.outlet.append(fragment);
}

function renderContent(parent) {
  const content = parent.firstElementChild;
  content.classList.add('row', 'content');

  // create info element if necessary
  for (const attr of [ATTR.INFO]) {
    const element = content.querySelector(`[${attr}]`);
    if (element) {
      element.innerHTML = templates[attr];
    }
  }
  // @todo => custom Element ?
  // update and convert contact links if possible
}

function renderOptions(parent, step) {
  const options = parent.lastElementChild;
  options.classList.add('row', 'options');

  for (const option of options.children) {
    const key = option.getAttribute(ATTR.ROUTE);
    const text = option.textContent;

    option.classList.add('option');
    option.innerHTML = templates.getOptionTemplate(key, text);
    option.removeAttribute(ATTR.ROUTE);
  }

  // insert back anchor if necessary
  // after the anchor /home
  // before other options
  if (step > 0) {
    const position =
      options.children[0]?.getAttribute(ATTR.ROUTE) === KEYS.CHAT ? 1 : 0;

    const option = document.createElement('div');
    option.setAttribute(ATTR.ROUTE, KEYS.BACK);
    option.classList.add('option');
    option.innerHTML = templates.getOptionTemplate(KEYS.BACK);

    options.insertBefore(option, options.children[position]);
  }
}

function updateOptions(options, step) {
  const nextKey = router.steps[step + 1] || null;

  for (const option of options.children) {
    // show all options because it's the last element
    if (nextKey === null) {
      option.classList.remove('is-hidden');
      option.classList.remove('is-choice');
      continue;
    }

    const index = option.children.length === 1 ? 0 : 1;
    const key = option.children[index].getAttribute(ATTR.ROUTE);
    const state = key === nextKey ? 'is-choice' : 'is-hidden';
    option.classList.add(state);
  }
}

// ################# animation

async function animateSectionContents() {
  // animation
  const [content, choices] = [...elements.section.children];
  hideContent(content);
  hideChoices(choices);
  await new Promise((resolve) => setTimeout(resolve, 300));
  await showContent(content);
  await showChoices(choices);
}

function scrollChatSectionIntoView() {
  elements.section.scrollIntoView(scrollIntoViewOptions);
}

async function animateChatOptions() {
  const choices = elements.section.children[1];
  hideChoices(choices);
  await showChoices(choices);
}
