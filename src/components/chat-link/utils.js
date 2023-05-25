// used as ChatLink 'target' attribute value
// to determine which will be the next module
export const TARGET_VAL = {
  HOME: 'home',
  SHARE: 'share',
  BACK: 'back',
};

export const CUSTOM_ATTR = {
  REJECTED: 'rejected',
  SELECTED: 'selected',
  TARGET_KEY: 'target',
};

export const selector = {
  parentLink: 'parent-link',
  targetLink: 'target-link',
};

export const html = {
  [TARGET_VAL.HOME]: 'Ich m&ouml;chte zur&uuml;ck zur Startseite',
  [TARGET_VAL.BACK]: 'Ich m&ouml;chte einen Schritt zur&uuml;ck',
  [TARGET_VAL.SHARE]: 'Ich m&ouml;chte diese Informationen teilen',
};

export const getParentLinkHtml = (text) => `
<div>
  <a class="${selector.parentLink}">✖</a>
  <span>${text}</span>
</div>`;

export const getTargetLinkHtml = (text) => `
<a class="${selector.targetLink}">${text}</a>`;
