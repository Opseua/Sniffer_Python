await import('./clearConsole.js');
console.clear();
console.log('SERVER JS RODANDO', '\n');

await import('./resources/functions.js');
import net from 'net'; const portSocket = 3000;
import { exec } from 'child_process'

const sockPri = net.createServer();
sockPri.on('connection', (socket) => { socket.write(JSON.stringify(sendPri)) }); sockPri.listen(portSocket, () => { });

const retFileInf = await fileInf({ 'path': new URL(import.meta.url).pathname });
const command = `D:/ARQUIVOS/WINDOWS/PORTABLE_Python/python-3.11.1.amd64/python.exe ${retFileInf.res.pathCurrent2}/start.py`
exec(command, (err, stdout, stderr) => { if (err) { console.error(err); return; } console.log(stdout); });

const sendPri = {
    'buffer': 1024,
    'arrUrl': [
        'https://ntfy.sh/',
        'https://rating.ewoq.google.com/u/0/rpc/rating/AssignmentAcquisitionService/GetNewTasks',
        'https://rating.ewoq.google.com/u/0/rpc/rating/SafeTemplateService/GetTemplate'
    ]
};

// -#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#

const { default: WebSocket } = await import('isomorphic-ws');
let WebS = WebSocket;
const infConfigStorage = { 'path': '/src/config.json', 'action': 'get', 'key': 'websocket' }
const retConfigStorage = await configStorage(infConfigStorage)
const port = retConfigStorage.res.port;
const device1 = retConfigStorage.res.device1.name
const device1Ret = `${retConfigStorage.res.ws2}:${port}/${retConfigStorage.res.device1.ret}`
const securityPass = retConfigStorage.res.securityPass
let wsRet = new WebS(`${retConfigStorage.res.ws2}:${port}/${device1}`);
wsRet.onclose = async (event) => { console.log(`SNIFFER PYTHON: WEBSOCKET INTERROMPIDO`); }

