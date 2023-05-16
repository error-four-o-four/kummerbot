import { KEYS } from '../../router/router.js';
import css from './style.css?inline';

export const CUSTOM_ATTR = {
  REJECTED: 'rejected',
  SELECTED: 'selected',
  TARGET_KEY: 'target',
  TEXT: 'text',
};

export const CUSTOM_TAG = 'chat-link';

export const IDS = {
  parentLink: 'parent-link',
  targetLink: 'target-link',
};

const getParentLinkHtml = (text) => `
<div>
<a id="${IDS.parentLink}">✖</a>
<span>${text}<span>
</div>`;

const getTargetLinkHtml = (text) => `
<a id="${IDS.targetLink}">${text}</a>
`;

export function createTemplate(key, text) {
  const template = document.createElement('template');
  template.innerHTML = `<style>${css}</style>`;

  // special cases: root, back, code !!
  // no need to render link to parent
  // bc there will be no subsequent chat modules
  if (![KEYS.ROOT, KEYS.BACK].includes(key)) {
    template.innerHTML += getParentLinkHtml(text);
  }
  template.innerHTML += getTargetLinkHtml(text);

  return template;
}
