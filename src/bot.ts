import { createBot, GatewayIntents } from 'discordeno';
import { env } from './env.ts';

export const bot = createBot({
  token: env.DISCORD_BOT_TOKEN,
  botId: env.DISCORD_BOT_USERID,
  intents: GatewayIntents.Guilds | GatewayIntents.GuildMessages,
  events: {},
});
