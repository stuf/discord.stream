const U = require('karet.util');
const R = require('ramda');
const K = require('kefir');
const axios = require('axios');

const { lSet } = require('../shared');
const { part, endpoint } = require('./youtube.json');

const { GOOGLE_KEY } = process.env;

//

const createParams = R.compose(
  lSet('params', R.__, {}),
  R.merge({ part, key: GOOGLE_KEY }),
  lSet('id', R.__, {}),
);

const getVideoJson =
  U.flatMapLatest(x => K.fromPromise(axios.get(endpoint, createParams(x))));

module.exports = {
  getVideoJson,
};

// getVideoJson(K.constant('Bi7T9r5GTto')).map(R.prop('data')).log();
