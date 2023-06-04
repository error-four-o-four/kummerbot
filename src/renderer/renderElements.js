import elements from '../elements/elements.js';
import renderer from './renderer.js';
import animator from './animation/animator.js';

import { MODULE_TAG } from '../components/components.js';

export async function renderElementsDelayed(signal) {
  const absoluteKeys = renderer.getKeys();

  for (let step = 0; step < absoluteKeys.length; step += 1) {
    // get prev, current and next key
    const relativeKeys = [step - 1, step, step + 1].map(
      (step) => absoluteKeys[step] || null
    );

    // check if there's a rendered ChatModule component
    // for the currently iterated part of the pathname (router.keys)
    // play animation if necessary

    const doContinue = checkCurrentStep(step, relativeKeys[2]);

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

    elements.outlet.append(module);
    elements.header.setIndicatorWaiting();

    // skip animation if it's not the last module
    if (module.next !== null || relativeKeys[2] !== null) continue;

    animator.scrollToChatModule(module);
    await animator.pushChatModule(module, signal);
  }
}

// @todo @refactor
function checkCurrentStep(step, next) {
  const renderedModule = elements.outlet.children[step];

  if (!renderedModule) return false;

  if (!!next) {
    renderedModule.next = next;
    return true;
  }

  // @doublecheck
  // missed a case
  console.warn('missed a case in renderElments.js checkCurrentStep');
  return true;
}

export async function renderElementsImmediately(signal) {
  // function isn't called in /chat route
  // outlet was cleared beforehand
  elements.header.setIndicatorPending();

  const moduleKey = renderer.getKeys()[0];
  const module = document.createElement(MODULE_TAG);
  await module.render([null, moduleKey, null]);

  elements.outlet.append(module);
  elements.header.setIndicatorWaiting();
  await animator.pushChatModuleImmediately(module, signal);
}
