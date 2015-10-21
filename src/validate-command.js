import validate from 'validate.js';
import config from './device-config.json';

const dataConstraint = {
  presence: true,
  numericality: {},
};

const constraints = {
  'action': {
    presence: true,
    inclusion: config.actionsSupported,
  },

  'x': dataConstraint,
  'y': dataConstraint,
  'z': dataConstraint,
};

/**
 * Performs business-validation of command
 * @async
 * @param command
 * @returns {Promise}
 */
function validateCommand(command) {
  return new Promise((resolve, reject) => {
    const validationResult = validate(command, constraints);
    if (!validationResult) {
      resolve(command);
    } else {
      reject(validationResult);
    }
  });
}

export default validateCommand;
