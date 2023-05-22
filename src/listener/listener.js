import renderer from '../renderer/renderer.js';
import { state } from '../renderer/utils.js';

import router from '../router/router.js';

function init() {
  window.addEventListener('popstate', (e) => {
    // @todo
    // console.log('animating:', state.transition);
    // abort all animations
    if (state.transition) {
      e.preventDefault();
      return;
    }

    router.update();
    renderer.update();
  });

  window.addEventListener('keypress', handleKeypress);
  window.addEventListener('click', handle);
}

function handleKeypress(e) {}

function handle(e) {
  if (
    e.target.localName === 'button' &&
    e.target.classList.contains('btn-copy')
  ) {
    console.log('@todo', e.target);
  }

  if (
    e.target.localName === 'button' &&
    e.target.classList.contains('btn-share')
  ) {
    console.log('@todo', e.target);
  }

  // e.preventDefault();
  // console.log('clicked', router.isRouterLink(e.target));

  if (router.isRouterLink(e.target)) {
    //   if (key === KEYS.SHARE) {
    //     console.log(navigator.canShare);
    //     // clipBoard etc
    //     return;
    //   }

    router.handle(e);
    renderer.update();

    if (e.target.classList.contains('contact-message')) {
    }
  }
}

// @todo
// button.addEventListener('click', (e) => {
//   const input = document.createElement('input');
//   input.style.display = 'none';
//   document.body.appendChild(input);
//   input.value = text;
//   input.focus();
//   input.select();
//   const result = document.execCommand('copy');
//   if (result === 'unsuccessful') {
//     console.error('Failed to copy text.');
//   }
//   input.remove();
// });

// async function writeToClipboard(data) {
//   if(typeof ClipboardItem && navigator.clipboard.write) {
//     // https://developer.apple.com/forums/thread/691873
//     const text = new ClipboardItem({
//     "text/plain": fetch(someUrl)
//       .then(response => response.text())
//       .then(text => new Blob([text], { type: "text/plain" }))
//     })
//     navigator.clipboard.write([text])
//   }
//   else {
//     navigator.clipboard.writeText(data)
//   }
// }

export default {
  init,
};
