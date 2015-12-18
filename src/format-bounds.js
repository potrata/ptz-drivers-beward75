/**
 * @desc Returns information about camera bounds
 * @return {Promise}
 */
const getBounds = () => Promise.resolve(formattedBounds);

const formattedBounds = {
  pan: { min: -180, max: 180 },
  tilt: { min: -10, max: 190, down: 0 },
  zoom: { min: 0, max: 100 },
};

export default getBounds;
