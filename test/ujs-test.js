/* global QUnit */
const { test } = QUnit;

import start, {
  ajax,
  getJSON,
  delegate,
  fire,
  CSRFProtection,
  addCustomEvent
} from '../src/index';

test('ujs', function(assert) {
  assert.ok(start, 'should export start');

  assert.ok(ajax, 'should export ajax');
  assert.ok(getJSON, 'should export getJSON');
  assert.ok(delegate, 'should export delegate');
  assert.ok(fire, 'should export fire');
  assert.ok(CSRFProtection, 'should export CSRFProtection');
  assert.ok(addCustomEvent, 'should export addCustomEvent');
});

test('ujs#start()', function(assert) {
  start();
  addCustomEvent('remove', ({ target }) => target.remove());
  html('<a id=link data-trigger="remove"></a>');
  assert.ok(query('#link'));
  fire(query('#link'), 'click');
  assert.ok(!query('#link'));
});

function html(html) {
  document.querySelector('#qunit-fixture').innerHTML = html;
}

function query(selector) {
  return document.querySelector('#qunit-fixture').querySelector(selector);
}
