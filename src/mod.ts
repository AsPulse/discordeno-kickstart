import { startBot } from 'discordeno';
import { bot } from './bot.ts';
import { logger } from './utils/logger.ts';
import { loadDirectory } from './utils/fileloader.ts';
import { upsertCommand } from './utils/command.ts';

const log = logger({ name: 'mod' });

log.info('Launch Process Started');
await Promise.all(
  [
    './src/features',
  ].map((path) => loadDirectory(path)),
);

await upsertCommand();

log.info('Starting bot...');
await startBot(bot);
log.info('Bot started!');
