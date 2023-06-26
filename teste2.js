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

// ################################################## RESPONSE
const sockRes = net.createServer((socket) => {
    let getSockRes = '';
    socket.on('data', async (chunk) => {
        getSockRes += chunk.toString();
        if (getSockRes.endsWith('#fim#')) {
            // ################################### SOCKET: RECEBIDO ###################################
            getSockRes = Buffer.from(getSockRes.split("#fim#")[0], 'base64').toString('utf-8');
            const dataRes = JSON.parse(getSockRes); const ret = { 'send': true, res: {} };
            const retReqRes = await reqRes(dataRes)

            // ################################### SOCKET: ENVIADO ###################################
            if (retReqRes.res.reqRes == 'res') {
                const sendB64Res = Buffer.from(JSON.stringify(retReqRes)).toString('base64');
                for (let i = 0; i < sendB64Res.length; i += sendPri.buffer) {
                    const part = sendB64Res.slice(i, i + sendPri.buffer);
                    socket.write(part);
                }; socket.write('#fim#');  // ENVIAR CARACTERE DE FIM 
            };
            getSockRes = ''; // LIMPAR BUFFER

            // if (retReqRes.res.reqRes == 'req') {
            //     console.log('ok REQ')
            // }

        }
    });
});
sockRes.listen((port + 2), () => { });




async function reqRes(inf) {
    const ret = { 'send': true, res: {} }; ret['res']['reqRes'] = inf.reqRes;

    if ((inf.reqRes == 'req') && (inf.url == 'https://ntfy.sh/') && (inf.method == 'PUT')) {
        ret['res']['body'] = inf.body.replace(/CASA/g, 'AAAAAAAA');
    }

    if ((inf.reqRes == 'res') && (inf.host == '18.119.140.20') || (inf.url == 'https://jsonformatter.org/json-parser')) {
        ret['res']['body'] = inf.body.replace(/JSON Full Form/g, 'AAAAAAAA');
    }

    return ret
}










