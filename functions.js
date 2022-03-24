const { exec } = require("child_process")
var AdmZip = require("adm-zip");

function create_zip(path, zipname) {
    const zip = new AdmZip()
    zip.addLocalFile(path)
    zip.writeZip(`storage/${zipname}.zip`)
}

function create_vpn(keys, key, name) {
    if (!keys.includes(key)) return

    exec(`sudo python3 headquarters.py --action create --name ${name}`, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`)
            return
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`)
            return
        }
        console.log(`stdout: ${stdout}`)
        return stdout
    })
}

function revoke_user(is_admin, num) {
    if (!is_admin) return
    exec(`sudo python3 headquarters.py --action revoke --num ${num}`, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`)
            return
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`)
            return
        }
        console.log(`stdout: ${stdout}`)
        return stdout
    })

}

function list_users(is_admin) {
    if (!is_admin) return
    exec(`sudo python3 headquarters.py --action list`, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`)
            return
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`)
            return
        }
        console.log(`stdout: ${stdout}`)
        return stdout
    })
}


function throw_key_err(msg) {
    msg.reply.text("[❗] Syntax error: Please provide only key and name.\n\t Example: /vpn key=0DSAFARSHIA22 name=Mamad")
    return
}
function random_str() {
    return Math.random().toString(36).substr(2, 3)
}


module.exports = {
    create_vpn:    create_vpn,
    throw_key_err: throw_key_err,
    random_str:    random_str,
    revoke_user:   revoke_user,
    list_users:    list_users,
    create_zip: create_zip,
}