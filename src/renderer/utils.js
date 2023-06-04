// const supportsTouchEvents = () => window && "ontouchstart" in window;

const getDeviceType = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

// @todo renderer property
export const isMobileDevice = getDeviceType();

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
