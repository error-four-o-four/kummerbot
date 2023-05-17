import templates, { TMPL_ATTR } from '../../renderer/templates.js';
import router from '../../router/router.js';

export class ChatMessage extends HTMLElement {
  // inject templates
  // hanlde animation
  constructor() {
    super();

    // for (const attribute of Object.values(TMPL_ATTR).filter(
    //   // @todo rename TMPL_ATTR
    //   (attr) => attr !== TMPL_ATTR.LIST
    // )) {
    for (const attribute of [TMPL_ATTR.INFO]) {
      if (!this.hasAttribute(attribute)) continue;

      this.innerHTML = templates[attribute];
      break;
    }
  }

  connectedCallback() {
    if (this.hasAttribute(TMPL_ATTR.SHARE)) {
      const href = router.getHrefToViewPage();
      const anchor = this.querySelector('a');

      anchor.href = href;
      anchor.innerHTML = `${href}<svg><use href="#icon-share"></use></svg>`;
      anchor.classList.add('has-icon');
    }
  }
}
