import asyncio
import os
import discord

from discord.ext import commands
from music import Music
from helpers import Help

bot = commands.Bot('!', intents=discord.Intents.all())
bot.remove_command('help')


async def main():
    await bot.add_cog(Help(bot))
    await bot.add_cog(Music(bot))
    await bot.start('TOKEN')
    await bot.run(os.getenv('TOKEN'))

asyncio.run(main())
