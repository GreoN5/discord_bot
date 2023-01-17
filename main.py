import asyncio
import os
import discord

from discord.ext import commands
from music import Music
from helpers import Help

bot = commands.Bot('!', intents=discord.Intents.default())
bot.remove_command('help')

client = discord.Client()


async def setup(bot):
    await bot.add_cog(Help(bot))
    await bot.add_cog(Music(bot))


async def main():
    # do other async things
    await setup()

    # start the client
    async with client:
        await client.start(os.getenv("TOKEN"))

asyncio.run(main())
