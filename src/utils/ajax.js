import param from 'jquery-param';
import { cspNonce } from './csp';
import { CSRFProtection } from './csrf';

const AcceptHeaders = {
  '*': '*/*',
  text: 'text/plain',
  html: 'text/html',
  xml: 'application/xml, text/xml',
  json: 'application/json, text/javascript',
  script:
    'text/javascript, application/javascript, application/ecmascript, application/x-ecmascript'
};

export default function ajax(options = {}) {
  options.headers = options.headers || {};
  // Add X-CSRF-Token
  CSRFProtection(options);
  let { url, beforeSend, raw, ...opts } = prepareOptions(options);
  if (beforeSend && beforeSend({ url, ...opts }) === false) {
    return Promise.reject(new Error('Ajax stopped.'));
  }

  function success({ response, data }) {
    if (raw) {
      return response;
    } else if (response.ok) {
      return data;
    } else {
      throw response;
    }
  }

  function error(error) {
    opts.error(error, 'error');
    opts.complete(error, 'error', error);
    throw error;
  }

  return fetch(url, opts)
    .then(processResponse(opts))
    .then(success, error);
}

export function getJSON(url, data) {
  return ajax({ url, dataType: 'json', data });
}

function prepareOptions({ dataType, data, ...options }) {
  if (options.crossDomain !== true && !isCrossDomain(options.url)) {
    options.headers['x-requested-with'] = 'XMLHttpRequest';
  }
  options.method = options.method ? options.method.toUpperCase() : 'GET';

  // append data to url if it's a GET request
  if (options.method === 'GET') {
    if (data) {
      data = typeof data === 'string' ? data : param(data);
      if (options.url.indexOf('?') < 0) {
        options.url += '?' + data;
      } else {
        options.url += '&' + data;
      }
    }
  } else {
    // Set Content-Type only when sending a string
    // Sending FormData will automatically set Content-Type to multipart/form-data
    if (typeof data === 'string') {
      options.headers['content-type'] =
        'application/x-www-form-urlencoded; charset=UTF-8';
    }
    options.body = data;
  }

  // Use "*" as default dataType
  if (!AcceptHeaders[dataType]) {
    dataType = '*';
  }
  let accept = options.accept || AcceptHeaders[dataType];
  if (dataType !== '*') {
    accept += ', */*; q=0.01';
  }
  options.headers['accept'] = accept;
  return options;
}

function processResponse(options) {
  return function(response) {
    return parseResponse(response.clone()).then(data => {
      if (response.ok) {
        options.success(data, response.statusText, response);
      } else {
        options.error(data, response.statusText, response);
      }
      options.complete(data, response.statusText, response);
      return { response, data };
    });
  };
}

function parseResponse(response) {
  let type = response.headers.get('content-type');
  if (typeof type === 'string') {
    if (type.match(/\bjson\b/)) {
      return response.json();
    } else if (type.match(/\bjavascript\b/)) {
      return response.text().then(parseScript);
    } else if (type.match(/\b(xml|html|svg)\b/)) {
      return response.text().then(xml => parseXML(type, xml));
    }
  }
  return response.text();
}

function parseScript(response) {
  let script = document.createElement('script');
  let nonce = cspNonce();
  if (nonce) {
    script.setAttribute('nonce', nonce);
  }
  script.text = response;
  document.head.appendChild(script).parentNode.removeChild(script);
  return response;
}

function parseXML(type, response) {
  let parser = new DOMParser();
  type = type.replace(/;.+/, ''); // remove something like ';charset=utf-8'
  try {
    return parser.parseFromString(response, type);
  } catch (e) {
    return null;
  }
}

const crossDomainURLCache = {};

// Determines if the request is a cross domain request.
export function isCrossDomain(url) {
  if (crossDomainURLCache.hasOwnProperty(url)) {
    return crossDomainURLCache[url];
  }
  let originAnchor = document.createElement('a');
  originAnchor.href = location.href;
  let urlAnchor = document.createElement('a');
  try {
    urlAnchor.href = url;
    // If URL protocol is false or is a string containing a single colon
    // *and* host are false, assume it is not a cross-domain request
    // (should only be the case for IE7 and IE compatibility mode).
    // Otherwise, evaluate protocol and host of the URL against the origin
    // protocol and host.
    let noProtocol =
      (!urlAnchor.protocol || urlAnchor.protocol == ':') && !urlAnchor.host;
    let originURL = `${originAnchor.protocol}//${originAnchor.host}`;
    let anchorURL = `${urlAnchor.protocol}//${urlAnchor.host}`;
    crossDomainURLCache[url] = !(noProtocol || originURL === anchorURL);
  } catch (e) {
    // If there is an error parsing the URL, assume it is crossDomain.
    crossDomainURLCache[url] = true;
  }
  return crossDomainURLCache[url];
}
