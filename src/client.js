const { Client } = require('discord.js');
const U = require('karet.util');
const R = require('ramda');
const K = require('kefir');
const L = require('partial.lenses');

const logger = require('./logger');
const M = require('./meta');

//

const {
  DISCORD_COMMAND_PREFIX,
} = process.env;

// Constants

const events = [
  'message',
  'ready',
];

// Handlers

// @todo Fixme
const Handler = {};

// Functions

const isPropCommand = R.propSatisfies(R.startsWith(DISCORD_COMMAND_PREFIX));

const getCommands = U.through(
  U.skipUnless(isPropCommand('content')),
  U.mapValue(L.get(M.Discord.commandL)),
);

const commandIsValid = R.compose(
  R.propSatisfies(R.is(Function), R.__, Handler),
  R.prop('command'),
);

//

const getClient = R.constructN(0, Client);
const connect = R.invoker(1, 'login');

const client = getClient();

const message$ = K.fromEvents(client, 'message').toProperty();
const ready$ = K.fromEvents(client, 'ready').toProperty();

//

const _events$ =
  R.map(ev => K.fromEvents(client, ev).map(payload => ({ payload, ev })), events);

const state$ =
  U.thru(U.parallel(_events$),
         U.toProperty,
         U.skipUnless(R.identity));

const commands$ = getCommands(message$);

const handled$ = U.thru(
  commands$,
  U.flatMapLatest(R.unless(commandIsValid, K.constantError)),
  U.flatMapLatest(cmd => L.set('handler', Handler[cmd.command], cmd)),
  U.flatMapErrors(R.compose(
    K.constantError,
    R.assoc('error', new Error('No suitable handler found for command.')),
  )),
);

// Activation

handled$.onValue(v => logger.log('info', `Handled command \`${v.command}\``));

// Methods

// @todo fixme

//

module.exports.instance = {
  client,
};

module.exports.properties = {
  message$,
  ready$,
  commands$,
  handled$,
  state$,
};

module.exports.methods = {};

module.exports.start = token => {
  logger.log('info', 'Connecting to the Discord API');
  connect(token, client);

  return state$.skipUntilBy(ready$);
};
