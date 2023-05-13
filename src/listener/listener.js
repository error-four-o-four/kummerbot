import renderer from '../renderer/renderer.js';
import router, { KEYS } from '../router/router.js';

function init() {
  window.addEventListener('popstate', (_) => {
    router.update();
    renderer.update();
  });

  window.addEventListener('keypress', handleKeypress);
  window.addEventListener('click', handle);
}

function handleKeypress(e) {}

function handle(e) {
  if (router.isRouterLink(e.target)) {
    const prevRoute = router.path;

    //   if (key === KEYS.SHARE) {
    //     console.log(navigator.canShare);
    //     // clipBoard etc
    //     return;
    //   }

    router.handle(e);
    renderer.update(prevRoute);
  }
}

export default {
  init,
};
