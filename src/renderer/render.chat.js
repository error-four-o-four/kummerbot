import { ATTR, VAL, elements, contents } from './config.js';

import {
  insertSingleSection,
  appendSingleSection,
  setCurrentSection,
} from './helpers.js';

import {
  scrollIntoViewOptions,
  hideContent,
  showContent,
  hideChoices,
  showChoices,
} from './transition.js';

import router, { fetchData, routes } from '../router/router.js';

const getPath = (key) => {
  const step = router.query.indexOf(key);

  // return first section or share section
  return step === 0 || key === VAL.SHARE
    ? '/views/chat/' + key + '.html'
    : '/views/chat-' + step + '/' + key + '.html';

  // return (
  //   router.root +
  //   '/views' +
  //   (step > 0 && key !== VAL.SHARE ? `/chat-${step}/` : '/chat/') +
  //   key +
  //   '.html'
  // );
};

const filterRenderedSections = () => {
  for (let i = elements.app.children.length - 1; i >= 0; i -= 1) {
    setCurrentSection(elements.app.children[i]);

    const id = elements.section.id;
    const key = router.query[i];

    if (!key || id !== key) {
      elements.section.remove();
      elements.section = null;
    }
  }
};

// called onpopstate/onpushstate
export async function renderChat() {
  // @todo on first render
  const isFirstRender =
    elements.app.children.length === 0 && router.query.length > 0;

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

      if (!isLastSection) continue;

      scrollSectionIntoView();
      await animateChoicesElement();

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

    // create elements 'content', 'choices', 'chosen'
    // set href of anchor elements
    // handle error
    // update visiblity of 'choices' and 'chosen'
    renderSectionContents(data, step);
    updateChoicesElement(values);

    if (error) {
      console.error(`Error: ${error}`);
      scrollSectionIntoView();
      return;
    }

    if (!values.isLastSection) continue;

    scrollSectionIntoView();
    await animateSectionContents();
  }
}

function renderSectionContents(data, step) {
  const template = document.createElement('template');
  template.innerHTML = data ? data : contents.templateError;

  // data has two template elements
  const content = createContentElement(template);
  const choices = createChoicesElement(template, step);
  const chosen = createChosenElement();

  // @todo
  // update and convert contact links if possible

  // use DocumentFragment for performance
  const fragment = document.createDocumentFragment();
  fragment.append(content, choices, chosen);

  const { section } = elements;
  section.innerHTML = '';
  section.append(fragment);
}

async function animateSectionContents() {
  // animation
  const [content, choices] = [...elements.section.children];
  hideContent(content);
  hideChoices(choices);
  await new Promise((resolve) => setTimeout(resolve, 300));
  await showContent(content);
  await showChoices(choices);
}

function scrollSectionIntoView() {
  elements.section.scrollIntoView(scrollIntoViewOptions);
}

// retrieve route from router path
const getRouteToStep = (step, key = null) => {
  const path = router.query.slice(0, step + 1).join('/');
  return '/' + path + (key ? `/${key}` : '');
};

function createContentElement(template) {
  const elt = template.content.firstElementChild.cloneNode(true);
  elt.classList.add('row', 'content');

  // create info element if necessary
  const div = elt.querySelector(`[${ATTR.INFO}]`);

  if (div) {
    div.innerHTML = contents.templateInfo;
  }

  return elt;
}

// ############### Choices Element

function createChoicesElement(template, step) {
  const elt = template.content.lastElementChild.cloneNode(true);
  elt.classList.add('row', 'choices');

  // get data from div element
  // reset div element
  // create and append anchor elements
  for (const child of elt.children) {
    const key = child.getAttribute(ATTR.ROUTE);

    const anchor =
      // key === VAL.HOMEPAGE
      //   ? createAnchorHomepage()
      //   : key === VAL.SHARE
      //   ? createAnchorNext(step, key, contents.text.anchorShare)
      // : createAnchorNext(step, key, child.textContent);
      key in createAnchorHandler
        ? createAnchorHandler[key](step, key)
        : createAnchorNext(step, key, child.textContent);

    anchor.setAttribute(ATTR.ROUTE, key);

    child.innerHTML = '';
    child.appendChild(anchor);
    child.removeAttribute(ATTR.ROUTE);
  }

  // insert back anchor if necessary
  if (step > 0) {
    const ref =
      elt.children[0]?.children[0]?.getAttribute(ATTR.ROUTE) === VAL.HOMEPAGE
        ? 1
        : 0;
    const anchor = createAnchorBack(step);
    elt.insertBefore(anchor, elt.children[ref]);
  }

  return elt;
}

