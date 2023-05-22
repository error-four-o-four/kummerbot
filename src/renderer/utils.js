import elements from './elements.js';

// const supportsTouchEvents = () => window && "ontouchstart" in window;

const getDeviceType = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

export const isMobileDevice = getDeviceType();

export const state = {
  initial: true,
  transition: false,
};

export const clearOutlet = () => {
  elements.outlet.innerHTML = '';
};

export const createLoadingIndicator = () => {
  const indicator = document.createElement('span');
  indicator.id = 'page-loading-indicator';
  indicator.innerHTML = `<svg><use xlink:href="#message-pending"></use></svg>`;
  return indicator;
};

export const removeLoadingIndicator = () => {
  const indicator = document.getElementById('page-loading-indicator');
  indicator.remove();
};
