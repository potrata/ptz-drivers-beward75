import {validate} from 'validate.js';
import {actionsSupported} from './const';

const dataConstraint = {
  presence: true,
  numericality: {},
};

const constraints = {
  'action': {
    presence: true,
    inclusion: actionsSupported,
  },

  'x': dataConstraint,
  'y': dataConstraint,
  'z': dataConstraint,
};

/**
 * Performs business-validation of command
 * @param command
 * @returns {Promise}
 */
export default function validateCommand(command) {
  return new Promise((resolve, reject) => {
    const validationResult = validate(command, constraints);
    if (!validationResult) {
      resolve(command);
    } else {
      reject(validationResult);
    }
  });
}
