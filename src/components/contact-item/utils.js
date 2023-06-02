import { ROUTES } from '../../router/config.js';
import { isMobileDevice } from '../../renderer/utils.js';

import { anchorClass } from '../chat-link/utils.js';
import { buttonClass as buttonActionClass } from '../../handler/button-handler.js';

const elementSelector = {
  infoWrap: 'contact-info-wrap',
  info: 'contact-info',
  buttonWrap: 'contact-buttons-wrap',
  button: 'contact-button',
};

const infoKey = {
  description: 'description',
  website: 'website',
  phone: 'phone,',
};

const info = {
  description: {
    key: 'description',
    selector: elementSelector.info + '-' + infoKey.description,
    html(data) {
      return `
      <p class="${this.selector}">${data}</p>`;
    },
  },
  website: {
    key: 'url',
    selector: elementSelector.info + '-' + infoKey.website,
    html(data) {
      return `
      <p>
        <a
          href="${data}"
          class="has-icon-before ${this.selector}"
          ><svg><use href="#icon-website-svg"></use></svg>Website
        </a>
      </p>`;
    },
  },
  phone: {
    key: 'phone',
    selector: elementSelector.info + '-' + infoKey.phone,
    html(data) {
      return `
      <p>
        <span class="has-icon-before ${this.selector}">${data}</span>
      </p>`;
    },
  },
};

export const buttonKey = {
  message: 'message',
  mail: 'mail',
  phone: 'phone',
};

export const buttonClass = Object.entries(buttonKey).reduce(
  (all, [key, value]) => {
    all[key] = elementSelector.button + '-' + value;
    return all;
  },
  {}
);

const buttons = {
  message: {
    key: 'mail',
    label: 'Nachricht',
    class: buttonClass[buttonKey.message],
    html: anchorHtml,
  },
  mail: {
    key: 'mail',
    label: 'E-Mail',
    class: buttonClass[buttonKey.mail],
    html: buttonHtml,
  },
  phone: {
    key: 'phone',
    label: 'Anruf',
    class: buttonClass[buttonKey.phone],
    html: anchorHtml,
  },
};

//  @consider
// requires extra guard cases in click event handler
// const btnSvg = (type) => `<svg><use href="#icon-${type}"></use></svg>`;

function buttonHtml(actionSelector = null) {
  return `
  <button
    type="button"
    class="${elementSelector.button} ${this.selector} ${
    actionSelector ? actionSelector : ''
  }"
    >${this.label}</button>`;
}

function anchorHtml(routedSelector = null) {
  return `
  <a
    class="${elementSelector.button} ${routedSelector ? routedSelector : ''} ${
    this.selector
  }"
    >${this.label}</a>`;
}

// @todo html entitities in title

export function createFragment(title) {
  const template = document.createElement('template');
  template.innerHTML = `
  <div class="contact-head">${title}</div>
  <div class="contact-body">
    <div class="${elementSelector.infoWrap}"></div>
    <div class="${elementSelector.buttonWrap}">
      ${Object.entries(buttons).reduce((html, [key, props]) => {
        if (!isMobileDevice && key === buttonKey.phone) return html;

        key === buttonKey.mail
          ? (html += props.html(buttonActionClass.copy))
          : key === buttonKey.message
          ? (html += props.html(anchorClass.routed))
          : (html += props.html());

        return html;
      }, '')}
    </div>
  </div>`;

  return template.content;
}

export function injectContactData(component, contactData) {
  const [wrapDescr, wrapBtns] = [...component.lastElementChild.children];

  wrapDescr.innerHTML = Object.values(info).reduce((html, props) => {
    const data = contactData[props.key];
    if (!!data) html += props.html(data);
    return html;
  }, '');

  for (const [key, props] of Object.entries(buttons)) {
    const button = wrapBtns.querySelector('.' + props.class);

    if (!button) continue;

    const data = contactData[props.key];

    if (!data) continue;

    if (key === buttonKey.message) {
      button.setAttribute('href', ROUTES.CONTACT);
    }

    button.setAttribute('value', data);
  }
}
