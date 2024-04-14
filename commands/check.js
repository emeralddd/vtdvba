const { Message, User, UserFlags, Client } = require('discord.js')

const help = {
    name:"check",
    aliases: []
}

/**
 * @param {object} obj
 * @param {Message} obj.message
 * @param {Client} obj.bot
 */

const run = async ({bot,message}) => {
    const wheat= await (await bot.guilds.fetch('889096508614537303')).members.fetch('786234973308715008');
    if(wheat.presence&&wheat.presence.status==='online') message.channel.send('Online');
    else message.channel.send('Offline');
}

module.exports.run = run

module.exports.help = help