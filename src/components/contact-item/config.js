export const CUSTOM_ATTR = {
  KEY: 'key',
  LOADING: 'loading',
};

// @todo html entitities in title
export const renderHtml = (title) => `
  <div class="contact-head">${title}</div>
  <div class="contact-body"></div>`;

const btnKeys = {
  message: 'mail',
  mail: 'mail',
  call: 'phone',
};

const btnClasses = {
  message: 'contact-message',
  mail: 'contact-mail',
  call: 'contact-phone',
};

const btnSvg = (type) => `<svg><use href="#icon-${type}"></use></svg>`;

// @todo differentiate mobile and desktop device
const btnContents = {
  message: (type, data) => `
    <a href="#${data}">
      ${btnSvg(type)}
      <span>Nachricht</span>
    </a>`,
  mail: (type, data) => `
  <a href="#${data}">
    ${btnSvg(type)}
    <span>E-Mail</span>
  </a>`,
  call: (type, data) => `
  <a href="#${data}">
    ${btnSvg(type)}
    <span>Anruf</span>
  </a>`,
};

const btn = (type, data) => `
  <div class="contact-button ${btnClasses[type]}">
    ${btnContents[type](type, data)}
  </div>
`;

const htmlDescription = (data) => {
  let html = `<div class="contact-description">`;

  // required to make div:empty { display: 'none' } work
  html += data.description
    ? `
  <p>${data.description}</p>`
    : '';
  html += data.page
    ? `
  <p>
    <a
      class="has-icon"
      href="#${data.page}"
      >${data.page}<svg><use href="#icon-share-svg"></use></svg>
    </a>
  </p>`
    : '';
  html += `</div>`;

  return html;
};

const htmlButtons = (data) => `
<div class="contact-buttons">
  ${Object.keys(btnKeys).reduce((all, key) => {
    if (btnKeys[key] in data) {
      const val = data[btnKeys[key]];
      all += `\n` + btn(key, val);
    }
    return all;
  }, '')}
</div>`;

export const injectData = (component) => {
  const { data } = component;
  const body = component.lastElementChild;

  if (typeof data === 'string') {
    body.innerHTML = data;
    return;
  }

  body.innerHTML += htmlDescription(data);
  body.innerHTML += htmlButtons(data);
};
