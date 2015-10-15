import R, {
  always, identity, concat, curry,
  pipe, map, join, prop, props, has,
  zip, zipObj, useWith, converge, unless,
} from 'ramda';

const throwError = (data) => {
  throw new Error(data);
};

// getParams :: {k:v} -> [v]
const getParams = props(['x', 'y', 'z']);

// pairToQueryPart :: [k,v] -> String
const pairToQueryPart = join('=');

// pairsToQueryString :: [[k,v]] -> String
const pairsToQueryString = pipe(map(pairToQueryPart), join('&'));

// mapParamsToQuery :: [a] -> {k:v} -> String
const mapParamsToQuery = curry(
  pipe(
    useWith(zip, [identity, getParams]),
    pairsToQueryString
  )
);

const actionParamsLookup = {
  ['setPosition']: mapParamsToQuery(['pan', 'tilt', 'zoom']),
  ['changePosition']: mapParamsToQuery(['rpan', 'rtilt', 'rzoom']),
  ['getPosition']: always(pairToQueryPart(['query', 'position'])),
};

// isActionValid :: String -> Boolean
const isActionValid = has(R.__, actionParamsLookup);

// getAction :: {k:v} -> v | Error
const getAction = R.pipe(
  prop('action'),
  unless(
    isActionValid,
    pipe(concat('unknown action: '), throwError),
  )
);


// convertData :: {*} -> String | Error
export const buildQueryString = converge(
  R.call, [
    pipe(getAction, prop(R.__, actionParamsLookup)),
    identity,
  ]
);

// mapReplyKeys :: {k1:v} -> {k2:v}
export const mapReplyKeys = pipe(
  props(['pan', 'tilt', 'zoom']),
  zipObj(['x', 'y', 'z'])
);
