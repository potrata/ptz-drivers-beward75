import {
  T, always, identity, concat, curry,
  pipe, map, join, prop, props,
  cond, zip, propEq, useWith,
} from 'ramda';

const throwError = (data) => {
  throw new Error(data);
};

// getAction :: {k:v} -> v
const getAction = prop('action');

// actionEquals :: String -> Boolean
const actionEquals = propEq('action');

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


// convertData :: {*} -> String | Error
export const buildQueryString = cond([
  [
    actionEquals('setPosition'),
    mapParamsToQuery(['pan', 'tilt', 'zoom']),
  ],
  [
    actionEquals('changePosition'),
    mapParamsToQuery(['rpan', 'rtilt', 'rzoom']),
  ],
  [
    actionEquals('getPosition'),
    pipe(always(['query', 'position']), pairToQueryPart),
  ],
  [
    T,
    pipe(getAction, concat('unknown action: '), throwError),
  ],
]);
