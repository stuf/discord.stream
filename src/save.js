const U = require('karet.util');
const R = require('ramda');
const K = require('kefir');

const logger = require('./logger');
const { Model } = require('./models');

//

const save$ = model => U.thru(
  model,
  U.flatMapLatest(m => K.fromNodeCallback(cb => m.save(cb))),
  U.toProperty,
  U.skipUnless(R.identity),
);

const methods = {};

methods.log = ({ response }) => {
  logger.info('info', 'Saving Log entity');
  const entity = new Model.Log(response);

  return save$(entity);
};

//

module.exports.methods = methods;

//
