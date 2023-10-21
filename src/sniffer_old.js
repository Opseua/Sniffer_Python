await import('../../Chrome_Extension/src/resources/@functions.js'); import net from 'net'; console.log('SNIFFER PYTHON [JS] RODANDO', '\n');
try {
    async function run() {
        let infConfigStorage, retConfigStorage, infFile, retFile, infNotification, retNotification, retLog, sendWeb
        // ------------------------------------------------------------------------------------------------------------ ↓↓↓↓↓↓↓↓ ***** CS *****
        let csf = configStorage, cs, gLet = ''; cs = await csf([gLet]); gLet = cs.res // ##### ***** CS *****
        if (!gLet.EWOQ) { gLet['EWOQ'] = {} }; gLet.EWOQ['log'] = [];                // ← { EWOQ }
        if (!gLet.tryRating) { gLet['tryRating'] = {} }; gLet.tryRating['log'] = []; // ← { tryRating }
        cs = await csf([gLet]); // gLet = cs.res
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

                    // #### NTFY
                    if ((inf.reqRes == 'req') && regex({ 'simple': true, 'pattern': arrUrl[0], 'text': inf.url })) {
                        ret['res']['body'] = inf.body.replace(/CASA/g, 'AAAAAAAA');
                    }

                    // #### EWOQ | /home
                    if ((inf.reqRes == 'req') && regex({ 'simple': true, 'pattern': arrUrl[1], 'text': inf.url })) {
                        platforms.EWOQ.log = []; await commandLine({ 'command': `"${conf[1]}:/ARQUIVOS/WINDOWS/BAT/ESCREVER_e_ou_TECLA.vbs" "[SHIFT+F1]"` })
                        gLet.EWOQ.log = []; cs = await csf([gLet]); // gLet = cs.res
                    }

                    // #### EWOQ | /GetTemplate [REQ-1]
                    if ((inf.reqRes == 'req') && regex({ 'simple': true, 'pattern': arrUrl[2], 'text': inf.url })) {
                        const token = JSON.parse(inf.body)['1']; tokenEWOQ['lastToken'] = token; tokenEWOQ[token] = false
                    }

                    // #### EWOQ | /GetTemplate [RES-2]
                    if ((inf.reqRes == 'res') && regex({ 'simple': true, 'pattern': arrUrl[2], 'text': inf.url })) {
                        let time = dateHour().res, time1 = `MES_${time.mon}_${time.monNam}/DIA_${time.day}`
                        let hitApp = inf.body.match(/raterVisibleName\\u003d\\"(.*?)\\\"\/\\u003e\\n  \\u003cinputTemplate/); if (hitApp.length > 0) {
                            hitApp = hitApp[1].replace(/[^a-zA-Z0-9]/g, ''); tokenEWOQ[tokenEWOQ.lastToken] = hitApp
                            retLog = await log({ 'folder': 'EWOQ', 'path': `RES_GET_template_${hitApp}.txt`, 'text': inf.body }); tokenEWOQ['path'] = retLog.res
                            platforms.EWOQ.log.map(async (value, index) => {
                                if (tokenEWOQ.lastToken == value.hitApp) {
                                    hitApp = tokenEWOQ[tokenEWOQ.lastToken]; platforms.EWOQ.log[index]['hitApp'] = hitApp
                                    retLog = await log({ 'folder': 'EWOQ', 'path': `RES_GET_${hitApp}.txt`, 'text': value.body }); platforms.EWOQ.log[index]['path'] = retLog.res
                                }
                            }); infNotification = { "duration": 3, "icon": "./src/media/notification_2.png", "title": `EWOQ | NOVA TASK`, "text": hitApp }
                            retNotification = await notification(infNotification);
                        }
                    }

                    // #### EWOQ | /GetNewTasks
                    if ((inf.reqRes == 'res') && regex({ 'simple': true, 'pattern': arrUrl[3], 'text': inf.url })) {
                        let time = dateHour().res, time1 = `MES_${time.mon}_${time.monNam}/DIA_${time.day}`, time2 = `${time.hou}.${time.min}.${time.sec}.${time.mil}`
                        let body = JSON.parse(inf.body); if (body['1']) {
                            const id = body['1'][0]['1']['1'].replace(/[^a-zA-Z0-9]/g, ''); const r = regex({ 'pattern': '":"locale","(.*?)"', 'text': inf.body })
                            const addGet = { 'locale': r.res['2'].split('":"')[1].split('"')[0] }
                            platforms.EWOQ.log.push({ 'id': id, 'body': inf.body, 'hitApp': body['1'][0]['2']['1'], 'token': body['1'][0]['2']['1'], 'addGet': addGet });
                            gLet.EWOQ.log.push({
                                'date': `${time1}/${time2}`, 'id': id, 'body': inf.body, 'hitApp': body['1'][0]['2']['1'],
                                'token': body['1'][0]['2']['1'], 'addGet': addGet
                            })
                            cs = await csf([gLet]); // gLet = cs.res
                            platforms.EWOQ.log.map(async (value, index) => {
                                if (tokenEWOQ.lastToken == value.hitApp) {
                                    let hitApp = tokenEWOQ[tokenEWOQ.lastToken]; platforms.EWOQ.log[index]['hitApp'] = hitApp
                                    retLog = await log({ 'folder': 'EWOQ', 'path': `RES_GET_${hitApp}.txt`, 'text': value.body }); platforms.EWOQ.log[index]['path'] = retLog.res
                                }
                            })
                        }
                    }

                    // #### EWOQ | /RecordTaskRenderingLatency [task 100% loaded] 
                    if ((inf.reqRes == 'req') && regex({ 'simple': true, 'pattern': arrUrl[4], 'text': inf.url })) {
                        const id = JSON.parse(inf.body)['2']['1'].replace(/[^a-zA-Z0-9]/g, '')
                        await commandLine({ 'command': `"${conf[1]}:/ARQUIVOS/WINDOWS/BAT/ESCREVER_e_ou_TECLA.vbs" "[SHIFT+F1][SHIFT+F2]"` })
                        platforms.EWOQ.log.map(async (value, index) => {
                            if (id == value.id) {
                                const body = JSON.parse(value.body); let hitApp = tokenEWOQ[value.token]; if (body['1'][0]['11'] && body['1'][0]['11']['1'][0]['4']) {

                                    // sendWeb = {
                                    //     "fun": [{
                                    //         "securityPass": securityPass, "funRet": { "retUrl": false }, "funRun": {
                                    //             "name": "notification", "par": {
                                    //                 "duration": 5, "icon": "./src/media/notification_2.png",
                                    //                 "title": `EWOQ | ${body['1'][0]['10']['1'][0]['2']}`, "text": `${body['1'][0]['11']['1'][0]['4']}`
                                    //             }
                                    //         }
                                    //     }]
                                    // }; await clipboard({ 'value': `${body['1'][0]['10']['1'][0]['2']}\n\n${body['1'][0]['11']['1'][0]['4']}` })
                                    // wsSend(gO.inf.wsArr[0], JSON.stringify(sendWeb))

                                    infNotification = {
                                        "duration": 5, "icon": "./src/media/notification_2.png",
                                        "title": `EWOQ | ${body['1'][0]['10']['1'][0]['2']}`, "text": `${body['1'][0]['11']['1'][0]['4']}`
                                    }; retNotification = await notification(infNotification);


                                } else {
                                    sendWeb = {
                                        "fun": [{
                                            "securityPass": securityPass, "funRet": { "retUrl": false }, "funRun": {
                                                "name": "notification", "par": {
                                                    "duration": 3, "icon": "./src/media/notification_2.png", "title": `EWOQ | `, "text": `${body['1'][0]['10']['1'][0]['2']}`
                                                }
                                            }
                                        }]
                                    }; await clipboard({ 'value': `${body['1'][0]['10']['1'][0]['2']}` });
                                };
                            }
                        })
                    }

                    // #### EWOQ | /SubmitFeedback
                    if ((inf.reqRes == 'req') && regex({ 'simple': true, 'pattern': arrUrl[5], 'text': inf.url })) {
                        let time = dateHour().res, time1 = `MES_${time.mon}_${time.monNam}/DIA_${time.day}`, json, body = JSON.parse(inf.body)
                        if (body['6']) {
                            const id = body['6']['1'].replace(/[^a-zA-Z0-9]/g, ''); platforms.EWOQ.log.map(async (value, index) => {
                                if (id == value.id) {
                                    let tasksQtd = 0, tasksSec = 0, tasksQtdHitApp = 0, tasksSecHitApp = 0, tasksQtdHitAppLast = 0, tasksSecHitAppLast = 0, lastHour
                                    let tasksQtdMon = 0, tasksSecMon = 0, hitApp = tokenEWOQ[value.token];
                                    retLog = await log({ 'folder': 'EWOQ', 'path': `REQ_SEND_${hitApp}.txt`, 'text': inf.body })
                                    retFile = await file({ 'action': 'change', 'path': value.path, 'pathNew': value.path.replace(`DIA_${time.day}/`, `DIA_${time.day}/OK/`) })
                                    retFile = await file({ 'action': 'change', 'path': retLog.res, 'pathNew': retLog.res.replace(`DIA_${time.day}/`, `DIA_${time.day}/OK/`) })
                                    if (tokenEWOQ.path) {
                                        retFile = await file({ 'action': 'change', 'path': tokenEWOQ.path, 'pathNew': tokenEWOQ.path.replace(`DIA_${time.day}/`, `DIA_${time.day}/OK/`) })
                                        tokenEWOQ.path = false
                                    }; const dif = body['9']
                                    infConfigStorage = { 'path': `./log/EWOQ/${time1}/#_DIA_#.json`, 'functionLocal': false, 'action': 'get', 'key': 'EWOQ' }
                                    retConfigStorage = await configStorage(infConfigStorage);
                                    if (!retConfigStorage.ret) { json = { 'inf': { 'reg': { 'tasksQtd': 0, 'tasksSec': 0, }, 'taskName': {} }, 'tasks': [] } }
                                    else { json = retConfigStorage.res };
                                    const jsonInf1 = new Date(Number(time.timMil) - dif).toLocaleTimeString(undefined, { hour12: false });
                                    const jsonInf2 = new Date(Number(time.timMil)).toLocaleTimeString(undefined, { hour12: false }); const jsonInf3 = false;
                                    json.tasks.push({
                                        'taskName': hitApp, 'start': jsonInf1, 'end': jsonInf2, 'sec': Math.round(dif / 1000), 'blind': jsonInf3, 'id': value.id,
                                        'addGet': value.addGet
                                    });
                                    if (!platforms.EWOQ[hitApp]) { lastHour = platforms.EWOQ.default.lastHour } else { lastHour = platforms.EWOQ[hitApp].lastHour }
                                    json.tasks.map(async (value, index) => {
                                        tasksQtd += 1; tasksSec += value.sec; if (value.taskName == hitApp) {
                                            tasksQtdHitApp += 1; tasksSecHitApp += value.sec
                                            const timestamp = new Date(`2023-${time.mon}-${time.day}T${value.start}`).getTime();
                                            if (timestamp + lastHour * 1000 > Number(time.timMil)) { tasksQtdHitAppLast += 1; tasksSecHitAppLast += value.sec }
                                        }
                                    }); json.inf.reg = { 'tasksQtd': tasksQtd, 'tasksSec': tasksSec, 'tasksHour': secToHour(tasksSec).res }
                                    json.inf.taskName[hitApp] = { 'tasksQtd': tasksQtdHitApp, 'tasksSec': tasksSecHitApp, 'tasksHour': secToHour(tasksSecHitApp).res }
                                    infConfigStorage = { 'path': `./log/EWOQ/${time1}/#_DIA_#.json`, 'functionLocal': false, 'action': 'set', 'key': 'EWOQ', 'value': json }
                                    retConfigStorage = await configStorage(infConfigStorage);
                                    infConfigStorage = {
                                        'path': `./log/EWOQ/MES_${time.mon}_${time.monNam}/#_MES_#.json`, 'functionLocal': false, 'action': 'set',
                                        'key': `DIA_${time.day}`, 'value': json.inf.reg
                                    }
                                    retConfigStorage = await configStorage(infConfigStorage);
                                    infConfigStorage = { 'path': `./log/EWOQ/MES_${time.mon}_${time.monNam}/#_MES_#.json`, 'functionLocal': false, 'action': 'get', 'key': `*` }
                                    retConfigStorage = await configStorage(infConfigStorage);
                                    for (const nameKey in retConfigStorage.res) {
                                        tasksQtdMon += retConfigStorage.res[nameKey].tasksQtd;
                                        tasksSecMon += retConfigStorage.res[nameKey].tasksSec
                                    }

                                    // sendWeb = {
                                    //     "fun": [{
                                    //         "securityPass": securityPass, "funRet": { "retUrl": false }, "funRun": {
                                    //             "name": "notification", "par": {
                                    //                 "duration": 3, "icon": "./src/media/icon_4.png", "title": `TryRating | ${hitApp}`,
                                    //                 "text": `QTD: ${tasksQtdMon.toString().padStart(4, '0')} | TOTAL: ${secToHour(tasksSecMon).res}\nQTD: ${tasksQtd.toString().padStart(4, '0')} | TOTAL: ${secToHour(tasksSec).res} | MÉDIO: ${secToHour((tasksSecHitAppLast / tasksQtdHitAppLast).toFixed(0)).res}`
                                    //             }
                                    //         }
                                    //     }]
                                    // }; wsSend(gO.inf.wsArr[0], JSON.stringify(sendWeb));
                                    platforms.EWOQ.log.splice(index, 1);

                                    infNotification = {
                                        "duration": 3, "icon": "./src/media/icon_4.png", "title": `TryRating | ${hitApp}`,
                                        "text": `QTD: ${tasksQtdMon.toString().padStart(4, '0')} | TOTAL: ${secToHour(tasksSecMon).res}\nQTD: ${tasksQtd.toString().padStart(4, '0')} | TOTAL: ${secToHour(tasksSec).res} | MÉDIO: ${secToHour((tasksSecHitAppLast / tasksQtdHitAppLast).toFixed(0)).res}`
                                    }; retNotification = await notification(infNotification);

                                    gLet.EWOQ.log.splice(index, 1); cs = await csf([gLet]); // gLet = cs.res
                                }
                            })
                        }
                    }

                    // #### Peroptyx | /home
                    if ((inf.reqRes == 'res') && regex({ 'simple': true, 'pattern': arrUrl[6], 'text': inf.url })) {
                        platforms.tryRating.log = []; await commandLine({ 'command': `"${conf[1]}:/ARQUIVOS/WINDOWS/BAT/ESCREVER_e_ou_TECLA.vbs" "[SHIFT+F1]"` })
                        gLet.tryRating.log = []; cs = await csf([gLet]); // gLet = cs.res
                    }

                    // #### Peroptyx | /survey
                    if ((inf.reqRes == 'res') && regex({ 'simple': true, 'pattern': arrUrl[7], 'text': inf.url })) {
                        let time = dateHour().res, time1 = `MES_${time.mon}_${time.monNam}/DIA_${time.day}`, time2 = `${time.hou}.${time.min}.${time.sec}.${time.mil}`
                        let body = JSON.parse(inf.body), hitApp = body.templateTaskType.replace(/[^a-zA-Z0-9]/g, ''); const id = body.requestId
                        retLog = await log({ 'folder': 'TryRating', 'path': `reg.txt`, 'text': time.tim })
                        retLog = await log({ 'folder': 'TryRating', 'path': `RES_GET_${hitApp}.txt`, 'text': inf.body })
                        const addGet = {
                            'conceptId': body.conceptId, 'projectId': body.projectId, 'templateSchemaVersionId': body.templateSchemaVersionId,
                            'targetLocalIds': body.targetLocalIds, 'name': body.tasks[0].metadata.name, 'assetType': body.tasks[0].metadata.assetType,
                            'metadata': body.tasks[0].metadata.metadata, 'state': body.tasks[0].metadata.state, 'createdBy': body.tasks[0].metadata.createdBy,
                            'created': body.tasks[0].metadata.created, 'storageType': body.tasks[0].metadata.storageType
                        }
                        platforms.tryRating.log.push({ 'id': id, 'body': inf.body, 'path': retLog.res, 'lastTaskTimestamp': Number(time.tim), 'addGet': addGet });
                        gLet.tryRating.log.push({ 'date': `${time1}/${time2}`, 'id': id, 'body': inf.body, 'path': retLog.res, 'lastTaskTimestamp': Number(time.tim), 'addGet': addGet });
                        cs = await csf([gLet]); // gLet = cs.res
                        await commandLine({ 'command': `"${conf[1]}:/ARQUIVOS/WINDOWS/BAT/ESCREVER_e_ou_TECLA.vbs" "[SHIFT+F1][SHIFT+F2]"` })
                        if (['Search20', 'QueryImageDeservingClassification'].includes(hitApp)) {
                            sendWeb = {
                                "fun": [{ "securityPass": securityPass, "funRet": { "retUrl": false }, "funRun": { "name": `peroptyx_${hitApp}`, "par": { "logFile": retLog.res } } }]
                            }
                            wsSend(gO.inf.wsArr[0], JSON.stringify(sendWeb))
                        } else if (hasKey({ 'key': 'testQuestionInformation', 'obj': body }).res) {

                            // sendWeb = {
                            //     "fun": [{
                            //         "securityPass": securityPass, "funRet": { "retUrl": false }, "funRun": {
                            //             "name": "notification", "par": {
                            //                 "duration": 5, "icon": "./src/media/notification_2.png", "title": `TryRating | AVISO`, "text": "Outro tipo de tarefa. TEM A RESPOSTA!"
                            //             }
                            //         }
                            //     }]
                            // }

                            infNotification = {
                                "duration": 5, "icon": "./src/media/notification_2.png",
                                "title": `TryRating | AVISO`, "text": "Outro tipo de tarefa. TEM A RESPOSTA!"
                            }
                            retNotification = await notification(infNotification);

                        } else if (body.targetLocalIds.length == 1) {

                            // sendWeb = {
                            //     "fun": [{
                            //         "securityPass": securityPass, "funRet": { "retUrl": false }, "funRun": {
                            //             "name": "notification", "par": {
                            //                 "duration": 5, "icon": "./src/media/notification_3.png", "title": `TryRating | AVISO`, "text": "Outro tipo de tarefa. BLIND, NÃO TEM A RESPOSTA!"
                            //             }
                            //         }
                            //     }]
                            // }

                            infNotification = {
                                "duration": 5, "icon": "./src/media/notification_3.png",
                                "title": `TryRating | AVISO`, "text": "Outro tipo de tarefa. BLIND, NÃO TEM A RESPOSTA!"
                            }
                            retNotification = await notification(infNotification);

                        } else {

                            // sendWeb = {
                            //     "fun": [{
                            //         "securityPass": securityPass, "funRet": { "retUrl": false }, "funRun": {
                            //             "name": "notification", "par": {
                            //                 "duration": 5, "icon": "./src/media/notification_3.png", "title": `TryRating | ALERTA`, "text": "Outro tipo de tarefa."
                            //             }
                            //         }
                            //     }]
                            // }

                            infNotification = { "duration": 5, "icon": "./src/media/notification_3.png", "title": `TryRating | ALERTA`, "text": "Outro tipo de tarefa." }
                            retNotification = await notification(infNotification);

                        };

                        //wsSend(gO.inf.wsArr[0], JSON.stringify(sendWeb));

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
                                gLet.tryRating.log.splice(index, 1); cs = await csf([gLet]); // gLet = cs.res
                                retLog = await log({ 'folder': 'TryRating', 'path': `reg1.txt`, 'text': (tasksSecHitAppLast / tasksQtdHitAppLast).toFixed(0) })
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


