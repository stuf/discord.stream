const K = require('kefir');

const logger = require('./logger');

//

const handleLog = payload => {
  logger.log('verbose', `Should handle command ${payload.command}`);

  return K.constant('not yet implemented');
};

//

module.exports = {
  log: handleLog,
};
