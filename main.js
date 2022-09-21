const TeleBot = require('telebot')
const { exec } = require("child_process")
var AdmZip = require("adm-zip");
const { create_vpn, random_str, throw_key_err, revoke_user, list_users, create_zip, random_int } = require("./functions")
require('dotenv').config()
const token = process.env.API_KEY
const bot = new TeleBot(token)
const admins = process.env.ADMINS.split(",").map(Number)
const UNIQUE_KEY = process.env.UNIQUE_KEY
const keys = [UNIQUE_KEY, ]

bot.on(/^\/createkey (.+)$/, async (msg, props) => {
    const is_admin = (admins.indexOf(msg.from.id) >= 0)
    if (!is_admin) return

    const name = props.match[1].replace(/\s/g, '')
    const key = (random_str() + "0" + name + "1" + random_str()).toUpperCase()
    console.log(`[>] Key created -> ${key}`);
    keys.push(key)
    await msg.reply.text(`[>] Key created!\n\tkeyword=${name}\n\tKey= ${key}`).catch(console.log)

})


bot.on('/keys', async (msg) => {
    await bot.sendMessage(msg.chat.id, `${keys}`).catch(console.log)
    return
})

bot.on(['/start', '/hello'], (msg) => msg.reply.text('Dorood Babe').catch(console.log))

bot.on(/^\/vpn (.+)$/, async (msg, props) => {
    let req = {}
    // console.log(props)
    props.match[1].split(" ").forEach(prop => {
        const key = prop.split("=")[0]
        const val = prop.split("=")[1]
        req[key] = val
    })
    if (!(req.key && req.name)) {
        throw_key_err(msg)
        return
    }
    const is_unique = req.key == UNIQUE_KEY 
    console.log(req)
    if (keys.includes(req.key)) {

        console.log(keys.includes(req.key) || [UNIQUE_KEY].includes(req.key));
        const prepMsg = await msg.reply.text("[🍑] Creating vpn please wait ...")
        const msgId = prepMsg.message_id
        const filename = `${random_str()}-${req.name.toUpperCase()}-${random_int()}`
        const path = `storage/${filename}.ovpn`
        console.log(filename);
        !is_unique ? keys.splice(req.key, 1) : {}
        await create_vpn(keys, req.key, `${filename}`).catch(err => console.log(err.message))
        await bot.editMessageText({chatId: msg.chat.id, messageId: msgId}, '[🔞] Vpn created, sending ...').catch(err => console.log(err))
        await create_zip(path, filename).catch(err => console.log(err.message))
        await bot.sendDocument(msg.chat.id, `./storage/${filename}.zip`).catch(err => console.log(err.message))
        await bot.deleteMessage(msg.chat.id, msgId).catch(err => msg.reply.text(err.message))
        return
    }
    msg.reply.text("[❗] Key not valid, please contact @NiGhTFuRyZz")
})

bot.on(/^\/revoke (.+)$/, async (msg, props) => {
    const is_admin = (admins.indexOf(msg.from.id) >= 0)
    const num = props.match[1]
    const res = await revoke_user(is_admin, num)
    await msg.reply.text(res).catch(console.log)
})

bot.on('/list', async (msg) => {
    const is_admin = (admins.indexOf(msg.from.id) >= 0)
    if (!is_admin) return
    const users_list = await list_users(is_admin).catch(console.log)
    await msg.reply.text(users_list).catch(err => console.log(err))
})



bot.start()