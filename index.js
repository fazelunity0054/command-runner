const {exec} = require('child_process')
const http = require('http');
const PORT = 9940;
require('dotenv').config()
console.log('Starting directory: ' + process.cwd());
try {
    process.chdir(process.env.DIR);
    console.log('New directory: ' + process.cwd());
}
catch (err) {
    console.log('chdir: ' + err);
}
const Commands = process.env?.COMMANDS?.split("&&&") ?? ['echo SET COMMANDS on .env file!']

function executeCommand(command, options = {}) {
    return new Promise((resolve, reject) => {
        exec(command, function (err, stdout, stderr) {
            if (err) {
                console.log(err)
                reject(err);
            }
            console.log(stdout);
        }).on('exit', ()=>{
            resolve(true);
        })
    });
}


http.createServer(async function (req, res) {
    let output = "";
    let pre = console.log;
    console.log = (str)=>{
        output += str+"\n";
    }
    await Promise.all((
        Commands.map(async (cmd) => {
            console.log('this$: '+cmd);
            console.log("<<<")
            try {
                await (await executeCommand(cmd));
            } catch (e) {
                console.log(e);
            }
            console.log("END>>>")
        })
    ))

    console.log('\n\nAll Commands Executed!')
    console.log("Split Command from env file: &&&")

    console.log = pre;
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end(output);
}).listen(PORT, "127.0.0.1");
console.log('Updater Running on port '+PORT);