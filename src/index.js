const U = require('karet.util');
const R = require('ramda');
const K = require('kefir');
const L = require('partial.lenses');

const logger = require('./logger');
const { start, properties, instance } = require('./client');

const {
  DISCORD_TOKEN,
} = process.env;

//

logger.log('info', 'Starting up Discord bot');

//

const started$ = start(DISCORD_TOKEN);

started$.onValue(() => logger.log('info', 'Discord client successfully connected'));
