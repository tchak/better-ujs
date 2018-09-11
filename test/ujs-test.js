/* global QUnit */
const { test } = QUnit;

import start, {
  ajax,
  getJSON,
  delegate,
  fire,
  CSRFProtection
} from '../src/index';

test('ujs', function(assert) {
  assert.ok(start, 'should have start');

  assert.ok(ajax, 'should have ajax');
  assert.ok(getJSON, 'should have getJSON');
  assert.ok(delegate, 'should have delegate');
  assert.ok(fire, 'should have fire');
  assert.ok(CSRFProtection, 'should have CSRFProtection');
});

test('ujs#start()', function(assert) {
  start();
  on('remove', function() {
    this.parentElement.removeChild(this);
  });
  html('<a id=link data-trigger="remove"></a>');
  assert.ok(query('#link'));
  fire(query('#link'), 'click');
  assert.ok(!query('#link'));
});

function on(eventName, fn) {
  document
    .querySelector('#qunit-fixture')
    .addEventListener(eventName, function(event) {
      fn.call(event.target, event);
    });
}

function html(html) {
  document.querySelector('#qunit-fixture').innerHTML = html;
}

function query(selector) {
  return document.querySelector('#qunit-fixture').querySelector(selector);
}
