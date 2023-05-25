import { CUSTOM_VAL } from './config.js';

export const html = {
  [CUSTOM_VAL.HOME]: 'Ich m&ouml;chte zur&uuml;ck zur Startseite',
  [CUSTOM_VAL.BACK]: 'Ich m&ouml;chte einen Schritt zur&uuml;ck',
  [CUSTOM_VAL.SHARE]: 'Ich m&ouml;chte diese Informationen teilen',
};

export const selector = {
  parentLink: 'parent-link',
  targetLink: 'target-link',
};

export const getParentLinkHtml = (text) => `
<div>
  <a class="${selector.parentLink}">✖</a>
  <span>${text}</span>
</div>`;

export const getTargetLinkHtml = (text) => `
<a class="${selector.targetLink}">${text}</a>`;
