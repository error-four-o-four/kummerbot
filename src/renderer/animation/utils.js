import config from './config.js';

// @todo => utils.js
export async function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const hideAllChildren = (component) => {
  component.messages.forEach((message) =>
    message.classList.add(config.isTransparentClass)
  );
  component.list && component.list.classList.add(config.isTransparentClass);
  component.links.forEach((link) =>
    link.classList.add(config.isTransparentClass)
  );
};

const hideLinks = (component) => {
  component.links.forEach((link) =>
    link.classList.add(config.isTransparentClass)
  );
};

const createAnimation = (elt, keyframes, options, callback = null) => {
  const animation = elt.animate(keyframes, {
    ...options,
    fill: 'forwards',
  });

  animation.addEventListener('finish', () => {
    if (elt.offsetParent !== null) {
      animation.commitStyles();
    }
    animation.cancel();
    callback && callback();
  });

  return animation;
};

const promiseAnimation = (animation) => {
  return new Promise((resolve) => {
    animation.onfinish = resolve;
    animation.play();
  });
};

const finishAnimationIn = (element) => {
  element.classList.remove(config.isTransparentClass);
  element.removeAttribute('style');
};

const createBounceInAnimation = (element) => {
  const animation = createAnimation(
    element,
    config.bounceInKeyframes,
    config.bounceInOptions,
    finishAnimationIn.bind(null, element)
  );
  animation.cancel();
  return animation;
};

const createFadeInAnimation = (element) => {
  const animation = createAnimation(
    element,
    config.fadeInKeyframes,
    config.fadeInOptions,
    finishAnimationIn.bind(null, element)
  );
  animation.cancel();
  return animation;
};

const finishAnimationOut = (element) => {
  element.classList.add(config.isTransparentClass);
  element.removeAttribute('style');
};

const createFadeOutAnimation = (element, duration, callback) => {
  const onfinish = (element) => {
    finishAnimationOut(element);
    callback && callback(element);
  };

  const animation = createAnimation(
    element,
    config.fadeOutKeyframes,
    {
      easing: config.easing,
      duration,
    },
    onfinish.bind(null, element)
  );

  animation.cancel();
  return animation;
};

const finishAllAnimations = (animations) =>
  animations.forEach((animation) => animation.finish());

export default {
  hideAllChildren,
  hideLinks,
  createFadeInAnimation,
  createFadeOutAnimation,
  createBounceInAnimation,
  promiseAnimation,
  finishAllAnimations,
};
