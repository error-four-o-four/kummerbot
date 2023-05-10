import renderer from '../renderer/renderer.js';
import router, { KEYS } from '../router/router.js';
import { ATTR } from '../elements/elements.js';

function init() {
  window.addEventListener('popstate', (_) => {
    router.update();
    renderer.update();
  });

  window.addEventListener('click', (e) => {
    const key = e.target.getAttribute(ATTR.ROUTE);

    if (key === null) return;

    if (
      key !== KEYS.RESET &&
      e.target.parentElement.classList.contains('is-choice')
    )
      return;

    router.handle(e);

    if (key === KEYS.SHARE) {
      console.log(navigator.canShare);
      // clipBoard etc
      return;
    }

    // already called via history back
    // which emits a popstate event
    if (key !== KEYS.BACK) {
      renderer.update();
    }
  });
}

export default {
  init,
};
