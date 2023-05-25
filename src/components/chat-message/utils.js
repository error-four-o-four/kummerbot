import elements from '../../elements/elements.js';
import formHandler from '../../listener/form-handler.js';

import { MESSAGE_TAG } from '../components.js';

export function insertShareLink(output) {
  // @todo
  // check if sharelink exists beforehand

  const href = router.getShareUrl();
  const paraLink = document.createElement('p');
  paraLink.innerHTML = `
  <a href="${href}">${href}</a>`;

  const paraBtns = document.createElement('p');
  paraBtns.innerHTML = `
  <button
  class="btn-copy has-icon"
  value="${href}"
  type="button"
  >URL Kopieren<svg><use href="#icon-copy-svg"></use></svg></button>`;

  // if (isMobileDevice) {
  // }

  // paraBtns.innerHTML += `
  // <button
  // class="btn-share has-icon"
  // value="${href}"
  // type="button"
  // >URL Teilen<svg><use href="#icon-share-svg"></use></svg></button>`;

  output.querySelectorAll(MESSAGE_TAG)[1].append(paraLink, paraBtns);
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
