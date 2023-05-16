import { KEYS } from '../router/router.js';

export const TMPL_ATTR = {
  SHARE: 'data-share-link',
  INFO: 'data-contacts-info',
  LIST: 'data-contacts-list',
};

// @todo getContactInfoTemplate()
const info = `
<p>
  Du kannst auf den gew&uuml;nschten Kontakt klicken, um zu einem anonymen
  Kontaktformular zu gelangen oder<br />du kopierst dir die gew&uuml;nschte
  E&dash;Mail&dash;Adresse in deine Ablage.
</p>
<p>Wer diese Ansprechpartner sind, siehst du, indem du auf den weiterführenden Link klickst.</p>`;

const share = `
<p>
  Wenn du m&ouml;chtest kann ich du dir diesen Link <a></a> in deiner Zwischenablage speichern oder einen QRCode erstellen.
</p>
`;

const displayedText = {
  error: '&#x26A0; Da hat etwas nicht funktioniert ...',
  [KEYS.BACK]: 'Ich m&ouml;chte einen Schritt zur&uuml;ck',
  [KEYS.ROOT]: 'Ich m&ouml;chte zur&uuml;ck zum Anfang',
  [KEYS.SHARE]: 'Ich m&ouml;chte diese Informationen teilen',
  [KEYS.COPY]: 'Ich m&ouml;chte den Link in der Zwischenablage speichern.',
  [KEYS.CODE]: 'Bitte erstelle mir einen QRCode.',
  indicator: {
    pending: 'Schreibt ...',
    waiting: 'Online',
  },
};

function createTemplateElement(html = null) {
  const elt = document.createElement('template');

  if (html) elt.innerHTML = html;

  return elt;
}

// @todo [ATTR.ERROR]
function getErrorTemplate() {
  return `
<div class="row content">
	<p>${displayedText.error}</p>
</div>`;
}

function getShareLinkTemplate(href) {
  const template = createTemplateElement(share);
  const anchor = template.content.querySelector('a');

  anchor.href = href;
  // anchor.innerText = href;

  anchor.classList.add('has-icon');
  anchor.innerHTML = `${href}<svg><use href="#icon-share"></use></svg>`;

  return template.content.cloneNode(true);
}

export default {
  [TMPL_ATTR.INFO]: info,
  text: displayedText,
  getErrorTemplate,
  getShareLinkTemplate,
};