async function reqRes(inf) {
    let ret = { 'send': true, res: {} };
    try {
        ret['res']['reqRes'] = inf.reqRes;
        if (!!sendPri.arrUrl.find(infRegex => regex({ 'simple': true, 'pattern': infRegex, 'text': inf.url }))) {
            let search
            // ######################################################################
            const sendWeb = {
                "securityPass": securityPass,
                "funRet": {
                    "ret": true,
                    "url": device1Ret,
                    "inf": "ID DO RETORNO"
                },
                "funRun": {
                    "name": "excel",
                    "par": {
                        "action": "set",
                        "tab": "CQPT",
                        "col": "A",
                        "value": `${inf.body}`
                    }
                }
            }
            wsRet.send(JSON.stringify(sendWeb))
            if ((inf.reqRes == 'req') && regex({ 'simple': true, 'pattern': 'https://ntfy.sh/', 'text': inf.url })) {
                ret['res']['body'] = inf.body.replace(/CASA/g, 'AAAAAAAA');
                //globalObject.inf = { 'alert': false, 'function': 'updateRange', 'res': ret.res.body };
                //log(`############## REQ: ##############\n${ret.res.body}\n\n`)
                // wsRet.send(JSON.stringify({ 'inf': data.funRet.inf, 'retWs': retWs }))
                // wsRet.close();
            }

            if ((inf.reqRes == 'res') && regex({ 'simple': true, 'pattern': '*18.119.140.20*', 'text': inf.url })) {
                search = 'JSON Full Form';
                if (inf.body.includes(search)) {
                    ret['res']['body'] = inf.body.replace(new RegExp(search, 'g'), 'AAAAAAAA');
                    //globalObject.inf = { 'alert': false, 'function': 'updateRange', 'res': ret.res.body };
                }
            }

            if ((inf.reqRes == 'res') && regex({ 'simple': true, 'pattern': 'https://jsonformatter.org/json-parser', 'text': inf.url })) {
                ret['res']['body'] = inf.body.replace(/JSON Full Form/g, 'AAAAAAAA');
            }

            if ((inf.reqRes == 'res') && regex({ 'simple': true, 'pattern': 'https://rating.ewoq.google.com/u/0/rpc/rating/SafeTemplateService/GetTemplate', 'text': inf.url })) {
                const nameTask = inf.body.match(/raterVisibleName\\u003d\\"(.*?)\\\"\/\\u003e\\n  \\u003cinputTemplate/);
                let tsk; if (nameTask) { tsk = nameTask[1]; } else { tsk = 'NAO ENCONTRADO'; }
                //log(` 🟡 RES | ${inf.url}\n${tsk}\n\n`)
                ws2.send(tsk)
                //globalObject.inf = { 'alert': false, 'function': 'updateRange', 'res': tsk }
            }

            if ((inf.reqRes == 'res') && regex({ 'simple': true, 'pattern': 'https://rating.ewoq.google.com/u/0/rpc/rating/AssignmentAcquisitionService/GetNewTasks', 'text': inf.url })) {
                //log(` 🟡 RES | ${inf.url}\n${inf.body}\n\n`)
                // globalObject.inf = { 'alert': false, 'function': 'updateRange', 'res': inf.body }
            }

            // ######################################################################
            if (!ret.send) { console.log('REQUISIAO CANcELADA') } else if ((ret.res) && (ret.res.body || ret.res.headers)) { console.log('REQUISIAO ALtERADA') }
        } else { console.log('OUTRO URL |', inf.url) }

    } catch (e) {
        console.log(regexE({ 'e': e }).res)
    }

    return ret
}














// -------------------------------------------------------------------------------------------------

// ################################################## REQUEST
const sockReq = net.createServer((socket) => {
    try {
        let getSockReq = '';
        socket.on('data', async (chunk) => {
            getSockReq += chunk.toString();
            if (getSockReq.endsWith('#fim#')) {
                // SOCKET: RECEBIDO
                getSockReq = Buffer.from(getSockReq.split("#fim#")[0], 'base64').toString('utf-8');
                const dataReq = JSON.parse(getSockReq); let ret = { 'send': true, res: {} };
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
    } catch (e) {
        console.log(regexE({ 'e': e }).res)
    }
});
sockReq.listen((portSocket + 1), () => { });

// ################################################## RESPONSE
const sockRes = net.createServer((socket) => {
    try {
        let getSockRes = '';
        socket.on('data', async (chunk) => {
            getSockRes += chunk.toString();
            if (getSockRes.endsWith('#fim#')) {
                // SOCKET: RECEBIDO
                getSockRes = Buffer.from(getSockRes.split("#fim#")[0], 'base64').toString('utf-8');
                const dataRes = JSON.parse(getSockRes); let ret = { 'send': true, res: {} };
                // SOCKET: ENVIADO
                const retReqRes = await reqRes(dataRes)
                console.log(2)
                if ((dataRes.reqRes == 'res') && (retReqRes.res.reqRes == 'res')) {
                    const sendB64Res = Buffer.from(JSON.stringify(retReqRes)).toString('base64');
                    for (let i = 0; i < sendB64Res.length; i += sendPri.buffer) {
                        const part = sendB64Res.slice(i, i + sendPri.buffer);
                        socket.write(part);
                    }; socket.write('#fim#');  // ENVIAR CARACTERE DE FIM 
                }; getSockRes = ''; // LIMPAR BUFFER
            }
        });
    } catch (e) {
        console.log(regexE({ 'e': e }).res)
    }
});
sockRes.listen((portSocket + 2), () => { });


// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@


async function log(inf) {
    const RetDH = dateHour()
    const infFileWrite = {
        'file': `LOG/[${RetDH.res.mon}-${RetDH.res.day}]/arquivo.txt`,
        'rewrite': true, // 'true' adiciona no MESMO arquivo, 'false' cria outro em branco
        'text': `🟢 ${RetDH.res.hou}:${RetDH.res.min}:${RetDH.res.sec}:${RetDH.res.mil} |${inf}`
    }; fileWrite(infFileWrite);
}
