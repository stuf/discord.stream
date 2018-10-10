/* eslint-disable no-unused-vars */
const S = require('sanctuary');
const U = require('karet.util');
const R = require('ramda');
const K = require('kefir');
const L = require('partial.lenses');

// const logger = require('./logger');
const { B, mkUrl1, get1 } = require('./shared');
const M = require('./meta');
const Youtube = require('./services/youtube');
const { Model } = require('./models');

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

    const getVideo = L.get(L.pick({
      videoId: 'id',
      videoUrl: 'url',
      videoTitle: 'title',
      videoPublishAt: 'publishedAt',
      videoThumbnailUrl: 'thumbnail',
    }));
    const getAuthor = L.get(['author', L.pick({
      user: 'tag',
    })]);

    return U.thru(
      K.constant(id),
      Youtube.methods.getVideoJson,
      U.mapValue(L.get([
        'data',
        M.Youtube.basicVideoL,
      ])),
      U.mapValue(R.compose(
        response => ({ response, command, message }),
        response => R.reduce(R.merge, {}, [getVideo(response), getAuthor(message)]),
      )),
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
