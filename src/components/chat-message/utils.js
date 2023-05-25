import { isMobileDevice } from '../../renderer/utils.js';

import elements from '../../elements/elements.js';
import formHandler from '../../listener/form-handler.js';

import { MESSAGE_TAG } from '../components.js';

export function createShareLinkHtml(href) {
  return `
  <p><a href="${href}">${href}</a></p>
  <p>
    <button
      class="btn-copy has-icon"
      value="${href}"
      type="button"
      >URL Kopieren<svg><use href="#icon-copy-svg"></use></svg></button>
    ${
      isMobileDevice
        ? `
      <button
        class="btn-share has-icon"
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

  formHandler.captcha = numA + numB;

  const para = document.createElement('p');
  para.innerHTML = `${numA} + ${numB} = ${elements.form.createCaptchaHtml()}`;

  output.querySelector(MESSAGE_TAG).append(para);
}
