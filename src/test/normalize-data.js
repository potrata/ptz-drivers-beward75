import test from 'blue-tape';
import normalizeData from './../normalize-data';

test('Data Normalization', (t) => {
  t.test('clamps data values to be always within some range', (assert) => {
    const result = normalizeData({
      ip: '10.20.30.40',
      action: 'setPosition',
      x: -3434340, y: 1345345, z: 100302,
    });

    assert.equal(result.x, -180);
    assert.equal(result.y, 190);
    assert.equal(result.z, 9999);
    assert.end();
  });

  t.test('rounds output values to nearest decimals', (assert) => {
    const result = normalizeData({
      ip: '10.20.30.40',
      action: 'changePosition',
      x: 1.234567, y: -13.45345, z: 3 / 7,
    });

    assert.ok(Number.isInteger(result.x), 'x is an integer');
    assert.ok(Number.isInteger(result.y), 'y is an integer');
    assert.ok(Number.isInteger(result.z), 'z is an integer');
    assert.end();
  });

  t.test('transforms data values to device scale', (assert) => {
    const result = normalizeData({
      ip: '10.20.30.40',
      action: 'setPosition',
      x: 14, y: -20, z: 50,
    });

    assert.equal(result.x, 14);
    assert.equal(result.y, 79);
    assert.equal(result.z, 5000);
    assert.end();
  });
});
