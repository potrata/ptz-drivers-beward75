import R from 'ramda';

export const throwError = (data) => {
  throw new Error(data);
};

/**
 * @sig Number -> Number -> Number
 */
export const divideBy = R.flip(R.divide);

/**
 * @sig Number -> Number -> Number
 */
export const subtractBy = R.flip(R.subtract);

/**
 * @sig [k,v] -> Number -> Number
 */
export const clamp = R.apply(R.useWith(R.pipe, [R.max, R.min]));

/**
 * @sig {k:v} -> String
 */
export const objToQuery = R.pipe(
  R.toPairs,
  R.map(R.join('=')),
  R.join('&')
);

/**
 * @sig [k] -> [m] -> {k:v} -> {m:v}
 */
export const pickAndReplace = R.useWith(R.pipe, [R.props, R.zipObj]);

/**
 * @sig {k:v} -> Number -> Number
 */
export const scale = (data) => {
  const [fromMin, fromMax, toMin, toMax] =
    R.pipe(R.props(['from', 'to']), R.flatten)(data);

  const fromRange = R.subtract(fromMax, fromMin);
  const toRange = R.subtract(toMax, toMin);

  return R.pipe(
    subtractBy(fromMin),      // Number -> Number
    R.multiply(toRange),      // Number -> Number
    divideBy(fromRange),      // Number -> Number
    R.add(toMin)              // Number -> Number
  );
};

/**
 * @sig Number -> [a]
 */
export const mirroredPairOf = R.lift(R.pair)(R.negate, R.identity);

/**
 * @sig Number -> [a,b] -> [c,d]
 */
export const extendRangeBy = R.pipe(mirroredPairOf, R.zipWith(R.add));
