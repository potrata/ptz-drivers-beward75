import R from 'ramda';
import {clamp, scale, extendRangeBy} from './util';

/**
 * @sig {k:v} -> Number -> Number)
 */
const clampByInputRange = R.pipe(R.prop('from'), clamp);

/**
 * @sig {k:v} -> Number -> Number
 */
const genericTransform = R.converge(
  R.pipe, [clampByInputRange, scale, R.always(Math.round)]
);

/**
 * @sig {k:v} -> Number -> Number
 */
const discreteTransform = R.pipe(
  R.evolve({ from: extendRangeBy(0.5) }),
  genericTransform
);

/**
 * @sig {k:v} -> Number -> Number
 */
const yInvertedTransform = R.converge(
  R.pipe, [R.always(R.negate), discreteTransform]
);

const actionToTransformLookup = {
  'setPosition': {
    x: genericTransform({ from: [-180, 180], to: [-180, 180] }),
    y: genericTransform({ from: [-10, 100], to: [-10, 100] }),
    z: genericTransform({ from: [0, 100], to: [0, 1274] }),
  },

  'changePosition': {
    x: genericTransform({ from: [-180, 180], to: [-180, 180] }),
    y: genericTransform({ from: [-180, 180], to: [-180, 180] }),
    z: genericTransform({ from: [-100, 100], to: [-1274, 1274] }),
  },

  'changePositionZoomed': {
    x: discreteTransform({ from: [-7, 7], to: [0, 720] }),
    y: yInvertedTransform({ from: [-7, 7], to: [0, 576] }),
    z: genericTransform({ from: [-1, 1], to: [-100, 100] }),
  },

  'setSpeed': {
    x: genericTransform({ from: [-7, 7], to: [-100, 100] }),
    y: genericTransform({ from: [-7, 7], to: [-100, 100] }),
    z: genericTransform({ from: [-1, 1], to: [-100, 100] }),
  },

  'changeFocus': {
    z: genericTransform({ from: [-1, 1], to: [-10, 10] }),
  },

  'getPosition': {
    x: genericTransform({ from: [-180, 180], to: [-180, 180] }),
    y: genericTransform({ from: [-10, 100], to: [-10, 100] }),
    z: genericTransform({ from: [0, 1274], to: [0, 100] }),
  },
};

/**
 * @sig {k:v} -> {*}
 */
const getTransformObj = R.pipe(
  R.prop('action'),
  R.propOr({}, R.__, actionToTransformLookup)
);

/**
 * @sig {k:v} -> {k:m}
 */
const normalizeData = R.converge(
  R.evolve, [
    getTransformObj,
    R.identity,
  ]
);

export default normalizeData;
