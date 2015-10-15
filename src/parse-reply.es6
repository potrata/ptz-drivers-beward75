import {mapReplyKeys} from './util';

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
    /** just throw in case of finding no matches at all **/
    throw new Error(`reply parsing failed:\n${reply}`);
  }
  return mapReplyKeys(result);
}
