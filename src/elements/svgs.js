export const id = {
  pending: 'message-pending',
  globe: 'globe',
  about: 'help-circle',
  back: 'arrow-left-circle',
  reset: 'circle-x',
  warn: 'warn',
  link: 'link',
  share: 'share',
  message: 'message',
  clipboardCopy: 'clipboard-copy',
  clipboardCheck: 'clipboard-check',
  clipboardX: 'clipboard-x',
  mail: 'mail',
  mailCheck: 'mail-check',
  mailX: 'mail-x',
  phone: 'phone',
  send: 'send',
};

export const useSymbol = (id) => `
<svg xmlns:xlink="http://www.w3.org/1999/xlink">
	<use xlink:href="/assets/symbols.svg#svg-${id}"></use>
</svg>`;
