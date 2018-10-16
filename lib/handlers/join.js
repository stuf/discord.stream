const K = require('kefir');

module.exports = (command, args, message) => {
  try {
    return K.constant('yay');
  } catch (err) {
    return K.constantError('oh noes');
  }
};