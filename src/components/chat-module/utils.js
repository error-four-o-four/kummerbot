import router, { fetchData } from '../../router/router.js';
import templates from '../../templates/templates.js';

// @todo
export const setAttribute = (component, attr, value) =>
  !!value
    ? component.setAttribute(attr, value)
    : component.removeAttribute(attr);

export const getData = async (cacheId, componentKey) => {
  if (templates.isCachedModule(cacheId)) {
    return {
      data: templates.get(cacheId),
      moduleWasCached: true,
    };
  }

  const path = router.getFileUrl(componentKey);
  const response = await fetchData(path);

  return {
    ...response,
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
