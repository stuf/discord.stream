const U = require('karet.util');

const R = require('ramda');

const L = require('partial.lenses');

const K = require('kefir');

const {
  mkUrl1,
  get1
} = require('../shared');

const M = require('../meta');

const Youtube = require('../services/youtube');

const {
  Log
} = require('./_models');

module.exports = (command, args, message) => {
  try {
    const [logType, maybeUrl] = args;
    const url = mkUrl1(maybeUrl);
    let id;

    if (R.propEq('pathname', '/watch', url)) {
      id = R.pipe(R.prop('searchParams'), get1('v'))(url);
    } else if (R.propEq('host', 'youtu.be', url)) {
      id = R.pipe(R.prop('pathName'), R.slice(1, Infinity))(url);
    }

    const getVideo = R.identity;
    const getAuthor = L.get(['author', 'id']);
    const payload = {
      command,
      message
    };
    return U.thru(K.constant(id), Youtube.methods.getVideoJson, U.show, U.mapValue(L.get(['data', M.Youtube.basicVideoL])), U.mapValue(R.pipe(R.assoc('response', R.__, payload), // eslint-disable-next-line
    ({
      response,
      command
    }) => ({
      video: getVideo(response),
      user: getAuthor(message)
    }))));
  } catch (e) {
    return K.constantError(e);
  }
};