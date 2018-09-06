import { matches, find, setData, getData, removeData } from './dom';

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
    return find(selector);
  }
}

export function serializeFormElement(element, button) {
  if (element.enctype === 'multipart/form-data') {
    disableEmptyFileInputs(element);
    let data = new FormData(element);
    enableEmptyFileInputs(element);
    if (button) {
      data.append(button.name, button.value);
    }
    return data;
  } else {
    return serializeElement(element, button);
  }
}

function disableEmptyFileInputs(element) {
  find(element, 'input[type="file"]:not([disabled])')
    .filter(input => input.files.length > 0)
    .forEach(input => {
      setData(input, 'ujs:temp-disabled', true);
      input.disabled = true;
    });
}

function enableEmptyFileInputs(element) {
  find(element, 'input[type="file"]')
    .filter(input => getData(input, 'ujs:temp-disabled'))
    .forEach(input => {
      removeData(input, 'ujs:temp-disabled');
      input.disabled = false;
    });
}
