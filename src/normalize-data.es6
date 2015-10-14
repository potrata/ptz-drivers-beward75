import R from 'ramda';

import {dataBounds} from './const';

// divideBy :: Number -> Number -> Number
const divideBy = R.flip(R.divide);

// subtractBy :: Number -> Number -> Number
const subtractBy = R.flip(R.subtract);

// clamp :: Number -> Number -> Number -> Number
const clamp = R.curry((a, b) => R.pipe(R.min(b), R.max(a)));

// projectRange :: [k,v] -> Number -> {k:Number}
const getValueProjector = ([key, entry]) => {
  const [[fromMin, fromMax], [toMin, toMax]] = R.props(['input', 'output'], entry);
  const fromRange = R.subtract(fromMax, fromMin);
  const toRange = R.subtract(toMax, toMin);

  return R.pipe(
    R.propOr(0, key),         // {k:v} -> Number
    clamp(fromMin, fromMax),  // Number -> Number
    subtractBy(fromMin),      // Number -> Number
    R.multiply(toRange),      // Number -> Number
    divideBy(fromRange),      // Number -> Number
    R.add(toMin),             // Number -> Number
    Math.round,               // Number -> Number
    R.objOf(key)              // Number -> {k:v}
  );
};

// getValueProjectors :: {*} -> [(... -> *)]
const getValueProjectors = R.pipe(
  R.prop('action'),
  R.flip(R.prop)(dataBounds),
  R.toPairs,
  R.map(getValueProjector)
);

// getData :: {*} -> {*}
const getData = R.pipe(
  R.converge(R.ap, [getValueProjectors, R.of]),
  R.mergeAll
);

// normalizeData :: {*} -> {*}
export default R.converge(R.merge, [R.identity, getData]);
