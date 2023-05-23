import { btnSelector as contactBtnSelector } from '../components/contact-item/utils.js';
import formHandler from './form-handler.js';

export function handleButtonEvents(e) {
  if (e.target.classList.contains('btn-copy')) {
    console.log('@todo', e.target);
    return;
  }

  if (e.target.classList.contains('btn-share')) {
    console.log('@todo', e.target);
    return;
  }

  if (e.target.classList.contains(contactBtnSelector.message)) {
    formHandler.email = e.target.getAttribute('value');
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
