import router, { fetchData } from '../../router/router.js';
import templates from '../../renderer/templates.js';

export const setAttribute = (component, attr, value) =>
  !!value
    ? component.setAttribute(attr, value)
    : component.removeAttribute(attr);

export const getData = async (cacheId, componentKey) => {
  if (templates.isCached(cacheId)) {
    return {
      data: templates.get(cacheId),
      wasCached: true,
    };
  }

  const path = router.getFileUrl(componentKey);
  const response = await fetchData(path);

  return {
    ...response,
    wasCached: false,
  };
};

export const injectContactsData = async (contacts, componentHref) => {
  const imported = await import('../../data/index.js');
  const { error, data } = await imported.default();

  contacts.forEach((contact) => {
    contact.injectData(error, data, componentHref);
  });
};
