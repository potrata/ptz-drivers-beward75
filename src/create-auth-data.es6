import R from 'ramda';

const isString = R.is(String);
const isNotEmpty = R.complement(R.isEmpty);
const emptyObjIfNil = R.ifElse(R.isNil, R.always({}), R.identity);

// {*} -> Boolean
const isLoginValid = R.propSatisfies(R.both(isString, isNotEmpty), 'login');

// {k: v} -> [v]
const getCredentials = R.pipe(R.props(['login', 'password']), R.map(R.defaultTo('')));

// {k: v} -> {m: v}
const createData = R.pipe(
  getCredentials,
  R.zipObj(['user', 'pass']),
  R.merge({ 'sendImmediately': false })
);

export default R.pipe(R.nthArg(0), emptyObjIfNil, R.ifElse(isLoginValid, createData, R.always({})));
