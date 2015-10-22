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
    assert.equal(result.y, 100);
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

  t.test('transforms data values to device scale for setPosition', (assert) => {
    const result = normalizeData({
      ip: '10.20.30.40',
      action: 'setPosition',
      x: 14, y: 88, z: 50,
    });

    assert.equal(result.x, 14);
    assert.equal(result.y, 88);
    assert.equal(result.z, 5000);
    assert.end();
  });
});

test('Data transformations with "changePositionZoomed" command', (t) => {
  t.test('ignores "z" parameter (pass it through)', (assert) => {
    const result = normalizeData({
      action: 'changePositionZoomed',
      x: -6, y: 1, z: 1265,
    });

    assert.equal(result.z, 1265);
    assert.end();
  });

  t.test('transforms data values to device scale for changePositionZoomed', (assert) => {
    const result = normalizeData({
      ip: '127.0.0.12',
      action: 'changePositionZoomed',
      x: -1, y: -7, z: 0,
    });

    assert.equal(result.x, 312);
    assert.equal(result.y, 557);
    assert.end();
  });

  t.test('Y-axis is inverted. UNACCEPTABLE!', (assert) => {
    const resultA = normalizeData({
      action: 'changePositionZoomed',
      x: 0, y: -6, z: 0,
    });

    const resultB = normalizeData({
      action: 'changePositionZoomed',
      x: 2, y: 6, z: 8,
    });

    assert.ok(resultB.y < resultA.y, 'higher the input,lower the output');
    assert.end();
  });
});

test('Data transformations with "setSpeed" command', (t) => {
  t.test('transforms data values to device scale for setSpeed', (assert) => {
    const result = normalizeData({
      ip: '196.45.34.56',
      action: 'setSpeed',
      x: -5,
      y: 5,
      z: 1,
    });

    assert.equal(result.x, -71);
    assert.equal(result.y, 71);
    assert.equal(result.z, 100);
    assert.end();
  });
});

test('Data transformations with "setFocus" command', (t) => {
  t.test('ignores x and y parameters', (assert) => {
    const result = normalizeData({
      ip: '196.45.34.56',
      action: 'setFocus',
      x: -5,
      y: 5,
      z: 1,
    });

    assert.equal(result.x, -5);
    assert.equal(result.y, 5);
    assert.end();
  });

  t.test('transforms data values to device scale for setFocus', (assert) => {
    const result = normalizeData({
      ip: '196.45.34.56',
      action: 'setFocus',
      x: -5,
      y: 5,
      z: 1,
    });

    assert.equal(result.z, 100);
    assert.end();
  });
});
