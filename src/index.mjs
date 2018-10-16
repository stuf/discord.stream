// @flow
import type { Observable } from 'kefir';
import * as U from 'karet.util';

import logger from './logger';
import Client from './client';
import Database from './database';

const {
  DISCORD_TOKEN,
  MONGODB_URL,
}: { DISCORD_TOKEN: string, MONGODB_URL: string } = process.env;

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

U.thru(
  [clientStarted$, dbStarted$],
  U.parallel,
  U.takeFirstErrors(1),
).onError(err => {
  logger.log('error', 'Errored');
  console.error(err);
  process.exit(1);
});
