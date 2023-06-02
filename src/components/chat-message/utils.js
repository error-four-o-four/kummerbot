import elements from '../../elements/elements.js';
import templates from '../../controller/templates.js';
import formController from '../../controller/form-controller.js';
import { ERROR_KEY } from '../../controller/error-controller.js';

import { buttonClass } from '../../handler/button-handler.js';
import { anchorClass } from '../chat-link/utils.js';
import { MESSAGE_TAG } from '../components.js';

(() => {
  const template = document.createElement('template');
  template.id = ERROR_KEY;
  template.innerHTML = `
  <p>&#x26A0; Da hat etwas nicht funktioniert ...</p>
  <p>
    Versuche die Seite neu zu laden oder<br />
    kehre Startseite zur&uuml;ck.
  </p>
  `;

  templates.set(template.id, template);
})();

export function createShareLinkHtml(href) {
  return `
  <p>
    <a
      class="${anchorClass.routed}"
      href="${href}">${href}</a>
  </p>
  <p>
    <button
      class="has-icon ${buttonClass.copy}"
      value="${href}"
      type="button"
      >URL Kopieren<svg><use href="#icon-copy-svg"></use></svg></button>
    ${
      !!navigator.canShare
        ? `
      <button
        class="has-icon ${buttonClass.share}"
        value="${href}"
        type="button"
        >URL Teilen<svg><use href="#icon-share-svg"></use></svg></button>`
        : ''
    }
  </p>`;
}

// @todo inject contact name
function insertCaptcha(output) {
  // @todo
  // check if captcha exists beforehand

  // @todo
  // insert recipient and message in first ChatModule
  const numA = Math.floor(5 + Math.random() * 9);
  const numB = Math.floor(1 + Math.random() * 9);

  formController.captcha = numA + numB;

  const para = document.createElement('p');
  para.innerHTML = `${numA} + ${numB} = ${elements.form.createCaptchaHtml()}`;

  output.querySelector(MESSAGE_TAG).append(para);
}
