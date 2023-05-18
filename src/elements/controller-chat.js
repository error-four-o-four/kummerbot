import router, { KEYS } from '../router/router.js';
import renderer from '../renderer/renderer.js';

import elements from './elements.js';

import {
  scrollToNextModule,
  scrollToPreviousModule,
  fadeLastChatModuleIn,
  fadeChatModulesOut,
  setIndicatorPending,
  setIndicatorWaiting,
  fadeChatLinksIn,
  hideChatLinks,
} from '../renderer/animation.js';

// #############################
// @todo on first render
// @todo hide app
// @todo show app when last element was rendered
// improves UX

// called onpopstate/onpushstate via elements.update()
export async function updateChatElements() {
  // remove incorrect elements
  // when back or reset button was clicked
  // router.keys.length will always be greater than 0
  // if this conitidion is fullfilled
  // elements.outlet.children.length will always be greater than 1
  if (elements.outlet.children.length > router.keys.length) {
    // get the last correct ChatModule component
    // and the modules which will be removed
    const [lastModuleIndex, filteredModules] = filterChatModules();
    const lastModule = elements.outlet.children[lastModuleIndex];

    // order matters to achieve a smooth scroll animation

    // make sure to update the appearance
    // set rejected / selected attributes
    hideChatLinks(lastModule);
    lastModule.next = null;

    scrollToPreviousModule(lastModule);
    fadeChatModulesOut(filteredModules);
    await fadeChatLinksIn(lastModule);

    // remove elements after animation
    for (const module of filteredModules) {
      module.remove();
    }
  }

  if (renderer.initial) {
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

    // if there are subsequent modules
    if (!!renderedModule && keys[2] !== null) {
      // update ChatLink components
      // at ChatModule.attributedChangedCallback()
      // skip animation
      // @todo renderer.initial
      renderedModule.next = keys[2];
      continue;
    }

    if (!!renderedModule && keys[2] === null) {
      // was cleared in removeChatModules
      continue;
    }

    setIndicatorPending();

    // if there isn't a rendered module
    // create a new one
    // fetch data and cache contents
    const { error, module } = await renderer.createChatModule(keys);

    if (error) {
      elements.outlet.append(module);
      // @todo animation
      scrollToNextModule(module);
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

    await fadeLastChatModuleIn(module);
    setIndicatorWaiting();
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
