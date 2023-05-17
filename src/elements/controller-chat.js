import router from '../router/router.js';
import renderer from '../renderer/renderer.js';

import elements from './elements.js';

import {
  scrollNextSectionIntoView,
  scrollToPreviousModule,
  playSectionFadeInAnimation,
  playSectionsFadeOutAnimation,
  toggleLoadingIndicator,
  setFixedHeight,
  removeFixedHeight,
} from '../renderer/animation.js';

// called onpopstate/onpushstate via elements.update()
export async function updateChatElements() {
  // if necessary, set renderer.initial
  // (onpopstate/pre route wasn't chat route)
  // compares router query [intern, option-a, ...]
  // with the attr 'key' of the rendered sections
  // removes page / incorrect modules
  // plays fade out animation
  await removeChatModules();

  if (renderer.initial) {
    // @todo on first render
    // @todo hide app
    // @todo show app when last element was rendered
    console.log('initial render');
  }

  for (let step = 0, steps = router.keys.length; step < steps; step += 1) {
    // get prev, current and next key
    const keys = [step - 1, step, step + 1].map(
      (step) => router.keys[step] || null
    );

    // check if there's a rendered ChatModule component
    // for the currently iterated part of the pathname (router.keys)
    const renderedModule = elements.outlet.children[step];

    // if there are subsequent modules
    if (!!renderedModule && keys[2] !== null) {
      // update ChatLink components
      // at ChatModule.attributedChangedCallback()
      // skip animation
      // @todo renderer.initial
      renderedModule.next = keys[2];
      continue;
    }

    // if it's the last module in outlet
    if (renderedModule && keys[2] === null) {
      // @todo cases: isInitialRender or isLastSection
      // make sure to reset ChatLink componenrts
      renderedModule.next = keys[2];
      // @todo animation !!
      // scrollChatSectionIntoView();
      // await animateChatOptions();
      continue;
    }

    // if there isn't rendered module
    // create a new one
    // fetch data and cache contents
    const { error, module } = await renderer.createChatModule(keys);

    if (error) {
      elements.outlet.append(module);
      // @todo animation
      // scrollNextSectionIntoView(newModule);
      // module.previousElementSibling &&
      //   removeFixedHeight(module.previousElementSibling);
      // newModule.previousElementSibling &&
      //   removeFixedHeight(newModule.previousElementSibling.lastElementChild);
      return;
    }

    // @wat
    // updating / setting href attributes of the children
    // doesn't work in connectedCallback()
    // when module is a cloned element from the cached <template>s

    elements.outlet.append(module);

    // explicitly set href attributes
    // after element was connected
    const hrefToModule = router.getHref(keys[1]);
    for (const link of module.links) {
      link.href = hrefToModule;
    }

    // handled by attributeChangedCallback()
    // updates appearance of ChatLink components
    module.next = keys[2];

    if (keys[2] !== null) continue;

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

// #############################

async function removeChatModules() {
  if (elements.outlet.children.length === 0) return;

  // clear outlet when coming from a page
  if (elements.outlet.children[0].key !== router.keys[0]) {
    renderer.initial = true;
    elements.clearOutlet();
    // console.log('cleared');
    return;
  }

  // compares router keys
  // with the keys of the rendered modules
  // returns the index of the last correctly rendered module
  // and the modules which will be removed
  const [lastModuleIndex, filteredModules] = filterChatModules();

  // @consider animation timeline (?)
  // make sure to update the appearance
  if (lastModuleIndex >= 0) {
    const lastModule = elements.outlet.children[lastModuleIndex];
    lastModule.next = null;
  }

  // skip if there are no modules
  if (filteredModules === null) return;

  scrollToPreviousModule(lastModule);
  await playSectionsFadeOutAnimation(filteredModules);

  // remove elements after animation
  for (const section of filteredModules) {
    section.remove();
  }
}

function filterChatModules() {
  let i = 0;

  while (i < router.keys.length) {

    const module = elements.outlet.children[i];

    // there are less sections rendered than required
    // no need to remove any sections
    if (!module) return [i - 1, null];

    // break if there's an incorrect section
    if (router.keys[i] !== module.key) break;

    i += 1;
  }

  return [i - 1, [...elements.outlet.children].slice(i)];
}
