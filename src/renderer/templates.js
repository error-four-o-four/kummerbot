import { KEYS } from '../router/config.js';
import { ATTR } from '../elements/config.js';

// @todo getContactInfoTemplate()
const info = `
<p>
  Du kannst auf den gew&uuml;nschten Kontakt klicken, um zu einem anonymen
  Kontaktformular zu gelangen oder<br />du kopierst dir die gew&uuml;nschte
  E&dash;Mail&dash;Adresse in deine Ablage.
</p>
<p>Wer diese Ansprechpartner sind, siehst du, indem du auf den weiterführenden Link klickst.</p>`;

const displayedText = {
  error: '&#x26A0; Ein Fehler ist aufgetreten.',
  [KEYS.BACK]: 'Ich m&ouml;chte einen Schritt zur&uuml;ck',
  [KEYS.ROOT]: 'Ich m&ouml;chte zur&uuml;ck zum Anfang',
  [KEYS.VIEW]: 'Wie sieht das aus, was ich teile?',
  [KEYS.SHARE]: 'Ich m&ouml;chte diese Informationen teilen',
  indicator: {
    pending: 'Schreibt ...',
    waiting: 'Online',
  },
};

function getErrorTemplate() {
  return `
<div class="row content">
	<p>${displayedText.error}</p>
</div>`;
}

export const templates = {
  [ATTR.INFO]: info,
  text: displayedText,
  getErrorTemplate,
};
