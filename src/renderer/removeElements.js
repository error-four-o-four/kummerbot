import renderer from './renderer.js';
import elements from '../elements/elements.js';
import animator from './animation/animator.js';

export async function removeAllEllements(signal) {
  const modules = [...elements.outlet.children];

  if (modules.length === 0) return;

  modules[0] && animator.scrollToChatModule(modules[0]);
  await animator.popAllChatModules(modules, signal);

  elements.outlet.innerHTML = '';
}

export async function removeElements(signal) {
  const absoluteKeys = renderer.getKeys();
  // remove incorrect elements
  // when back or reset button was clicked
  // router.keys.length will always be greater than 0
  // if this conitidion is fullfilled
  // elements.outlet.children.length will always be greater than 1
  if (elements.outlet.children.length < absoluteKeys.length) return;

  // get the last correct ChatModule component
  // and the modules which will be removed
  const [lastModuleIndex, filteredModules] = filterChatModules(absoluteKeys);
  const lastModule = elements.outlet.children[lastModuleIndex];

  // order matters to achieve a smooth scroll animation
  // @todo add scroll event listener ?!?!
  // bc there's no way to adjust scroll duration / timing
  animator.scrollToChatModule(lastModule);
  await animator.popChatModule(filteredModules, lastModule, signal);
}

function filterChatModules(absoluteKeys) {
  let i = 0;

  while (i < absoluteKeys.length) {
    const module = elements.outlet.children[i];

    // break if there's an incorrect section
    if (absoluteKeys[i] !== module.key) break;

    i += 1;
  }

  return [i - 1, [...elements.outlet.children].slice(i)];
}
