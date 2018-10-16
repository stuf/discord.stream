const R = require('ramda');

const { B, curry3 } = require('../shared');

// #region Payload


// #endregion

const handleCommandPayload = R.compose(
  R.apply(R.apply),
  B.bimap(
    R.prop('handler'),
    R.props(['command', 'args', 'message']),
  ),
  B.toBi,
);

const createHandledResponse = (command, payload) => ({ command, payload });
const createHandledError = (command, error) => ({ command, error });

module.exports = {
  handleCommandPayload,

  createHandledError,
  createHandledResponse,
};
