export const MODULE_ATTR = {
  KEY: 'data-chat-module-key',
  NEXT: 'data-next-module-key',
};

const app = document.getElementById('app');

const header = document.querySelector('header');
const avatarSvg = document.getElementById('avatar-svg');
const statusSpan = document.getElementById('status-indicator');
const aboutLink = document.querySelector('about-link');

const outlet = document.getElementById('outlet');
const templatesContainer = document.getElementById('templates-container');
// @todo svgs ?

export default {
  app,
  header: {
    elt: header,
    svg: avatarSvg,
    span: statusSpan,
    link: aboutLink,
  },
  outlet,
  templatesContainer,
};
