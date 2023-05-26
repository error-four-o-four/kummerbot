import router from '../../router/router.js';

import {
  MESSAGE_TAG,
  CONTACT_TAG,
  LINK_TAG,
  LINK_ATTR,
  TARGET_VAL,
} from '../components.js';

export const createErrorFragment = (message) => {
  const element = document.createElement(MESSAGE_TAG);
  element.innerHTML = `
  <p>&#x26A0; Da hat etwas nicht funktioniert ...</p>
  ${!!message ? `<p>${message}</p>` : ''}
  <p>
  Versuche die Seite neu zu laden oder<br />
  kehre Startseite zur&uuml;ck.
  </p>
  `;

  const output = new DocumentFragment();
  output.appendChild(element);

  adjustChatLinksToRoute(output, { hasError: true });

  return output;
};

export const createModuleFragment = (parsedElements, properties) => {
  const output = new DocumentFragment();
  console.log(
    `rendering a ${properties.moduleWasCached ? 'cached' : 'new'} ${
      properties.moduleKey
    } ChatModule`
  );

  for (const parsedElement of parsedElements) {
    const element = constructElement(parsedElement, properties);
    output.appendChild(element);
  }

  adjustChatLinksToRoute(output, properties);

  return output;
};

function constructElement(template, properties) {
  // @reminder
  // call constructor to make setters, getters and methods available
  // although constructor resets properties
  // @gnaaaaaa
  // element.cloneNode(true) of a connected element calls constructor!!!
  // const test = template.cloneNode(true);
  // console.log(test.target, test.getAttribute(LINK_ATTR.TARGET_KEY));
  const element = document.createElement(template.localName);

  // skip needless attributes
  for (const { name, value } of template.attributes) {
    element.setAttribute(name, value);
  }

  // always copy contents
  element.innerHTML = template.innerHTML;

  // call methods 'render()' and 'update()' if necessary
  if (element.localName === MESSAGE_TAG) {
    // call render if ChatMessage has dynamic content
    // ChatMessage depends on key to inject dynamic contents
    element.attributes.length > 0 && element.render(properties);
    return element;
  }

  if (element.localName === CONTACT_TAG) {
    !properties.moduleWasCached && element.render();
    return element;
  }

  // ChatLink depends on href
  if (!properties.moduleWasCached) {
    element.render();
  }

  element.update(properties.moduleHref);
  return element;
}

function adjustChatLinksToRoute(output, properties) {
  const links = [...output.querySelectorAll(LINK_TAG)];
  const hasLinks = links.length > 0;
  const hasContacts = output.querySelectorAll(CONTACT_TAG).length > 0;
  const [
    [hasChatLinkHome, chatLinkHome],
    [hasChatLinkBack, chatLinkBack],
    [hasChatLinkShare, chatLinkShare],
  ] = [TARGET_VAL.HOME, TARGET_VAL.BACK, TARGET_VAL.SHARE].map((value) => {
    const link = links.find((link) => link.target === value);
    return [!!link, link];
  });

  const { prevKey, moduleKey, moduleHref } = properties;

  // always insert ChatLink back
  // and doublecheck position
  if (router.isChatRoute && !!prevKey && !hasChatLinkBack) {
    const element = constructChatLink(TARGET_VAL.BACK, moduleHref);

    if (!hasLinks) {
      output.appendChild(element);
    } else {
      const position = hasChatLinkHome ? 'after' : 'before';
      links[0][position](element);
    }
  }

  // insert ChatLink Back
  // if routed from /chat to /shared, /about, /error, /contact
  // and it's not the first view
  if (!router.isChatRoute && !!router.prev && !hasChatLinkBack) {
    const element = constructChatLink(TARGET_VAL.BACK, moduleHref);
    output.appendChild(element);
  }

  // insert ChatLink share when
  // first view was /shared
  // bc cached module does not have share link
  if (router.isChatRoute && hasContacts && !hasChatLinkShare) {
    const element = constructChatLink(TARGET_VAL.SHARE, moduleHref);
    output.appendChild(element);
  }

  if (router.isChatRoute && hasContacts && hasChatLinkHome) {
    chatLinkHome.remove();
  }

  // insert ChatLink home
  // to ChatModule with ContactItems
  if ((router.isSharedRoute || properties.hasError) && !hasChatLinkHome) {
    const element = constructChatLink(TARGET_VAL.HOME, moduleHref);
    output.append(element);
  }

  // remove ChatLink Share
  // if it's the first view
  if (router.isSharedRoute && hasChatLinkShare) {
    chatLinkShare.remove();
  }

  // @todo isContactRoute

  // @consider isAboutRoute
}

function constructChatLink(value, href) {
  const element = document.createElement(LINK_TAG);
  element.setAttribute(LINK_ATTR.TARGET_KEY, value);
  element.render();
  element.update(href);
  return element;
}
