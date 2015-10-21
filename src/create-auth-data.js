import R from 'ramda';
import {pickAndReplace} from './util';

/**
 * @sig  {*} -> Boolean
 */
const isLoginValid = R.propSatisfies(
  R.both(
    R.is(String),
    R.complement(R.isEmpty)),
  'login'
);

/**
 * @sig {k:v} -> {m:v}
 */
const createDataObj = R.pipe(
  pickAndReplace(['login', 'password'], ['user', 'pass']),
  R.assoc('sendImmediately', false),
  R.map(R.defaultTo(''))
);

/**
 * @sig {k:v} -> {m:v} | {}
 */
const createAuthData = R.pipe(
  R.nthArg(0),
  R.defaultTo({}),
  R.ifElse(
    isLoginValid,
    createDataObj,
    R.always({})
  )
);

export default createAuthData;
