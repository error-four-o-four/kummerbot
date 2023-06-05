import { LIST_TAG, MESSAGE_TAG } from '../../components/components.js';

import utils, { delay } from './utils.js';

export default {
  active: false,
  scrollToChatModule,
  popChatModule,
  popAllChatModules,
  pushChatModule,
  pushChatModuleImmediately,
};

function scrollToChatModule(element) {
  element.scrollIntoView({
    block: 'start',
    inline: 'nearest',
    behavior: 'smooth',
  });
}

// /chat route pushed #########################

const activeAnimations = [];

function pushChatModule(component, interrupt) {
  return new Promise(async (resolve) => {
    if (interrupt) {
      console.log(
        `interrupted ${activeAnimations.length} animation${
          activeAnimations.length > 1 ? 's' : ''
        }`
      );
      utils.finishAllAnimations(activeAnimations);
      activeAnimations.length = 0;
    }

    utils.hideAllChildren(component);

    for (const element of component.children) {
      if (element.localName === MESSAGE_TAG) {
        activeAnimations.push(utils.createBounceInAnimation(element));
        continue;
      }
      activeAnimations.push(utils.createFadeInAnimation(element));
    }

    await playDelayedChainedAnimations(activeAnimations);

    activeAnimations.length = 0;
    resolve();
  });
}

function playDelayedChainedAnimations(animations) {
  const reducer = async (chain, animation) => {
    await chain;

    const element = animation.effect.target;

    if (element.localName === MESSAGE_TAG) {
      element.pending = true;
      await delay(5 * element.innerText.length);
      element.pending = false;
    }

    if (element.localName === LIST_TAG) {
      element.pending = true;
      await delay(200);
      element.pending = false;
    }

    return utils.promiseAnimation(animation);
  };

  return animations.reduce(reducer, Promise.resolve());
}

function pushChatModuleImmediately(component, interrupt) {
  return new Promise(async (resolve) => {
    if (interrupt) {
      utils.finishAllAnimations(activeAnimations);
      activeAnimations.length = 0;
    }

    utils.hideAllChildren(component);

    for (const element of component.children) {
      if (element.localName === MESSAGE_TAG) {
        activeAnimations.push(utils.createBounceInAnimation(element));
        continue;
      }
      activeAnimations.push(utils.createFadeInAnimation(element));
    }

    await playChainedAnimations(activeAnimations);

    activeAnimations.length = 0;
    resolve();
  });
}

// /chat route popped #####################

function popChatModule(filteredComponents, lastComponent, interrupt) {
  return new Promise(async (resolve) => {
    if (interrupt) {
      utils.finishAllAnimations(activeAnimations);
      activeAnimations.length = 0;
    }

    const links = lastComponent.links;
    const link = links.filter((link) => link.selected)[0];
    // fade selected link out animation is slightly longer
    // than fade modules out animation
    const fadeOutAnimations = [];

    filteredComponents.forEach((component) =>
      fadeOutAnimations.push(
        utils.createFadeOutAnimation(component, 300, () => component.remove())
      )
    );
    fadeOutAnimations.push(utils.createFadeOutAnimation(link, 400));

    const fadeInAnimations = links.map((link) =>
      utils.createFadeInAnimation(link)
    );

    activeAnimations.push(...fadeOutAnimations, ...fadeInAnimations);

    await playAnimations(fadeOutAnimations);
    utils.hideLinks(lastComponent);
    lastComponent.next = null;
    await playChainedAnimations(fadeInAnimations);
    activeAnimations.length = 0;
    resolve();
  });
}

// @todo dry !
function popAllChatModules(components, interrupt) {
  return new Promise(async (resolve) => {
    if (interrupt) {
      utils.finishAllAnimations(activeAnimations);
      activeAnimations.length = 0;
    }

    components.forEach((component) =>
      activeAnimations.push(
        utils.createFadeOutAnimation(component, 300, () => component.remove())
      )
    );

    await playAnimations(activeAnimations);
    activeAnimations.length = 0;
    resolve();
  });
}

function playAnimations(animations) {
  return Promise.all(
    animations.map((animation) => utils.promiseAnimation(animation))
  );
}

async function playChainedAnimations(animations) {
  const reducer = async (chain, animation) => {
    await chain;

    const element = animation.effect.target;

    if (element.localName === LIST_TAG) {
      element.pending = true;
      await delay(200);
      element.pending = false;
    }

    return utils.promiseAnimation(animation);
  };
  return animations.reduce(reducer, Promise.resolve());
}
