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

/**
 * @deprecated
 */
methods.log = ({ response }) => {
  logger.info('info', 'Saving Log entity');

  const { user, video } = response;
  const { thumbnails } = video;


  const logObject = {
    user,
    video: Object.assign(
      {},
      video,
      {
        thumbnails: thumbnails.map(t => new Model.VideoThumbnail(t)),
      },
    ),
  };

  const loggableVideo = new Model.Log(logObject);

  const entity = new Model.Log(loggableVideo);

  return save$(entity);
};

//

module.exports.methods = methods;

//
