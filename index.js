const util = require('util');
const exec = util.promisify(require('child_process').exec);
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

async function executeCommand(command) {
    try {
        const { stdout, stderr } = await exec(command);
        if (stdout) {
            console.log('Command Output (stdout):', stdout);
        }
        if (stderr) {
            console.log('Command Output (stderr):', stderr);
        }
        return { stdout, stderr };
    } catch (error) {
        console.log(error);
        throw error;
    }
}


http.createServer(async function (req, res) {
    let output = "";
    const pre = console.log;
    console.log = (...str) => {
        output += str.join(" ") + "\n";
    };

    for (const cmd of Commands) {
        console.log('this$: ' + cmd);
        console.log("<<<");
        try {
            await executeCommand(cmd);
        } catch (e) {
            console.log(e);
        }
        console.log("END>>>");
    }


    console.log('\n\nAll Commands Executed!')
    console.log("Split Command from env file: &&&")

    console.log = pre;
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end(output);
}).listen(PORT, "127.0.0.1");
console.log('Updater Running on port '+PORT);