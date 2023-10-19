await import('../../Chrome_Extension/src/resources/@functions.js'); import net from 'net'; console.log('SNIFFER PYTHON [JS] RODANDO', '\n');
await import('./scripts/@EWOQ.js');
await import('./scripts/@tryRating.js');
await import('./scripts/tryRating_QueryImageDeservingClassification.js');
await import('./scripts/tryRating_Search20.js');
try {
    async function run() {
        let infConfigStorage, retConfigStorage, infFile, retFile, infNotification, retNotification, retLog, sendWeb
        // ------------------------------------------------------------------------------------------------------------ ↓↓↓↓↓↓↓↓ ***** CS *****
        let csf = configStorage, cs = await csf(['']); gO.inf = cs.res // GET
        // ------------------------------------------------------------------------------------------------------------ ↑↑↑↑↑↑↑↑ ***** CS *****
        infConfigStorage = { 'action': 'get', 'key': 'sniffer' }; retConfigStorage = await configStorage(infConfigStorage)
        if (!retConfigStorage.ret) { return } else { retConfigStorage = retConfigStorage.res }; const portSocket = retConfigStorage.portSocket;
        const bu = retConfigStorage.bufferSocket; const arrUrl = retConfigStorage.arrUrl

        infConfigStorage = { 'action': 'get', 'key': 'webSocket' }; retConfigStorage = await configStorage(infConfigStorage)
        if (!retConfigStorage.ret) { return } else { retConfigStorage = retConfigStorage.res }; const securityPass = retConfigStorage.securityPass;
        let s = retConfigStorage.server['1'], url = s.url, host = s.host, port = s.port, dev = retConfigStorage.devices; let dev1 = `${url}://${host}:${port}/${dev[1].name}`;
        gO.inf = { 'wsArr': [dev1] }; await wsConnect(gO.inf.wsArr);

        infConfigStorage = { 'action': 'get', 'key': 'platforms' }; retConfigStorage = await configStorage(infConfigStorage);
        if (!retConfigStorage.ret) { return } else { retConfigStorage = retConfigStorage.res }; let platforms = retConfigStorage

        infFile = { 'action': 'inf' }; retFile = await file(infFile); if (!retFile.ret) { return } else { retFile = retFile.res }
        let command = `"${conf[1]}:\\ARQUIVOS\\WINDOWS\\BAT\\RUN_PORTABLE\\1_BACKGROUND.exe"`
        command = `${command} "${conf[1]}:\\ARQUIVOS\\WINDOWS\\PORTABLE_Python\\python-3.11.1.amd64\\python.exe"`
        command = `${command} "${conf[1]}:\\ARQUIVOS\\PROJETOS\\Sniffer_Python\\src\\resources\\start.py"`
        const infCommandLine = { 'background': false, 'command': command }; const retCommandLine = await commandLine(infCommandLine); if (!retCommandLine.ret) { return }

        let tokenEWOQ = {}; platforms.EWOQ['log'] = []; platforms.tryRating['log'] = [];
        async function reqRes(inf) {
            let ret = { 'send': true, res: {} }
            try {
                ret['res']['reqRes'] = inf.reqRes; if (!!arrUrl.find(infRegex => regex({ 'simple': true, 'pattern': infRegex, 'text': inf.url }))) {
                    // ######################################################################

                    // #### NTFY | /home
                    if ((inf.reqRes == 'req') && regex({ 'simple': true, 'pattern': arrUrl[0], 'text': inf.url })) {
                        ret['res']['body'] = inf.body.replace(/CASA/g, 'AAAAAAAA');
                    }

                    // #### EWOQ | /home
                    if ((inf.reqRes == 'res') && regex({ 'simple': true, 'pattern': arrUrl[1], 'text': inf.url })) {
                        const retEWOQ = await EWOQ({ 'url': 'EWOQ/home', 'body': inf.body })
                    }

                    // #### EWOQ | /GetTemplate_[REQ-1]
                    if ((inf.reqRes == 'req') && regex({ 'simple': true, 'pattern': arrUrl[2], 'text': inf.url })) {
                        const retEWOQ = await EWOQ({ 'url': 'EWOQ/GetTemplate_[REQ-1]', 'body': inf.body })
                    }

                    // #### EWOQ | /GetTemplate_[RES-2]
                    if ((inf.reqRes == 'res') && regex({ 'simple': true, 'pattern': arrUrl[2], 'text': inf.url })) {
                        const retEWOQ = await EWOQ({ 'url': 'EWOQ/GetTemplate_[RES-2]', 'body': inf.body })
                    }

                    // #### EWOQ | /GetNewTasks
                    if ((inf.reqRes == 'res') && regex({ 'simple': true, 'pattern': arrUrl[3], 'text': inf.url })) {
                        const retEWOQ = await EWOQ({ 'url': 'EWOQ/GetNewTasks', 'body': inf.body })
                    }

                    // #### EWOQ | /RecordTaskRenderingLatency [task 100% loaded] 
                    if ((inf.reqRes == 'req') && regex({ 'simple': true, 'pattern': arrUrl[4], 'text': inf.url })) {
                        const retEWOQ = await EWOQ({ 'url': 'EWOQ/RecordTaskRenderingLatency', 'body': inf.body })
                    }

                    // #### EWOQ | /SubmitFeedback
                    if ((inf.reqRes == 'req') && regex({ 'simple': true, 'pattern': arrUrl[5], 'text': inf.url })) {
                        const retEWOQ = await EWOQ({ 'url': 'EWOQ/SubmitFeedback', 'body': inf.body })
                    }

                    // #### Peroptyx | /home
                    if ((inf.reqRes == 'res') && regex({ 'simple': true, 'pattern': arrUrl[6], 'text': inf.url })) {
                        const retTryRating = await tryRating({ 'url': 'tryRating/home', 'body': inf.body })
                    }

                    // #### Peroptyx | /survey
                    if ((inf.reqRes == 'res') && regex({ 'simple': true, 'pattern': arrUrl[7], 'text': inf.url })) {
                        const retTryRating = await tryRating({ 'url': 'tryRating/survey', 'body': inf.body })
                    }

                    // #### Peroptyx | /client_log [submit]
                    if ((inf.reqRes == 'req') && regex({ 'simple': true, 'pattern': arrUrl[8], 'text': inf.url })) {
                        let time = dateHour().res, time1 = `MES_${time.mon}_${time.monNam}/DIA_${time.day}`, json, body = JSON.parse(inf.body)
                        let tasksQtd = 0, tasksSec = 0, tasksQtdHitApp = 0, tasksSecHitApp = 0, tasksQtdHitAppLast = 0, tasksSecHitAppLast = 0, lastHour, tasksQtdMon = 0, tasksSecMon = 0
                        let hitApp = body.data.templateTaskType.replace(/[^a-zA-Z0-9]/g, ''); const id = body.data.tasks[0].requestId
                        retLog = await log({ 'folder': 'TryRating', 'path': `REQ_SEND_${hitApp}.txt`, 'text': inf.body })
                        retFile = await file({ 'action': 'change', 'path': retLog.res, 'pathNew': retLog.res.replace(`DIA_${time.day}/`, `DIA_${time.day}/OK/`) })
                        platforms.tryRating.log.map(async (value, index) => {
                            if (id == value.id) {
                                retFile = await file({ 'action': 'change', 'path': value.path, 'pathNew': value.path.replace(`DIA_${time.day}/`, `DIA_${time.day}/OK/`) })
                                const dif = Number(time.tim) - value.lastTaskTimestamp
                                infConfigStorage = { 'path': `./log/TryRating/${time1}/#_DIA_#.json`, 'functionLocal': false, 'action': 'get', 'key': 'tryRating' }
                                retConfigStorage = await configStorage(infConfigStorage);
                                if (!retConfigStorage.ret) { json = { 'inf': { 'reg': { 'tasksQtd': 0, 'tasksSec': 0, }, 'taskName': {} }, 'tasks': [] } }
                                else { json = retConfigStorage.res };
                                const jsonInf1 = new Date(Number(`${value.lastTaskTimestamp}000`)).toLocaleTimeString(undefined, { hour12: false });
                                const jsonInf2 = new Date(Number(`${time.tim}000`)).toLocaleTimeString(undefined, { hour12: false });
                                const jsonInf3 = hasKey({ 'key': 'testQuestionInformation', 'obj': JSON.parse(value.body) }).res;
                                json.tasks.push({ 'taskName': hitApp, 'start': jsonInf1, 'end': jsonInf2, 'sec': dif, 'blind': jsonInf3, 'id': value.id, 'addGet': value.addGet });
                                if (!platforms.tryRating[hitApp]) { lastHour = platforms.tryRating.default.lastHour } else { lastHour = platforms.tryRating[hitApp].lastHour }
                                json.tasks.map(async (value, index) => {
                                    tasksQtd += 1; tasksSec += value.sec; if (value.taskName == hitApp) {
                                        tasksQtdHitApp += 1; tasksSecHitApp += value.sec
                                        const timestamp = new Date(`2023-${time.mon}-${time.day}T${value.start}`).getTime();
                                        if (timestamp + lastHour * 1000 > Number(time.timMil)) { tasksQtdHitAppLast += 1; tasksSecHitAppLast += value.sec }
                                    }
                                }); json.inf.reg = { 'tasksQtd': tasksQtd, 'tasksSec': tasksSec, 'tasksHour': secToHour(tasksSec).res }
                                json.inf.taskName[hitApp] = { 'tasksQtd': tasksQtdHitApp, 'tasksSec': tasksSecHitApp, 'tasksHour': secToHour(tasksSecHitApp).res }
                                infConfigStorage = { 'path': `./log/TryRating/${time1}/#_DIA_#.json`, 'functionLocal': false, 'action': 'set', 'key': 'tryRating', 'value': json }
                                retConfigStorage = await configStorage(infConfigStorage);
                                infConfigStorage = {
                                    'path': `./log/TryRating/MES_${time.mon}_${time.monNam}/#_MES_#.json`, 'functionLocal': false, 'action': 'set',
                                    'key': `DIA_${time.day}`, 'value': json.inf.reg
                                }
                                retConfigStorage = await configStorage(infConfigStorage);
                                infConfigStorage = { 'path': `./log/TryRating/MES_${time.mon}_${time.monNam}/#_MES_#.json`, 'functionLocal': false, 'action': 'get', 'key': `*` }
                                retConfigStorage = await configStorage(infConfigStorage);
                                for (const nameKey in retConfigStorage.res) { tasksQtdMon += retConfigStorage.res[nameKey].tasksQtd; tasksSecMon += retConfigStorage.res[nameKey].tasksSec }

                                // sendWeb = {
                                //     "fun": [{
                                //         "securityPass": securityPass, "funRet": { "retUrl": false }, "funRun": {
                                //             "name": "notification", "par": {
                                //                 "duration": 3, "icon": "./src/media/icon_4.png", "title": `TryRating | ${hitApp}`,
                                //                 "text": `QTD: ${tasksQtdMon.toString().padStart(4, '0')} | TOTAL: ${secToHour(tasksSecMon).res}\nQTD: ${tasksQtd.toString().padStart(4, '0')} | TOTAL: ${secToHour(tasksSec).res} | MÉDIO: ${secToHour((tasksSecHitAppLast / tasksQtdHitAppLast).toFixed(0)).res}`
                                //             }
                                //         }
                                //     }]
                                // };
                                // wsSend(gO.inf.wsArr[0], JSON.stringify(sendWeb)); 

                                infNotification = {
                                    "duration": 3, "icon": "./src/media/icon_4.png", "title": `TryRating | ${hitApp}`,
                                    "text": `QTD: ${tasksQtdMon.toString().padStart(4, '0')} | TOTAL: ${secToHour(tasksSecMon).res}\nQTD: ${tasksQtd.toString().padStart(4, '0')} | TOTAL: ${secToHour(tasksSec).res} | MÉDIO: ${secToHour((tasksSecHitAppLast / tasksQtdHitAppLast).toFixed(0)).res}`
                                }; retNotification = await notification(infNotification);

                                platforms.tryRating.log.splice(index, 1);
                                // gLet.tryRating.log.splice(index, 1); cs = await csf([gLet]); // gLet = cs.res
                                retLog = await log({ 'folder': 'TryRating', 'path': `reg1.txt`, 'text': (tasksSecHitAppLast / tasksQtdHitAppLast).toFixed(0) })
                            }
                        })

                        const retTryRating = await tryRating({ 'url': 'tryRating/client_log', 'body': inf.body })
                    }

                    // ######################################################################
                    if (!ret.send) { console.log('REQ/RES CANCELADA') } else if ((ret.res) && (ret.res.body || ret.res.headers)) { console.log('REQ/RES ALTERADA') }
                } else { console.log('OUTRO URL |', inf.url) }
            } catch (e) { const m = await regexE({ 'e': e }); console.log(m.res) }; return ret
        }

        // -------------------------------------------------------------------------------------------------
        const sockReq = net.createServer((socket) => {// ########### REQUEST
            try {
                let g = ''; socket.on('data', async (chunk) => {
                    g += chunk.toString(); if (g.endsWith('#fim#')) {
                        g = Buffer.from(g.split("#fim#")[0], 'base64').toString('utf-8'); const d = JSON.parse(g); const r = await reqRes(d) // SOCKET: ENVIADO
                        if ((d.reqRes == 'req') && (r.res.reqRes == 'req')) {
                            const b = Buffer.from(JSON.stringify(r)).toString('base64'); for (let i = 0; i < b.length; i += bu) { const p = b.slice(i, i + bu); socket.write(p) }
                            socket.write('#fim#'); // ENVIAR CARACTERE DE FIM 
                        }; g = ''; // LIMPAR BUFFER
                    }
                });
            } catch (e) { (async () => { const m = await regexE({ 'e': e }); console.log(m.res) })() }
        }); sockReq.listen((portSocket), () => { }); const sockRes = net.createServer((socket) => { // ########### RESPONSE
            try {
                let g = ''; socket.on('data', async (chunk) => {
                    g += chunk.toString(); if (g.endsWith('#fim#')) { // ↓ SOCKET: RECEBIDO                   SOCKET: ENVIADO  ↓
                        g = Buffer.from(g.split("#fim#")[0], 'base64').toString('utf-8'); const d = JSON.parse(g); const r = await reqRes(d)
                        if ((d.reqRes == 'res') && (r.res.reqRes == 'res')) {
                            const b = Buffer.from(JSON.stringify(r)).toString('base64'); for (let i = 0; i < b.length; i += bu) { const part = b.slice(i, i + bu); socket.write(part) };
                            socket.write('#fim#'); // ENVIAR CARACTERE DE FIM 
                        }; g = ''; // LIMPAR BUFFER
                    }
                });
            } catch (e) { (async () => { const m = await regexE({ 'e': e }); console.log(m.res) })() }
        }); sockRes.listen((portSocket + 1), () => { });
        // -------------------------------------------------------------------------------------------------
























    }
    await run()
}
catch (e) { const m = await regexE({ 'e': e }); console.log(m.res) }



