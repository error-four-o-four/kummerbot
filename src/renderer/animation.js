import elements from '../elements/elements.js';
import templates from './templates.js';

export function toggleLoadingIndicator() {
  const header = elements.header.elt;
  const element = elements.header.span;
  const { pending, waiting } = templates.text.indicator;
  const isWaiting = element.innerText === waiting;

  if (isWaiting) {
    element.innerText = pending;
    header.classList.add('pending');
    return;
  }

  element.innerText = waiting;
  header.classList.remove('pending');
}

// #####################################

export function setFixedHeight(element) {
  element.style.height = element.scrollHeight + 'px';
}

// remove fixed height when next section was appended
export function removeFixedHeight(element) {
  element.removeAttribute('style');
}

// #####################################

export function scrollNextSectionIntoView(section) {
  section.scrollIntoView({
    block: 'start',
    inline: 'nearest',
    behavior: 'smooth',
  });
}

export function scrollToPreviousModule(section) {
  section.scrollIntoView({
    block: 'end',
    inline: 'nearest',
    behavior: 'smooth',
  });
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
  result.push(prev + 5 * row.innerText.length);
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

export async function playSectionsFadeOutAnimation(sections) {
  const keyframeOptions = {
    // needs to be a bit longer than
    // scroll animation to make it smooth
    duration: 350,
    easing: 'ease-out',
  };

  const promises = sections.map((child) => {
    const promise = animateTo(child, keyframesFadeOut, keyframeOptions);

    promise.then(() => {
      child.classList.add('is-transparent');
      child.removeAttribute('style');
    });

    return promise;
  });

  return new Promise((res) => {
    Promise.all(promises).then(() => res());
  });
}
