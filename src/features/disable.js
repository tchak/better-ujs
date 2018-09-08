import { matches, getData, setData, removeData } from '../utils/dom';
import { stopEverything } from '../utils/event';
import { formElements } from '../utils/form';
import {
  formSubmitSelector,
  formEnableSelector,
  formDisableSelector,
  linkDisableSelector,
  buttonDisableSelector
} from '../utils/selectors';

export function handleDisabledElement(e) {
  const element = this;
  if (element.disabled) {
    stopEverything(e);
  }
}

// Unified function to enable an element (link, button and form)
export function enableElement(e) {
  const element = e instanceof Event ? e.target : e;
  if (matches(element, linkDisableSelector)) {
    enableLinkElement(element);
  } else if (
    matches(element, buttonDisableSelector) ||
    matches(element, formEnableSelector)
  ) {
    enableFormElement(element);
  } else if (matches(element, formSubmitSelector)) {
    enableFormElements(element);
  }
}

// Unified function to disable an element (link, button and form)
export function disableElement(e) {
  const element = e instanceof Event ? e.target : e;
  if (matches(element, linkDisableSelector)) {
    disableLinkElement(element);
  } else if (
    matches(element, buttonDisableSelector) ||
    matches(element, formDisableSelector)
  ) {
    disableFormElement(element);
  } else if (matches(element, formSubmitSelector)) {
    disableFormElements(element);
  }
}

//  Replace element's html with the 'data-disable-with' after storing original html
//  and prevent clicking on it
function disableLinkElement(element) {
  let replacement = element.getAttribute('data-disable-with');
  if (replacement) {
    setData(element, 'ujs:enable-with', element.innerHTML); // store enabled state
    element.innerHTML = replacement;
  }
  element.addEventListener('click', stopEverything); // prevent further clicking
  setData(element, 'ujs:disabled', true);
}

// Restore element to its original state which was disabled by 'disableLinkElement' above
function enableLinkElement(element) {
  let originalText = getData(element, 'ujs:enable-with');
  if (originalText) {
    element.innerHTML = originalText; // set to old enabled state
    removeData(element, 'ujs:enable-with');
  }
  element.removeEventListener('click', stopEverything); // enable element
  removeData(element, 'ujs:disabled');
}

// Disables form elements:
//  - Caches element value in 'ujs:enable-with' data store
//  - Replaces element text with value of 'data-disable-with' attribute
//  - Sets disabled property to true
function disableFormElements(form) {
  formElements(form, formDisableSelector).forEach(disableFormElement);
}

function disableFormElement(element) {
  let replacement = element.getAttribute('data-disable-with');
  if (replacement) {
    if (matches(element, 'button')) {
      setData(element, 'ujs:enable-with', element.innerHTML);
      element.innerHTML = replacement;
    } else {
      setData(element, 'ujs:enable-with', element.value);
      element.value = replacement;
    }
  }
  element.disabled = true;
  setData(element, 'ujs:disabled', true);
}

// Re-enables disabled form elements:
//  - Replaces element text with cached value from 'ujs:enable-with' data store (created in `disableFormElements`)
//  - Sets disabled property to false
function enableFormElements(form) {
  formElements(form, formEnableSelector).forEach(enableFormElement);
}

function enableFormElement(element) {
  let originalText = getData(element, 'ujs:enable-with');
  if (originalText) {
    if (matches(element, 'button')) {
      element.innerHTML = originalText;
    } else {
      element.value = originalText;
    }
    removeData(element, 'ujs:enable-with');
  }
  element.disabled = false;
  removeData(element, 'ujs:disabled');
}
