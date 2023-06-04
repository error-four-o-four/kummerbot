// opacity: 0
const isTransparentClass = 'is-transparent';

const fadeInKeyframes = [
  {
    opacity: 0,
  },
  {
    opacity: 1,
  },
];

const fadeOutKeyframes = [
  {
    opacity: 1,
  },
  {
    opacity: 0,
  },
];

const bounceInKeyframes = [
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

const easing = 'ease-out';

const fadeInOptions = {
  duration: 150,
  easing,
};

const bounceInOptions = {
  duration: 300,
  easing,
};

export default {
  isTransparentClass,
  easing,
  fadeInKeyframes,
  fadeInOptions,
  fadeOutKeyframes,
  bounceInKeyframes,
  bounceInOptions,
};
