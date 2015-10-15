import test from 'blue-tape';
import formatUrl from './../format-url';

test('URL Formatting', (t) => {
  t.test('returns valid url for supported actions', (assert) => {
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

  t.test('throws error if action is unknown', (assert) => {
    const testData = {
      ip: '1.2.3.4',
      action: 'kill-em-all',
      x: 6, y: 6, z: 6,
    };

    assert.throws(() => formatUrl(testData), /unsupported|unknown/);
    assert.end();
  });
});
