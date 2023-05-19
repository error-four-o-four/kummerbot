import { KEYS } from '../router/router.js';

export const TMPL_ATTR = {
  SHARE: 'inject-share-link',
  INFO: 'contacts-info',
  LIST: 'contacts-list',
};

const info = `
<p>
  Du kannst auf den gew&uuml;nschten Kontakt klicken, um zu einem anonymen
  Kontaktformular zu gelangen oder<br />du kopierst dir die gew&uuml;nschte
  E&dash;Mail&dash;Adresse in deine Zwischenablage.
</p>
<p>Wer diese Ansprechpartner sind, siehst du, indem du auf den weiterführenden Link klickst.</p>`;

const code = ``;

const displayedText = {
  [KEYS.BACK]: 'Ich m&ouml;chte einen Schritt zur&uuml;ck',
  [KEYS.ROOT]: 'Ich m&ouml;chte zur&uuml;ck zum Anfang',
  [KEYS.SHARE]: 'Ich m&ouml;chte diese Informationen teilen',
  [KEYS.COPY]: 'Ich m&ouml;chte den Link in der Zwischenablage speichern.',
  [KEYS.CODE]: 'Bitte erstelle mir einen QRCode.',
  indicator: {
    pending: 'Schreibt ...',
    waiting: 'Online',
  },
  about: {
    inactive: 'Details',
    active: 'zur&uuml;ck',
  },
};

function getErrorTemplate(error) {
  console.log(error);
  return `
<chat-message>
	<p>$&#x26A0; Da hat etwas nicht funktioniert ...</p>
  <p>Hier erscheint eine Fehlermeldung</p>
  <p>Und hier ist der Link zur <a>Startseite</a>
</chat-message>`;
}

export default {
  text: displayedText,
  [TMPL_ATTR.INFO]: info,
  getErrorTemplate,
};
