import router from '../../router/router.js';

const getDeviceType = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

const isMobileDevice = getDeviceType();

// const supportsTouchEvents = () => window && "ontouchstart" in window;

export const selector = {
  message: 'contact-btn-message',
  mail: 'contact-btn-mail',
  phone: 'contact-btn-phone',
  descr: 'contact-description',
  wrap: 'contact-buttons-wrap',
  btn: 'contact-button',
};

// @todo html entitities in title
export const renderHtml = (title) => `
  <div class="contact-head">${title}</div>
  <div class="contact-body">
    <div class="${selector.descr}"></div>
    <div class="${selector.wrap}"></div>
  </div>`;

const htmlPage = ({ page }) =>
  page
    ? `
  <p>
    <a
      class="has-icon-before"
      href="#${page}">
      <svg><use href="#icon-website-svg"></use></svg>Website
    </a>
  </p>`
    : '';

const htmlPhone = ({ phone }) =>
  phone
    ? `
  <p class="has-icon">${phone}</p>`
    : '';

//  @consider
// requires extra guard cases in click event handler
// const btnSvg = (type) => `<svg><use href="#icon-${type}"></use></svg>`;

const dataKeys = {
  message: 'mail',
  mail: 'mail',
  phone: 'phone',
};

// @todo differentiate mobile and desktop device
const btn = {
  // handled by listener
  message: (type) => `
  <a
    class="${selector[type]}"
    href="${router.origin + router.routes.contact}"
    >Nachricht</a>`,
  mail: (type, data) => `
  <button
    type="button"
    class="${selector[type]}"
    value="${data}"
    >Mail</button>`,
  phone: (type, data) => `
  <a
    class="${selector[type]}"
    href="tel:${data}"
    >Anruf</a>`,
};

const htmlButtons = (data) =>
  Object.keys(dataKeys).reduce((all, key) => {
    if (!isMobileDevice && key === 'phone') return all;

    const prop = dataKeys[key];
    if (!(prop in data)) return all;

    const val = data[prop];
    if (val) {
      // console.log(key, prop, val);
      all += `\n` + btn[key](key, val);
    }
    return all;
  }, '');

export function renderError(message) {
  const body = this.lastElementChild;
  body.classList.add('error');

  const wrap = body.firstElementChild;
  wrap.innerText = message;
}

export function injectData() {
  const { data } = this;
  const descr = this.querySelector('.' + selector.descr);
  const wrap = this.querySelector('.' + selector.wrap);

  descr.innerHTML = data.description ? `<p>${data.description}</p>` : '';
  descr.innerHTML += htmlPhone(data);
  descr.innerHTML += htmlPage(data);

  wrap.innerHTML = htmlButtons(data);
}
