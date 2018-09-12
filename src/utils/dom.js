// Checks if the given native dom element matches the selector
// element::
//   native DOM element
// selector::
//   css selector string or
//   a javascript object with `selector` and `exclude` properties
//   Examples: "form", { selector: "form", exclude: "form[data-remote='true']"}
export function matches(element, selector) {
  if (selector.exclude) {
    return (
      element.matches(selector.selector) && !element.matches(selector.exclude)
    );
  } else {
    return element.matches(selector);
  }
}

const elementData = new WeakMap();

export function getData(element, key) {
  let data = elementData.get(element);
  if (data) {
    return data[key];
  }
  return;
}

export function setData(element, key, value) {
  let data = elementData.get(element);
  if (data) {
    data[key] = value;
  } else {
    elementData.set(element, { [key]: value });
  }
}

export function removeData(element, key) {
  let data = elementData.get(element);
  if (data) {
    delete data[key];
  }
}

export function getMetaContent(name) {
  let meta = document.querySelector(`meta[name=${name}]`);
  return meta && meta.content;
}

export function queryAll(selector, element) {
  return [...(element || document).querySelectorAll(selector)];
}
