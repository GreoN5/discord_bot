const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder().setName('pause').setDescription('отивам да пуша'),
  async execute(interaction) {
    const queue = interaction.client.player.queues.get(interaction.guildId);

    if (!queue) {
      await interaction.reply('There is no song playing.');
      return;
    }

    const currentSong = queue.currentTrack;
    queue.node.setPaused(true);

    const embed = new EmbedBuilder()
      .setDescription(`${currentSong.title} has been paused!`)
      .setThumbnail(currentSong.thumbnail);

    await interaction.reply({
      embeds: [embed],
    });
  },
};
