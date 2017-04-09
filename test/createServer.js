import http from 'http';
const childProcess = require('child_process');

let portrange = 45033;

function getFreePort(cb) {
    return new Promise((resolve, reject) => {
        var port = portrange;
        portrange += 1;

        var server = http.createServer();

        server.listen(port, function (err) {
            server.once('close', function () {
                resolve(port);
            })

            server.close();
        });

        server.on('error', function (err) {
            getPort(cb);
        });
    });
}

function killPortHolder(port) {
    childProcess.execSync(`sudo lsof -P | grep ':${port}' | awk '{print $2}' | xargs kill -9`);
}

export default async function createServer() {
    const port = await getFreePort();

    console.log('found a free port', port);

    killPortHolder(port);
    killPortHolder(8000);

    const serverProcess = childProcess.spawn('node', ['../resonators-server/index.js'], {
        env: {
            ENV: 'dev',
            PORT: port,
            PATH: process.env.PATH,
            HOME: '/Users/alonn'
        }
    });

    const clientProcess = childProcess.spawn('npm', ['start']);

    const serverPromise = readStdOutUntil(serverProcess, 'Node app is running', '[SERVER]', '\x1b[33m%s\x1b[0m:')
        .then(() => {
            console.log('server is ready');
        });

    const clientPromise = readStdOutUntil(clientProcess, 'webpack: Compiled', '[CLIENT]', '\x1b[36m%s\x1b[0m')
        .then(() => {
            console.log('client is ready');
        });

    return Promise.all([serverPromise, clientPromise])
        .then(() => {
            console.log(`server and client are ready.\nserver: localhost:${port}\nclient: localhost:8000`);
            return `localhost:${port}`;
        });
}

function readStdOutUntil(process, str, prefix, color) {
    return new Promise((res, rej) => {
        process.stdout.setEncoding('utf8');

        process.stdout.on('data', function(data) {
            var line = data.toString();

            console.log(color, prefix, line);

            if (line.indexOf(str) !== -1)
                res();
        });

        process.stderr.on('data', function(data) {
            console.log(color, prefix, data.toString());
        });
    });
}
