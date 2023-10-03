await import('../../Chrome_Extension/src/resources/@functions.js'); import net from 'net'; console.log('SNIFFER PYTHON [JS] RODANDO', '\n');

try {
    async function run() {
        let infConfigStorage, retConfigStorage, infFile, retFile, retLog, sendWeb
        infConfigStorage = { 'action': 'get', 'key': 'sniffer' }; retConfigStorage = await configStorage(infConfigStorage)
        if (!retConfigStorage.ret) { return } else { retConfigStorage = retConfigStorage.res }
        const portSocket = retConfigStorage.portSocket; const bu = retConfigStorage.bufferSocket; const arrUrl = retConfigStorage.arrUrl

        infConfigStorage = { 'action': 'get', 'key': 'webSocket' }; retConfigStorage = await configStorage(infConfigStorage)
        if (!retConfigStorage.ret) { return } else { retConfigStorage = retConfigStorage.res }
        const wsHost = retConfigStorage.ws1; const portWebSocket = retConfigStorage.portWebSocket;
        const securityPass = retConfigStorage.securityPass; const device1 = retConfigStorage.device1.name;
        const device1Ret = retConfigStorage.device1.ret; const device2 = retConfigStorage.device2.name;
        const device2Ret = retConfigStorage.device2.ret;

        infConfigStorage = { 'action': 'get', 'key': 'platforms' }; retConfigStorage = await configStorage(infConfigStorage);
        if (!retConfigStorage.ret) { return } else { retConfigStorage = retConfigStorage.res }; let platforms = retConfigStorage

        infFile = { 'action': 'inf' }; retFile = await file(infFile); if (!retFile.ret) { return } else { retFile = retFile.res }
        let command = `"${conf[1]}:\\ARQUIVOS\\WINDOWS\\BAT\\RUN_PORTABLE\\1_BACKGROUND.exe"`
        command = `${command} "${conf[1]}:\\ARQUIVOS\\WINDOWS\\PORTABLE_Python\\python-3.11.1.amd64\\python.exe"`
        command = `${command} "${conf[1]}:\\ARQUIVOS\\PROJETOS\\Sniffer_Python\\src\\resources\\start.py"`
        const infCommandLine = { 'background': false, 'command': command }; const retCommandLine = await commandLine(infCommandLine); if (!retCommandLine.ret) { return }
        const { default: WebSocket } = await import('ws'); let WebS = WebSocket
        let wsRet1 = new WebS(`ws://${wsHost}:${portWebSocket}/${device1}`); wsRet1.onclose = async (event) => { console.log(`SNIFFER PYTHON: WEBSOCKET 1 INTERROMPIDO`) }
        let wsRet2 = new WebS(`ws://${wsHost}:${portWebSocket}/${device2}`); wsRet2.onclose = async (event) => { console.log(`SNIFFER PYTHON: WEBSOCKET 2 INTERROMPIDO`) }

        let hitAppEWOQ = '#1#', hitAppTryRating = '#1#'; platforms.EWOQ['log'] = []; platforms.tryRating['log'] = []
        async function reqRes(inf) {
            let ret = { 'send': true, res: {} }
            try {
                ret['res']['reqRes'] = inf.reqRes; if (!!arrUrl.find(infRegex => regex({ 'simple': true, 'pattern': infRegex, 'text': inf.url }))) {
                    // ######################################################################

                    // #### NTFY
                    if ((inf.reqRes == 'req') && regex({ 'simple': true, 'pattern': arrUrl[0], 'text': inf.url })) {
                        ret['res']['body'] = inf.body.replace(/CASA/g, 'AAAAAAAA');
                    }

                    // #### EWOQ | /home
                    if ((inf.reqRes == 'req') && regex({ 'simple': true, 'pattern': arrUrl[1], 'text': inf.url })) {
                        platforms.EWOQ.log = []; // platforms.EWOQ.tasksFile = []
                        await commandLine({ 'command': `"${conf[1]}:/ARQUIVOS/WINDOWS/BAT/ESCREVER_e_ou_TECLA.vbs" "[SHIFT+F1]"` })
                    }

                    // #### EWOQ | /GetTemplate
                    if ((inf.reqRes == 'res') && regex({ 'simple': true, 'pattern': arrUrl[2], 'text': inf.url })) {
                        let time = dateHour().res, time1 = `MES_${time.mon}_${time.monNam}/DIA_${time.day}`
                        hitAppEWOQ = inf.body.match(/raterVisibleName\\u003d\\"(.*?)\\\"\/\\u003e\\n  \\u003cinputTemplate/);
                        if (hitAppEWOQ.length > 0) { hitAppEWOQ = hitAppEWOQ[1].replace(/[^a-zA-Z0-9]/g, '') } else { hitAppEWOQ = 'NewTask' }
                        retLog = await log({ 'folder': 'EWOQ', 'path': `RES_GET_template.txt`, 'text': inf.body })

                        // platforms.EWOQ.tasksFile.map(async (value, index) => {
                        //     if (hitAppEWOQ !== '#1#' && value.path.includes('#1#')) {
                        //         retFile = await file({ 'action': 'change', 'path': value.path, 'pathNew': value.path.replace('#1#', `${hitAppEWOQ}`) })
                        //         platforms.EWOQ.tasksFile[index].path = value.path.replace('#1#', `${hitAppEWOQ}`)
                        //     }
                        // }); 

                        platforms.EWOQ.log.map(async (value, index) => {
                            if (hitAppEWOQ !== '#1#' && value.path.includes('#1#')) {
                                retFile = await file({ 'action': 'change', 'path': value.path, 'pathNew': value.path.replace('#1#', `${hitAppEWOQ}`) })
                                platforms.EWOQ.log[index].path = value.path.replace('#1#', `${hitAppEWOQ}`)
                            }
                        }); sendWeb = {
                            "fun": [{
                                "securityPass": securityPass, "funRet": { "retUrl": false }, "funRun": {
                                    "name": "notification", "par": {
                                        "duration": 3, "icon": "./src/media/notification_2.png",
                                        "title": `EWOQ | NOVA TASK`, "text": hitAppEWOQ
                                    }
                                }
                            }]
                        }; wsRet1.send(JSON.stringify(sendWeb))
                    }

                    // #### EWOQ | /GetNewTasks
                    if ((inf.reqRes == 'res') && regex({ 'simple': true, 'pattern': arrUrl[3], 'text': inf.url })) {
                        let time = dateHour().res, time1 = `MES_${time.mon}_${time.monNam}/DIA_${time.day}`, body = JSON.parse(inf.body)
                        if (body['1']) {
                            const id = body['1'][0]['1']['1'].replace(/[^a-zA-Z0-9]/g, '')
                            retLog = await log({ 'folder': 'EWOQ', 'path': `RES_GET_#1#.txt`, 'text': inf.body })
                            // platforms.EWOQ.tasksFile.push({ 'path': retLog.res, 'id': id, 'body': inf.body });
                            platforms.EWOQ.log.push({ 'path': retLog.res, 'id': id, 'body': inf.body });

                            // platforms.EWOQ.tasksFile.map(async (value, index) => {
                            //     if (hitAppEWOQ !== '#1#' && value.path.includes('#1#')) {
                            //         retFile = await file({ 'action': 'change', 'path': value.path, 'pathNew': value.path.replace('#1#', `${hitAppEWOQ}`) })
                            //         platforms.EWOQ.tasksFile[index].path = value.path.replace('#1#', `${hitAppEWOQ}`)
                            //         platforms.EWOQ.tasksFile[index]['hitApp'] = hitAppEWOQ
                            //     }
                            // })

                            platforms.EWOQ.log.map(async (value, index) => {
                                if (hitAppEWOQ !== '#1#' && value.path.includes('#1#')) {
                                    retFile = await file({ 'action': 'change', 'path': value.path, 'pathNew': value.path.replace('#1#', `${hitAppEWOQ}`) })
                                    platforms.EWOQ.log[index].path = value.path.replace('#1#', `${hitAppEWOQ}`)
                                    platforms.EWOQ.log[index]['hitApp'] = hitAppEWOQ
                                }
                            })
                        }
                    }

                    // #### EWOQ | /RecordTaskRenderingLatency [task 100% loaded] 
                    if ((inf.reqRes == 'req') && regex({ 'simple': true, 'pattern': arrUrl[4], 'text': inf.url })) {
                        const id = JSON.parse(inf.body)['2']['1'].replace(/[^a-zA-Z0-9]/g, '')
                        await commandLine({ 'command': `"${conf[1]}:/ARQUIVOS/WINDOWS/BAT/ESCREVER_e_ou_TECLA.vbs" "[SHIFT+F1][SHIFT+F2]"` })
                        //platforms.EWOQ.tasksFile.map(async (value, index) => {
                        platforms.EWOQ.log.map(async (value, index) => {
                            if (id == value.id) {
                                const body = JSON.parse(value.body)
                                if (body['1'][0]['11'] && body['1'][0]['11']['1'][0]['4']) {
                                    sendWeb = {
                                        "fun": [{
                                            "securityPass": securityPass, "funRet": { "retUrl": false }, "funRun": {
                                                "name": "notification", "par": {
                                                    "duration": 5, "icon": "./src/media/notification_2.png", "title": `EWOQ | ${body['1'][0]['10']['1'][0]['2']}`,
                                                    "text": `${body['1'][0]['11']['1'][0]['4']}`
                                                }
                                            }
                                        }]
                                    }; await clipboard({ 'value': `${body['1'][0]['10']['1'][0]['2']}\n\n${body['1'][0]['11']['1'][0]['4']}` })
                                    wsRet1.send(JSON.stringify(sendWeb))
                                } else {
                                    sendWeb = {
                                        "fun": [{
                                            "securityPass": securityPass, "funRet": { "retUrl": false }, "funRun": {
                                                "name": "notification", "par": {
                                                    "duration": 3, "icon": "./src/media/notification_2.png", "title": `EWOQ | `,
                                                    "text": `${body['1'][0]['10']['1'][0]['2']}`
                                                }
                                            }
                                        }]
                                    }; await clipboard({ 'value': `${body['1'][0]['10']['1'][0]['2']}` });// wsRet1.send(JSON.stringify(sendWeb))
                                }
                            }
                        })
                    }

                    // #### EWOQ | /SubmitFeedback
                    if ((inf.reqRes == 'req') && regex({ 'simple': true, 'pattern': arrUrl[5], 'text': inf.url })) {
                        let time = dateHour().res, time1 = `MES_${time.mon}_${time.monNam}/DIA_${time.day}`, json, body = JSON.parse(inf.body)
                        if (body['6']) {
                            const id = body['6']['1'].replace(/[^a-zA-Z0-9]/g, '')
                            // platforms.EWOQ.tasksFile.map(async (value, index) => {
                            platforms.EWOQ.log.map(async (value, index) => {
                                if (id == value.id) {
                                    let tasksQtd = 0, tasksSec = 0, tasksQtdHitApp = 0, tasksSecHitApp = 0, tasksQtdHitAppLast = 0, tasksSecHitAppLast = 0, lastHour, tasksQtdMon = 0, tasksSecMon = 0
                                    retLog = await log({ 'folder': 'EWOQ', 'path': `REQ_SEND_${hitAppEWOQ}.txt`, 'text': inf.body })
                                    retFile = await file({ 'action': 'change', 'path': value.path, 'pathNew': value.path.replace(`DIA_${time.day}/`, `DIA_${time.day}/OK/`) })
                                    retFile = await file({ 'action': 'change', 'path': retLog.res, 'pathNew': retLog.res.replace(`DIA_${time.day}/`, `DIA_${time.day}/OK/`) })
                                    const dif = body['9']

                                    infConfigStorage = { 'path': `./log/EWOQ/${time1}/#_DIA_#.json`, 'functionLocal': false, 'action': 'get', 'key': 'EWOQ' }
                                    retConfigStorage = await configStorage(infConfigStorage);
                                    if (!retConfigStorage.ret) { json = { 'inf': { 'reg': { 'tasksQtd': 0, 'tasksSec': 0, }, 'taskName': {} }, 'tasks': [] } }
                                    else { json = retConfigStorage.res };
                                    const jsonInf1 = new Date(Number(time.timMil) - dif).toLocaleTimeString(undefined, { hour12: false });
                                    const jsonInf2 = new Date(Number(time.timMil)).toLocaleTimeString(undefined, { hour12: false });
                                    const jsonInf3 = false; const add = { 'id': id }
                                    json.tasks.push({ 'taskName': hitAppEWOQ, 'start': jsonInf1, 'end': jsonInf2, 'sec': Math.round(dif / 1000), 'blind': jsonInf3, ...add });
                                    if (!platforms.EWOQ[hitAppEWOQ]) { lastHour = platforms.EWOQ.default.lastHour } else { lastHour = platforms.EWOQ[hitAppEWOQ].lastHour }
                                    json.tasks.map(async (value, index) => {
                                        tasksQtd += 1; tasksSec += value.sec; if (value.taskName == hitAppEWOQ) {
                                            tasksQtdHitApp += 1; tasksSecHitApp += value.sec
                                            const timestamp = new Date(`2023-${time.mon}-${time.day}T${value.start}`).getTime();
                                            if (timestamp + lastHour * 1000 > Number(time.timMil)) { tasksQtdHitAppLast += 1; tasksSecHitAppLast += value.sec }
                                        }
                                    }); json.inf.reg = { 'tasksQtd': tasksQtd, 'tasksSec': tasksSec }
                                    json.inf.taskName[hitAppEWOQ] = { 'tasksQtd': tasksQtdHitApp, 'tasksSec': tasksSecHitApp }
                                    infConfigStorage = { 'path': `./log/EWOQ/${time1}/#_DIA_#.json`, 'functionLocal': false, 'action': 'set', 'key': 'EWOQ', 'value': json }
                                    retConfigStorage = await configStorage(infConfigStorage);

                                    json.inf.reg['tasksHour'] = `${secToHour(tasksSec).res}`
                                    infConfigStorage = { 'path': `./log/EWOQ/MES_${time.mon}_${time.monNam}/#_MES_#.json`, 'functionLocal': false, 'action': 'set', 'key': `DIA_${time.day}`, 'value': json.inf.reg }
                                    retConfigStorage = await configStorage(infConfigStorage);

                                    infConfigStorage = { 'path': `./log/EWOQ/MES_${time.mon}_${time.monNam}/#_MES_#.json`, 'functionLocal': false, 'action': 'get', 'key': `*` }
                                    retConfigStorage = await configStorage(infConfigStorage);
                                    for (const nameKey in retConfigStorage.res) { tasksQtdMon += retConfigStorage.res[nameKey].tasksQtd; tasksSecMon += retConfigStorage.res[nameKey].tasksSec }

                                    sendWeb = {
                                        "fun": [{
                                            "securityPass": securityPass, "funRet": { "retUrl": false }, "funRun": {
                                                "name": "notification", "par": {
                                                    "duration": 3, "icon": "./src/media/icon_4.png", "title": `TryRating | ${hitAppEWOQ}`,
                                                    "text": `QTD: ${tasksQtdMon.toString().padStart(4, '0')} | TOTAL: ${secToHour(tasksSecMon).res}\nQTD: ${tasksQtd.toString().padStart(4, '0')} | TOTAL: ${secToHour(tasksSec).res} | MÉDIO: ${secToHour((tasksSecHitAppLast / tasksQtdHitAppLast).toFixed(0)).res}`
                                                }
                                            }
                                        }]
                                    }; wsRet1.send(JSON.stringify(sendWeb)); platforms.EWOQ.log.splice(index, 1); // platforms.EWOQ.tasksFile.splice(index, 1);
                                }
                            })
                        }
                    }

                    // #### Peroptyx | /home
                    if ((inf.reqRes == 'res') && regex({ 'simple': true, 'pattern': arrUrl[6], 'text': inf.url })) {
                        platforms.tryRating.log = []; // platforms.tryRating.tasksFile = []
                        await commandLine({ 'command': `"${conf[1]}:/ARQUIVOS/WINDOWS/BAT/ESCREVER_e_ou_TECLA.vbs" "[SHIFT+F1]"` })
                    }

                    // #### Peroptyx | /survey
                    if ((inf.reqRes == 'res') && regex({ 'simple': true, 'pattern': arrUrl[7], 'text': inf.url })) {
                        let time = dateHour().res, time1 = `MES_${time.mon}_${time.monNam}/DIA_${time.day}`, body = JSON.parse(inf.body)
                        hitAppTryRating = body.templateTaskType.replace(/[^a-zA-Z0-9]/g, ''); const id = body.requestId

                        retLog = await log({ 'folder': 'TryRating', 'path': `RES_GET_${hitAppTryRating}.txt`, 'text': inf.body })
                        const add = { 'id': id, 'conceptId': body.conceptId, 'projectId': body.projectId, 'templateSchemaVersionId': body.templateSchemaVersionId, 'targetLocalIds': body.targetLocalIds }
                        platforms.tryRating.log.push({ 'path': retLog.res, 'id': id, 'lastTaskTimestamp': Number(time.tim), 'body': inf.body, ...add });
                        // platforms.tryRating.tasksFile.push({ 'path': retLog.res, 'id': id, 'lastTaskTimestamp': Number(time.tim), 'body': inf.body, ...add });
                        await commandLine({ 'command': `"${conf[1]}:/ARQUIVOS/WINDOWS/BAT/ESCREVER_e_ou_TECLA.vbs" "[SHIFT+F1][SHIFT+F2]"` })

                        if (['Search20', 'QueryImageDeservingClassification'].includes(hitAppTryRating)) {
                            sendWeb = {
                                "fun": [{
                                    "securityPass": securityPass, "funRet": { "retUrl": false }, "funRun": {
                                        "name": `peroptyx_${hitAppTryRating}`, "par": { "logFile": retLog.res }
                                    }
                                }]
                            }
                        } else if (hasKey({ 'key': 'testQuestionInformation', 'obj': body }).res) {
                            sendWeb = {
                                "fun": [{
                                    "securityPass": securityPass, "funRet": { "retUrl": false }, "funRun": {
                                        "name": "notification", "par": {
                                            "duration": 5, "icon": "./src/media/notification_2.png",
                                            "title": `TryRating | AVISO`, "text": "Outro tipo de tarefa. TEM A RESPOSTA!"
                                        }
                                    }
                                }]
                            }
                        } else if (body.targetLocalIds.length == 1) {
                            sendWeb = {
                                "fun": [{
                                    "securityPass": securityPass, "funRet": { "retUrl": false }, "funRun": {
                                        "name": "notification", "par": {
                                            "duration": 5, "icon": "./src/media/notification_3.png",
                                            "title": `TryRating | AVISO`, "text": "Outro tipo de tarefa. BLIND, NÃO TEM A RESPOSTA!"
                                        }
                                    }
                                }]
                            }
                        } else {
                            sendWeb = {
                                "fun": [{
                                    "securityPass": securityPass, "funRet": { "retUrl": false }, "funRun": {
                                        "name": "notification", "par": {
                                            "duration": 5, "icon": "./src/media/notification_3.png",
                                            "title": `TryRating | ALERTA`, "text": "Outro tipo de tarefa."
                                        }
                                    }
                                }]
                            }
                        }; wsRet1.send(JSON.stringify(sendWeb));
                    }

                    // #### Peroptyx | /client_log [submit]
                    if ((inf.reqRes == 'req') && regex({ 'simple': true, 'pattern': arrUrl[8], 'text': inf.url })) {
                        let time = dateHour().res, time1 = `MES_${time.mon}_${time.monNam}/DIA_${time.day}`, json, body = JSON.parse(inf.body)
                        let tasksQtd = 0, tasksSec = 0, tasksQtdHitApp = 0, tasksSecHitApp = 0, tasksQtdHitAppLast = 0, tasksSecHitAppLast = 0, lastHour, tasksQtdMon = 0, tasksSecMon = 0
                        hitAppTryRating = body.data.templateTaskType.replace(/[^a-zA-Z0-9]/g, ''); const id = body.data.tasks[0].requestId

                        retLog = await log({ 'folder': 'TryRating', 'path': `REQ_SEND_${hitAppTryRating}.txt`, 'text': inf.body })
                        retFile = await file({ 'action': 'change', 'path': retLog.res, 'pathNew': retLog.res.replace(`DIA_${time.day}/`, `DIA_${time.day}/OK/`) })
                        // platforms.tryRating.tasksFile.map(async (value, index) => {
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
                                const add = { 'id': id, 'conceptId': value.conceptId, 'projectId': value.projectId, 'templateSchemaVersionId': value.templateSchemaVersionId, 'targetLocalIds': value.targetLocalIds }
                                json.tasks.push({ 'taskName': hitAppTryRating, 'start': jsonInf1, 'end': jsonInf2, 'sec': dif, 'blind': jsonInf3, ...add });
                                if (!platforms.tryRating[hitAppTryRating]) { lastHour = platforms.tryRating.default.lastHour } else { lastHour = platforms.tryRating[hitAppTryRating].lastHour }
                                json.tasks.map(async (value, index) => {
                                    tasksQtd += 1; tasksSec += value.sec; if (value.taskName == hitAppTryRating) {
                                        tasksQtdHitApp += 1; tasksSecHitApp += value.sec
                                        const timestamp = new Date(`2023-${time.mon}-${time.day}T${value.start}`).getTime();
                                        if (timestamp + lastHour * 1000 > Number(time.timMil)) { tasksQtdHitAppLast += 1; tasksSecHitAppLast += value.sec }
                                    }
                                }); json.inf.reg = { 'tasksQtd': tasksQtd, 'tasksSec': tasksSec }
                                json.inf.taskName[hitAppTryRating] = { 'tasksQtd': tasksQtdHitApp, 'tasksSec': tasksSecHitApp }
                                infConfigStorage = { 'path': `./log/TryRating/${time1}/#_DIA_#.json`, 'functionLocal': false, 'action': 'set', 'key': 'tryRating', 'value': json }
                                retConfigStorage = await configStorage(infConfigStorage);

                                json.inf.reg['tasksHour'] = `${secToHour(tasksSec).res}`
                                infConfigStorage = { 'path': `./log/TryRating/MES_${time.mon}_${time.monNam}/#_MES_#.json`, 'functionLocal': false, 'action': 'set', 'key': `DIA_${time.day}`, 'value': json.inf.reg }
                                retConfigStorage = await configStorage(infConfigStorage);

                                infConfigStorage = { 'path': `./log/TryRating/MES_${time.mon}_${time.monNam}/#_MES_#.json`, 'functionLocal': false, 'action': 'get', 'key': `*` }
                                retConfigStorage = await configStorage(infConfigStorage);
                                for (const nameKey in retConfigStorage.res) { tasksQtdMon += retConfigStorage.res[nameKey].tasksQtd; tasksSecMon += retConfigStorage.res[nameKey].tasksSec }

                                sendWeb = {
                                    "fun": [{
                                        "securityPass": securityPass, "funRet": { "retUrl": false }, "funRun": {
                                            "name": "notification", "par": {
                                                "duration": 3, "icon": "./src/media/icon_4.png", "title": `TryRating | ${hitAppTryRating}`,
                                                "text": `QTD: ${tasksQtdMon.toString().padStart(4, '0')} | TOTAL: ${secToHour(tasksSecMon).res}\nQTD: ${tasksQtd.toString().padStart(4, '0')} | TOTAL: ${secToHour(tasksSec).res} | MÉDIO: ${secToHour((tasksSecHitAppLast / tasksQtdHitAppLast).toFixed(0)).res}`
                                            }
                                        }
                                    }]
                                }; wsRet1.send(JSON.stringify(sendWeb)); platforms.tryRating.log.splice(index, 1); // platforms.tryRating.tasksFile.splice(index, 1);
                            }
                        })
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
                        g = Buffer.from(g.split("#fim#")[0], 'base64').toString('utf-8');
                        const d = JSON.parse(g); const r = await reqRes(d) // SOCKET: ENVIADO
                        if ((d.reqRes == 'req') && (r.res.reqRes == 'req')) {
                            const b = Buffer.from(JSON.stringify(r)).toString('base64');
                            for (let i = 0; i < b.length; i += bu) { const p = b.slice(i, i + bu); socket.write(p) }
                            socket.write('#fim#'); // ENVIAR CARACTERE DE FIM 
                        }; g = ''; // LIMPAR BUFFER
                    }
                });
            } catch (e) { (async () => { const m = await regexE({ 'e': e }); console.log(m.res) })() }
        }); sockReq.listen((portSocket), () => { });
        const sockRes = net.createServer((socket) => { // ########### RESPONSE
            try {
                let g = ''; socket.on('data', async (chunk) => {
                    g += chunk.toString(); if (g.endsWith('#fim#')) {
                        g = Buffer.from(g.split("#fim#")[0], 'base64').toString('utf-8'); // SOCKET: RECEBIDO
                        const d = JSON.parse(g); const r = await reqRes(d) // SOCKET: ENVIADO
                        if ((d.reqRes == 'res') && (r.res.reqRes == 'res')) {
                            const b = Buffer.from(JSON.stringify(r)).toString('base64');
                            for (let i = 0; i < b.length; i += bu) { const part = b.slice(i, i + bu); socket.write(part) };
                            socket.write('#fim#'); // ENVIAR CARACTERE DE FIM 
                        }; g = ''; // LIMPAR BUFFER
                    }
                });
            } catch (e) { (async () => { const m = await regexE({ 'e': e }); console.log(m.res) })() }
        }); sockRes.listen((portSocket + 1), () => { });
        // -------------------------------------------------------------------------------------------------

        async function logOld(inf) {
            const RetDH = dateHour(); const text = `🟡 ${inf.reqRes} | ${inf.url}\n${inf.value}\n\n`
            infFile = {
                'action': 'write', 'functionLocal': false, 'rewrite': true, // 'true' adiciona, 'false' limpa
                'path': `./log/EWOQ/[${RetDH.res.mon}-${RetDH.res.day}]/arquivo.txt`,
                'text': `🟢 ${RetDH.res.hou}:${RetDH.res.min}:${RetDH.res.sec}:${RetDH.res.mil} | ${text}`
            }; retFile = await file(infFile);

            if (inf.url == arrUrl[2]) {
                sendWeb = {
                    "fun": {
                        "securityPass": securityPass, "funRet": { "ret": false, "url": `ws://${wsHost}:${portWebSocket}/${device1}`, },
                        "funRun": { "name": "notification", "par": { "duration": 2, "title": `EWOQ |`, "text": inf.value, } }
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
                                    "name": "file", "par": {
                                        "action": "write", "rewrite": true,
                                        "file": `${conf[1]}:/ARQUIVOS/PROJETOS/Chrome_Extension/log/arquivo.txt`, "text": "########"
                                    }
                                }
                            }
                        },
                        "funRun": {
                            "name": "excel", "par": {
                                "action": "set", "tab": "YARE", "col": "A", "value": inf.value, "inf": JSON.stringify(inf.inf)
                            }
                        }
                    }
                }
            }; wsRet1.send(JSON.stringify(sendWeb))
        }

































    }
    await run()
}
catch (e) { const m = await regexE({ 'e': e }); console.log(m.res) }



