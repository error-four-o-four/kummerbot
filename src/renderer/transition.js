function animateTo(elt, keyframes, options) {
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
      resolve(animation);
    });
  });
}

export const scrollIntoViewOptions = {
  block: 'end',
  inline: 'nearest',
  behavior: 'smooth',
};

export function hideContent(elt) {
  elt.classList.add('is-transparent');
}

export function showContent(elt) {
  const keyframes = [
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

  const options = {
    duration: 300,
    easing: 'ease-out',
  };

  const promise = animateTo(elt, keyframes, options);
  promise.then(() => {
    elt.classList.remove('is-transparent');
    elt.removeAttribute('style');
  });

  return promise;
}

export function hideChoices(elt) {
  for (const child of elt.children) {
    child.classList.add('is-transparent');
  }
}

export function showChoices(elt) {
  const keyframes = [
    {
      opacity: 0,
    },
    {
      opacity: 1,
    },
  ];

  const promises = [...elt.children].map((child, i) => {
    const promise = animateTo(child, keyframes, {
      duration: 300,
      delay: i * 200,
      easing: 'ease-out',
    });

    // promise.then((p) => console.log(p.effect.target === child));
    promise.then(() => {
      child.classList.remove('is-transparent');
      child.removeAttribute('style');
    });

    return promise;
  });

  return promises.at(-1);
}
