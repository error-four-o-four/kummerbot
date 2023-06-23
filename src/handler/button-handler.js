import { buttonClass as contactButtonClass } from '../components/contact-list/utils.js';

import contacts from '../data/contacts.js';
import { id, setSymbolPath, useSymbol } from '../elements/svgs.js';

export const buttonClass = {
  copy: 'button-copy-value',
  share: 'button-share-value',
};

export const buttonAttribute = {
  id: 'data-id',
};

const isCopyMailButton = (target) => {
  return (
    target.classList.contains(buttonClass.copy) &&
    target.classList.contains(contactButtonClass.mail)
  );
};

const isCopyShareUrlButton = (target) => {
  return (
    target.classList.contains(buttonClass.copy) &&
    !target.classList.contains(contactButtonClass.mail)
  );
};

const getCopyMailString = (target) => {
  // element is copy contact mail button
  const id = 1 * target.getAttribute(buttonAttribute.id);
  return contacts.find((contact) => contact._id === id)?.mail || null;
};

const isShareButton = (target) => {
  return target.classList.contains(buttonClass.share);
};

export default {
  click: async (e) => {
    if (e.target.localName !== 'button') return;

    const { target } = e;

    // console.log(target);

    if (isCopyShareUrlButton(target)) {
      const string = target.value;
      const copied = await copyData(string);

      const useElement = target.querySelector('use');
      const useId = copied ? id.clipboardCheck : id.clipboardX;
      setSymbolPath(useElement, useId);
      return;
    }

    if (isCopyMailButton(target)) {
      console.log(target);
      const string = getCopyMailString(target);
      const copied = string && (await copyData(string));

      document
        .querySelectorAll('.' + contactButtonClass.mail)
        .forEach((button) => {
          const useElement = button.previousElementSibling.children[0];
          useElement && setSymbolPath(useElement, id.clipboardCopy);
        });

      const useElement = target.previousElementSibling.children[0];
      const useId = copied ? id.clipboardCheck : id.clipboardX;

      useElement && setSymbolPath(useElement, useId);
      return;
    }

    if (isShareButton(target)) {
      const data = {
        title: 'KummerBot',
        text: 'a2Bs - anonymes Beratungs- und Beschwerdesystem',
        url: target.value,
      };
      navigator.share(data);
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
