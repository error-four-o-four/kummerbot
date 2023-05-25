import router, { fetchData } from '../../router/router.js';
import templates from '../../templates/templates.js';
import { MESSAGE_TAG } from '../components.js';

// @todo
export const setAttribute = (component, attr, value) =>
  !!value
    ? component.setAttribute(attr, value)
    : component.removeAttribute(attr);

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
    console.log(template);
    templates.set(template);
  }

  return elements;
};

// const filterTemplateElements = (data) =>
//   parseModuleData(data).filter((element) => {
//     if (
//       element.localName === 'template' &&
//       !templates.isCachedMessage(element.id)
//     ) {
//       templates.set(element);
//       // moduleElements
//       return false;
//     }
//     return true;
//   });

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
  // return cached elements
  if (templates.isCachedModule(moduleTemplateId)) {
    const cachedData = templates.get(moduleTemplateId);

    return {
      moduleElements: parseDataString(cachedData),
      moduleWasCached: true,
    };
  }

  // fetch data
  const path = router.getFileUrl(moduleKey);
  let response = await fetchData(path);

  if (response.error) {
    // todo
    return {
      error: response.error,
      moduleElements: null,
    };
  }

  // cache attached template elements
  // and remove from elements array
  const moduleElements = filterTemplateElements(response.data);

  // fetch additional data based on ChatMessage attributes
  const doRequest = hasDynamicElements(moduleElements);

  if (doRequest) {
    response = await fetchData('/views/templates.html');

    if (response.error) return { error };

    // @todo
    // either redo parseDataString
    // bc templates are attached to head
    // or create template innerHTML = response.data etc
    const templateElements = parseDataString(response.data);
    for (const element of templateElements) {
      templates.set(element);
    }
  }

  return {
    moduleElements,
    moduleWasCached: false,
  };
};

export const injectContactsData = async (contacts) => {
  const imported = await import('../../data/index.js');
  const { error, data } = await imported.default();

  contacts.forEach((contact) => {
    contact.injectData(error, data);
  });
};
