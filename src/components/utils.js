export function setAttribute(component, attribute, value) {
  !!value
    ? component.setAttribute(attribute, value)
    : component.removeAttribute(attribute);
}

export function setBooleanAttribute(component, attribute, value) {
  !!value
    ? component.setAttribute(attribute, true)
    : component.removeAttribute(attribute);
}

export function defineComponent(componentTag, componentClass) {
  if (window.customElements.get(componentTag)) return;

  window.customElements.define(componentTag, componentClass);
}
