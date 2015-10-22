import test from 'blue-tape';
import formatUrl from './../format-url';

test('URL Formatting', (t) => {
  t.test('returns correct url for "setPosition" and "changePosition" actions', (assert) => {
    const setPositionURL = formatUrl({
      ip: '10.0.11.12',
      action: 'setPosition',
      x: -10, y: 0, z: 23,
    });

    const changePositionURL = formatUrl({
      ip: '10.20.30.40',
      action: 'changePosition',
      x: 0, y: 1, z: 2,
    });

    assert.equals(setPositionURL, `http://10.0.11.12/cgi-bin/com/ptz.cgi?pan=-10&tilt=0&zoom=23`);
    assert.equals(changePositionURL, `http://10.20.30.40/cgi-bin/com/ptz.cgi?rpan=0&rtilt=1&rzoom=2`);
    assert.end();
  });

  t.test('returns correct url for "changePositionZoomed" action', (assert) => {
    const changePositionZoomedURL = formatUrl({
      ip: '196.45.34.56',
      action: 'changePositionZoomed',
      x: -234, y: 118,
    });

    assert.equals(changePositionZoomedURL, `http://196.45.34.56/cgi-bin/com/ptz.cgi?center=-234,118&imagewidth=720&imageheight=576&stream=h264`);
    assert.end();
  });

  t.test('throws error if action is unknown', (assert) => {
    const testData = {
      ip: '1.2.3.4',
      action: 'kill-em-all',
      x: 6, y: 6, z: 6,
    };

    assert.throws(() => formatUrl(testData), /unsupported|unknown/);
    assert.end();
  });

  t.test('returns correct url for "setSpeed" action', (assert) => {
    const setSpeedURL = formatUrl({
      ip: '196.45.34.56',
      action: 'setSpeed',
      x: -50,
      y: 50,
      z: 100,
    });

    assert.equals(setSpeedURL, 'http://196.45.34.56/cgi-bin/com/ptz.cgi?continuouspantiltmove=-50,50&continuouszoommove=100');
    assert.end();
  });

  t.test('returns correct url for "setFocus" action', (assert) => {
    const setFocusURL = formatUrl({
      ip: '196.45.34.56',
      action: 'setFocus',
      x: 13,
      y: 666,
      z: 100,
    });

    assert.equals(setFocusURL, 'http://196.45.34.56/cgi-bin/com/ptz.cgi?rfocus=100');
    assert.end();
  });

  t.test('returns correct url to set autofocus on for "setFocus" action with 0 value', (assert) => {
    const setFocusURL = formatUrl({
      ip: '196.45.34.56',
      action: 'setFocus',
      x: 13,
      y: 666,
      z: 0,
    });

    assert.equals(setFocusURL, 'http://196.45.34.56/cgi-bin/com/ptz.cgi?autofocus=on');
    assert.end();
  });
});
