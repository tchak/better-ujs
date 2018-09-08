import { getData, setData } from '../utils/dom';
import { fire } from '../utils/event';

export function handleAddClass({ detail }) {
  this.className.add(...toArray(detail));
}

export function handleRemoveClass({ detail }) {
  this.className.remove(...toArray(detail));
}

export function handleToggleClass({ detail }) {
  this.className.toggle(detail);
}

export function handleReplaceInnerHtml({ detail }) {
  this.innerHTML = detail;
}

export function handleReplaceOuterHtml({ detail }) {
  this.outerHTML = detail;
}

export function handleReplaceText({ detail }) {
  this.textContent = detail;
}

export function handleAfterElement({ detail }) {
  const element = this;
  if (typeof detail === 'string') {
    element.insertAdjacentHTML('afterend', detail);
  } else if (element.nextSibling) {
    element.parentNode.insertBefore(detail, element.nextSibling);
  } else {
    element.parentNode.appendChild(detail);
  }
}

export function handleBeforeElement({ detail }) {
  const element = this;
  if (typeof detail === 'string') {
    element.insertAdjacentHTML('beforebegin', detail);
  } else {
    element.parentNode.insertBefore(detail, element);
  }
}

export function handleAppendElement({ detail }) {
  if (typeof detail === 'string') {
    detail = createHTMLFragment(detail);
  }
  this.appendChild(detail);
}

export function handlePrependElement({ detail }) {
  const element = this;
  if (typeof detail === 'string') {
    detail = createHTMLFragment(detail);
  }
  if (element.firstChild) {
    element.insertBefore(detail, element.firstChild);
  } else {
    element.appendChild(detail);
  }
}

export function handleRemoveElement() {
  this.parentNode.removeChild(this);
}

export function handleEmptyElement() {
  this.innerHTML = '';
}

export function handleSetData({ detail }) {
  const element = this;
  let data = getData(element, 'ujs:page-data');
  if (data !== detail) {
    setData(element, 'ujs:page-data', detail);
    fire(element, 'data:change', detail);
  }
}

function toArray(classList) {
  return Array.isArray(classList) ? classList : classList.split(/\s*/);
}

function createHTMLFragment(html) {
  let fragment = document.createDocumentFragment();
  fragment.innerHTML = html;
  return fragment;
}
