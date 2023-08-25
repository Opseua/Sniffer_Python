await import('../../Chrome_Extension/src/resources/@functions.js');
import net from 'net';
console.log('SNIFFER PYTHON [JS] RODANDO', '\n');

try {
    async function run() {
        let infConfigStorage, retConfigStorage
        infConfigStorage = { 'path': '../../Chrome_Extension/src/config.json', 'action': 'get', 'key': 'sniffer' }
        retConfigStorage = await configStorage(infConfigStorage)
        if (!retConfigStorage.ret) { return }
        const portSocket = retConfigStorage.res.portSocket
        const bufferSocket = retConfigStorage.res.bufferSocket
        const arrUrl = retConfigStorage.res.arrUrl
        infConfigStorage = { 'path': '../../Chrome_Extension/src/config.json', 'action': 'get', 'key': 'webSocket' }
        retConfigStorage = await configStorage(infConfigStorage)
        if (!retConfigStorage.ret) { return }
        const wsHost = retConfigStorage.res.ws1
        const portWebSocket = retConfigStorage.res.portWebSocket;
        const securityPass = retConfigStorage.res.securityPass
        const device1 = retConfigStorage.res.device1.name
        const device1Ret = retConfigStorage.res.device1.ret
        const device2 = retConfigStorage.res.device2.name
        const device2Ret = retConfigStorage.res.device2.ret
        // const infFile = { 'action': 'read', 'file': `D:/ARQUIVOS/PROJETOS/Sniffer_Python/log/state.txt` };
        // const retFile = await file(infFile);
        // if (retFile.ret) {
        //     const infApi = {
        //         url: `http://${wsHost}:${portWebSocket}/${device2}`,
        //         method: 'POST', headers: { 'accept-language': 'application/json' },
        //         body: {
        //             "fun": {
        //                 "securityPass": securityPass, "funRet": { "ret": false, },
        //                 "funRun": { "name": "commandLine", "par": { "background": false, "command": 'taskkill /IM "nodeSniffer.exe" /F' } }
        //             }
        //         }
        //     };
        //     const retApi = await api(infApi);
        //     return
        // }
        const retFileInf = await fileInf({ 'path': new URL(import.meta.url).pathname });
        if (!retFileInf.ret) { return }
        let command = `"D:\\ARQUIVOS\\WINDOWS\\BAT\\RUN_PORTABLE\\4_BACKGROUND.exe"`
        command = `${command} "D:\\ARQUIVOS\\WINDOWS\\PORTABLE_Python\\python-3.11.1.amd64\\python.exe" "${retFileInf.res.pathCurrent1}/resources/start.py"`
        const infCommandLine = { 'background': false, 'command': command }
        const retCommandLine = await commandLine(infCommandLine)
        if (!retCommandLine.ret) { return }
        const { default: WebSocket } = await import('isomorphic-ws');
        let WebS = WebSocket;
        let wsRet = new WebS(`ws://${wsHost}:${portWebSocket}/${device1}`);
        wsRet.onclose = async (event) => { console.log(`SNIFFER PYTHON: WEBSOCKET INTERROMPIDO`); }

        async function reqRes(inf) {
            let ret = { 'send': true, res: {} };
            try {
                ret['res']['reqRes'] = inf.reqRes;
                if (!!arrUrl.find(infRegex => regex({ 'simple': true, 'pattern': infRegex, 'text': inf.url }))) {
                    let search
                    // ######################################################################

                    // #### NTFY
                    if ((inf.reqRes == 'req') && regex({ 'simple': true, 'pattern': 'https://ntfy.sh/', 'text': inf.url })) {
                        ret['res']['body'] = inf.body.replace(/CASA/g, 'AAAAAAAA');
                        //const infLog = { 'reqRes': inf.reqRes, 'url': inf.url, 'value': inf.body }
                        //log(infLog)
                    }

                    // #### EWOQ | template
                    if ((inf.reqRes == 'res') && regex({ 'simple': true, 'pattern': 'https://rating.ewoq.google.com/u/0/rpc/rating/SafeTemplateService/GetTemplate', 'text': inf.url })) {
                        const nameTask = inf.body.match(/raterVisibleName\\u003d\\"(.*?)\\\"\/\\u003e\\n  \\u003cinputTemplate/);
                        let tsk; if (nameTask) { tsk = nameTask[1]; } else { tsk = 'NAO ENCONTRADO'; }
                        const infLog = { 'reqRes': inf.reqRes, 'url': inf.url, 'value': tsk, 'inf': { 'reqRes': inf.reqRes, 'lin': 'AQUI_LIN', 'tsk': tsk } }
                        log(infLog)
                    }

                    // #### EWOQ | new task
                    if ((inf.reqRes == 'res') && regex({ 'simple': true, 'pattern': 'https://rating.ewoq.google.com/u/0/rpc/rating/AssignmentAcquisitionService/GetNewTasks', 'text': inf.url })) {
                        let infLog
                        const ewoq = JSON.parse(inf.body)
                        if (ewoq['1']) {
                            const id = ewoq['1'][0]['1']['1']
                            infLog = { 'reqRes': inf.reqRes, 'url': inf.url, 'value': inf.body, 'inf': { 'reqRes': inf.reqRes, 'lin': 'AQUI_LIN', 'id': id } }
                        } else {
                            infLog = { 'reqRes': inf.reqRes, 'url': inf.url, 'value': inf.body }
                        }
                        log(infLog)
                    }

                    // #### EWOQ | submit
                    if ((inf.reqRes == 'req') && regex({ 'simple': true, 'pattern': 'https://rating.ewoq.google.com/u/0/rpc/rating/SubmitFeedbackService/SubmitFeedback', 'text': inf.url })) {
                        let infLog
                        const ewoq = JSON.parse(inf.body)
                        if (ewoq['6']) {
                            const id = ewoq['6']['1']
                            infLog = { 'reqRes': inf.reqRes, 'url': inf.url, 'value': inf.body, 'inf': { 'reqRes': inf.reqRes, 'lin': 'AQUI_LIN', 'id': id } }
                        } else {
                            infLog = { 'reqRes': inf.reqRes, 'url': inf.url, 'value': inf.body }
                        }
                        log(infLog)
                    }

                    // #### Peroptyx | survey
                    if ((inf.reqRes == 'res') && regex({ 'simple': true, 'pattern': 'https://www.tryrating.com/api/survey', 'text': inf.url })) {
                        let nameTask
                        let sendWebBolean = false
                        if (regex({ 'simple': true, 'text': JSON.stringify(inf.body), 'pattern': '*Search 2.0*' })) {
                            // Search 2.0 
                            sendWebBolean = true
                            nameTask = 'peroptyxSearch2_0'
                        } else if (regex({ 'simple': true, 'text': JSON.stringify(inf.body), 'pattern': '*Query Image Deserving Classification*' })) {
                            // Query Image Deserving Classification
                            sendWebBolean = true
                            nameTask = 'peroptyxQIDC'
                        }
                        if (sendWebBolean) {
                            const sendWeb = {
                                "fun": {
                                    "securityPass": securityPass,
                                    "funRet": {
                                        "ret": false,
                                        "url": "aaaa",
                                        "inf": "ID DO RETORNO 1"
                                    },
                                    "funRun": {
                                        "name": nameTask,
                                        "par": {
                                            "server": true,
                                            "sniffer": inf.body
                                        }
                                    }
                                }
                            }
                            wsRet.send(JSON.stringify(sendWeb))
                        }
                    }

                    // ######################################################################
                    if (!ret.send) { console.log('REQUISIAO CANCELADA') } else if ((ret.res) && (ret.res.body || ret.res.headers)) { console.log('REQUISIAO ALTERADA') }
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
                            for (let i = 0; i < sendB64Req.length; i += bufferSocket) {
                                const part = sendB64Req.slice(i, i + bufferSocket);
                                socket.write(part);
                            }; socket.write('#fim#');  // ENVIAR CARACTERE DE FIM 
                        }; getSockReq = ''; // LIMPAR BUFFER
                    }
                });
            } catch (e) {
                console.log(regexE({ 'e': e }).res)
            }
        });
        sockReq.listen((portSocket), () => { });

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
                        if ((dataRes.reqRes == 'res') && (retReqRes.res.reqRes == 'res')) {
                            const sendB64Res = Buffer.from(JSON.stringify(retReqRes)).toString('base64');
                            for (let i = 0; i < sendB64Res.length; i += bufferSocket) {
                                const part = sendB64Res.slice(i, i + bufferSocket);
                                socket.write(part);
                            }; socket.write('#fim#');  // ENVIAR CARACTERE DE FIM 
                        }; getSockRes = ''; // LIMPAR BUFFER
                    }
                });
            } catch (e) {
                console.log(regexE({ 'e': e }).res)
            }
        });
        sockRes.listen((portSocket + 1), () => { });


        // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@


        async function log(inf) {
            let sendWeb
            const RetDH = dateHour()
            const text = `🟡 ${inf.reqRes} | ${inf.url}\n${inf.value}\n\n`
            const infFile = {
                'action': 'write',
                'file': `D:/ARQUIVOS/PROJETOS/Chrome_Extension/log/[${RetDH.res.mon}-${RetDH.res.day}]/arquivo.txt`,
                'rewrite': true, // 'true' adiciona, 'false' limpa
                'text': `🟢 ${RetDH.res.hou}:${RetDH.res.min}:${RetDH.res.sec}:${RetDH.res.mil} | ${text}`
            };
            const retFile = await file(infFile);

            if (inf.url == 'https://rating.ewoq.google.com/u/0/rpc/rating/SafeTemplateService/GetTemplate') {
                sendWeb = {
                    "fun": {
                        "securityPass": securityPass,
                        "funRet": {
                            "ret": false,
                            "url": `ws://${wsHost}:${portWebSocket}/${device1}`,
                            "inf": "ID DO RETORNO 1"
                        },
                        "funRun": {
                            "name": "notification",
                            "par": {
                                "duration": 2,
                                "type": "basic",
                                "title": `WELOCALIZE`,
                                "message": inf.value,
                                "iconUrl": null,
                                "buttons": [],
                            }
                        }
                    }
                }
            } else {
                sendWeb = {
                    "fun": {
                        "securityPass": securityPass,
                        "funRet": {
                            "ret": true,
                            "url": `ws://${wsHost}:${portWebSocket}/${device2}`,
                            "inf": "ID DO RETORNO 1",
                            "fun": {
                                "securityPass": securityPass,
                                "funRet": {
                                    "ret": false,
                                    "url": `ws://${wsHost}:${portWebSocket}/${device2Ret}`,
                                    "inf": "ID DO RETORNO 2"
                                },
                                "funRun": {
                                    "name": "file",
                                    "par": {
                                        "action": "write",
                                        "file": "D:/ARQUIVOS/PROJETOS/Chrome_Extension/log/arquivo.txt",
                                        "rewrite": true,
                                        "text": "########"
                                    }
                                }
                            }
                        },
                        "funRun": {
                            "name": "excel",
                            "par": {
                                "action": "set",
                                "tab": "YARE",
                                "col": "A",
                                "value": inf.value,
                                "inf": JSON.stringify(inf.inf)
                            }
                        }
                    }
                }
            }
            wsRet.send(JSON.stringify(sendWeb))
        }

































    }
    await run()
} catch (e) {
    console.log(regexE({ 'e': e }).res)
}



