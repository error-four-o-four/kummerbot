import templates from '../../controller/templates.js';
import formController from '../../controller/form/form-controller.js';
import errorController from '../../controller/error-controller.js';
import { ERROR_KEY } from '../../controller/error-controller.js';

import { id, useSymbol } from '../../elements/svgs.js';
import { buttonClass } from '../../handler/button-handler.js';
import { anchorClass } from '../chat-link/utils.js';

(() => {
  const template = document.createElement('template');
  template.id = ERROR_KEY;
  template.innerHTML = `
  <p>&#x26A0; Da hat etwas nicht funktioniert ...</p>
  <p>
    Versuche die Seite neu zu laden oder<br />
    kehre zur Startseite zur&uuml;ck.
  </p>
  `;

  templates.set(template.id, template);
})();

export function injectErrorMessage(component) {
  const message = errorController.get();

  if (!message) return;

  const para = document.createElement('p');
  para.innerHTML = message;
  component.firstElementChild.after(para);
}

export function createShareLinkHtml(href) {
  return `
  <p>
    <a
      class="${anchorClass.routed}"
      href="${href}">${href}</a>
  </p>
  <p class="share-link-buttons">
    <button
      class="${anchorClass.iconBefore} ${buttonClass.copy}"
      value="${href}"
      type="button"
      >${useSymbol(id.clipboardCopy)}URL Kopieren</button>
    ${
      !!navigator.canShare
        ? `
      <button
        class="${anchorClass.iconBefore} ${buttonClass.share}"
        value="${href}"
        type="button"
        >${useSymbol(id.share)}URL Teilen</button>`
        : ''
    }
  </p>`;
}

export function updateShareLink(component, href) {
  const anchor = component.querySelector('a');

  if (anchor.href === href) return;

  component
    .querySelectorAll('button')
    .forEach((button) => button.setAttribute('value', href));
  anchor.href = href;
  anchor.innerText = href;
  return;
}

export function injectContactName(component) {
  const span = component.querySelector('b');
  span.innerHTML = formController.name;
}

export function injectContactMessage(component) {
  component.lastElementChild.innerText = formController.message;
  component.lastElementChild.classList.add('contact-data-message');
}

export function setCaptchaValue(component) {
  const [numA, numB] = formController.getRandomCaptchaValues();
  component.lastElementChild.innerText = `${numA} + ${numB} = ?`;
}
