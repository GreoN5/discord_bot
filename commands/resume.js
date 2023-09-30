const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('resume')
    .setDescription('Resumes the queue with the current song'),
  async execute(interaction) {
    const queue = interaction.client.player.queues.get(interaction.guildId);

    if (!queue) {
      await interaction.reply('There is no song playing.');
      return;
    }

    const currentSong = queue.currentTrack;
    queue.node.setPaused(false);

    const embed = new EmbedBuilder()
      .setDescription(`${currentSong.title} has started running again!`)
      .setThumbnail(currentSong.thumbnail);

    await interaction.reply({
      embeds: [embed],
    });
  },
};
