import { CUSTOM_VAL } from './config.js';
import { id, useSymbol } from '../../elements/svgs.js';

export const html = {
  [CUSTOM_VAL.HOME]: 'Ich m&ouml;chte zur&uuml;ck zur Startseite',
  [CUSTOM_VAL.BACK]: 'Ich m&ouml;chte einen Schritt zur&uuml;ck',
  [CUSTOM_VAL.SHARE]: 'Ich m&ouml;chte diese Informationen teilen',
};

export const anchorClass = {
  toParent: 'parent-link',
  toTarget: 'target-link',
  routed: 'is-routed',
  icon: 'has-icon',
  iconBefore: 'has-icon-before',
};

export const getParentLinkHtml = (text) => `
<div>
  <a class="${anchorClass.routed} ${anchorClass.toParent}"></a>
  ${useSymbol(id.reset)}
  <span>${text}</span>
</div>`;

export const getTargetLinkHtml = (text) => `
<a class="${anchorClass.routed} ${anchorClass.toTarget}">${text}</a>`;
