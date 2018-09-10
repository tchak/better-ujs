import { on as delegate } from 'delegated-events';
import './polyfills';
import { getData, find } from './utils/dom';
import { refreshCSRFTokens } from './utils/csrf';
import { fire } from './utils/event';
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
  handleAddClass,
  handleRemoveClass,
  handleToggleClass,
  handleReplaceInnerHtml,
  handleReplaceOuterHtml,
  handleAfterElement,
  handleBeforeElement,
  handleAppendElement,
  handlePrependElement,
  handleEmptyElement,
  handleRemoveElement,
  handleReplaceText
} from './features/dom';

import { handleSetData } from './features/data';

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

const DOM_EVENTS = ['click', 'submit', 'change', 'input', 'data:change'];
const AJAX_EVENTS = [
  'ajax:before',
  'ajax:beforeSend',
  'ajax:send',
  'ajax:complete',
  'ajax:stopped'
];

export default function start({ customEvents, hideClassName } = {}) {
  // This event works the same as the load event, except that it fires every
  // time the page is loaded.
  // See https://github.com/rails/jquery-ujs/issues/357
  // See https://developer.mozilla.org/en-US/docs/Using_Firefox_1.5_caching
  window.addEventListener('pageshow', () => {
    find(`${formEnableSelector}, ${linkDisableSelector}`)
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
  if (customEvents) {
    customEvents.forEach(delegateTriggerHandler);
  }

  document.addEventListener('data:set', bindEvent(handleSetData));

  document.addEventListener('dom:class:add', bindEvent(handleAddClass));
  document.addEventListener('dom:class:remove', bindEvent(handleRemoveClass));
  document.addEventListener('dom:class:toggle', bindEvent(handleToggleClass));

  document.addEventListener(
    'dom:html:replace',
    bindEvent(handleReplaceInnerHtml)
  );
  document.addEventListener(
    'dom:html:replace:outer',
    bindEvent(handleReplaceOuterHtml)
  );

  document.addEventListener('dom:text:replace', bindEvent(handleReplaceText));

  document.addEventListener('dom:element:after', bindEvent(handleAfterElement));
  document.addEventListener(
    'dom:element:before',
    bindEvent(handleBeforeElement)
  );
  document.addEventListener(
    'dom:element:append',
    bindEvent(handleAppendElement)
  );
  document.addEventListener(
    'dom:element:prepend',
    bindEvent(handlePrependElement)
  );

  document.addEventListener(
    'dom:element:remove',
    bindEvent(handleRemoveElement)
  );
  document.addEventListener('dom:element:empty', handleEmptyElement);

  hideClassName = hideClassName || 'display-none';

  document.addEventListener(
    'dom:element:show',
    redirectEvent('dom:class:remove', hideClassName)
  );
  document.addEventListener(
    'dom:element:hide',
    redirectEvent('dom:class:add', hideClassName)
  );
  document.addEventListener(
    'dom:element:toggle',
    redirectEvent('dom:class:toggle', hideClassName)
  );

  document.addEventListener('DOMContentLoaded', refreshCSRFTokens);
}

function bindEvent(handler) {
  return function(e) {
    handler.call(e.target, e);
  };
}

function redirectEvent(eventName, data) {
  return function({ target: element }) {
    fire(element, eventName, data);
  };
}

function delegateTriggerHandler(eventName) {
  delegate(eventName, triggerSelector, handleTrigger);
}

function disableElementWithTimeout(e) {
  setTimeout(() => disableElement(e), 10);
}
