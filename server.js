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
//exec(command, (err, stdout, stderr) => { if (err) { console.error(err); return; } console.log(stdout); });

const sendPri = {
    'buffer': 1024,
    'arrUrl': [
        'http://18.119.140.20*', 'https://ntfy.sh/', 'https://jsonformatter.org/json-parser',
        'https://rating.ewoq.google.com/u/0/rpc/rating/AssignmentAcquisitionService/GetNewTasks',
        'https://rating.ewoq.google.com/u/0/rpc/rating/SafeTemplateService/GetTemplate'
    ]
};

// -#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#

async function reqRes(inf) {
    const ret = { 'send': true, res: {} }; ret['res']['reqRes'] = inf.reqRes;
    function rgxMat(a, b) {
        const c = b.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*');
        return new RegExp(`^${c}$`).test(a);
    }
    const regex = sendPri.arrUrl.find(m => rgxMat(inf.url, m));
    if (!!regex) {
        // ######################################################################

        if ((inf.reqRes == 'req') && (rgxMat(inf.url, 'https://ntfy.sh/'))) {
            ret['res']['body'] = inf.body.replace(/CASA/g, 'AAAAAAAA');
            globalObject.inf = { 'alert': false, 'function': 'updateRange', 'res': ret.res.body };
        }
        if ((inf.reqRes == 'res') && rgxMat(inf.url, '*18.119.140.20*')) {
            ret['res']['body'] = inf.body.replace(/JSON Full Form/g, 'AAAAAAAA');
            globalObject.inf = { 'alert': false, 'function': 'updateRange', 'res': ret.res.body };
        }
        if ((inf.reqRes == 'res') && rgxMat(inf.url, 'https://jsonformatter.org/json-parser')) {
            ret['res']['body'] = inf.body.replace(/JSON Full Form/g, 'AAAAAAAA');
        }
        // ********

        if ((inf.reqRes == 'res') && rgxMat(inf.url, 'https://rating.ewoq.google.com/u/0/rpc/rating/AssignmentAcquisitionService/GetNewTasks') || rgxMat(inf.url, 'https://rating.ewoq.google.com/u/0/rpc/rating/SafeTemplateService/GetTemplate')) {
            globalObject.inf = { 'alert': false, 'function': 'updateRange', 'res': inf.body }
        }

        // ######################################################################
    } else { console.log('OUTRO URL |', inf.url) }

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


