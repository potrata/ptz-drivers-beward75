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
    y: genericTransform({ from: [-180, 180], to: [-10, 190] }),
    z: genericTransform({ from: [0, 100], to: [0, 9999] }),
  },

  'changePosition': {
    x: genericTransform({ from: [-180, 180], to: [-180, 180] }),
    y: genericTransform({ from: [-180, 180], to: [-10, 190] }),
    z: genericTransform({ from: [0, 100], to: [-9999, 9999] }),
  },

  'changePositionZoomed': {
    x: discreteTransform({ from: [-7, 7], to: [0, 720] }),
    y: yInvertedTransform({ from: [-7, 7], to: [0, 576] }),
    z: R.identity,
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
