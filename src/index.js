import { on as delegate } from 'delegated-events';
import { getData, queryAll } from './utils/dom';
import { refreshCSRFTokens } from './utils/csrf';
import {
  enableElement,
  disableElement,
  handleDisabledElement
} from './features/disable';
import { handleConfirm } from './features/confirm';
import {
  handleRemote,
  formSubmitButtonClick,
  handleMetaClick
} from './features/remote';
import { handleMethod } from './features/method';
import { handleTrigger } from './features/trigger';

import {
  linkClickSelector,
  buttonClickSelector,
  inputChangeSelector,
  inputInputSelector,
  formSubmitSelector,
  formInputClickSelector,
  formEnableSelector,
  linkDisableSelector,
  buttonDisableSelector,
  triggerSelector
} from './utils/selectors';

export { delegate };
export { fire } from './utils/event';
export { CSRFProtection } from './utils/csrf';
export { default as ajax, getJSON } from './utils/ajax';

const DOM_EVENTS = ['click', 'submit', 'change', 'input'];
const AJAX_EVENTS = [
  'ajax:before',
  'ajax:beforeSend',
  'ajax:send',
  'ajax:complete',
  'ajax:stopped'
];

export default function start() {
  // This event works the same as the load event, except that it fires every
  // time the page is loaded.
  // See https://github.com/rails/jquery-ujs/issues/357
  // See https://developer.mozilla.org/en-US/docs/Using_Firefox_1.5_caching
  window.addEventListener('pageshow', () => {
    queryAll(`${formEnableSelector}, ${linkDisableSelector}`)
      .filter(el => getData(el, 'ujs:disabled'))
      .forEach(enableElement);
  });

  delegate('ajax:complete', linkDisableSelector, enableElement);
  delegate('ajax:stopped', linkDisableSelector, enableElement);
  delegate('ajax:complete', buttonDisableSelector, enableElement);
  delegate('ajax:stopped', buttonDisableSelector, enableElement);

  delegate('click', linkClickSelector, handleDisabledElement);
  delegate('click', linkClickSelector, handleConfirm);
  delegate('click', linkClickSelector, handleMetaClick);
  delegate('click', linkClickSelector, disableElement);
  delegate('click', linkClickSelector, handleRemote);
  delegate('click', linkClickSelector, handleMethod);

  delegate('click', buttonClickSelector, handleDisabledElement);
  delegate('click', buttonClickSelector, handleConfirm);
  delegate('click', buttonClickSelector, disableElement);
  delegate('click', buttonClickSelector, handleRemote);

  delegate('change', inputChangeSelector, handleDisabledElement);
  delegate('change', inputChangeSelector, handleConfirm);
  delegate('change', inputChangeSelector, handleRemote);

  delegate('input', inputInputSelector, handleRemote);

  delegate('submit', formSubmitSelector, handleDisabledElement);
  delegate('submit', formSubmitSelector, handleConfirm);
  delegate('submit', formSubmitSelector, handleRemote);

  // Normal mode submit
  // Slight timeout so that the submit button gets properly serialized
  delegate('submit', formSubmitSelector, disableElementWithTimeout);
  delegate('ajax:send', formSubmitSelector, disableElement);
  delegate('ajax:complete', formSubmitSelector, enableElement);

  delegate('click', formInputClickSelector, handleDisabledElement);
  delegate('click', formInputClickSelector, handleConfirm);
  delegate('click', formInputClickSelector, formSubmitButtonClick);

  DOM_EVENTS.forEach(delegateTriggerHandler);
  AJAX_EVENTS.forEach(delegateTriggerHandler);

  document.addEventListener('DOMContentLoaded', refreshCSRFTokens);
}

export function addCustomEvent(eventName, callback, options = {}) {
  document.addEventListener(eventName, event => {
    callback.call(event.target, event);
  });

  if (options.trigger) {
    delegateTriggerHandler(eventName);
  }
}

function delegateTriggerHandler(eventName) {
  delegate(eventName, triggerSelector, handleTrigger);
}

function disableElementWithTimeout(e) {
  setTimeout(() => disableElement(e), 10);
}
