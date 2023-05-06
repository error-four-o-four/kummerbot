import router, { isChatRoute } from '../router/router.js';

// @todo move to router ??
import { ATTR, VAL } from './config.js';
import { renderChat } from './render.chat.js';
import { renderPage } from './render.page.js';

async function update() {
  const route = router.validate();

  if (isChatRoute(route)) {
    renderChat();
    return;
  }

  renderPage();
}

export { ATTR, VAL };

export default {
  update,
};
