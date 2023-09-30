const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stop')
    .setDescription('Stop the bot completely (exit channel).'),
  async execute(interaction) {
    const queue = interaction.client.player.queues.get(interaction.guildId);

    if (!queue) {
      await interaction.reply('There are no songs in the queue.');
      return;
    }

    await interaction.client.player.queues.player.destroy();
    await interaction.reply('Защо ме спря ве педераст!!!');
  },
};
