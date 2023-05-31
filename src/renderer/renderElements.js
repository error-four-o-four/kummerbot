import router from '../router/router.js';
import elements from '../elements/elements.js';
import animation from './animation.js';
import { state } from './utils.js';

import { MODULE_TAG } from '../components/components.js';

export async function renderElementsDelayed() {
  if (state.initial) {
    // console.log('initial render');
  }

  const absoluteKeys = router.state.keys;

  for (let step = 0; step < absoluteKeys.length; step += 1) {
    // get prev, current and next key
    const relativeKeys = [step - 1, step, step + 1].map(
      (step) => absoluteKeys[step] || null
    );

    // check if there's a rendered ChatModule component
    // for the currently iterated part of the pathname (router.keys)
    // play animation if necessary
    const doContinue = await checkCurrentStep(step, relativeKeys[2]);

    if (doContinue) continue;

    // else create a new ChatModule component
    elements.header.setIndicatorPending();

    // @reminder
    // cloneNode() method of an element within a template does not call the constructor
    // it's necessary to call the constructor to make setters, getters and methods available
    const module = document.createElement(MODULE_TAG);

    // use moduleKey to fetch and store .html-file initially
    // render contents depending on route
    await module.render(relativeKeys);

    // @todo
    // if state.initial hide elements

    elements.outlet.append(module);
    elements.header.setIndicatorWaiting();

    // skip animation if it's not the last module
    if (module.next !== null) continue;

    await animation.fadeLastChatModuleIn(module);

    // @todo
    // module.contacts.length > 0
    // await promised contacts
    // set loading = false
  }
}

// @todo @refactor
async function checkCurrentStep(step, next) {
  const renderedModule = elements.outlet.children[step];

  if (!renderedModule) return false;

  const hasCorrectNextKey = renderedModule.next === next;
  const hasSubsequentModules = !!next;
  // wrong modules were removed in removeElemnts()
  // skip if module and nextKey exist
  if (hasSubsequentModules && hasCorrectNextKey) {
    return true;
  }

  // @doublecheck
  // make sure to update ChatLink appearance
  // should be obsolete
  if (hasSubsequentModules && !hasCorrectNextKey) {
    renderedModule.next = next;
    return true;
  }

  // next key of last existing module was set to null
  // animate last element
  // @todo && initialRender
  if (!hasSubsequentModules) {
    // await animation.fadeLastChatModuleIn(renderedModule);
    // await animation.fadeChatLinksIn(renderedModule);
    return true;
  }

  // @doublecheck
  // missed a case
  console.warn('missed a case in renderElments.js checkCurrentStep');
  return true;
}

export async function renderElementsImmediately() {
  // function isn't called in /chat route
  // outlet was cleared beforehand
  elements.header.setIndicatorPending();

  const module = document.createElement(MODULE_TAG);
  await module.render([null, router.state.keys[0], null]);

  elements.outlet.append(module);
  elements.header.setIndicatorWaiting();
  await animation.fadeLastChatModuleIn(module);
}
