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

// get and set data on a given element using "expando properties"
// See: https://developer.mozilla.org/en-US/docs/Glossary/Expando
const expando = '_ujsData';

export function getData(element, key) {
  return element[expando] && element[expando][key];
}

export function setData(element, key, value) {
  element[expando] = element[expando] || {};
  element[expando][key] = value;
}

export function removeData(element, key) {
  element[expando] = element[expando] || {};
  delete element[expando][key];
}

export function getMetaContent(name) {
  let meta = document.querySelector(`meta[name=${name}]`);
  return meta && meta.content;
}

// a wrapper for document.querySelectorAll
// returns an Array
export function find(selector) {
  return [...document.querySelectorAll(selector)];
}
