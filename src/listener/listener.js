import renderer from '../renderer/renderer.js';
import router, { KEYS } from '../router/router.js';

function init() {
  window.addEventListener('popstate', (_) => {
    router.update();
    elements.update();
  });

  window.addEventListener('keypress', handleKeypress);
  window.addEventListener('click', handle);
}

function handleKeypress(e) {}

function handle(e) {
  if (
    e.target.localName === 'button' &&
    e.target.classList.contains('contact-button')
  ) {
    console.log('@todo', e.target);
  }

  e.preventDefault();
  console.log(e.target, router.isRouterLink(e.target));

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
