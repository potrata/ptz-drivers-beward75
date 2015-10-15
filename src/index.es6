import request from 'request-promise';
import R from 'ramda';

import validateCommand from './validate-command';
import createAuthData from './create-auth-data';
import normalizeData from './normalize-data';
import formatUrl from './format-url';
import parseReply from './parse-reply';

import pkg from './../package.json';

const buildRequestData = (options) => {
  return R.pipe(
    R.converge(R.pipe(R.pair, R.zipObj(['url', 'auth'])), [formatUrl, createAuthData]),
    R.merge(options)
  );
};

///TODO: Should be removed as soon as "flat" format for command schema will be committed
const transformCommand = (command) => {
  return R.converge(
    R.unapply(R.mergeAll), [
      R.pick(['x', 'y', 'z']),
      R.path(['camera']),
      R.pipe(R.path(['action', 'type']), R.objOf('action')),
    ]
  )(command);
};

///TODO: It's useless and should be removed from driver's API
export const model = pkg.model;

/**
 * @desc Performs HTTP-request to device
 * @param {object} command
 * @param {object} [options]
 * @return {Promise}
 */
export function execute(command, options = {}) {
  const _command = transformCommand(command); // TEMPORARY
  const pipeline = R.pipeP(
    validateCommand,
    normalizeData,
    buildRequestData(options),
    request,
    parseReply
  );
  return pipeline(_command);
}
