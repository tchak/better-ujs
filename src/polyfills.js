import 'es6-promise/auto';
import 'whatwg-fetch';
import 'es6-weak-map/implement';
import 'custom-event-polyfill';

if (!Element.prototype.closest) {
  Element.prototype.closest = function(selector) {
    let element = this;
    if (!document.documentElement.contains(element)) {
      return null;
    }
    do {
      if (element.matches(selector)) {
        return element;
      }
      element = element.parentElement || element.parentNode;
    } while (element !== null && element.nodeType === 1);
    return null;
  };
}

Element.prototype.matches =
  Element.prototype.matches ||
  Element.prototype.matchesSelector ||
  Element.prototype.mozMatchesSelector ||
  Element.prototype.msMatchesSelector ||
  Element.prototype.oMatchesSelector ||
  Element.prototype.webkitMatchesSelector;

if (!DOMTokenList.prototype.toggle) {
  const { add, remove } = DOMTokenList.prototype;

  DOMTokenList.prototype.add = function(...tokens) {
    tokens.forEach(token => add.call(this, token));
  };

  DOMTokenList.prototype.remove = function(...tokens) {
    tokens.forEach(token => remove.call(this, token));
  };

  DOMTokenList.prototype.toggle = function(token, force) {
    const hasToken = this.contains(token);
    if (hasToken && force !== true) {
      this.remove(token);
      return false;
    } else if (!hasToken && force !== false) {
      this.add(token);
      return true;
    }
    return hasToken;
  };
}

if (!DOMTokenList.prototype.replace) {
  DOMTokenList.prototype.replace = function(oldToken, newToken) {
    if (this.contains(oldToken)) {
      this.add(newToken);
      this.remove(oldToken);
      return true;
    }
    return false;
  };
}
