export const buttonClass = {
  copy: 'button-copy-value',
  share: 'button-share-value',
};

const isCopyButton = (target) => {
  return target.classList.contains(buttonClass.copy);
};

const isShareButton = (target) => {
  return target.classList.contains(buttonClass.share);
};

export default {
  click: async (e) => {
    if (e.target.localName !== 'button') return;

    const { target } = e;

    if (isCopyButton(target)) {
      const text = target.value;
      const copied = await copyData(text);

      document
        .querySelectorAll('.' + buttonClass.copy)
        .forEach((button) => button.classList.remove('success'));

      target.classList.add(copied ? 'success' : 'error');

      return;
    }

    if (isShareButton(target)) {
      console.log('@todo', target);
      return;
    }
  },
};

async function copyData(string) {
  if (!navigator.clipboard.writeText) return false;

  try {
    await navigator.clipboard.writeText(string);
    return true;
  } catch (error) {
    console.warn(error);
    return false;
  }
}

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

async function shareData() {}
