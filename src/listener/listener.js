import router from '../router/router.js';
import renderer, { ATTR } from '../renderer/renderer.js';

function init() {
  window.onpopstate = () => {
    router.update();
    renderer.update();
  };

  window.addEventListener('click', (e) => {
    const { target } = e;

    if (target.tagName !== 'A') return;

    if (!target.hasAttribute(ATTR.ROUTE)) return;

    router.handle(e);
    renderer.update();
  });
}

export default {
  init,
};
