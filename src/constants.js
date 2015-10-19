export const dataBounds = {
  'setPosition': {
    'x': {
      input: [-180, 180],
      output: [-180, 180],
    },
    'y': {
      input: [-180, 180],
      output: [-10, 190],
    },
    'z': {
      input: [0, 100],
      output: [0, 9999],
    },
  },
  'changePosition': {
    'x': {
      input: [-180, 180],
      output: [-180, 180],
    },
    'y': {
      input: [-180, 180],
      output: [-10, 190],
    },
    'z': {
      input: [0, 100],
      output: [-9999, 9999],
    },
  },
};

export const actionsSupported = [
  'changePosition',
  'setPosition',
  'getPosition',
];
