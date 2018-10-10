const U = require('karet.util');
const R = require('ramda');
const K = require('kefir');
const axios = require('axios');

const { lSet } = require('../shared');
const { part, endpoint } = require('./youtube.json');

const { GOOGLE_KEY: key } = process.env;

//

const createParams = R.compose(
  lSet('params', R.__, {}),
  R.merge({ part, key }),
  lSet('id', R.__, {}),
);

const getVideoJson =
  U.through(
    U.flatMapLatest(x => K.fromPromise(axios.get(endpoint, createParams(x)))),
    U.toProperty,
  );

module.exports.methods = {
  getVideoJson,
};

// getVideoJson(K.constant('Bi7T9r5GTto')).map(R.prop('data')).log();
