const { test } = QUnit;
import start, { ajax, getJSON } from '../src/index';

test('ujs', function(assert){
  assert.ok(ajax, 'should have ajax');
  assert.ok(getJSON, 'should have getJSON');
  assert.ok(start, 'should have start');
});
