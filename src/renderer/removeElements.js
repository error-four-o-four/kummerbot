import renderer from './renderer.js';
import animator from './animation/animator.js';

export async function removeAllEllements(signal) {
  const modules = [...renderer.outlet.children];

  if (modules.length === 0) return;

  // console.log(modules[0], modules);

  // @todo scroll to top
  modules[0] && animator.scrollToChatModule(modules[0]);
  // @todo check modules
  await animator.popAllChatModules(modules, signal);

  renderer.outlet.innerHTML = '';
}

export async function removeElements(signal) {
  const absoluteKeys = renderer.getKeys();
  // remove incorrect elements
  // when back or reset button was clicked
  // router.keys.length will always be greater than 0
  // if this conitidion is fullfilled
  // elements.outlet.children.length will always be greater than 1
  if (renderer.outlet.children.length < absoluteKeys.length) return;

  // get the last correct ChatModule component
  // and the modules which will be removed
  const [lastModuleIndex, filteredModuleElts] = filterChatModules(absoluteKeys);
  const lastModuleElt = renderer.outlet.children[lastModuleIndex];

  // order matters to achieve a smooth scroll animation
  // @todo add scroll event listener ?!?!
  // bc there's no way to adjust scroll duration / timing
  animator.scrollToChatModule(lastModuleElt);
  await animator.popChatModule(filteredModuleElts, lastModuleElt, signal);
}

function filterChatModules(absoluteKeys) {
  let i = 0;

  while (i < absoluteKeys.length) {
    const moduleElt = renderer.outlet.children[i];

    // break if there's an incorrect section
    if (absoluteKeys[i] !== moduleElt.key) break;

    i += 1;
  }

  return [i - 1, [...renderer.outlet.children].slice(i)];
}
