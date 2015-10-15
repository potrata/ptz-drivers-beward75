import R from 'ramda';
import {dataBounds} from './const';

// divideBy :: Number -> Number -> Number
const divideBy = R.flip(R.divide);

// subtractBy :: Number -> Number -> Number
const subtractBy = R.flip(R.subtract);

// clamp :: Number -> Number -> Number -> Number
const clamp = R.useWith(R.pipe, [R.max, R.min]);

// scaler :: ([a],[b]) -> Number -> Number
const scaler = ([fromMin, fromMax], [toMin, toMax]) => {
  const fromRange = R.subtract(fromMax, fromMin);
  const toRange = R.subtract(toMax, toMin);

  return R.pipe(
    clamp(fromMin, fromMax),  // Number -> Number
    subtractBy(fromMin),      // Number -> Number
    R.multiply(toRange),      // Number -> Number
    divideBy(fromRange),      // Number -> Number
    R.add(toMin),             // Number -> Number
    Math.round                // Number -> Number
  );
};

// getValueProjector :: [k,v] -> {k:*} -> {k:Number}
const getValueProjector = ([key, entry]) => {
  const [from, to] = R.props(['input', 'output'], entry);

  return R.pipe(
    R.propOr(0, key),         // {k:v} -> Number
    scaler(from, to),         // Number -> Number
    R.objOf(key)              // Number -> {k:v}
  );
};

// getBounds :: {k:v} -> [[k,v]]
const getBounds = R.pipe(
  R.prop('action'),
  R.prop(R.__, dataBounds),
  R.toPairs
);

// getValueProjectors :: {*} -> [(... -> *)]
const getValueProjectors = R.pipe(
  getBounds,
  R.map(getValueProjector)
);

// getData :: {*} -> {*}
const getData = R.pipe(
  R.converge(
    R.ap,
    [getValueProjectors, R.of]
  ),
  R.mergeAll
);

// normalizeData :: {*} -> {*}
export default R.converge(R.merge, [R.identity, getData]);
