import { templates } from '../../renderer/templates.js';
import router, { KEYS } from '../../router/router.js';

import css from './style.css?inline';

const CUSTOM_ATTR = {
  REJECTED: 'rejected',
  SELECTED: 'selected',
  TARGET_KEY: 'target',
  TEXT: 'text',
};

const CUSTOM_TAG = 'chat-link';

const IDS = {
  sectionLink: 'section-link',
  targetLink: 'target-link',
};

const htmlStyle = `
<style>${css}</style>`;

const htmlWrap = `
<div>
  <a id="${IDS.sectionLink}">✖</a>
  <span><span>
</div>`;

const htmlLink = `
<a id="${IDS.targetLink}"></a>`;

const getType = (key) =>
  !Object.values(KEYS)
    .filter((key) => key !== KEYS.SHARE)
    .includes(key);

// special cases: root, back, view !!
// no need to render resetLinkWrap
// bc there will be no subsequent chat sections
const getTemplate = (type) => `${htmlStyle}${type ? htmlWrap : ''}${htmlLink}`;

// and attribute 'text' will not be set
// bc the text is defined in elements/templates.js
const getText = (type, elt) =>
  type && elt.keyOfTarget !== KEYS.SHARE
    ? elt.getAttribute(CUSTOM_ATTR.TEXT)
    : templates.text[elt.keyOfTarget];

export const getHref = (key) => {
  const hasSubsequentRoute = getType(key);
  const keyIndex = router.keys.indexOf(key);

  if (hasSubsequentRoute) {
    return '/' + router.keys.slice(0, keyIndex + 1).join('/');
  }

  if (key === KEYS.ROOT) {
    return router.routes[key];
  }

  if (key === KEYS.BACK) {
    return '/' + router.keys.slice(0, keyIndex).join('/');
  }

  // @todo case VIEW
};

export { CUSTOM_ATTR, CUSTOM_TAG, IDS, getType, getTemplate, getText };
