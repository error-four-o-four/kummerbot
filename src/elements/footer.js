const element = document.querySelector('footer');

const attributes = {
  visbile: 'visible',
  hidden: 'aria-hidden',
};

export default {
  element,
  show() {
    // css styles
    element.removeAttribute(attributes.hidden);
    element.setAttribute(attributes.visbile, true);
  },
  hide() {
    return new Promise((resolve) => {
      const onend = () => {
        element.removeEventListener('transitionend', onend);
        resolve();
      };

      element.addEventListener('transitionend', onend);
      element.removeAttribute(attributes.visbile);
      element.setAttribute(attributes.hidden, true);
    });
    // css styles
  },
};
