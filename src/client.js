/**
 * Discord client -related functionality
 *
 * Creates observable Properties out of commonly used Discord
 * events to allow handling these in a reactive way.
 *
 * @todo Extract command handling and pipeline to their own files
 */
const { Client } = require('discord.js');
const U = require('karet.util');
const R = require('ramda');
const K = require('kefir');
const L = require('partial.lenses');

const logger = require('./logger');
const Handlers = require('./handlers');
const M = require('./meta');
const { B, mkError1, construct0, invoke1 } = require('./shared');
const Save = require('./save');
//

const {
  DISCORD_COMMAND_PREFIX,
} = process.env;

// Constants

const events = [
  'message',
  'ready',
];

// Functions

const isPropCommand = R.propSatisfies(R.startsWith(DISCORD_COMMAND_PREFIX));

const getCommands = U.through(
  U.skipUnless(isPropCommand('content')),
  U.mapValue(L.get(M.Discord.transformMessageL)),
);

function commandIsValid(x) {
  const fn = R.compose(
    R.propSatisfies(R.is(Function), R.__, Handlers.methods),
    R.prop('command'),
  );

  return fn(x);
}

const addPayloadError = R.compose(
  K.constantError,
  R.assoc('error', mkError1('No suitable handler found for command.')),
);

/** @deprecated */
const handleCommandPayload = R.compose(
  R.apply(R.apply),
  B.bimap(
    R.prop('handler'),
    R.props(['command', 'args', 'message']),
  ),
  B.toBi,
);

/** @deprecated */
const createHandledResponse = (command, payload) => ({ command, payload });

/** @deprecated */
const createHandledError = (command, error) => ({ command, error });

//

// #region Initialize client and expose messages
const getClient = construct0(Client);
const connect = invoke1('login');

const client = getClient();

const message$ = K.fromEvents(client, 'message').toProperty();
const ready$ = K.fromEvents(client, 'ready').toProperty();
// #endregion

//

const _events$ =
  R.map(ev => K.fromEvents(client, ev).map(payload => ({ payload, ev })), events);

const state$ = U.thru(
  U.parallel(_events$),
  U.toProperty,
  U.skipUnless(R.identity),
);

const commands$ = getCommands(message$);

const handler$ = U.thru(
  commands$,
  U.flatMapLatest(R.unless(commandIsValid, K.constantError)),
  U.flatMapLatest(cmd => L.set('handler', Handlers.methods[cmd.command], cmd)),
  U.flatMapErrors(addPayloadError),
);

const handled$ = U.thru(
  handler$,
  U.skipUnless(R.identity),

  // @todo Replace with a bimap-based version or lift values into a Property
  U.flatMapLatest(x => {
    const fnRes = handleCommandPayload(x);
    const resFn = U.lift(
      fnRes instanceof Error
      ? createHandledError
      : createHandledResponse
    );

    return resFn(x.command, fnRes);
  }),
);

const hasSaveMethod = response => Save.methods[response.command];
const hasSaveMethod$ = U.liftRec(hasSaveMethod);

const saveHandled$ = U.thru(
  handled$,
  U.skipUnless(hasSaveMethod$),
  U.flatMapLatest(({ command, payload }) => Save.methods[command](payload))
);

// Activation

handler$.onValue(v =>
  logger.log('info', `Got command \`${v.command}\``));

handled$.onValue(v => {
  logger.log('info', `Handled command \`${v.command}\``);
  console.log('handled$.onValue:', v);
});

handled$.onError(({ command, error }) =>
  logger.log('error', `Error handling command \`${command}\`; type=\`${error.name}\`, message=\`${error.message}\``));

saveHandled$.observe({
  value: v => logger.log(
    'info',
    `Successfully saved entity; ${JSON.stringify(v, null, 2)}`,
  ),
  error: err => logger.log(
    'error',
    `Error trying to save entity; ${err.message}`,
  ),
});

// Methods

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
