await import('./clearConsole.js');
import { Console } from 'console';
import net from 'net'; const port = 3000;
console.log('\n', 'SERVER JS RODANDO\n');
const serverPri = net.createServer();
serverPri.on('connection', (socket) => { socket.write(JSON.stringify(sendPri)) }); serverPri.listen(port, () => { });

const sendPri = {
    'buffer': 1024,
    'host': [
        '18.119.140.20',
    ],
    'url': [
        'https://jsonformatter.org/json-parser',
    ]
};


// ################################################## REQUEST



// ################################################## RESPONSE
const sockRes = net.createServer((socket) => {
    let getSockRes = '';
    socket.on('data', async (chunk) => {
        getSockRes += chunk.toString();
        if (getSockRes.endsWith('#fim#')) {
            getSockRes = Buffer.from(getSockRes.split("#fim#")[0], 'base64').toString('utf-8');
            const dataRes = JSON.parse(getSockRes); const ret = { 'send': true, res: {} };
            // ################################### ↑↑↑ SOCKET: RECEBIDO ↑↑↑ ###################################

            if ((dataRes.type == 'req') && (dataRes.url == 'https://ntfy.sh/') && (dataRes.method == 'PUT')) {
                ret['res']['body'] = dataRes.body.replace(/JSON Full Form/g, 'AAAAAAAA');
            }

            if ((dataRes.type == 'req') && (dataRes.url == 'https://ntfy.sh/') && (dataRes.method == 'PUT')) {
                ret['res']['body'] = dataRes.body.replace(/JSON Full Form/g, 'AAAAAAAA');
            }

            // ################################### ↓↓↓ SOCKET: ENVIADO ↓↓↓ ###################################
            const sendB64Res = Buffer.from(JSON.stringify(ret)).toString('base64');
            for (let i = 0; i < sendB64Res.length; i += sendPri.buffer) {
                const part = sendB64Res.slice(i, i + sendPri.buffer);
                socket.write(part);
            }; socket.write('#fim#'); getSockRes = ''; // ENVIAR CARACTERE DE FIM E LIMPAR BUFFER
        }
    });
});
sockRes.listen((port + 2), () => { });










