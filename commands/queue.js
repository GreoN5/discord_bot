const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('queue')
    .setDescription('Show first 10 songs of the current queue'),
  async execute(interaction) {
    const queue = interaction.client.player.queues.get(interaction.guildId);

    if (!queue || !queue.isPlaying()) {
      await interaction.reply('There are no songs in the queue.');
      return;
    }

    const queueString = queue.tracks
      .toArray()
      .slice(0, 10)
      .map((song, i) => {
        return `${i}) [${song.duration}]\` ${song.title} - <@${song.requestedBy.id}>`;
      })
      .join('\n');

    const currentSong = queue.currentTrack;

    const embed = new EmbedBuilder()
      .setDescription(
        `**Currently Playing**\n` +
          (currentSong
            ? `\`[${currentSong.duration}]\` ${currentSong.title} - <@${currentSong.requestedBy.id}>`
            : 'None') +
          `\n\n**Queue**\n${queueString}`,
      )
      .setThumbnail(currentSong.thumbnail);

    await interaction.reply({
      embeds: [embed],
    });
  },
};
