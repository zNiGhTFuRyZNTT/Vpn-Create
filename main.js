const TeleBot = require('telebot')
const { exec } = require("child_process")
var AdmZip = require("adm-zip");
const {
    create_vpn,
    random_str,
    throw_key_err,
    revoke_user,
    list_users,
    create_zip
} = require("./functions")
require('dotenv').config()
const token = process.env.API_KEY
const bot = new TeleBot(token)
const admins = process.env.ADMINS.split(",").map(Number)
const UNIQUE_KEY = process.env.UNIQUE_KEY
let keys = [UNIQUE_KEY, ]

bot.on(/^\/createkey (.+)$/, async (msg, props) => {
    const is_admin = (admins.indexOf(msg.from.id) >= 0)
    if (!is_admin) return

    const name = props.match[1].replace(/\s/g, '')
    const key = (random_str() + "0" + name + "1" + random_str()).toUpperCase()
    console.log(`[>] Key created -> ${key}`);
    keys.push(key)
    msg.reply.text(`[>] Key created!\n\tkeyword=${name}\n\tKey= ${key}`)

})

bot.on(['/start', '/hello'], (msg) => msg.reply.text('Dorood Babe'))

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
    console.log(req)
    if (keys.includes(req.key)) {
        await msg.reply.text("[🍑] Creating vpn please wait ...")
        const filename = random_str() + req.name
        create_vpn(keys, req.key, `${filename}`)
        keys.splice(req.key, 1)
        // bot.sendDocument(msg.chat.id, '')
        await bot.sendMessage(msg.chat.id, '[🔞] Vpn created, sending ...').catch(err => console.log)
        // console.log(`${filename}.ovpn`);
        const path = `storage/${filename}.ovpn`
        create_zip(path, filename)
        console.log(path);
        await bot.sendDocument(msg.chat.id, `./storage/${filename}.zip`).catch(err => console.log(err))
        return
    }
    msg.reply.text("[❗] Key not valid, please contact @NiGhTFuRyZz")
})

bot.on(/^\/revoke (.+)$/, async (msg, props) => {
    const num = props.match[1]
    const res = revoke_user(is_admin, num)
    msg.reply.text(res)
})

bot.on(/^\/list (.+)$/, async (msg, props) => {
    const is_admin = (admins.indexOf(msg.from.id) >= 0)
    if (!is_admin) return
    const users_list = list_users(is_admin)
    msg.reply.text(users_list)
})



bot.start()