const createAnchorHandler = {
  [VAL.HOMEPAGE]: createAnchorHomepage,
  [VAL.SHARE]: createAnchorNext,
  [VAL.VIEW]: createAnchorView,
};

function createAnchorHomepage() {
  const anchor = document.createElement('a');
  anchor.innerHTML = contents.text.anchorHomepage;
  anchor.href = routes.home;
  return anchor;
}

function createAnchorBack(step) {
  const wrap = document.createElement('div');
  const anchor = document.createElement('a');
  anchor.href = getRouteToStep(step - 1);
  anchor.innerHTML = contents.text.anchorBack;
  anchor.setAttribute(ATTR.ROUTE, VAL.POPSTATE);

  wrap.appendChild(anchor);
  return wrap;
}

function createAnchorNext(step, key, text) {
  const anchor = document.createElement('a');
  anchor.innerHTML = key === VAL.SHARE ? contents.text.anchorShare : text;
  anchor.href = getRouteToStep(step, key);
  return anchor;
}

function createAnchorView(step, key) {
  const anchor = document.createElement('a');
  anchor.innerHTML = contents.text.anchorView;
  anchor.href = routes.view;
  return anchor;
}

function updateChoicesElement({ step, isLastSection }) {
  const { section } = elements;
  const [, choices, chosen] = section.children;
  const anchors = [...choices.querySelectorAll('a')];

  // section hasn't been answered yet
  // only display choices element
  if (isLastSection) {
    choices.classList.remove('is-hidden');
    chosen.classList.add('is-hidden');
    return;
  }

  // this is the next step
  const key = router.query[step + 1];

  // chosen element hasn't been rendered yet
  if (!chosen.getAttribute(ATTR.CHOICE)) {
    chosen.setAttribute(ATTR.CHOICE, key);

    // get route to chosen step
    const href = getRouteToStep(step);
    // use key to get the anchor text for the next section
    const text = anchors.find(
      (elt) => elt.getAttribute(ATTR.ROUTE) === key
    )?.textContent;

    // set href to current section
    renderChosenContents(chosen, href, text);
  }

  // chosen element has been rendered
  const choice = chosen.getAttribute(ATTR.CHOICE);
  // update content if necessary
  if (choice !== key) {
    const text = anchors.find(
      (elt) => elt.getAttribute(ATTR.ROUTE) === key
    )?.textContent;
    updateChosenContents(chosen, text);
  }

  // section has been answered
  // hide choices, show chosen choice
  choices.classList.add('is-hidden');
  chosen.classList.remove('is-hidden');
}

async function animateChoicesElement() {
  const choices = elements.section.children[1];
  hideChoices(choices);
  await showChoices(choices);
}

// ########### Chosen Element

function createChosenElement() {
  const elt = document.createElement('div');
  elt.classList.add('row', 'chosen');

  return elt;
}

function renderChosenContents(elt, href, text) {
  const anchorWrap = document.createElement('div');
  anchorWrap.innerHTML = `<a href="${href}" ${ATTR.ROUTE}="${VAL.RESETSTATE}">✖</a>`;

  const textWrap = document.createElement('div');
  textWrap.textContent = text;

  const fragment = document.createDocumentFragment();
  fragment.append(anchorWrap, textWrap);

  elt.innerHTML = '';
  elt.append(fragment);
}

function updateChosenContents(elt, text) {
  elt.lastElementChild.textContent = text;
}
