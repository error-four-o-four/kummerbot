export const id = {
  pending: 'svg-message-pending',
  globe: 'svg-globe',
  about: 'svg-help-circle',
  back: 'svg-arrow-left-circle',
  reset: 'svg-circle-x',
  warn: 'svg-warn',
  link: 'svg-link',
  share: 'svg-share',
  message: 'svg-message',
  clipboardCopy: 'svg-clipboard-copy',
  clipboardCheck: 'svg-clipboard-check',
  clipboardX: 'svg-clipboard-x',
  mail: 'svg-mail',
  mailCheck: 'svg-mail-check',
  mailX: 'svg-mail-x',
  phone: 'svg-phone',
  send: 'svg-send',
};

const path = '/assets/symbols.svg';

const getSymbolPath = (id) => path + '#' + id;

export const useSymbol = (id) => `
<svg xmlns:xlink="http://www.w3.org/1999/xlink">
	<use xlink:href="${getSymbolPath(id)}"></use>
</svg>`;

export const setSymbolPath = (element, id) => {
  element.setAttribute('xlink:href', getSymbolPath(id));
};
