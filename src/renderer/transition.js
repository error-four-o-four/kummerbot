const scrollIntoViewOptions = {
  block: 'start',
  inline: 'nearest',
  behavior: 'smooth',
};

export function scrollSectionIntoView(section) {
  section.scrollIntoView(scrollIntoViewOptions);
}

// #####################################

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

function getAnimatedElements(section) {
  return [
    [...section.children].slice(0, -1),
    [...section.lastElementChild.children],
  ];
}

function rowsDelayReducer(result, row, i) {
  const prev = result[i - 1] || 0;
  result.push(prev + 3 * row.innerText.length);
  return result;
}

function linksDelayReducer(result, link, i) {
  result.push(i * 200);
  return result;
}

// @todo refactor
// thenable sequence
function playChainedAnimation(
  elements,
  keyframes,
  { duration, delays, easing }
) {
  const promises = elements.map((child, i) => {
    const options = {
      duration,
      delay: delays[i],
      easing,
    };
    const promise = animateTo(child, keyframes, options);

    promise.then(() => {
      child.classList.remove('is-transparent');
      child.removeAttribute('style');
    });
    return promise;
  });

  return promises.at(-1);
}

export async function playSectionFadeInAnimation(section) {
  const [rows, links] = getAnimatedElements(section);

  // instantely hide rows and links
  for (const row of rows) row.classList.add('is-transparent');
  for (const link of links) link.classList.add('is-transparent');

  const keyframeOptions = {
    duration: 300,
    delays: rows.reduce(rowsDelayReducer, []),
    easing: 'ease-out',
  };

  await playChainedAnimation(rows, keyframesBounceIn, keyframeOptions);

  keyframeOptions.duration = 200;
  keyframeOptions.delays = links.reduce(linksDelayReducer, []);

  await playChainedAnimation(links, keyframesFadeIn, keyframeOptions);
}
