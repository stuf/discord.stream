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

clientStarted$.take(1).onValue(() => logger.log('info', 'Discord client successfully connected'));
dbStarted$.take(1).onValue(() => logger.log('info', 'MongoDB connection successfully opened'));
done$.take(1).onValue(() => logger.log('info', 'Bot ready'));
