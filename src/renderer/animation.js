function scrollToNextModule(element) {
  element.scrollIntoView({
    block: 'start',
    inline: 'nearest',
    behavior: 'smooth',
  });
}

function scrollToPreviousModule(elements) {
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

function hideChatLinks(module) {
  for (const link of module.links) {
    link.classList.add('is-transparent');
  }
}

function onFadeInFinished(element) {
  element.classList.remove('is-transparent');
  element.removeAttribute('style');
}

async function fadeChatMessagesIn(module) {
  const reducer = async (chain, message) => {
    await chain;
    message.pending = true;
    await delay(6 * message.innerText.length);
    message.pending = false;
    return animateTo(
      message,
      keyframesBounceIn,
      keyframeOptions,
      onFadeInFinished.bind(null, message)
    );
  };

  return module.messages.reduce(reducer, Promise.resolve());
}

async function fadeChatLinksIn(module) {
  const reducer = async (chain, link) => {
    await chain;
    return animateTo(
      link,
      keyframesFadeIn,
      keyframeOptions,
      onFadeInFinished.bind(null, link)
    );
  };
  return module.links.reduce(reducer, Promise.resolve());
}

async function fadeLastChatModuleIn(module) {
  hideChatMessages(module);
  hideChatLinks(module);
  scrollToNextModule(module);

  await fadeChatMessagesIn(module);
  await fadeChatLinksIn(module);
}

async function fadeFilteredChatModulesOut(modules) {
  const keyframeOptions = {
    // needs to be a bit longer than
    // scroll animation to make it smooth
    duration: 200,
    easing: 'ease-out',
  };

  await Promise.all(
    modules.map((module) =>
      animateTo(
        module,
        keyframesFadeOut,
        keyframeOptions,
        onFadeInFinished.bind(null, module)
      )
    )
  );
}

export default {
  scrollToNextModule,
  scrollToPreviousModule,
  hideChatLinks,
  fadeChatLinksIn,
  fadeLastChatModuleIn,
  fadeFilteredChatModulesOut,
};
