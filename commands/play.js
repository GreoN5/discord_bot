const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const { QueryType } = require('discord-player');
const { YoutubeExtractor } = require('@discord-player/extractor');

const executePlaySong = async (interaction, queue, embed) => {
  const url = interaction.options.getString('url');

  const result = await interaction.client.player.search(url, {
    requestedBy: interaction.user,
    searchEngine: QueryType.YOUTUBE_VIDEO,
  });

  if (result.tracks.length === 0) return interaction.reply('Сори брат, няма такава песен!');

  const song = result.tracks[0];
  await queue.addTrack(song);

  embed
    .setDescription(`**[${song.title}](${song.url})** has been added to the Queue`)
    .setThumbnail(song.thumbnail)
    .setFooter({ text: `Duration: ${song.duration}` });
};

const executePlayPlaylist = async (interaction, queue, embed) => {
  const url = interaction.options.getString('url');
  const result = await interaction.client.player.search(url, {
    requestedBy: interaction.user,
    searchEngine: QueryType.YOUTUBE_PLAYLIST,
  });

  if (result.tracks.length === 0)
    return interaction.reply(`'Сори брат, няма такъв плейлист:' ${url}`);

  const playlist = result.playlist;
  await queue.addTrack(result.tracks);

  embed
    .setDescription(
      `**${result.tracks.length} songs from [${playlist.title}](${playlist.url})** have been added to the Queue`,
    )
    .setThumbnail(playlist.thumbnail);
};

const executePlaySearch = async (interaction, queue, embed) => {
  const url = interaction.options.getString('keywords');
  const result = await interaction.client.player.search(url, {
    requestedBy: interaction.user,
    searchEngine: QueryType.AUTO,
  });

  if (result.tracks.length === 0) return interaction.editReply('Сори брат, няма такава песен!');

  const song = result.tracks[0];
  await queue.addTrack(song);

  embed
    .setDescription(`**[${song.title}](${song.url})** has been added to the Queue`)
    .setThumbnail(song.thumbnail)
    .setFooter({ text: `Duration: ${song.duration}` });
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('пускай Сашко')
    .addSubcommand((subcommand) =>
      subcommand
        .setName('search')
        .setDescription('Searches for a song and plays it')
        .addStringOption((option) =>
          option.setName('keywords').setDescription('search keywords').setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('playlist')
        .setDescription('Plays a playlist from YT')
        .addStringOption((option) =>
          option.setName('url').setDescription("the playlist's url").setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('song')
        .setDescription('Plays a single song from YT')
        .addStringOption((option) =>
          option.setName('url').setDescription("the song's url").setRequired(true),
        ),
    ),
  async execute(interaction) {
    if (!interaction.member.voice.channel) {
      return interaction.reply('Къде си бе???');
    }

    await interaction.client.player.extractors.register(YoutubeExtractor, {});
    const queue = await interaction.client.player.nodes.create(interaction.guild);

    if (!queue.connection) await queue.connect(interaction.member.voice.channel);

    const embed = new EmbedBuilder();

    switch (interaction.options.getSubcommand()) {
      case 'song': {
        await executePlaySong(interaction, queue, embed);
        break;
      }
      case 'playlist': {
        await executePlayPlaylist(interaction, queue, embed);
        break;
      }
      case 'search': {
        await executePlaySearch(interaction, queue, embed);
        break;
      }
      default:
        break;
    }

    if (!queue.isPlaying()) await queue.play(queue.tracks.toArray());

    await interaction.reply({
      embeds: [embed],
    });
  },
};
