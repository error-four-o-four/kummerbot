import renderer from '../renderer/renderer.js';
import router from '../router/router.js';
import { ATTR } from '../elements/elements.js';

function init() {
  window.addEventListener('popstate', (_) => {
    router.update();
    renderer.update();
  });

  window.addEventListener('click', (e) => {
    const { target } = e;

    if (target.tagName !== 'A') return;

    if (target.hasAttribute(ATTR.ROUTE)) {
      router.handle(e);
      renderer.update();

      // if (value === KEYS.SHARE) {
      //   // navigator.canShare()
      //   // clipBoard etc
      //   return;
      // }
    }
  });
}

export default {
  init,
};
