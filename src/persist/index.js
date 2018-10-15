// eslint-disable-next-line
const { Model } = require('mongoose');
const U = require('karet.util');
const R = require('ramda');
const K = require('kefir');

//

const methods = {};

/**
 * @param {Model} model
 * @returns {K.Property}
 */
methods.save$ = model => U.thru(
  model,
  U.flatMapLatest(m => K.fromNodeCallback(cb => m.save(cb))),
  U.toProperty,
  U.skipUnless(R.identity),
);

//

module.exports.methods = {};
