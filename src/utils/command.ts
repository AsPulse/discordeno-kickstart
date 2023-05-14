import { Bot } from 'discordeno';
import { CreateSlashApplicationCommand, Interaction } from 'discordeno';
import { bot } from '../bot.ts';
import { env } from '../env.ts';
import { registerEventListener } from './event.ts';
import { Logger, logger } from './logger.ts';

export type UserCommand = {
  setting: CreateSlashApplicationCommand;
  guildOnly: boolean;
  handler: (
    interaction: Interaction,
    bot: Bot,
    logger: Logger,
  ) => Promise<void>;
};

const log = logger({ name: 'command' });

const commands: UserCommand[] = [];
export function registerCommand(command: UserCommand) {
  commands.push(command);
  log.info(
    `Registered ${
      command.guildOnly ? 'guild' : 'global'
    } command: ${command.setting.name}`,
  );
}
export async function upsertCommand() {
  const guildCommands = commands.filter((command) => command.guildOnly);
  const globalCommands = commands.filter((command) => !command.guildOnly);

  if (guildCommands.length > 0) {
    await bot.helpers.upsertGuildApplicationCommands(
      env.DISCORD_GUILDID,
      guildCommands.map((v) => v.setting),
    );
  }
  if (globalCommands.length > 0) {
    await bot.helpers.upsertGlobalApplicationCommands(
      globalCommands.map((v) => v.setting),
    );
  }

  log.info(
    `Upserted ${guildCommands.length} guild command(s) and ${globalCommands.length} global command(s).`,
  );
}

registerEventListener('interactionCreate', async (_, interaction) => {
  const { data } = interaction;
  if (data === undefined) {
    log.warn(`Interaction whose id is ${interaction.id} has no data!`);
    return;
  }

  const interactionName = data.name;

  const command = commands.find((v) => v.setting.name === data.name);
  if (command === undefined) {
    log.warn(
      `Interaction Received: ${interactionName}, but no command found for.`,
    );
    return;
  } else {
    log.debug(`Interaction Received: ${interactionName}`);
    const commandLogger = logger({
      name: `command (${interactionName}, interaction: ${interaction.id})`,
    });
    commandLogger.info(`Handling command...`);
    await command.handler(interaction, bot, commandLogger);
    commandLogger.info(`Handling finished!`);
  }
});
