export function setAttribute(component, attribute, value) {}

export function setBooleanAttribute(component, attribute, value) {
  !!value
    ? component.setAttribute(attribute, true)
    : component.removeAttribute(attribute);
}
