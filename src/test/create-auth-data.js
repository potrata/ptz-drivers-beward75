import test from 'blue-tape';
import createAuthData from './../create-auth-data';

test('Building Authentication Data', (t) => {
  t.test(`returns empty object if no data presented at all`, (assert) => {
    const result = createAuthData();
    assert.deepEqual(result, {});
    assert.end();
  });

  t.test(`returns empty object if "login" field doesn't exist`, (assert) => {
    const result = createAuthData({ password: '123' });
    assert.deepEqual(result, {});
    assert.end();
  });

  t.test(`returns empty object if login is not a string`, (assert) => {
    const result = createAuthData({ login: [1, 2, 3], password: 'whatever' });
    assert.deepEqual(result, {});
    assert.end();
  });

  t.test(`returns valid data object if password isn't set`, (assert) => {
    const result = createAuthData({ login: 'test-login' });
    assert.deepEqual(result, {
      user: 'test-login',
      pass: '',
      sendImmediately: false,
    });
    assert.end();
  });

  t.test(`returns valid data object with login and password`, (assert) => {
    const result = createAuthData({ login: 'test-login', password: '12345' });
    assert.deepEqual(result, {
      user: 'test-login',
      pass: '12345',
      sendImmediately: false,
    });
    assert.end();
  });
});

