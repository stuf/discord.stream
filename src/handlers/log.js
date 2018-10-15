const U = require('karet.util');
const R = require('ramda');
const L = require('partial.lenses');
const K = require('kefir');

const { mkUrl1, get1 } = require('../shared');
const M = require('../meta');
const Youtube = require('../services/youtube');

module.exports = (command, args, message) => {
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

    // eslint-disable-next-line
    const thumbnailL = L.array(L.pick({
      url: 'url',
      width: ['width', L.normalize(parseInt)],
      height: ['height', L.normalize(parseInt)],
    }));

    const getThumbnails = L.collect([
      L.entries,
      L.reread(([size, thumb]) => Object.assign({}, { size }, thumb)),
    ]);

    const getVideo = L.get(L.pick({
      id: 'id',
      url: 'url',
      title: 'title',
      publishedAt: 'publishedAt',
      thumbnails: ['thumbnail', L.normalize(getThumbnails)],
    }));

    const getAuthor = L.get(['author', 'tag']);

    return U.thru(
      K.constant(id),
      Youtube.methods.getVideoJson,
      U.mapValue(L.get([
        'data',
        M.Youtube.basicVideoL,
      ])),
      U.mapValue(R.compose(
        response => ({ response, command, message }),
        // eslint-disable-next-line
        ({ response, command }) =>
          ({
            video: getVideo(response),
            user: getAuthor(message),
          }))),
    );
  }
  catch (e) {
    return K.constantError(e);
  }
};
