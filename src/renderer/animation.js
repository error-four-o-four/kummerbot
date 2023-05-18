import elements from '../elements/elements.js';
import templates from './templates.js';

const { pending, waiting } = templates.text.indicator;

export function setIndicatorPending() {
  elements.header.span.innerText = pending;
  elements.header.elt.classList.add('pending');
}

export function setIndicatorWaiting() {
  elements.header.span.innerText = waiting;
  elements.header.elt.classList.remove('pending');
}

// #####################################

export function scrollToNextModule(element) {
  element.scrollIntoView({
    block: 'start',
    inline: 'nearest',
    behavior: 'smooth',
  });
}

export function scrollToPreviousModule(elements) {
  elements.scrollIntoView({
    block: 'end',
    inline: 'nearest',
    behavior: 'smooth',
  });
}

// #####################################

function animateTo(elt, keyframes, options, callback = null) {
  const animation = elt.animate(keyframes, {
    ...options,
    fill: 'forwards',
  });

  return new Promise((resolve) => {
    animation.addEventListener('finish', () => {
      if (elt.offsetParent !== null) {
        animation.commitStyles();
      }
      animation.cancel();
      callback && callback();
      resolve(animation);
    });
  });
}

const keyframesFadeIn = [
  {
    opacity: 0,
  },
  {
    opacity: 1,
  },
];

const keyframesFadeOut = [
  {
    opacity: 1,
  },
  {
    opacity: 0,
  },
];

const keyframesBounceIn = [
  {
    transform: 'scale(0.9)',
    opacity: 0,
  },
  {
    transform: 'scale(1.05)',
    opacity: 1,
  },
  {
    transform: 'scale(1)',
    opacity: 1,
  },
];

const keyframeOptions = { duration: 300, easing: 'ease-out' };

async function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function hideChatMessages(module) {
  for (const message of module.messages) {
    message.classList.add('is-transparent');
  }
}

export function hideChatLinks(module) {
  for (const link of module.links) {
    link.classList.add('is-transparent');
  }
}

async function fadeChatMessagesIn(module) {
  const onfinish = (message) => {
    message.classList.remove('is-transparent');
    message.removeAttribute('style');
  };

  const reducer = async (chain, message) => {
    await chain;
    await delay(5 * message.innerText.length);
    return animateTo(
      message,
      keyframesBounceIn,
      keyframeOptions,
      onfinish.bind(null, message)
    );
  };

  return module.messages.reduce(reducer, Promise.resolve());
}

export async function fadeChatLinksIn(module) {
  const onfinish = (link) => {
    link.classList.remove('is-transparent');
    link.removeAttribute('style');
  };

  const reducer = async (chain, link) => {
    await chain;
    return animateTo(
      link,
      keyframesFadeIn,
      keyframeOptions,
      onfinish.bind(null, link)
    );
  };
  return module.links.reduce(reducer, Promise.resolve());
}

export async function fadeLastChatModuleIn(module) {
  hideChatMessages(module);
  hideChatLinks(module);
  scrollToNextModule(module);

  await fadeChatMessagesIn(module);
  await fadeChatLinksIn(module);
}

export async function fadeChatModulesOut(modules) {
  const keyframeOptions = {
    // needs to be a bit longer than
    // scroll animation to make it smooth
    duration: 200,
    easing: 'ease-out',
  };

  const promises = modules.map((child) => {
    const promise = animateTo(child, keyframesFadeOut, keyframeOptions);

    promise.then(() => {
      child.classList.add('is-transparent');
      child.removeAttribute('style');
    });

    return promise;
  });

  await Promise.all(promises);
}