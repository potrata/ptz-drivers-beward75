import R from 'ramda';
import {buildQueryString} from './util';

const createURL = (ip, params) => `http://${ip}/cgi-bin/com/ptz.cgi?${params}`;

export default R.converge(createURL, [R.prop('ip'), buildQueryString]);
