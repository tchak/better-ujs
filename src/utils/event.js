import { on as delegate, off } from 'delegated-events';

// Triggers a custom event on an element and returns false if the event result is false
// obj::
//   a native DOM element
// name::
//   string that corrspends to the event you want to trigger
//   e.g. 'click', 'submit'
// data::
//   data you want to pass when you dispatch an event
export function fire(obj, name, data) {
  let event = new CustomEvent(name, {
    bubbles: true,
    cancelable: true,
    detail: data
  });
  obj.dispatchEvent(event);
  return !event.defaultPrevented;
}

// Helper function, needed to provide consistent behavior in IE
export function stopEverything(e) {
  fire(e.target, 'ujs:everythingStopped');
  e.preventDefault();
  e.stopPropagation();
  e.stopImmediatePropagation();
}

export { delegate, off };
