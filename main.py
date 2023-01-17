import asyncio
import os
import discord

from discord.ext import commands
from music import Music
from helpers import Help

intents = discord.Intents.default()
intents.message_content = True

bot = commands.Bot(command_prefix='!', intents=intents)
bot.remove_command('help')

client = discord.Client(intents=discord.Intents.default())


async def setup(bot):
    await bot.add_cog(Help(bot))
    await bot.add_cog(Music(bot))


async def main():
    # do other async things
    await setup(bot)

    # start the client
    async with client:
        await client.start(os.getenv("TOKEN"))

asyncio.run(main())
