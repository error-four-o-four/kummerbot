import { CUSTOM_VAL } from './config.js';

export const html = {
  [CUSTOM_VAL.HOME]: 'Ich m&ouml;chte zur&uuml;ck zur Startseite',
  [CUSTOM_VAL.BACK]: 'Ich m&ouml;chte einen Schritt zur&uuml;ck',
  [CUSTOM_VAL.SHARE]: 'Ich m&ouml;chte diese Informationen teilen',
};

export const anchorClass = {
  toParent: 'parent-link',
  toTarget: 'target-link',
  routed: 'is-routed',
};

export const getParentLinkHtml = (text) => `
<div>
  <a class="${anchorClass.routed} ${anchorClass.toParent}">✖</a>
  <span>${text}</span>
</div>`;

export const getTargetLinkHtml = (text) => `
<a class="${anchorClass.routed} ${anchorClass.toTarget}">${text}</a>`;
