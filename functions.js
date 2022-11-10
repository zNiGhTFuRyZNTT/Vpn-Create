const { exec } = require("child_process")

function create_zip(path, zipname) {
    return new Promise(function (resolve, reject) {
        exec(`sudo zip storage/${zipname}.zip ${path}`, (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`)
                reject(error)
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`)
                reject(stderr)
            }
            console.log(`${stdout}`)
            resolve(stdout)
        })
    })
}

function create_vpn(name) {
    return new Promise((resolve, reject) => {
        exec(`sudo python3 headquarters.py --action create --name ${name}`, (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`)
                reject(error)
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`)
                reject(stderr)
            }
            console.log(`stdout: ${stdout}`)
            resolve(stdout)
        })
    })
}

function revoke_user(is_admin, num) {
    return new Promise((resolve, reject) => {
        if (!is_admin) return
        exec(`sudo python3 headquarters.py --action revoke --num ${num}`, (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`)
                reject(error)
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`)
                reject(stderr)
            }
            console.log(`stdout: ${stdout}`)
            resolve(stdout)
        })   
    })
}

function list_users(is_admin) {
    return new Promise((resolve, reject) => {
        if (!is_admin) return
        exec(`sudo python3 headquarters.py --action list`, (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`)
                reject(error)
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`)
                reject(stderr)
            }
            // console.log(stdout)
            resolve(stdout)
        })
    })

}


function throw_key_err(msg) {
    msg.reply.text("[❗] Syntax error: Please provide only key and name.\n\t Example: /vpn key=0DSAFARSHIA22 name=Mamad")
    return
}
function random_str() {
    return Math.random().toString(36).substr(2, 3)
}
function random_int() {
    return Math.floor(Math.random() * 1000)
}


module.exports = {
    create_vpn:    create_vpn,
    throw_key_err: throw_key_err,
    random_str:    random_str,
    revoke_user:   revoke_user,
    list_users:    list_users,
    create_zip: create_zip,
    random_int: random_int,
}