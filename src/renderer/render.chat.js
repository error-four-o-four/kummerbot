import {
  ATTR_ROUTE,
  ATTR_CHOICE,
  VAL_HOMEPAGE,
  VAL_POPSTATE,
  VAL_RESETSTATE,
  elements,
} from './config.js';

import {
  insertSingleSection,
  appendSingleSection,
  setCurrentSection,
} from './helpers.js';

import {
  scrollIntoViewOptions,
  showContent,
  hideChoices,
  showChoices,
} from './transition.js';

import router, { fetchData } from '../router/router.js';

const getPath = (key) => {
  const step = router.query.indexOf(key);
  return (
    router.root + '/views' + (step > 0 ? `/chat-${step}/` : '/') + key + '.html'
  );
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
    renderSectionContents(data, step);
    // update visiblity of 'choices' and 'chosen'
    updateChoicesElement(values);

    // if (fetched.error) {
    // 	// @todo? remove listeners?
    // 	app.innerHTML = '';
    // 	const section = appendSection('error');
    // 	section.innerHTML = '';
    // 	section.append(createErrorFragment(router.root + '/chat'));
    // 	return;
    // }

    if (error) {
      console.error(`Error: ${error}`);
      return;
    }

    if (!values.isLastSection) continue;

    scrollSectionIntoView();
    await animateSectionContents();
  }
}

const errorContentTemplate = `
<div>
  <p>&#x26A0; Ein Fehler ist aufgetreten.</p>
</div>
<div>
  <div ${ATTR_ROUTE}="${VAL_HOMEPAGE}">Ich m&ouml;chte zur&uuml;ck zum Anfang</div>
</div>
`;

function renderSectionContents(data, step) {
  const template = document.createElement('template');
  template.innerHTML = data ? data : errorContentTemplate;

  // data has two template elements
  const content = createContentElement(template);
  const choices = createChoicesElement(template, step);
  const chosen = createChosenElement();

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
  hideChoices(choices);
  await showContent(content);
  await showChoices(choices);
}

function scrollSectionIntoView() {
  elements.section.scrollIntoView(scrollIntoViewOptions);
}

// retrieve route from router path
const getRouteToStep = (step) => {
  const path = router.query.slice(0, step + 1).join('/');
  return router.root + '/' + path;
};

function createContentElement(template) {
  const elt = template.content.firstElementChild.cloneNode(true);
  elt.classList.add('row', 'content');

  return elt;
}

// ############### Choices Element

// // append key to router path
// const getNextRoute = (key) => router.root + router.path + '/' + key;

function createChoicesElement(template, step) {
  const elt = template.content.lastElementChild.cloneNode(true);
  elt.classList.add('row', 'choices');

  // get data from div element
  // reset div element
  // create and append anchor element
  for (const child of elt.children) {
    const key = child.getAttribute(ATTR_ROUTE);
    const text = child.textContent;
    const href =
      key === VAL_HOMEPAGE
        ? getRouteToStep(0)
        : getRouteToStep(step) + '/' + key;

    const anchor = document.createElement('a');
    anchor.textContent = text;
    anchor.href = href;
    anchor.setAttribute(ATTR_ROUTE, key);

    child.innerHTML = '';
    child.appendChild(anchor);
    child.removeAttribute(ATTR_ROUTE);
  }

  // insert back button if necessary
  if (step > 0) {
    const anchorWrap = document.createElement('div');
    const anchor = document.createElement('a');
    anchor.href = getRouteToStep(step - 1);
    anchor.innerHTML = 'Ich m&ouml;chte einen Schritt zur&uuml;ck';
    anchor.setAttribute(ATTR_ROUTE, VAL_POPSTATE);

    anchorWrap.appendChild(anchor);
    elt.insertBefore(anchorWrap, elt.children[0]);
  }

  return elt;
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
  if (!chosen.getAttribute(ATTR_CHOICE)) {
    chosen.setAttribute(ATTR_CHOICE, key);

    // get route to chosen step
    const href = getRouteToStep(step);
    // use key to get the anchor text for the next section
    const text = anchors.find(
      (elt) => elt.getAttribute(ATTR_ROUTE) === key
    )?.textContent;

    // set href to current section
    renderChosenContents(chosen, href, text);
  }

  // chosen element has been rendered
  const choice = chosen.getAttribute(ATTR_CHOICE);
  // update content if necessary
  if (choice !== key) {
    const text = anchors.find(
      (elt) => elt.getAttribute(ATTR_ROUTE) === key
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
  anchorWrap.innerHTML = `<a href="${href}" ${ATTR_ROUTE}="${VAL_RESETSTATE}">✖</a>`;

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
