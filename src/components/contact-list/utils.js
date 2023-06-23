import { isMobileDevice } from '../../renderer/utils.js';
import { id, useSymbol } from '../../elements/svgs.js';

import { anchorClass } from '../chat-link/utils.js';

import {
  buttonClass as buttonActionClass,
  buttonAttribute as buttonActionAttribute,
} from '../../handler/button-handler.js';

import { ROUTES } from '../../router/config.js';
import { CONTACT_VAL } from '../../controller/form/config.js';

const elementClass = {
  infoWrap: 'contact-info-wrap',
  info: 'contact-info',
  buttonWrap: 'contact-buttons-wrap',
  button: 'contact-button',
};

const info = [
  {
    key: 'phone',
    class: elementClass.info + '-phone',
    html(data) {
      return `
      <p>
        <span class="has-icon-before ${this.class}">${data}</span>
      </p>`;
    },
  },
  {
    key: 'url',
    class: elementClass.info + '-website',
    html(data) {
      return `
      <p>
        <a
          href="${data}"
          class="${anchorClass.iconBefore} ${this.class}"
          >${useSymbol(id.globe)}Website
        </a>
      </p>`;
    },
  },
];

const buttonKey = {
  message: 'message',
  mail: 'mail',
  phone: 'phone',
};

export const buttonClass = {
  message: elementClass.button + '-' + buttonKey.message,
  mail: elementClass.button + '-' + buttonKey.mail,
  phone: elementClass.button + '-' + buttonKey.phone,
};

const buttons = [
  {
    key: 'mail',
    label: 'Nachricht',
    html(data) {
      return `
    <div>
      ${useSymbol(id.mail)}
      <a
        class="${elementClass.button} ${anchorClass.routed} ${
        buttonClass.message
      }"
        href="${ROUTES.CONTACT + '/' + CONTACT_VAL[0]}"
        ${buttonActionAttribute.id}="${data}"
        >${this.label}</a>
      </div>`;
    },
  },
  {
    key: 'mail',
    label: 'E-Mail',
    html(data) {
      return `
    <div>
      ${useSymbol(id.clipboardCopy)}
      <button
        type="button"
        ${buttonActionAttribute.id}="${data}"
        class="${elementClass.button} ${buttonActionClass.copy} ${
        buttonClass.mail
      }"
        >${this.label}</button>
    </div>`;
    },
  },
  {
    key: 'phone',
    label: 'Anruf',
    html(data) {
      const href = 'tel:+49' + data.replaceAll(/\s/g, '').substring(1);
      return `
      <div>
        ${useSymbol(id.phone)}
        <a
          href="${href}"
          class="${elementClass.button} ${buttonClass.phone}"
          >${this.label}</a>
      </div>`;
    },
  },
];

// @consider
// requires extra guard cases in click event handler
// const btnSvg = (type) => `<svg><use href="#icon-${type}"></use></svg>`;

export function createItemHtml(data) {
  return `
		<div class="contact-head">
      <b>${data.name}</b>${!!data.dscr ? '<br />' + data.dscr : ''}
    </div>
		<div class="contact-body">
			<div class="${elementClass.infoWrap}">
        ${info.reduce((html, props) => {
          const value = data[props.key];
          if (!!value) html += props.html(value);
          return html;
        }, '')}
      </div>
			<div class="${elementClass.buttonWrap}">
        ${buttons.reduce((html, props) => {
          // @todo renderer property ?
          // if (!isMobileDevice && props.key === buttonKey.phone) return html;

          const value = data[props.key];
          if (!value) return html;

          if (isMobileDevice && props.key === buttonKey.phone) {
            html += props.html(data.phone);
          }

          if (props.key !== buttonKey.phone) {
            html += props.html(data._id);
          }

          return html;
        }, '')}
    </div>
		</div>`;
}
