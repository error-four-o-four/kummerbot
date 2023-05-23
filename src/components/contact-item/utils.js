import { MODULE_KEY } from '../../renderer/templates.js';
import { isMobileDevice } from '../../renderer/utils.js';

export const eltSelector = {
  wrapDescr: 'contact-description-wrap',
  description: 'contact-description',
  page: 'contact-description-page',
  phone: 'contact-description-phone',
  wrapBtns: 'contact-buttons-wrap',
  btn: 'contact-button',
};

const eltHtml = {
  description: (value) => `
  <p class="${eltSelector.description}">${value}</p>`,
  page: (value) => `
  <p>
    <a
      href="${value}"
      class="has-icon-before ${eltSelector.page}"
      ><svg><use href="#icon-website-svg"></use></svg>Website
    </a>
  </p>`,
  phone: (value) => `
  <p>
    <span class="has-icon-before ${eltSelector.phone}">${value}</span>
  </p>`,
};

export const btnSelector = {
  message: 'contact-btn-message',
  mail: 'contact-btn-mail',
  phone: 'contact-btn-phone',
};

const btnLabel = {
  message: 'Nachricht',
  mail: 'Mail',
  phone: 'Anruf',
};

const btnDataKeys = {
  message: 'mail',
  mail: 'mail',
  phone: 'phone',
};

//  @consider
// requires extra guard cases in click event handler
// const btnSvg = (type) => `<svg><use href="#icon-${type}"></use></svg>`;

const btnHtml = {
  // handled by listener
  anchor: (type) => `
  <a
    class="${eltSelector.btn} ${btnSelector[type]}"
    >${btnLabel[type]}</a>`,
  button: (type) => `
  <button
    type="button"
    class="${eltSelector.btn} ${btnSelector[type]}"
    >${btnLabel[type]}</button>`,
};

// @todo html entitities in title
export const createFragment = (title) => {
  const template = document.createElement('template');
  template.innerHTML = `
  <div class="contact-head">${title}</div>
  <div class="contact-body">
    <div class="${eltSelector.wrapDescr}"></div>
    <div class="${eltSelector.wrapBtns}">
      ${Object.keys(btnDataKeys).reduce((html, key) => {
        if (!isMobileDevice && key === 'phone') return html;

        const tag = key === 'mail' ? 'button' : 'anchor';
        html += btnHtml[tag](key);

        return html;
      }, '')}
    </div>
  </div>`;

  return template.content;
};

export function injectContactData(component, contactData) {
  const [wrapDescr, wrapBtns] = [...component.lastElementChild.children];

  wrapDescr.innerHTML = Object.entries(eltHtml).reduce((html, [key, fn]) => {
    if (contactData[key]) html += fn(contactData[key]);
    return html;
  }, '');

  // @todo refactor
  const btnMessage = wrapBtns.querySelector('.' + btnSelector.message);
  btnMessage &&
    contactData[btnDataKeys.message] &&
    btnMessage.setAttribute('value', contactData[btnDataKeys.message]);

  const btnMail = wrapBtns.querySelector('.' + btnSelector.mail);
  btnMail &&
    contactData[btnDataKeys.mail] &&
    btnMail.setAttribute('value', contactData[btnDataKeys.mail]);

  const btnPhone = wrapBtns.querySelector('.' + btnSelector.phone);
  btnPhone &&
    contactData[btnDataKeys.phone] &&
    btnPhone.setAttribute('value', contactData[btnDataKeys.phone]);
}

export function updateMessageButton(component, componentHref) {
  const btn = component.querySelector('.' + btnSelector.message);
  const href = componentHref + '/' + MODULE_KEY.MESSAGE;

  if (btn.href === href) return;

  console.log('updated', componentHref, href, btn);

  btn && btn.setAttribute('href', href);
}
