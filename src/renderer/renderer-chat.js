import router from '../router/router.js';

import { MODULE_TAG } from '../components/chat-module/index.js';

import animation from './animation.js';
import elements from '../elements/elements.js';

import { state } from './utils.js';
// import { MODULE_KEY } from './templates.js';

export async function updateChatElements() {
  await removeElements();

  if (state.initial) {
    // console.log('initial render');
  }

  for (let step = 0, steps = router.keys.length; step < steps; step += 1) {
    // get prev, current and next key
    const keys = [step - 1, step, step + 1].map(
      (step) => router.keys[step] || null
    );

    // check if there's a rendered ChatModule component
    // for the currently iterated part of the pathname (router.keys)
    const renderedModule = elements.outlet.children[step];

    // module exists
    if (!!renderedModule) {
      // if there are subsequent modules
      // make sure to update ChatLink appearance
      if (renderedModule.next !== keys[2]) renderedModule.next = keys[2];
      // @todo state.initial
      // scroll to last module
      continue;
    }

    elements.header.setIndicatorPending();

    // if there isn't a rendered module
    // create a new one
    // fetch data and cache contents
    // get data with current key of the module
    const module = document.createElement(MODULE_TAG);
    await module.render(keys);

    if (module.key === 'error') {
      elements.outlet.append(module);
      // @todo animation
      // @todo error template
      // when error module has ChatLinks
      animation.scrollToNextModule(module);
      return;
    }

    // updates elements
    // when module was cloned from cache
    // and prev route wasn't the same
    elements.outlet.append(module);

    if (module.next !== null) continue;

    await animation.fadeLastChatModuleIn(module);
    elements.header.setIndicatorWaiting();
  }
}

async function removeElements() {
  // remove incorrect elements
  // when back or reset button was clicked
  // router.keys.length will always be greater than 0
  // if this conitidion is fullfilled
  // elements.outlet.children.length will always be greater than 1
  if (elements.outlet.children.length < router.keys.length) return;

  // get the last correct ChatModule component
  // and the modules which will be removed
  const [lastModuleIndex, filteredModules] = filterChatModules();
  const lastModule = elements.outlet.children[lastModuleIndex];

  // console.log(lastModuleIndex, lastModule);
  // order matters to achieve a smooth scroll animation

  // make sure to update the appearance
  // set rejected / selected attributes
  animation.hideChatLinks(lastModule);
  lastModule.next = null;

  animation.scrollToPreviousModule(lastModule);
  animation.fadeFilteredChatModulesOut(filteredModules);
  await animation.fadeChatLinksIn(lastModule);

  // remove elements after animation
  for (const module of filteredModules) {
    module.remove();
  }
}

function filterChatModules() {
  let i = 0;

  while (i < router.keys.length) {
    const module = elements.outlet.children[i];

    // break if there's an incorrect section
    if (router.keys[i] !== module.key) break;

    i += 1;
  }

  return [i - 1, [...elements.outlet.children].slice(i)];
}
