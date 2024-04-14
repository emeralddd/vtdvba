require('events').EventEmitter.prototype._maxListeners = Infinity
require('events').defaultMaxListeners = Infinity
const { Collection, Client, Intents } = require('discord.js')
const fs = require('fs')
require('dotenv').config({ path: 'secret.env' })
const express = require('express')
const axios = require('axios')
// import axios from 'axios'

const bot = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_PRESENCES] })
let commandsList = new Collection()
let aliasesList = new Collection()

const app = express()

app.get('/', function (req, res) {
    res.send('Hello World')
})

app.listen(process.env.PORT || 3000)

const addCommand = () => {
    fs.readdir(`./commands/`, (error, files) => {
        if (error) {
            // console.error(error.message)
        }
        const jsfile = files.filter(file => file.split('.').pop() === 'js')
        if (jsfile.length === 0) {
            console.error('Chua lenh nao duoc add!')
        }
        jsfile.forEach((file, index) => {
            const module = require(`./commands/${file}`)
            if (module.help) {
                commandsList.set(module.help.name, module)
                module.help.aliases.forEach(alias => {
                    aliasesList.set(alias, module.help.name)
                })
            }
        })
    })
}

const checkOnline = async () => {
    const wheat = await (await bot.guilds.fetch('889096508614537303')).members.fetch('786234973308715008');
    if ((!wheat.presence) || (wheat.presence && wheat.presence.status === 'offline')) {
        await (await bot.users.fetch('687301490238554160')).send('BOT OFF ALOOOO!');

        // try {
        //     axios.post('https://wheat-1.emeralddd.repl.co/wheatriped', {
        //         RESTART_KEY: process.env.RESTART_KEY
        //     });

        //     axios.post('https://wheat.emeralddd.repl.co/wheatriped', {
        //         RESTART_KEY: process.env.RESTART_KEY
        //     });
        // } catch (err) {

        // }
    }
}

const each2Minutes = async () => {
    checkOnline();
    setInterval(async () => {
        checkOnline();
    }, 600000)
}

bot.once('ready', () => {
    addCommand()
    bot.user.setActivity('with temeralddd#1385', { type: 'PLAYING' })
    console.log(`Da dang nhap duoi ten ${bot.user.tag}!`)
    each2Minutes();

})

bot.on('guildMemberAdd', async (member) => {
    try {
        const memberRole = await member.guild.roles.fetch('918193953067638834')
        await member.roles.add(memberRole)
        await member.send(`> Welcome to **Wheat Support Server** 🌾!\n\n**Đọc luật của Server 🛑 Read the Rules of Server**\n▻ <#889102076775366686>\n**Một số câu hỏi thường gặp ❓ Frequently Ask Questions**\n▻ <#917992797204807691>\n**Channel hỗ trợ chính 🎧 Find a guide for any questions here**\n▻ <#889096508614537310>`)
    } catch (error) {
        // console.log(error)
    }
})

bot.on('messageCreate', async (message) => {
    if (message.channel.type === "dm") return

    try {
        const msg = message.content
        if (!msg) return
        const prefix = 'vv'
        if (!msg.toLowerCase().startsWith(prefix)) return
        const S = msg.substring(prefix.length).split(' ')
        let args = []
        for (const i of S) {
            if (i != '') args.push(i)
        }
        if (args.length === 0) return
        let cmd = args[0].toLowerCase()
        if (aliasesList.has(cmd)) {
            cmd = aliasesList.get(cmd)
        }
        if (commandsList.has(cmd)) {
            const command = commandsList.get(cmd)
            try {
                command.run({
                    bot,
                    S,
                    message,
                    msg,
                    args,
                    aliasesList
                })
            } catch (error) {
                // console.log(error)
            }
        }
    } catch (error) {
        // console.log(error)
    }
})

bot.login(process.env.TOKEN)