import './style/main.css';

(async () => {
  await import('./components/components.js');
  const router = (await import('./router/router.js')).default;
  const handler = (await import('./handler/handler.js')).default;
  const renderer = (await import('./renderer/renderer.js')).default;

  router.init();
  handler.init();

  renderer.update();
})();
