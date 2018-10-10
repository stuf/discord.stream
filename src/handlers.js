const U = require('karet.util');
const R = require('ramda');
const K = require('kefir');
const L = require('partial.lenses');

// const logger = require('./logger');
const { mkUrl1, get1 } = require('./shared');
const M = require('./meta');
const Youtube = require('./services/youtube');

//

/**
 * @todo Make this beautiful
 *
 * @param {*} command
 * @param {*} args
 * @param {*} message
 */
const handleLog = (command, args, message) => {
  try {
    const maybeUrl = R.head(args);
    const url = mkUrl1(maybeUrl);

    let id;
    if (R.propEq('pathname', '/watch', url)) {
      id = R.pipe(R.prop('searchParams'), get1('v'))(url);
    }
    else if (R.propEq('host', 'youtu.be', url)) {
      id = R.pipe(R.prop('pathName'), R.slice(1, Infinity))(url);
    }

    return U.thru(
      id,
      Youtube.methods.getVideoJson,
      U.mapValue(L.get([
        'data',
        M.Youtube.basicVideoL,
      ]))
    );
  }
  catch (e) {
    return K.constantError(e);
  }
};

//

module.exports = {
  log: handleLog,
};
