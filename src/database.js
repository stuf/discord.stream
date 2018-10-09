const mongoose = require('mongoose');
const U = require('karet.util');
const R = require('ramda');
const K = require('kefir');

const logger = require('./logger');

// Database

const _database = U.variable();

const database$ = U.skipUnless(R.identity, U.toProperty(_database));

// Constants

const events = [
  'connecting',
  'connected',
  'open',
  'error',
  'disconnecting',
  'disconnected',
  'reconnected',
];

//

const events$ = U.thru(
  database$,
  U.mapValue(db =>
    R.map(ev => K.fromEvents(db, ev).map(payload => ({ payload, ev })), events)),
);

//

module.exports.constants = {
  events,
};

module.exports.properties = {
  database$,
  events$,
};

module.exports.start = url => {
  logger.log('info', `Connecting to database at URL: ${url}`);

  try {
    mongoose.connect(url, { useNewUrlParser: true });

    _database.set(mongoose.connection);
  }
  catch (err) {
    logger.log('error', 'Error trying connect to database');
    return K.constantError(err);
  }

  return database$;
};

//

database$.onValue(() => logger.log('verbose', 'Got database connection'));
