import router from '../router/router.js';
import elements from '../elements/elements.js';
import animation from './animation.js';

export async function removeAllEllements() {
  const modules = [...elements.outlet.children];

  if (modules.length === 0) return;

  modules[0] && animation.scrollToChatModule(modules[0]);
  await animation.fadeFilteredChatModulesOut(modules);

  elements.outlet.innerHTML = '';
}

export async function removeElements() {
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

  animation.scrollToChatModule(lastModule);
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
