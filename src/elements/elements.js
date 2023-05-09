import { KEYS } from '../router/config.js';

const app = document.getElementById('app');
const header = document.querySelector('header');

export default {
  app,
  header,
  headerAnchor: null,
  section: null,
};

export * from './anchors.js';

const templateInfo = `
<p>
  Du kannst auf den gew&uuml;nschten Kontakt klicken, um zu einem anonymen
  Kontaktformular zu gelangen oder<br />du kopierst dir die gew&uuml;nschte
  E&dash;Mail&dash;Adresse in deine Ablage.
</p>
<p>Wer diese Ansprechpartner sind, siehst du, indem du auf den weiterführenden Link klickst.</p>`;

export const contents = {
  text: {
    error: '&#x26A0; Ein Fehler ist aufgetreten.',
    [KEYS.BACK]: 'Ich m&ouml;chte einen Schritt zur&uuml;ck',
    [KEYS.HOME]: 'Ich m&ouml;chte zur&uuml;ck zum Anfang',
    [KEYS.VIEW]: 'Wie sieht das aus, was ich teile?',
    [KEYS.RESET]: '✖',
    [KEYS.SHARE]: 'Ich m&ouml;chte diese Informationen teilen',
    headerAnchorAbout: 'Details',
    headerAnchorBack: 'zur&uuml;ck',
  },
  // get templateError() {
  //   return `<div><p>${this.text.error}</p></div>\n<div ${ATTR.ROUTE}="${KEYS.HOME}">${this.text[KEYS.HOME]}</div>`;
  // },
  templateInfo,
};
