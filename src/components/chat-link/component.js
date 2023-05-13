import { ATTR } from '../../elements/elements.js';

import {
  CUSTOM_ATTR,
  IDS,
  getType,
  getTemplate,
  getText,
  getHref,
} from './config.js';

const { REJECTED, SELECTED, TARGET_KEY } = CUSTOM_ATTR;

export class ChatLink extends HTMLElement {
  constructor() {
    super();

    // set on connected Callback
    this.parentSection = null;
    this.keyOfSection = null;
    this.linktToSection = null;

    this.keyOfTarget = null;
    this.linkToTarget = null;

    this.attachShadow({ mode: 'open' });
  }

  get selected() {
    return this.hasAttribute(SELECTED);
  }

  set selected(value) {
    if (!value) {
      this.removeAttribute(SELECTED);
      return;
    }
    this.setAttribute(SELECTED, SELECTED);
  }

  get rejected() {
    return this.hasAttribute(REJECTED);
  }

  set rejected(value) {
    if (!value) {
      this.removeAttribute(REJECTED);
      return;
    }
    this.setAttribute(REJECTED, REJECTED);
  }

  get href() {
    return this.selected ? this.linktToSection.href : this.linkToTarget.href;
  }

  connectedCallback() {
    this.keyOfTarget = this.getAttribute(TARGET_KEY);

    const hasSubsequentRoute = getType(this.keyOfTarget);
    const template = document.createElement('template');
    template.innerHTML = getTemplate(hasSubsequentRoute);

    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.parentSection =
      this.parentElement.parentElement ||
      this.shadowRoot.host.closest('section');
    this.keyOfSection = this.parentSection.getAttribute(ATTR.SECTION_KEY);
    this.linktToSection = this.shadowRoot.getElementById(IDS.sectionLink);

    const text = getText(hasSubsequentRoute, this);
    this.linkToTarget = this.shadowRoot.getElementById(IDS.targetLink);
    this.linkToTarget.innerHTML = text;

    if (this.linktToSection) {
      const hrefToSection = getHref(this.keyOfSection);
      const hrefToTarget = hrefToSection + '/' + this.keyOfTarget;
      this.linktToSection.href = hrefToSection;
      this.linkToTarget.href = hrefToTarget;
      this.linktToSection.nextElementSibling.innerHTML = text;
    } else {
      this.linkToTarget.href = getHref(this.keyOfTarget);
    }

    this.update();
  }

  update() {
    const selectedKey = this.parentSection.getAttribute(ATTR.SELECTED_KEY);
    const hasAttribute = this.selected || this.rejected;

    if (!selectedKey && !hasAttribute) return;

    if (!selectedKey && hasAttribute) {
      this.selected = null;
      this.rejected = null;
      return;
    }

    if (selectedKey === this.keyOfTarget) {
      this.selected = SELECTED;
      this.rejected = null;
      return;
    }

    this.selected = null;
    this.rejected = REJECTED;

    // @todo animation !!
  }
}
