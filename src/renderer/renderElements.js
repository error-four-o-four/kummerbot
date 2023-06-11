import router from '../router/router.js';
import renderer from './renderer.js';
import animator from './animation/animator.js';

import errorController from '../controller/error-controller.js';

import { ROUTES } from '../router/config.js';
import { ERROR_KEY } from '../controller/error-controller.js';
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

    // @reminder
    // cloneNode() method of an element within a template does not call the constructor
    // it's necessary to call the constructor to make setters, getters and methods available
    const moduleElt = document.createElement(MODULE_TAG);

    // use moduleKey to fetch and store .html-file initially
    // render contents depending on route
    await moduleElt.render(relativeKeys);

    if (moduleElt.key === ERROR_KEY) {
      errorController.set('Morp');
      router.hasError = true;
      moduleElt.renderError(...relativeKeys);
    }

    renderer.outlet.append(moduleElt);

    // skip animation if it's not the last module
    if (moduleElt.next !== null) continue;

    animator.scrollToChatModule(moduleElt);

    if (router.isPopstateEvent) {
      await animator.pushChatModuleImmediately(moduleElt, signal);
    } else {
      await animator.pushChatModule(moduleElt, signal);
    }

    if (moduleElt.key === ERROR_KEY) break;
  }
}

function checkCurrentStep(step, next) {
  const renderedModule = renderer.outlet.children[step];

  if (!renderedModule) return false;

  if (!!next) {
    renderedModule.next = next;
    return true;
  }

  renderedModule.next = null;
  return true;
}

export async function renderElementsImmediately(signal) {
  // function isn't called in /chat route
  // outlet was cleared beforehand

  const moduleKey = renderer.getKeys()[0];
  const moduleElt = document.createElement(MODULE_TAG);
  await moduleElt.render([null, moduleKey, null]);

  // requested .html-file could not be fetched
  if (moduleElt.key === ERROR_KEY) {
    router.replace({ pathname: ROUTES.ERROR });
    moduleElt.renderError();
  }

  renderer.outlet.append(moduleElt);
  await animator.pushChatModuleImmediately(moduleElt, signal);
}
