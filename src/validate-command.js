import validate from 'validate.js';
import config from './device-config.json';

validate.validators.ptzOptionalParameter = (value, options, key, attributes) => {
  if (attributes.action !== options.action && !Number.isInteger(parseInt(value, 10))) {
    return 'is not valid';
  }
  return null;
};

const ptzConstraint = {
  ptzOptionalParameter: {
    action: 'getPosition',
  },
};

const constraints = {
  'action': {
    presence: true,
    inclusion: config.actionsSupported,
  },

  'x': ptzConstraint,
  'y': ptzConstraint,
  'z': ptzConstraint,
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
