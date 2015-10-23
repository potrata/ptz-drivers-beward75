import test from 'blue-tape';
import validateCommand from './../validate-command';

test('Command validation', (t) => {
  t.test('passes valid command through', () => {
    return validateCommand({
      ip: '2.3.4.5',
      login: '123',
      password: '',
      model: 'some',
      action: 'setPosition',
      x: 1.0, y: 0.0, z: -1.0,
    });
  });

  t.test('throws if action type is invalid', (assert) => {
    return validateCommand({
      ip: '1.2.3.4',
      model: 'beward',
      action: 'invalidActionType',
      x: 1, y: 0, z: -1,
    }).catch(err => {
      assert.deepEqual(err, { 'action': ['invalidActionType is not included in the list'] });
      return err;
    });
  });

  t.test('throws if data params type is invalid', (assert) => {
    return validateCommand({
      ip: '1.2.3.4',
      model: 'beward',
      action: 'setPosition',
      x: 'abcdefg', y: { 's': 2 }, z: [1, 2, 3],
    }).catch(err => {
      assert.deepEqual(err, {
        'x': ['X is not valid'],
        'y': ['Y is not valid'],
        'z': ['Z is not valid'],
      });
      return err;
    });
  });
});
