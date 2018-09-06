const { test } = QUnit;
import start, { ajax, getJSON, delegate, fire, CSRFProtection, matches } from '../src/index';

test('ujs', function(assert){
  assert.ok(start, 'should have start');

  assert.ok(ajax, 'should have ajax');
  assert.ok(getJSON, 'should have getJSON');  
  assert.ok(delegate, 'should have delegate');
  assert.ok(fire, 'should have fire');
  assert.ok(CSRFProtection, 'should have CSRFProtection');
  assert.ok(matches, 'should have matches');
});
