import { delegate } from './utils/event';

// iOS 11.3 Safari / macOS Safari 11.1 empty <input type="file"> XHR bug workaround.
// This should work with every modern browser which supports ES5 (including IE9).
// https://stackoverflow.com/questions/49614091/safari-11-1-ajax-xhr-form-submission-fails-when-inputtype-file-is-empty
// https://github.com/rails/rails/issues/32440

export function fixSafari11() {
  delegate('ajax:before', 'input[type="file"]:not([disabled])', function() {
    let input = this;
    if (input.files.length > 0) {
      return;
    }
    input.setAttribute('data-safari-temp-disabled', 'true');
    input.setAttribute('disabled', 'disabled');
  });

  // You should call this by yourself when you aborted an ajax request by stopping a event in ajax:before hook.
  delegate(
    'ajax:beforeSend',
    'input[type="file"][data-safari-temp-disabled]',
    function() {
      let input = this;
      input.removeAttribute('data-safari-temp-disabled');
      input.removeAttribute('disabled');
    }
  );
}
