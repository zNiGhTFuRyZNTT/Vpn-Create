const TeleBot = require('telebot')
const cluster = require('cluster')
const { exec } = require("child_process")
var AdmZip = require("adm-zip")
const { create_vpn, random_str, throw_key_err, revoke_user, list_users, create_zip, random_int } = require("./functions")
const database = require("./database")
require('dotenv').config()
const token = process.env.API_KEY
const bot = new TeleBot({
    token: token,
    usePlugins: ['floodProtection',]
})
const admins = process.env.ADMINS.split(",").map(Number)



bot.on(['/start', '/hello'], (msg) => msg.reply.text('برام /vpn رو بفرست. پاینده ایران🖤👑').catch(console.log))

bot.on('vpn', async (msg) => {
    const is_admin = (admins.indexOf(msg.from.id) >= 0)
    userId = msg.from.id
    const userCount = await database.getUser(msg.from.id)
    await database.addUser(userId, 0)

    if (userCount < 2 || is_admin) {

        // console.log(keys.includes(req.key) || [UNIQUE_KEY].includes(req.key));
        const prepMsg = await msg.reply.text("[🖤] Creating vpn please wait ...")
        const msgId = prepMsg.message_id
        const filename = `${random_str()}-${req.name.toUpperCase()}-${random_int()}`
        const path = `storage/${filename}.ovpn`
        console.log(filename)
        try {
            await create_vpn(`${filename}`)
            await bot.editMessageText({chatId: msg.chat.id, messageId: msgId}, '[🔞] Vpn created, sending ...').catch(err => console.log(err))
            await create_zip(path, filename).catch(err => console.log(err))
            await bot.sendDocument(msg.chat.id, `./storage/${filename}.zip`).catch(err => console.log(err))
            await database.addCount(userId)
            await bot.deleteMessage(msg.chat.id, msgId).catch(err => msg.reply.text(err))
            return

        } catch (error) {
            msg.reply.text(`مشکلی پیش اومد لطفا دوباره تلاش کن یا به من پیام بده @NiGhTFuRyZz`).catch(console.log)
            return
        }

    }
    msg.reply.text("[❗] درخواست نا معتبر, لطفا به ادمین پیام بدید. @NiGhTFuRyZz").catch(console.log)
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
    list_users(is_admin)
        .then(users_list=> {
            msg.reply.text(users_list).catch(err => console.log(err))
        })
        .catch(console.log)
})


if (cluster.isMaster) {
    cluster.fork()

    cluster.on('exit', (worker, code, signal) => {
        cluster.fork()
    })
}
if (cluster.isWorker) {
    bot.start()
}