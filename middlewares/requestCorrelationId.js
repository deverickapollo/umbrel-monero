import * as UUID from '../utils/UUID.js';
import * as constants from '../utils/const.js';
import { createNamespace } from 'continuation-local-storage';
const apiRequest = createNamespace(constants.REQUEST_CORRELATION_NAMESPACE_KEY);


export function addCorrelationId(req, res, next) {
  apiRequest.bindEmitter(req);
  apiRequest.bindEmitter(res);
  apiRequest.run(function() {
    apiRequest.set(constants.REQUEST_CORRELATION_ID_KEY, UUID.create);
    next();
  });
}

export default addCorrelationId;
