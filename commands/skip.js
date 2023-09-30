const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder().setName('skip').setDescription('Skips the current song'),
  async execute(interaction) {
    const queue = interaction.client.player.queues.get(interaction.guildId);

    if (!queue) {
      await interaction.reply('There are no songs in the queue');
      return;
    }

    const currentSong = queue.currentTrack;
    queue.node.skip();

    const embed = new EmbedBuilder()
      .setDescription(`${currentSong.title} has been skipped!`)
      .setThumbnail(currentSong.thumbnail);

    await interaction.reply({
      embeds: [embed],
    });
  },
};
