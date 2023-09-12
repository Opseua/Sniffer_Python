await import('../../Chrome_Extension/src/resources/@functions.js'); import net from 'net'; console.log('SNIFFER PYTHON [JS] RODANDO', '\n');

try {
    async function run() {
        let infConfigStorage, retConfigStorage

        infConfigStorage = { 'action': 'get', 'key': 'sniffer' }; retConfigStorage = await configStorage(infConfigStorage)
        if (!retConfigStorage.ret) { return } else { retConfigStorage = retConfigStorage.res }
        const portSocket = retConfigStorage.portSocket; const bufferSocket = retConfigStorage.bufferSocket;
        const arrUrl = retConfigStorage.arrUrl

        infConfigStorage = { 'action': 'get', 'key': 'webSocket' }; retConfigStorage = await configStorage(infConfigStorage)
        if (!retConfigStorage.ret) { return } else { retConfigStorage = retConfigStorage.res }
        const wsHost = retConfigStorage.ws1; const portWebSocket = retConfigStorage.portWebSocket;
        const securityPass = retConfigStorage.securityPass; const device1 = retConfigStorage.device1.name;
        const device1Ret = retConfigStorage.device1.ret; const device2 = retConfigStorage.device2.name;
        const device2Ret = retConfigStorage.device2.ret; let infFile, retFile;

        infConfigStorage = { 'action': 'get', 'key': 'platforms' }; retConfigStorage = await configStorage(infConfigStorage)
        if (!retConfigStorage.ret) { return } else { retConfigStorage = retConfigStorage.res }
        const tryRating = retConfigStorage.tryRating;

        infFile = { 'action': 'inf' }; retFile = await file(infFile); if (!retFile.ret) { return } else { retFile = retFile.res }
        let command = `"${conf[1]}:\\ARQUIVOS\\WINDOWS\\BAT\\RUN_PORTABLE\\1_BACKGROUND.exe"`
        command = `${command} "${conf[1]}:\\ARQUIVOS\\WINDOWS\\PORTABLE_Python\\python-3.11.1.amd64\\python.exe"`
        command = `${command} "${conf[1]}:\\ARQUIVOS\\PROJETOS\\Sniffer_Python\\src\\resources\\start.py"`
        const infCommandLine = { 'background': false, 'command': command }; const retCommandLine = await commandLine(infCommandLine); if (!retCommandLine.ret) { return }
        const { default: WebSocket } = await import('ws'); let WebS = WebSocket
        let wsRet1 = new WebS(`ws://${wsHost}:${portWebSocket}/${device1}`);
        wsRet1.onclose = async (event) => { console.log(`SNIFFER PYTHON: WEBSOCKET 1 INTERROMPIDO`) }
        let wsRet2 = new WebS(`ws://${wsHost}:${portWebSocket}/${device2}`);
        wsRet2.onclose = async (event) => { console.log(`SNIFFER PYTHON: WEBSOCKET 2 INTERROMPIDO`) }

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
                        const nameTask = inf.body.match(/raterVisibleName\\u003d\\"(.*?)\\\"\/\\u003e\\n  \\u003cinputTemplate/);
                        let tsk; if (nameTask) { tsk = nameTask[1]; } else { tsk = 'NAO ENCONTRADO'; }
                        const infLog = { 'reqRes': inf.reqRes, 'url': inf.url, 'value': tsk, 'inf': { 'reqRes': inf.reqRes, 'lin': 'AQUI_LIN', 'tsk': tsk } }
                        log(infLog)
                    }

                    // #### EWOQ | new task
                    if ((inf.reqRes == 'res') && regex({ 'simple': true, 'pattern': 'https://rating.ewoq.google.com/u/0/rpc/rating/AssignmentAcquisitionService/GetNewTasks', 'text': inf.url })) {
                        let infLog; const ewoq = JSON.parse(inf.body)
                        if (ewoq['1']) {
                            const id = ewoq['1'][0]['1']['1']
                            infLog = { 'reqRes': inf.reqRes, 'url': inf.url, 'value': inf.body, 'inf': { 'reqRes': inf.reqRes, 'lin': 'AQUI_LIN', 'id': id } }
                        } else { infLog = { 'reqRes': inf.reqRes, 'url': inf.url, 'value': inf.body } }; log(infLog)
                    }

                    // #### EWOQ | submit
                    if ((inf.reqRes == 'req') && regex({ 'simple': true, 'pattern': 'https://rating.ewoq.google.com/u/0/rpc/rating/SubmitFeedbackService/SubmitFeedback', 'text': inf.url })) {
                        let infLog; const ewoq = JSON.parse(inf.body)
                        if (ewoq['6']) {
                            const id = ewoq['6']['1']
                            infLog = { 'reqRes': inf.reqRes, 'url': inf.url, 'value': inf.body, 'inf': { 'reqRes': inf.reqRes, 'lin': 'AQUI_LIN', 'id': id } }
                        } else { infLog = { 'reqRes': inf.reqRes, 'url': inf.url, 'value': inf.body } }; log(infLog)
                    }

                    // #### Peroptyx | survey
                    if ((inf.reqRes == 'res') && regex({ 'simple': true, 'pattern': 'https://www.tryrating.com/api/survey', 'text': inf.url })) {
                        let nameTask; let sendWebBolean = false
                        if (regex({ 'simple': true, 'text': JSON.stringify(inf.body), 'pattern': '*Search 2.0*' })) {
                            sendWebBolean = true; nameTask = 'peroptyxSearch2_0'
                        } else if (regex({ 'simple': true, 'text': JSON.stringify(inf.body), 'pattern': '*Query Image Deserving Classification*' })) {
                            sendWebBolean = true; nameTask = 'peroptyxQIDC'
                        }

                        let infFile, time2; const time = dateHour().res; const time1 = `MES_${time.mon}_${time.monNam}/DIA_${time.day}`
                        if (sendWebBolean) { time2 = `${time.hou}.${time.min}.${time.sec}` }
                        else { time2 = `${time.hou}.${time.min}.${time.sec}_NEW_TASK` }; const jsonGet = inf.body
                        infFile = { // ############# json GET
                            'action': 'write',
                            'functionLocal': false,
                            'path': `./log/TryRating/${time1}/${time2}_RES_GET.txt`,
                            'rewrite': true, // 'true' adiciona, 'false' limpa
                            'text': `${JSON.stringify(jsonGet)}\n\n`
                        }; retFile = await file(infFile);

                        infFile = { // #############  time json GET
                            'action': 'write',
                            'functionLocal': false,
                            'path': `./log/TryRating/timeLastGet.txt`,
                            'rewrite': false, // 'true' adiciona, 'false' limpa
                            'text': time.tim
                        }; retFile = await file(infFile);

                        if (sendWebBolean) {
                            const sendWeb = {
                                "fun": {
                                    "securityPass": securityPass,
                                    "funRet": { "ret": false, },
                                    "funRun": {
                                        "name": nameTask,
                                        "par": {
                                            "server": true,
                                            "sniffer": inf.body
                                        }
                                    }
                                }
                            }; wsRet1.send(JSON.stringify(sendWeb))
                        } else {
                            const sendWeb = {
                                "fun": {
                                    "securityPass": securityPass,
                                    "funRet": { "ret": false, },
                                    "funRun": {
                                        "name": "notification",
                                        "par": {
                                            "duration": 5, "iconUrl": "./src/media/notification_3.png",
                                            "title": `ALERTA`,
                                            "message": "Outro tipo de tarefa!"
                                        }
                                    }
                                }
                            }; wsRet1.send(JSON.stringify(sendWeb))
                        }
                    }

                    // #### Peroptyx | submit
                    if ((inf.reqRes == 'req') && regex({ 'simple': true, 'pattern': 'https://www.tryrating.com/api/client_log', 'text': inf.url })) {

                        let infFile, retFile, reg; const time = dateHour().res; const time1 = `MES_${time.mon}_${time.monNam}/DIA_${time.day}`
                        const time2 = `${time.hou}.${time.min}.${time.sec}`; const jsonSend = inf.body
                        infFile = { // ############# json SEND
                            'action': 'write',
                            'functionLocal': false,
                            'path': `./log/TryRating/${time1}/${time2}_REQ_SEND.txt`,
                            'rewrite': true, // 'true' adiciona, 'false' limpa
                            'text': `${JSON.stringify(jsonSend)}\n\n`
                        }; retFile = await file(infFile);

                        infFile = { 'action': 'read', 'functionLocal': false, 'path': `./log/TryRating/timeLastGet.txt` }; retFile = await file(infFile);
                        const dif = Number(time.tim) - Number(retFile.res)


                        const hitApp = `${JSON.parse(jsonSend).data.templateTaskType.replace(/[^a-zA-Z0-9]/g, '')}`;
                        let infConfigStorage, retConfigStorage, json
                        infConfigStorage = { 'path': `./log/TryRating/${time1}/###_JSON_###.json`, 'functionLocal': false, 'action': 'get', 'key': 'tryRating' }
                        retConfigStorage = await configStorage(infConfigStorage);
                        if (!retConfigStorage.ret) { json = { 'inf': { 'reg': { 'tasksQtd': 0, 'tasksSec': 0, }, 'taskName': {} }, 'tasks': [] } }
                        else { json = retConfigStorage.res };
                        const jsonInf1 = new Date(Number(`${retFile.res}000`)).toLocaleTimeString(undefined, { hour12: false });
                        const jsonInf2 = new Date(Number(`${time.tim}000`)).toLocaleTimeString(undefined, { hour12: false });
                        json.tasks.push({ 'taskName': hitApp, 'start': jsonInf1, 'end': jsonInf2, 'sec': dif });
                        let tasksQtd = 0, tasksSec = 0, tasksQtdHitApp = 0, tasksSecHitApp = 0, tasksQtdHitAppLast = 0, tasksSecHitAppLast = 0, lastHour, tasksQtdMon = 0, tasksSecMon = 0
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
                            "fun": {
                                "securityPass": securityPass,
                                "funRet": { "ret": false, },
                                "funRun": {
                                    "name": "notification",
                                    "par": {
                                        "duration": 3, "iconUrl": "./src/media/icon_4.png",
                                        "title": `SPAM | ${hitApp}`,
                                        "message": `QTD: ${tasksQtdMon.toString().padStart(4, '0')} | TOTAL: ${secToHour(tasksSecMon).res}\nQTD: ${tasksQtd.toString().padStart(4, '0')} | TOTAL: ${secToHour(tasksSec).res} | MÉDIO: ${secToHour((tasksSecHitAppLast / tasksQtdHitAppLast).toFixed(0)).res}`
                                    }
                                }
                            }
                        }; wsRet1.send(JSON.stringify(sendWeb))


                        infFile = { 'action': 'read', 'functionLocal': false, 'path': `./log/TryRating/${time1}/###_REG_###.txt` }; retFile = await file(infFile);
                        if (!retFile.ret) { reg = 0 } else { reg = retFile.res }

                        const total = Number(reg) + dif

                        infFile = { // ############# total trabalhado
                            'action': 'write',
                            'functionLocal': false,
                            'path': `./log/TryRating/${time1}/###_REG_###.txt`,
                            'rewrite': false, // 'true' adiciona, 'false' limpa
                            'text': JSON.stringify(total)
                        }; retFile = await file(infFile);

                    }

                    // ######################################################################
                    if (!ret.send) { console.log('REQUISIAO CANCELADA') } else if ((ret.res) && (ret.res.body || ret.res.headers)) { console.log('REQUISIAO ALTERADA') }
                } else { console.log('OUTRO URL |', inf.url) }
            } catch (e) { console.log(regexE({ 'e': e }).res) }; return ret
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
            } catch (e) { console.log(regexE({ 'e': e }).res) }
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
            } catch (e) { console.log(regexE({ 'e': e }).res) }
        }); sockRes.listen((portSocket + 1), () => { });
        // -------------------------------------------------------------------------------------------------


        async function log(inf) {
            let sendWeb; const RetDH = dateHour(); const text = `🟡 ${inf.reqRes} | ${inf.url}\n${inf.value}\n\n`
            const infFile = {
                'action': 'write',
                'functionLocal': false,
                'path': `./log/Welocalize/[${RetDH.res.mon}-${RetDH.res.day}]/arquivo.txt`,
                'rewrite': true, // 'true' adiciona, 'false' limpa
                'text': `🟢 ${RetDH.res.hou}:${RetDH.res.min}:${RetDH.res.sec}:${RetDH.res.mil} | ${text}`
            }; const retFile = await file(infFile);

            if (inf.url == 'https://rating.ewoq.google.com/u/0/rpc/rating/SafeTemplateService/GetTemplate') {
                sendWeb = {
                    "fun": {
                        "securityPass": securityPass,
                        "funRet": { "ret": false, "url": `ws://${wsHost}:${portWebSocket}/${device1}`, },
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
                                "securityPass": securityPass,
                                "funRet": { "ret": false, "url": `ws://${wsHost}:${portWebSocket}/${device2Ret}` },
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
            }
            wsRet1.send(JSON.stringify(sendWeb))
        }

































    }
    await run()
}
catch (e) {
    console.log(regexE({ 'e': e }).res)
}



