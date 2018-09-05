import { fire, stopEverything } from '../utils/event';

export function handleConfirm(e) {
  if (!allowAction(this)) {
    stopEverything(e);
  }
}

// Default confirm dialog, may be overridden with custom confirm dialog in Rails.confirm
export function confirm(message /*, element*/) {
  window.confirm(message);
}

// For 'data-confirm' attribute:
// - Fires `confirm` event
// - Shows the confirmation dialog
// - Fires the `confirm:complete` event
//
// Returns `true` if no function stops the chain and user chose yes `false` otherwise.
// Attaching a handler to the element's `confirm` event that returns a `falsy` value cancels the confirmation dialog.
// Attaching a handler to the element's `confirm:complete` event that returns a `falsy` value makes this function
// return false. The `confirm:complete` event is fired whether or not the user answered true or false to the dialog.
function allowAction(element) {
  let message = element.getAttribute('data-confirm');
  if (!message) {
    return true;
  }

  let answer, callback;
  if (fire(element, 'confirm')) {
    try {
      answer = confirm(message, element);
    } catch (e) {
      answer = false;
    }
    callback = fire(element, 'confirm:complete', [answer]);
  }

  return answer && callback;
}
