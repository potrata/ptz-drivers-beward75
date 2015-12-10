import R from 'ramda';
import {pickAndReplace, objToQuery, throwError} from './util';

/**
 * @sig [m] -> {k:v} -> {m:v}
 */
const pickReplaceXYZ = pickAndReplace(['x', 'y', 'z']);

/**
 * @sig {k:v} -> String
 */
const joinXY = R.pipe(
  R.props(['x', 'y']),
  R.join(',')
);

const transformFnLookup = {
  'setPosition': R.pipe(
    pickReplaceXYZ(['pan', 'tilt', 'zoom']),
    objToQuery
  ),

  'changePosition': R.pipe(
    pickReplaceXYZ(['rpan', 'rtilt', 'rzoom']),
    objToQuery
  ),

  'getPosition': R.always('query=position'),

  'changePositionZoomed': R.pipe(
    R.converge(
      R.merge, [
        R.pipe(joinXY,
          R.objOf('center'),
          R.merge(R.__, {
            'imagewidth': '720',
            'imageheight': '576',
            'stream': 'h264',
          })),
        R.pipe(R.prop('z'), R.objOf('rzoom')),
      ]
    ),
    objToQuery
  ),
  'setSpeed': R.pipe(
    R.converge(
      R.merge, [
        R.pipe(joinXY, R.objOf('continuouspantiltmove')),
        R.pipe(R.prop('z'), R.objOf('continuouszoommove')),
      ]
    ),
    objToQuery
  ),
  'changeFocus': R.pipe(
    R.ifElse(
      R.propEq('z', 0),
      R.always({ autofocus: 'on' }),
      R.pipe(
        pickAndReplace(['z'])(['rfocus']),
        R.merge({ autofocus: 'off' })
      )
    ),
    objToQuery
  ),
};

/**
 * @sig String -> ({k:v} -> String) | Error
 */
const actionToTransformFn = R.pipe(
  R.prop(R.__, transformFnLookup),
  R.defaultTo(
    R.pipe(R.concat('unknown action: '), throwError)
  )
);

/**
 * @sig {k:v} -> String | Error
 */
const buildQueryString = R.converge(
  R.call, [
    R.pipe(R.prop('action'), actionToTransformFn),
    R.identity,
  ]
);

/**
 * @sig (String -> String) -> String
 */
const buildURLString = (ip, params) => `http://${ip}/cgi-bin/com/ptz.cgi?${params}`;

/**
 * @sig {k:v} -> String
 */
const formatURL = R.converge(buildURLString, [R.prop('ip'), buildQueryString]);

export default formatURL;
