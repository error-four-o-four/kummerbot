import { KEYS } from '../router/config.js';
import { ATTR } from './config.js';

const info = `
<p>
  Du kannst auf den gew&uuml;nschten Kontakt klicken, um zu einem anonymen
  Kontaktformular zu gelangen oder<br />du kopierst dir die gew&uuml;nschte
  E&dash;Mail&dash;Adresse in deine Ablage.
</p>
<p>Wer diese Ansprechpartner sind, siehst du, indem du auf den weiterführenden Link klickst.</p>`;

const blocks = {
  error: '&#x26A0; Ein Fehler ist aufgetreten.',
  [KEYS.BACK]: 'Ich m&ouml;chte einen Schritt zur&uuml;ck',
  [KEYS.CHAT]: 'Ich m&ouml;chte zur&uuml;ck zum Anfang',
  [KEYS.VIEW]: 'Wie sieht das aus, was ich teile?',
  [KEYS.SHARE]: 'Ich m&ouml;chte diese Informationen teilen',
  headerAnchorAbout: 'Details',
  headerAnchorBack: 'zur&uuml;ck',
};

function getErrorTemplate() {
  return `
<div>
	<p>${blocks.error}</p>
</div>`;
}

function getOptionTemplate(key, text) {
  if (
    Object.values(KEYS)
      .filter((key) => key !== KEYS.SHARE)
      .includes(key)
  ) {
    return `<a ${ATTR.ROUTE}="${key}">${blocks[key]}</a>`;
  }

  if (key === KEYS.SHARE) {
    return `
<a ${ATTR.ROUTE}="${KEYS.RESET}">✖</a>
<a ${ATTR.ROUTE}="${key}">${blocks[key]}</a>`;
  }

  return `
<a ${ATTR.ROUTE}="${KEYS.RESET}">✖</a>
<a ${ATTR.ROUTE}="${key}">${text}</a>`;
}

export const templates = {
  [ATTR.INFO]: info,
  text: blocks,
  getErrorTemplate,
  getOptionTemplate,
};
