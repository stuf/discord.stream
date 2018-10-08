const U = require('karet.util');

const logger = require('./logger');
const Client = require('./client');
const Database = require('./database');

const {
  DISCORD_TOKEN,
  MONGODB_URL,
} = process.env;

//

logger.log('info', 'Starting up Discord bot');

//

const clientStarted$ = Client.start(DISCORD_TOKEN);
const dbStarted$ = Database.start(MONGODB_URL);

const done$ = U.combine(
  [clientStarted$, dbStarted$],
  () => true,
);

//

clientStarted$.onValue(() => logger.log('info', 'Discord client successfully connected'));
dbStarted$.onValue(() => logger.log('info', 'MongoDB connection successfully opened'));
done$.onValue(() => logger.log('info', 'Bot ready'));
