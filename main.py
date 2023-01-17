import os
import discord

from discord.ext import commands
from music import Music
from helpers import Help

bot = commands.Bot('!', intents=discord.Intents.default())
bot.remove_command('help')

bot.add_cog(Help(bot))
bot.add_cog(Music(bot))

bot.run(os.getenv('TOKEN'))
