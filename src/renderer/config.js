export const ATTR = {
  ROUTE: 'data-route',
  CHOICE: 'data-choice',
  INFO: 'data-info-contacts',
};

export const VAL = {
  HOMEPAGE: 'home',
  POPSTATE: 'popstate',
  RESETSTATE: 'resetstate',
  SHARE: 'share',
  VIEW: 'view',
};

const app = document.getElementById('app');

export const elements = {
  app,
  section: null,
};

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
    anchorBack: 'Ich m&ouml;chte einen Schritt zur&uuml;ck',
    anchorHomepage: 'Ich m&ouml;chte zur&uuml;ck zum Anfang',
    anchorShare: 'Ich m&ouml;chte diese Informationen teilen',
    anchorView: 'Wie sieht das aus, was ich teile?',
  },
  get templateError() {
    return `<div><p>${this.text.error}</p></div>\n<div ${ATTR.ROUTE}="${VAL.HOMEPAGE}">${this.text.anchorHomepage}</div>`;
  },
  templateInfo,
};
