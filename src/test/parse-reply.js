import test from 'blue-tape';
import parseReply from './../parse-reply';

test('Reply Parsing', (t) => {
  t.test('returns an object when reply is device position info', (assert) => {
    const result = parseReply(`
      pan = 1.0,
      tilt = 2.333
      zoom = -333
    `);

    assert.equals(typeof result, 'object');
    assert.end();
  });

  t.test('converts data keys to x, y, z', (assert) => {
    const result = parseReply(`
      pan = 40.4,
      tilt = 1
      zoom = 23
    `);

    assert.ok(result.x, 'x key exists');
    assert.ok(result.y, 'y key exists');
    assert.ok(result.z, 'z key exists');
    assert.end();
  });

  t.test('rounds data values to nearest decimals', (assert) => {
    const result = parseReply(`
      pan = 4.4,
      tilt = -12.456
      zoom = 2.323000
    `);

    assert.ok(Number.isInteger(result.x), 'x is an integer');
    assert.ok(Number.isInteger(result.y), 'y is an integer');
    assert.ok(Number.isInteger(result.z), 'z is an integer');
    assert.end();
  });
});
