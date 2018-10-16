const { Client } = require('discord.js');
const U = require('karet.util');
const R = require('ramda');
const K = require('kefir');
const L = require('partial.lenses');

const { construct0, invoke1, curry2 } = require('../shared');

const fromEvents2 = curry2(K.fromEvents);

//

/**
 * @private
 * @type {Function}
 * @returns {Client}
 */
const _createClient = construct0(Client);

/**
 * @private
 * @type {Function}
 * @param {String} token
 */
const _connect = invoke1('login');

//

const client = _createClient();

//

const constants = {};

/**
 * Discord events to observe
 */
constants.events = [
  'message',
  'ready',
];

module.exports.constants = constants;

//

const methods = {};

module.exports.methods = methods;

//

const properties = {};

properties.events$ = U.thru(
  constants.events,
  R.map(ev =>
    fromEvents2(client, ev).map(payload => ({ payload, ev }))
  ),
);

properties.state$ = U.thru(
  U.parallel(properties.events$),
  U.toProperty,
  U.skipUnless(R.identity),
);

properties.messages$ = U.thru(
  fromEvents2(properties.client, 'messages'),
  U.toProperty,
);

module.exports.properties = properties;
