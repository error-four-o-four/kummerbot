import router, { isChatRoute } from '../router/router.js';

// @todo move to router ??
import { ATTR, VAL } from './config.js';
import { renderChat } from './render.chat.js';
import { renderView } from './render.view.js';

async function update() {
  const route = router.validate();

  if (isChatRoute(route)) {
    renderChat();
    return;
  }

  renderView();
}

export { ATTR, VAL };

export default {
  update,
};
