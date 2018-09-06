import { on as delegate } from 'delegated-events';
import './polyfills';
import { getData, find } from './utils/dom';
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

import {
  linkClickSelector,
  buttonClickSelector,
  inputChangeSelector,
  inputInputSelector,
  formSubmitSelector,
  formInputClickSelector,
  formEnableSelector,
  linkDisableSelector,
  buttonDisableSelector
} from './utils/selectors';

export { delegate };
export { fire } from './utils/event';
export { CSRFProtection } from './utils/csrf';
export { default as ajax, getJSON } from './utils/ajax';
export { matches } from './utils/dom';

export default function start() {
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

  document.addEventListener('DOMContentLoaded', refreshCSRFTokens);
}

function disableElementWithTimeout(e) {
  setTimeout(() => disableElement(e), 10);
}
