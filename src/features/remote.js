import debounce from 'debounce';
import { matches, getData, setData, removeData } from '../utils/dom';
import { fire, stopEverything } from '../utils/event';
import ajax from '../utils/ajax';
import { serializeElement, serializeFormElement } from '../utils/form';
import { formSubmitSelector } from '../utils/selectors';

const DEFAULT_DEBOUNCE = 200;

// Checks "data-remote" if true to handle the request through a XHR request.
function isRemote(element) {
  let value = element.getAttribute('data-remote');
  return value && value !== 'false';
}

function handleRemoteWithDebounce(e) {
  let element = this;

  if (!isRemote(element)) {
    return true;
  }

  let handler = getData(element, 'ujs:debounce');
  let interval = element.getAttribute('data-debounce');

  if (!handler) {
    if (interval) {
      if (interval === 'true') {
        interval = DEFAULT_DEBOUNCE;
      } else {
        interval = parseInt(interval);
      }
      handler = debounce(handleRemote, interval);
      setData(element, 'ujs:debounce', handler);
    } else {
      handler = handleRemote;
    }
  }

  return handler.call(element, e);
}

export { handleRemoteWithDebounce as handleRemote };

// Submits "remote" forms and links with ajax
function handleRemote(e) {
  let element = this;

  if (!fire(element, 'ajax:before')) {
    fire(element, 'ajax:stopped');
    return;
  }

  let format = element.getAttribute('data-format');
  let isInput = matches(element, 'input');
  if (isInput && format && !new RegExp(format).test(element.value)) {
    fire(element, 'ajax:stopped');
    return;
  }

  let withCredentials = element.getAttribute('data-with-credentials');
  let dataType = element.getAttribute('data-type') || 'script';
  let url, method, data;

  if (matches(element, formSubmitSelector)) {
    // memoized value from clicked submit button
    let button = getData(element, 'ujs:submit-button');

    method = getData(element, 'ujs:submit-button-formmethod') || element.method;
    url =
      getData(element, 'ujs:submit-button-formaction') ||
      element.getAttribute('action') ||
      location.href;

    // strip query string if it's a GET request
    if (method.toUpperCase() === 'GET') {
      url = url.replace(/\?.*$/, '');
    }

    data = serializeFormElement(element, button);

    removeData(element, 'ujs:submit-button');
    removeData(element, 'ujs:submit-button-formmethod');
    removeData(element, 'ujs:submit-button-formaction');
  } else {
    let isAnchor = matches(element, 'a');
    let params = element.getAttribute('data-params');
    method = element.getAttribute('data-method');
    url = isAnchor ? element.href : element.getAttribute('data-url');
    data = isAnchor ? params : serializeElement(element, params);
  }

  ajax({
    url,
    method,
    data,
    dataType,
    // stopping the "ajax:beforeSend" event will cancel the ajax request
    beforeSend: options => {
      if (fire(element, 'ajax:beforeSend', options)) {
        fire(element, 'ajax:send');
      } else {
        fire(element, 'ajax:stopped');
        return false;
      }
    },
    success: (...args) => fire(element, 'ajax:success', args),
    error: (...args) => fire(element, 'ajax:error', args),
    complete: (...args) => fire(element, 'ajax:complete', args),
    withCredentials: withCredentials && withCredentials !== 'false'
  });

  stopEverything(e);
}

export function formSubmitButtonClick() {
  let button = this;
  let form = button.form;
  if (!form) {
    return;
  }
  // Register the pressed submit button
  if (button.name) {
    setData(form, 'ujs:submit-button', {
      name: button.name,
      value: button.value
    });
  }
  // Save attributes from button
  setData(
    form,
    'ujs:submit-button-formaction',
    button.getAttribute('formaction')
  );
  setData(
    form,
    'ujs:submit-button-formmethod',
    button.getAttribute('formmethod')
  );
}

export function handleMetaClick(e) {
  let link = this;
  let method = (link.getAttribute('data-method') || 'GET').toUpperCase();
  let data = link.getAttribute('data-params');
  let metaClick = e.metaKey || e.ctrlKey;
  if (metaClick && method === 'GET' && !data) {
    e.stopImmediatePropagation();
  }
}
