await import('../../Chrome_Extension/src/resources/@functions.js'); import net from 'net'; console.log('SNIFFER PYTHON [JS] RODANDO', '\n');

try {
    async function run() {
        let infConfigStorage, retConfigStorage, infFile, retFile

        infConfigStorage = { 'action': 'get', 'key': 'sniffer' }; retConfigStorage = await configStorage(infConfigStorage)
        if (!retConfigStorage.ret) { return } else { retConfigStorage = retConfigStorage.res }
        const portSocket = retConfigStorage.portSocket; const bufferSocket = retConfigStorage.bufferSocket;
        const arrUrl = retConfigStorage.arrUrl

        infConfigStorage = { 'action': 'get', 'key': 'webSocket' }; retConfigStorage = await configStorage(infConfigStorage)
        if (!retConfigStorage.ret) { return } else { retConfigStorage = retConfigStorage.res }
        const wsHost = retConfigStorage.ws1; const portWebSocket = retConfigStorage.portWebSocket;
        const securityPass = retConfigStorage.securityPass; const device1 = retConfigStorage.device1.name;
        const device1Ret = retConfigStorage.device1.ret; const device2 = retConfigStorage.device2.name;
        const device2Ret = retConfigStorage.device2.ret;

        infConfigStorage = { 'action': 'get', 'key': 'platforms' }; retConfigStorage = await configStorage(infConfigStorage)
        if (!retConfigStorage.ret) { return } else { retConfigStorage = retConfigStorage.res }; const tryRating = retConfigStorage.tryRating;

        infFile = { 'action': 'inf' }; retFile = await file(infFile); if (!retFile.ret) { return } else { retFile = retFile.res }
        let command = `"${conf[1]}:\\ARQUIVOS\\WINDOWS\\BAT\\RUN_PORTABLE\\1_BACKGROUND.exe"`
        command = `${command} "${conf[1]}:\\ARQUIVOS\\WINDOWS\\PORTABLE_Python\\python-3.11.1.amd64\\python.exe"`
        command = `${command} "${conf[1]}:\\ARQUIVOS\\PROJETOS\\Sniffer_Python\\src\\resources\\start.py"`
        const infCommandLine = { 'background': false, 'command': command }; const retCommandLine = await commandLine(infCommandLine); if (!retCommandLine.ret) { return }
        const { default: WebSocket } = await import('ws'); let WebS = WebSocket
        let wsRet1 = new WebS(`ws://${wsHost}:${portWebSocket}/${device1}`); wsRet1.onclose = async (event) => { console.log(`SNIFFER PYTHON: WEBSOCKET 1 INTERROMPIDO`) }
        let wsRet2 = new WebS(`ws://${wsHost}:${portWebSocket}/${device2}`); wsRet2.onclose = async (event) => { console.log(`SNIFFER PYTHON: WEBSOCKET 2 INTERROMPIDO`) }

        async function reqRes(inf) {
            let ret = { 'send': true, res: {} };
            try {
                ret['res']['reqRes'] = inf.reqRes;
                if (!!arrUrl.find(infRegex => regex({ 'simple': true, 'pattern': infRegex, 'text': inf.url }))) {
                    let search // ######################################################################

                    // #### NTFY
                    if ((inf.reqRes == 'req') && regex({ 'simple': true, 'pattern': 'https://ntfy.sh/', 'text': inf.url })) {
                        ret['res']['body'] = inf.body.replace(/CASA/g, 'AAAAAAAA');
                    }

                    // #### EWOQ | template
                    if ((inf.reqRes == 'res') && regex({ 'simple': true, 'pattern': 'https://rating.ewoq.google.com/u/0/rpc/rating/SafeTemplateService/GetTemplate', 'text': inf.url })) {
                        const hitApp = inf.body.match(/raterVisibleName\\u003d\\"(.*?)\\\"\/\\u003e\\n  \\u003cinputTemplate/);
                        let tsk; if (hitApp) { tsk = hitApp[1]; } else { tsk = 'NAO ENCONTRADO'; }
                        const infLog = { 'reqRes': inf.reqRes, 'url': inf.url, 'value': tsk, 'inf': { 'reqRes': inf.reqRes, 'lin': 'AQUI_LIN', 'tsk': tsk } }
                        logOld(infLog)
                    }

                    // #### EWOQ | new task
                    if ((inf.reqRes == 'res') && regex({ 'simple': true, 'pattern': 'https://rating.ewoq.google.com/u/0/rpc/rating/AssignmentAcquisitionService/GetNewTasks', 'text': inf.url })) {
                        let infLog, ewoq = JSON.parse(inf.body)
                        if (ewoq['1']) {
                            const id = ewoq['1'][0]['1']['1']
                            infLog = { 'reqRes': inf.reqRes, 'url': inf.url, 'value': inf.body, 'inf': { 'reqRes': inf.reqRes, 'lin': 'AQUI_LIN', 'id': id } }
                        } else { infLog = { 'reqRes': inf.reqRes, 'url': inf.url, 'value': inf.body } }; logOld(infLog)
                    }

                    // #### EWOQ | submit
                    if ((inf.reqRes == 'req') && regex({ 'simple': true, 'pattern': 'https://rating.ewoq.google.com/u/0/rpc/rating/SubmitFeedbackService/SubmitFeedback', 'text': inf.url })) {
                        let infLog, ewoq = JSON.parse(inf.body)
                        if (ewoq['6']) {
                            const id = ewoq['6']['1']
                            infLog = { 'reqRes': inf.reqRes, 'url': inf.url, 'value': inf.body, 'inf': { 'reqRes': inf.reqRes, 'lin': 'AQUI_LIN', 'id': id } }
                        } else { infLog = { 'reqRes': inf.reqRes, 'url': inf.url, 'value': inf.body } }; logOld(infLog)
                    }

                    // #### Peroptyx | survey
                    if ((inf.reqRes == 'res') && regex({ 'simple': true, 'pattern': 'https://www.tryrating.com/api/survey', 'text': inf.url })) {
                        let time = dateHour().res, time1 = `MES_${time.mon}_${time.monNam}/DIA_${time.day}`, time2 = `${time.hou}.${time.min}.${time.sec}`, retLog, sendWeb
                        let hitApp = `${JSON.parse(inf.body).templateTaskType.replace(/[^a-zA-Z0-9]/g, '')}`;
                        if (hitApp == 'Search20') { hitApp = 'SCH20' }
                        else if (hitApp == 'QueryImageDeservingClassification') { hitApp = 'QIDC' } else { hitApp = 'NewTask' }

                        retLog = await log({ 'folder': 'TryRating', 'file': 'timeLastGet.txt', 'text': time.tim })
                        retLog = await log({ 'folder': 'TryRating', 'file': `RES_GET_${hitApp}.txt`, 'text': inf.body })

                        if (hitApp.includes('NewTask')) {
                            sendWeb = {
                                "fun": [
                                    {
                                        "securityPass": securityPass, "funRet": { "retUrl": false },
                                        "funRun": {
                                            "name": "notification",
                                            "par": {
                                                "duration": 5, "iconUrl": "./src/media/notification_3.png",
                                                "title": `ALERTA`,
                                                "message": "Outro tipo de tarefa!"
                                            }
                                        }
                                    }
                                ]
                            }
                        } else {
                            sendWeb = {
                                "fun": [
                                    {
                                        "securityPass": securityPass, "funRet": { "retUrl": false },
                                        "funRun": {
                                            "name": `peroptyx_${hitApp}`,
                                            "par": {
                                                "server": true,
                                                "logFile": retLog.res
                                            }
                                        }
                                    }
                                ]
                            }
                        }; wsRet1.send(JSON.stringify(sendWeb))
                    }

                    // #### Peroptyx | submit
                    if ((inf.reqRes == 'req') && regex({ 'simple': true, 'pattern': 'https://www.tryrating.com/api/client_log', 'text': inf.url })) {
                        let time = dateHour().res, time1 = `MES_${time.mon}_${time.monNam}/DIA_${time.day}`, time2 = `${time.hou}.${time.min}.${time.sec}`, json, retLog
                        let tasksQtd = 0, tasksSec = 0, tasksQtdHitApp = 0, tasksSecHitApp = 0, tasksQtdHitAppLast = 0, tasksSecHitAppLast = 0, lastHour, tasksQtdMon = 0, tasksSecMon = 0
                        let hitApp = `${JSON.parse(inf.body).data.templateTaskType.replace(/[^a-zA-Z0-9]/g, '')}`;
                        if (hitApp == 'Search20') { hitApp = 'SCH20' }
                        else if (hitApp == 'QueryImageDeservingClassification') { hitApp = 'QIDC' } else { hitApp = 'NewTask' }

                        retLog = await log({ 'folder': 'TryRating', 'file': `REQ_SEND_${hitApp}.txt`, 'text': inf.body })
                        infFile = { 'action': 'read', 'functionLocal': false, 'path': `./log/TryRating/timeLastGet.txt` }; retFile = await file(infFile);
                        const dif = Number(time.tim) - Number(retFile.res)


                        infConfigStorage = { 'path': `./log/TryRating/${time1}/###_JSON_###.json`, 'functionLocal': false, 'action': 'get', 'key': 'tryRating' }
                        retConfigStorage = await configStorage(infConfigStorage);
                        if (!retConfigStorage.ret) { json = { 'inf': { 'reg': { 'tasksQtd': 0, 'tasksSec': 0, }, 'taskName': {} }, 'tasks': [] } }
                        else { json = retConfigStorage.res };
                        const jsonInf1 = new Date(Number(`${retFile.res}000`)).toLocaleTimeString(undefined, { hour12: false });
                        const jsonInf2 = new Date(Number(`${time.tim}000`)).toLocaleTimeString(undefined, { hour12: false });
                        json.tasks.push({ 'taskName': hitApp, 'start': jsonInf1, 'end': jsonInf2, 'sec': dif });
                        if (!tryRating[hitApp]) { lastHour = tryRating.default.lastHour } else { lastHour = tryRating[hitApp].lastHour }
                        json.tasks.map(async (value, index) => {
                            tasksQtd += 1; tasksSec += value.sec
                            if (value.taskName == hitApp) {
                                tasksQtdHitApp += 1; tasksSecHitApp += value.sec
                                const timestamp = new Date(`2023-${time.mon}-${time.day}T${value.start}`).getTime();
                                if (timestamp + lastHour * 1000 > Number(time.timMil)) { tasksQtdHitAppLast += 1; tasksSecHitAppLast += value.sec }
                            }
                        })
                        json.inf.reg = { 'tasksQtd': tasksQtd, 'tasksSec': tasksSec }
                        json.inf.taskName[hitApp] = { 'tasksQtd': tasksQtdHitApp, 'tasksSec': tasksSecHitApp }
                        infConfigStorage = { 'path': `./log/TryRating/${time1}/###_JSON_###.json`, 'functionLocal': false, 'action': 'set', 'key': 'tryRating', 'value': json }
                        retConfigStorage = await configStorage(infConfigStorage);

                        json.inf.reg['tasksHour'] = `${secToHour(tasksSec).res}`
                        infConfigStorage = { 'path': `./log/TryRating/MES_${time.mon}_${time.monNam}/###_JSON_###.json`, 'functionLocal': false, 'action': 'set', 'key': `DIA_${time.day}`, 'value': json.inf.reg }
                        retConfigStorage = await configStorage(infConfigStorage);

                        infConfigStorage = { 'path': `./log/TryRating/MES_${time.mon}_${time.monNam}/###_JSON_###.json`, 'functionLocal': false, 'action': 'get', 'key': `*` }
                        retConfigStorage = await configStorage(infConfigStorage);
                        for (const nameKey in retConfigStorage.res) { tasksQtdMon += retConfigStorage.res[nameKey].tasksQtd; tasksSecMon += retConfigStorage.res[nameKey].tasksSec }


                        const sendWeb = {
                            "fun": [
                                {
                                    "securityPass": securityPass, "funRet": { "retUrl": false },
                                    "funRun": {
                                        "name": "notification",
                                        "par": {
                                            "duration": 3, "iconUrl": "./src/media/icon_4.png",
                                            "message": `QTD: ${tasksQtdMon.toString().padStart(4, '0')} | TOTAL: ${secToHour(tasksSecMon).res}\nQTD: ${tasksQtd.toString().padStart(4, '0')} | TOTAL: ${secToHour(tasksSec).res} | MÉDIO: ${secToHour((tasksSecHitAppLast / tasksQtdHitAppLast).toFixed(0)).res}`
                                        }
                                    }
                                }
                            ]
                        }; wsRet1.send(JSON.stringify(sendWeb))
                    }

                    // ######################################################################
                    if (!ret.send) { console.log('REQUISICAO CANCELADA') } else if ((ret.res) && (ret.res.body || ret.res.headers)) { console.log('REQUISICAO ALTERADA') }
                } else { console.log('OUTRO URL |', inf.url) }
            } catch (e) { const m = await regexE({ 'e': e }); console.log(m.res) }; return ret
        }

        // -------------------------------------------------------------------------------------------------
        const sockReq = net.createServer((socket) => {// ########### REQUEST
            try {
                let getSockReq = ''; socket.on('data', async (chunk) => {
                    getSockReq += chunk.toString();
                    if (getSockReq.endsWith('#fim#')) {
                        getSockReq = Buffer.from(getSockReq.split("#fim#")[0], 'base64').toString('utf-8');  // SOCKET: RECEBIDO
                        const dataReq = JSON.parse(getSockReq); let ret = { 'send': true, res: {} };
                        const retReqRes = await reqRes(dataReq) // SOCKET: ENVIADO
                        if ((dataReq.reqRes == 'req') && (retReqRes.res.reqRes == 'req')) {
                            const sendB64Req = Buffer.from(JSON.stringify(retReqRes)).toString('base64');
                            for (let i = 0; i < sendB64Req.length; i += bufferSocket) {
                                const part = sendB64Req.slice(i, i + bufferSocket); socket.write(part);
                            }; socket.write('#fim#'); // ENVIAR CARACTERE DE FIM 
                        }; getSockReq = ''; // LIMPAR BUFFER
                    }
                });
            } catch (e) { (async () => { const m = await regexE({ 'e': e }); console.log(m.res) })() }
        }); sockReq.listen((portSocket), () => { });
        const sockRes = net.createServer((socket) => { // ########### RESPONSE
            try {
                let getSockRes = ''; socket.on('data', async (chunk) => {
                    getSockRes += chunk.toString();
                    if (getSockRes.endsWith('#fim#')) {
                        getSockRes = Buffer.from(getSockRes.split("#fim#")[0], 'base64').toString('utf-8'); // SOCKET: RECEBIDO
                        const dataRes = JSON.parse(getSockRes); let ret = { 'send': true, res: {} };
                        const retReqRes = await reqRes(dataRes) // SOCKET: ENVIADO
                        if ((dataRes.reqRes == 'res') && (retReqRes.res.reqRes == 'res')) {
                            const sendB64Res = Buffer.from(JSON.stringify(retReqRes)).toString('base64');
                            for (let i = 0; i < sendB64Res.length; i += bufferSocket) {
                                const part = sendB64Res.slice(i, i + bufferSocket); socket.write(part);
                            }; socket.write('#fim#'); // ENVIAR CARACTERE DE FIM 
                        }; getSockRes = ''; // LIMPAR BUFFER
                    }
                });
            } catch (e) { (async () => { const m = await regexE({ 'e': e }); console.log(m.res) })() }
        }); sockRes.listen((portSocket + 1), () => { });
        // -------------------------------------------------------------------------------------------------

        async function logOld(inf) {
            let sendWeb; const RetDH = dateHour(); const text = `🟡 ${inf.reqRes} | ${inf.url}\n${inf.value}\n\n`
            infFile = {
                'action': 'write', 'functionLocal': false,
                'path': `./log/Welocalize/[${RetDH.res.mon}-${RetDH.res.day}]/arquivo.txt`,
                'rewrite': true, // 'true' adiciona, 'false' limpa
                'text': `🟢 ${RetDH.res.hou}:${RetDH.res.min}:${RetDH.res.sec}:${RetDH.res.mil} | ${text}`
            }; retFile = await file(infFile);

            if (inf.url == 'https://rating.ewoq.google.com/u/0/rpc/rating/SafeTemplateService/GetTemplate') {
                sendWeb = {
                    "fun": {
                        "securityPass": securityPass, "funRet": { "ret": false, "url": `ws://${wsHost}:${portWebSocket}/${device1}`, },
                        "funRun": {
                            "name": "notification",
                            "par": {
                                "duration": 2,
                                "title": `WELOCALIZE`,
                                "message": inf.value,
                            }
                        }
                    }
                }
            } else {
                sendWeb = {
                    "fun": {
                        "securityPass": securityPass,
                        "funRet": {
                            "ret": true, "url": `ws://${wsHost}:${portWebSocket}/${device2}`,
                            "fun": {
                                "securityPass": securityPass, "funRet": { "ret": false, "url": `ws://${wsHost}:${portWebSocket}/${device2Ret}` },
                                "funRun": {
                                    "name": "file",
                                    "par": {
                                        "action": "write",
                                        "file": `${conf[1]}:/ARQUIVOS/PROJETOS/Chrome_Extension/log/arquivo.txt`,
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
            }; wsRet1.send(JSON.stringify(sendWeb))
        }

































    }
    await run()
}
catch (e) {
    console.log(regexE({ 'e': e }).res)
}



