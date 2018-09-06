import { stopEverything } from '../utils/event';
import { isCrossDomain } from '../utils/ajax';
import {
  csrfToken as getCsrfToken,
  csrfParam as getCsrfParam
} from '../utils/csrf';

// Handles "data-method" on links such as:
// <a href="/users/5" data-method="delete" rel="nofollow" data-confirm="Are you sure?">Delete</a>
export function handleMethod(e) {
  let link = this;
  let method = link.getAttribute('data-method');

  if (!method) {
    return false;
  }

  let href = link.href;
  let csrfToken = getCsrfToken();
  let csrfParam = getCsrfParam();
  let form = document.createElement('form');
  let formContent = `<input name='_method' value='${method}' type='hidden' />`;

  if (csrfParam && csrfToken && !isCrossDomain(href)) {
    formContent += `<input name='${csrfParam}' value='${csrfToken}' type='hidden' />`;
  }

  // Must trigger submit by click on a button, else "submit" event handler won't work!
  // https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/submit
  formContent += '<input type="submit" />';

  form.method = 'post';
  form.action = href;
  form.target = link.target;
  form.innerHTML = formContent;
  form.style.display = 'none';

  document.body.appendChild(form);
  form.querySelector('[type="submit"]').click();

  return stopEverything(e);
}
