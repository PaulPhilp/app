const fs = require ("fs")

export default function getDir(name) {
    console.log(`getDir(${name})`)
    console.log(fs)
    return fs.readdirSync(name)
    }