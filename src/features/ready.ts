import { registerEventListener } from '../utils/event.ts';
import { logger } from '../utils/logger.ts';

const log = logger({ name: 'Ready' });

registerEventListener('ready', (_, { shardId, user }) => {
  log.info(`Bot logged in as "${user.username}", Shard ${shardId} ready!`);
});
