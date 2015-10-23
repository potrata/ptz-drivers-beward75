import {pickAndReplace} from './util';

/**
* @sig {k1:v} -> {k2:v}
*/
const mapReplyKeys = pickAndReplace(['pan', 'tilt', 'zoom'], ['x', 'y', 'z']);

const getMatchesOrEmpty = (text, regex) => {
  return text.trim().match(regex) || [];
};
/**
 * expressionToObj :: String -> {k:v}
 */
const expressionToObj = (expression) => {
  const [key, value] = expression.split('=').map(token => token.trim());
  return { [key]: Math.round(value) };
};

/**
 * @desc Converts reply string to valid js Object
 * @param {String} reply
 * @return {Object<String,*>}
 */
export default function parseReply(reply) {
  if (!reply || !reply.length) {
    return ['empty reply'];
  }

  const result = getMatchesOrEmpty(reply, /(zoom|pan|tilt)\s?=\s?([-]?[0-9]+\.?[0-9]?)/igm)
    .map(expressionToObj)
    .reduce((collector, entry) => ({ ...collector, ...entry }), {});

  if (!Object.keys(result).length) {
    return reply;
  }
  return mapReplyKeys(result);
}
