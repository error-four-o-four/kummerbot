// @todo use a default
let errorMessage = '';

export const ERROR_KEY = 'error';

export default {
  set(message) {
    errorMessage = message;
  },
  get() {
    if (!errorMessage) return null;

    const message = errorMessage;
    errorMessage = null;

    return message;
  },
};
