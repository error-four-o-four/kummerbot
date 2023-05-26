import router from '../router/router.js';
import renderer from '../renderer/renderer.js';

// @todo use a default
let errorMessage = '';

export default {
  set(message) {
    errorMessage = message;
  },
  get() {
    return !!errorMessage ? errorMessage : null;
  },
};
