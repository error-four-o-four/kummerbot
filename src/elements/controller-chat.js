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

// called onpopstate/onpushstate via renderer.update()
export async function updateChatElements() {
  // remove page / incorrect sections
  // plays fade out animation
  // set isInitialRender

  await removeChatModules();

  if (renderer.initial) {
    // @todo on first render
    // @todo hide app
    // @todo show app when last element was rendered
    console.log('initial render');
  }

  // compare router query [intern, option-a, ...]
  // with the ids of the rendered sections
  // get prev, current and next key
  for (let step = 0, steps = router.keys.length; step < steps; step += 1) {
    const keys = [step - 1, step, step + 1].map(
      (step) => router.keys[step] || null
    );

    const renderedModule = elements.outlet.children[step];

    // module is rendered or
    // wasn't removed in filterOutlet()
    if (!!renderedModule && keys[2] !== null) {
      // updates children / links
      // skips animation
      // @todo cases: isInitialRender or isLastSection
      renderedModule.key = keys[1];
      renderedModule.setKeyToNextModule(keys[2]);
      continue;
    }

    // is last module in outlet
    if (renderedModule && keys[2] === null) {
      // @todo cases: isInitialRender or isLastSection
      renderedModule.setKeyToNextModule(keys[2]);
      // @todo animation !!
      // scrollChatSectionIntoView();
      // await animateChatOptions();
      continue;
    }

    // create a new ChatModule element
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

    elements.outlet.append(module);

    // @wat?
    // these methods don't work in connectedCallback of ChatModule
    module.setHrefOfLinks();
    module.setKeyToNextModule(keys[2]);

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

  if (elements.outlet.children[0].key !== router.keys[0]) {
    renderer.initial = true;
    elements.clearOutlet();
    console.log('cleared');
    return;
  }

  const [lastModuleIndex, filteredModules] = filterChatModules();

  if (filteredModules === null) return;

  const lastModule = elements.outlet.children[lastModuleIndex];
  lastModule.setKeyToNextModule(null);

  scrollToPreviousModule(lastModule);
  await playSectionsFadeOutAnimation(filteredModules);

  for (const section of filteredModules) {
    section.remove();
  }
}

function filterChatModules() {
  let i = 0;

  while (i < router.keys.length) {
    // compare router keys
    // with the keys of the rendered sections
    const module = elements.outlet.children[i];

    // there are less sections rendered than required
    // no need to remove any sections
    if (!module) return [-1, null];

    // break if there's an incorrect section
    if (router.keys[i] !== module.key) break;

    i += 1;
  }

  return [i - 1, [...elements.outlet.children].slice(i)];
}
