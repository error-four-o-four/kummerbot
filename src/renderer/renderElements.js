import router from '../router/router.js';

import { MODULE_TAG } from '../components/chat-module/index.js';

import animation from './animation.js';
import elements from '../elements/elements.js';

import { state, createLoadingIndicator } from './utils.js';

export async function renderElements() {
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
    // play animation if necessary
    const doContinue = await checkCurrentStep(step, keys[2]);

    if (doContinue) continue;

    // else create a new ChatModule component
    elements.header.setIndicatorPending();

    // if there isn't a rendered module
    // create a new one
    // fetch data and cache contents
    // get data with current key of the module
    const module = document.createElement(MODULE_TAG);
    // updates elements
    // when module was cloned from cache
    // and prev route wasn't the same
    await module.render(keys);

    // @todo @consider ??
    // insertLinks etc here!
    // module.update()

    if (module.key === 'error') {
      elements.outlet.append(module);
      // @todo animation
      // @todo error template
      // when error module has ChatLinks
      animation.scrollToChatModule(module);
      break;
    }

    elements.outlet.append(module);

    // @todo
    // if state.initial hide elements

    // skip animation if it's not the last module
    if (module.next !== null) continue;

    await animation.fadeLastChatModuleIn(module);
    elements.header.setIndicatorWaiting();
  }
}

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

export async function renderElementDirectly() {
  // outlet was cleared beforehand
  elements.outlet.append(createLoadingIndicator());

  elements.header.setIndicatorPending();

  // if there isn't a rendered module
  // create a new one
  // fetch data and cache contents
  // get data with current key of the module
  const module = document.createElement(MODULE_TAG);
  await module.render([null, router.keys[0], null]);

  // @todo @consider ??
  // insertLinks etc here!
  // module.update()

  if (module.key === 'error') {
    elements.outlet.append(module);
    return;
  }

  elements.outlet.innerHTML = '';
  elements.outlet.append(module);

  // await animation.fadeLastChatModuleIn(module);
  elements.header.setIndicatorWaiting();
}
