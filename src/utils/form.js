import { matches, $ } from './dom';

export function serializeElement(element, additionalParam) {
  let inputs = [element];
  let params = [];

  if (matches(element, 'form')) {
    inputs = [...element.elements];
  }

  inputs.forEach(input => {
    if (!input.name || input.disabled) {
      return;
    }
    if (matches(input, 'select')) {
      [...input.options].forEach(option => {
        if (option.selected) {
          params.push({ name: input.name, value: option.value });
        }
      });
    } else if (
      input.checked ||
      ['radio', 'checkbox', 'submit'].indexOf(input.type) == -1
    ) {
      params.push({ name: input.name, value: input.value });
    }
  });

  if (additionalParam) {
    params.push(additionalParam);
  }

  return params
    .map(param => {
      if (param.name) {
        return `${encodeURIComponent(param.name)}=${encodeURIComponent(
          param.value
        )}`;
      } else {
        return param;
      }
    })
    .join('&');
}

// Helper function that returns form elements that match the specified CSS selector
// If form is actually a "form" element this will return associated elements outside the from that have
// the html form attribute set
export function formElements(form, selector) {
  if (matches(form, 'form')) {
    return [...form.elements].filter(el => matches(el, selector));
  } else {
    return $(selector);
  }
}
