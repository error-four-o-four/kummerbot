import elements from '../../elements/elements.js';
import templates from '../../templates/templates.js';
import contactHandler from '../../handler/contact-handler.js';

import { buttonSelector } from '../../handler/button-handler.js';
import { MESSAGE_TAG, MODULE_VAL } from '../components.js';

export function createErrorTemplate() {
  const template = document.createElement('template');
  template.id = MODULE_VAL.ERROR;
  template.innerHTML = `
  <p>&#x26A0; Da hat etwas nicht funktioniert ...</p>
  <p>
    Versuche die Seite neu zu laden oder<br />
    kehre Startseite zur&uuml;ck.
  </p>
  `;

  templates.set(template.id, template);
}

export function createShareLinkHtml(href) {
  return `
  <p><a href="${href}">${href}</a></p>
  <p>
    <button
      class="has-icon ${buttonSelector.copy}"
      value="${href}"
      type="button"
      >URL Kopieren<svg><use href="#icon-copy-svg"></use></svg></button>
    ${
      !!navigator.canShare
        ? `
      <button
        class="has-icon ${buttonSelector.share}"
        value="${href}"
        type="button"
        >URL Teilen<svg><use href="#icon-share-svg"></use></svg></button>`
        : ''
    }
  </p>`;
}

export function insertCaptcha(output) {
  // @todo
  // check if captcha exists beforehand

  // @todo
  // insert recipient and message in first ChatModule
  const numA = Math.floor(5 + Math.random() * 9);
  const numB = Math.floor(1 + Math.random() * 9);

  contactHandler.captcha = numA + numB;

  const para = document.createElement('p');
  para.innerHTML = `${numA} + ${numB} = ${elements.form.createCaptchaHtml()}`;

  output.querySelector(MESSAGE_TAG).append(para);
}
