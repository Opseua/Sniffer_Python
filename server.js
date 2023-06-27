const { addListener, globalObject } = await import('../Chrome_Extension/src/resources/globalObject.js');
await import('../Microsoft_Graph_API/src/services/excel/updateRange.js')

await import('../Chrome_Extension/src/clearConsole.js');
import net from 'net'; const port = 3000;
import { exec } from 'child_process'
console.clear();

console.log('SERVER JS RODANDO', '\n');
const sockPri = net.createServer();
sockPri.on('connection', (socket) => { socket.write(JSON.stringify(sendPri)) }); sockPri.listen(port, () => { });

import { fileInf } from '../Chrome_Extension/src/resources/fileInf.js';
const retFunction = await fileInf(new URL(import.meta.url).pathname);
const command = `D:/ARQUIVOS/WINDOWS/PORTABLE_Python/python-3.11.1.amd64/python.exe ${retFunction.res.pathCurrent2}/start.py`
exec(command, (err, stdout, stderr) => { if (err) { console.error(err); return; } console.log(stdout); });

const filterBy = str => sendPri.arrUrl.some(a => new RegExp('^' + str.replace(/\*/g, '.*') + '$').test(a));
const sendPri = {
    'buffer': 1024,
    'arrUrl': ['18.119.140.20', 'https://jsonformatter.org/json-parser', 'https://ntfy.sh/']
};

// -#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#

async function reqRes(inf) {
    const ret = { 'send': true, res: {} }; ret['res']['reqRes'] = inf.reqRes;
    if (filterBy(inf.url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\\(?=\*)/g, ''))) {
        // ######################################################################


        if ((inf.reqRes == 'req') && (inf.url == 'https://ntfy.sh/')) {
            ret['res']['body'] = inf.body.replace(/CASA/g, 'AAAAAAAA');
            globalObject.inf = {
                'alert': false, 'function': 'updateRange', 'res': ret.res.body
            };
        }

        if ((inf.reqRes == 'res') && (inf.host == '18.119.140.20') || (inf.url == 'https://jsonformatter.org/json-parser')) {
            ret['res']['body'] = inf.body.replace(/JSON Full Form/g, 'AAAAAAAA');
        }


        // ######################################################################
    }

    return ret
}














// -------------------------------------------------------------------------------------------------

// ################################################## REQUEST
const sockReq = net.createServer((socket) => {
    let getSockReq = '';
    socket.on('data', async (chunk) => {
        getSockReq += chunk.toString();
        if (getSockReq.endsWith('#fim#')) {
            // SOCKET: RECEBIDO
            getSockReq = Buffer.from(getSockReq.split("#fim#")[0], 'base64').toString('utf-8');
            const dataReq = JSON.parse(getSockReq); const ret = { 'send': true, res: {} };
            // SOCKET: ENVIADO
            const retReqRes = await reqRes(dataReq)
            if ((dataReq.reqRes == 'req') && (retReqRes.res.reqRes == 'req')) {
                const sendB64Req = Buffer.from(JSON.stringify(retReqRes)).toString('base64');
                for (let i = 0; i < sendB64Req.length; i += sendPri.buffer) {
                    const part = sendB64Req.slice(i, i + sendPri.buffer);
                    socket.write(part);
                }; socket.write('#fim#');  // ENVIAR CARACTERE DE FIM 
            }; getSockReq = ''; // LIMPAR BUFFER
        }
    });
});
sockReq.listen((port + 1), () => { });

// ################################################## RESPONSE
const sockRes = net.createServer((socket) => {
    let getSockRes = '';
    socket.on('data', async (chunk) => {
        getSockRes += chunk.toString();
        if (getSockRes.endsWith('#fim#')) {
            // SOCKET: RECEBIDO
            getSockRes = Buffer.from(getSockRes.split("#fim#")[0], 'base64').toString('utf-8');
            const dataRes = JSON.parse(getSockRes); const ret = { 'send': true, res: {} };
            // SOCKET: ENVIADO
            const retReqRes = await reqRes(dataRes)
            if ((dataRes.reqRes == 'res') && (retReqRes.res.reqRes == 'res')) {
                const sendB64Res = Buffer.from(JSON.stringify(retReqRes)).toString('base64');
                for (let i = 0; i < sendB64Res.length; i += sendPri.buffer) {
                    const part = sendB64Res.slice(i, i + sendPri.buffer);
                    socket.write(part);
                }; socket.write('#fim#');  // ENVIAR CARACTERE DE FIM 
            }; getSockRes = ''; // LIMPAR BUFFER
        }
    });
});
sockRes.listen((port + 2), () => { });


