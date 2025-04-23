/* eslint-disable no-unused-vars, no-magic-numbers */
import logger from '../utils/logger.js';

export function handleError(error, req, res, next) {

  var statusCode = error.statusCode || 500;
  var route = req.url || '';
  var message = error.message || '';
  logger.error(message, route, error.stack);

  res.status(statusCode).json(message);
}
export default handleError;
