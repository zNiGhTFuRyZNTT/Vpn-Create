const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('./data.sqlite3', sqlite3.OPEN_READWRITE , err => {
    if (err)
        return console.error(err.message)
    console.log("[Database] > Connected to SQLite Database")
})

// run to make the intial table
// db.run('CREATE TABLE users (userId integer, count integer)')

function getUser(userID) {
    return new Promise((resolve, reject) => {
        db.get(`SELECT * FROM users WHERE user_id = ?`, userID, (err, user) => {
            if (err) reject(err)
            resolve(user)
        })
    })
}

function addUser(userId, count) {
    return new Promise((resolve, reject) => {
        if (userId == -1001749065212 || chatID == -1001749065212)
            resolve(false)
        else
            getUser(userId)
                .then(res => {
                    if (res) {
                        resolve(true)
                    }
                    else 
                        db.run("INSERT INTO users (userId, count) VALUES (?, ?)", [userId, count], err => {
                            if (err) reject(err)
                            
                            resolve(true)
                        }) 
                })
                .catch(reject)
    })
}

function addCount(userId) {
    return new Promise((resolve, reject) => {
        db.get(`SELECT count FROM users WHERE userId = ?`, userId, (err, user) => {
            if (err) reject(err)
            
            if (user)
                db.run("UPDATE users SET count = ? WHERE userId = ?", [++user.count, userId], err => {
                    if (err) reject(err)
                    resolve(true)
                }) 
        })
    })
}
function reduceCount(userId) {
    return new Promise((resolve, reject) => {
        db.get(`SELECT count FROM users WHERE userId = ?`, userId, (err, user) => {
            if (err) reject(err)
            
            if (user)
                db.run("UPDATE users SET count = ? WHERE userId = ?", [--user.count, userId], err => {
                    if (err) reject(err)
                    resolve(true)
                }) 
        })
    })
}

module.exports = {
    getUser: getUser,
    addUser: addUser,
    addCount: addCount,
    reduceCount: reduceCount,
}