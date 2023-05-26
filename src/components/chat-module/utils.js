import errorHandler from '../../handler/error-handler.js';
import router, { fetchData } from '../../router/router.js';
import templates from '../../templates/templates.js';

import { MESSAGE_TAG } from '../components.js';

const parser = new DOMParser();

const parseDataString = (string) => {
  const parsed = parser.parseFromString(string, 'text/html');
  return parsed.body.children.length > 0
    ? [...parsed.body.children]
    : [...parsed.head.children];
};

const filterTemplateElements = (data) => {
  const elements = parseDataString(data);
  const templateElements = [];
  // templates are attached at the end
  let i = elements.length - 1;

  while (i >= 0) {
    const element = elements[i];

    if (element.localName !== 'template') break;

    templateElements.push(elements.pop());
    i -= 1;
  }

  if (templateElements.length === 0) return elements;

  for (const template of templateElements) {
    templates.set(template);
  }

  return elements;
};

const hasDynamicElements = (elements) => {
  return elements
    .filter(
      (element) => element.localName === MESSAGE_TAG && !element.innerHTML
    )
    .reduce(
      (result, element) =>
        result
          ? result
          : !templates.isCachedMessage(element.attributes[0].name),
      false
    );
};

export const getModuleElements = async (moduleTemplateId, moduleKey) => {
  const output = {
    moduleElements: null,
    moduleWasCached: null,
  };

  let data;

  // return cached elements
  if (templates.isCachedModule(moduleTemplateId)) {
    data = templates.get(moduleTemplateId);

    output.moduleElements = parseDataString(data);
    output.moduleWasCached = true;
    return output;
  }

  // fetch data
  const path = router.getFileUrl(moduleKey);
  data = await fetchData(path);

  if (!data || errorHandler.get()) {
    return output;
  }

  // cache attached template elements
  // and remove from elements array
  output.moduleElements = filterTemplateElements(data);

  // fetch additional data based on ChatMessage attributes
  const doRequest = hasDynamicElements(output.moduleElements);

  if (doRequest) {
    data = await fetchData('/views/templates.html');

    if (!data || errorHandler.get()) return output;

    // @todo
    // either redo parseDataString
    // bc templates are attached to head
    // or create template innerHTML = response.data etc
    const templateElements = parseDataString(data);
    for (const element of templateElements) {
      templates.set(element);
    }
  }

  return output;
};

export const injectContactsData = async (contacts) => {
  const imported = await import('../../handler/data-handler.js');
  const { error, data } = await imported.default();

  contacts.forEach((contact) => {
    contact.injectData(error, data);
  });
};
