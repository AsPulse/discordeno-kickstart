import { ApplicationCommandFlags, InteractionResponseTypes } from 'discordeno';
import { registerCommand } from '../utils/command.ts';

registerCommand({
  setting: {
    name: 'ping',
    description: 'reply with pong.',
    options: [],
  },
  guildOnly: true,
  handler: async (interaction, bot) => {
    await bot.helpers.sendInteractionResponse(
      interaction.id,
      interaction.token,
      {
        type: InteractionResponseTypes.ChannelMessageWithSource,
        data: {
          content: `Pong!`,
          flags: ApplicationCommandFlags.Ephemeral,
        },
      },
    );
  },
});
