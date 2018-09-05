import { getMetaContent, $ } from './dom';

const CSRFTokenHeader = 'x-csrf-token';

// Up-to-date Cross-Site Request Forgery token
export function csrfToken() {
  return getMetaContent('csrf-token');
}

// URL param that must contain the CSRF token
export function csrfParam() {
  return getMetaContent('csrf-param');
}

// Make sure that every Ajax request sends the CSRF token
export function CSRFProtection(xhrOrOptions) {
  let token = csrfToken();
  if (token) {
    if (xhrOrOptions.headers) {
      xhrOrOptions.headers[CSRFTokenHeader] = token;
    } else if (typeof xhrOrOptions.setRequestHeader === 'function') {
      xhrOrOptions.setRequestHeader(CSRFTokenHeader, token);
    }
  }
}

// Make sure that all forms have actual up-to-date tokens (cached forms contain old ones)
export function refreshCSRFTokens() {
  let token = csrfToken();
  let param = csrfParam();
  if (token && param) {
    $(`form input[name="${param}"]`).forEach(input => {
      input.value = token;
    });
  }
}
