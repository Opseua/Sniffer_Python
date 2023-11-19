await import('./TryRating_QueryImageDeservingClassification.js'); await import('./TryRating_Search20.js'); await import('./TryRating_DrivingNavigation3DMaps.js');

async function TryRating(inf) {
    let ret = { 'ret': false }; // gO.inf[platform].log = { 'a': '4' }; await csf([gO.inf]) // SET
    try {
        let platform = inf.platform ? inf.platform : 'Teste'
        let infConfigStorage, retConfigStorage, infFile, retFile, infNotification, retNotification, retLog
        let time = dateHour().res, time1 = `MES_${time.mon}_${time.monNam}/DIA_${time.day}`, time2 = `${time.hou}.${time.min}.${time.sec}.${time.mil}`
        let other = { 'default': { 'lastHour': 1800 }, 'QueryImageDeservingClassification': { 'lastHour': 600 } }

        // #### TryRating | /home
        if ((inf.url == `${platform}/home`)) {
            console.log(`#### ${platform} | /home`)
            gO.inf[platform] = {};
            gO.inf[platform]['log'] = [];
            await csf([gO.inf]);
            await commandLine({ 'command': `"${conf[1]}:/ARQUIVOS/WINDOWS/BAT/ESCREVER_e_ou_TECLA.vbs" "[SHIFT+F1]"` })
        }

        // #### TryRating | /survey
        if ((inf.url == `${platform}/survey`)) {
            console.log(`#### ${platform} | /survey`)
            if (inf.body !== 'NULL') {
                let body = JSON.parse(inf.body), hitApp = body.templateTaskType.replace(/[^a-zA-Z0-9]/g, '');
                let id = body.requestId
                retLog = await log({ 'folder': `${platform}`, 'path': `GET_${hitApp}.txt`, 'text': inf.body })
                let addGet = {
                    'conceptId': body.conceptId, 'projectId': body.projectId, 'templateSchemaVersionId': body.templateSchemaVersionId,
                    'targetLocalIds': body.targetLocalIds, 'name': body.tasks[0].metadata.name, 'assetType': body.tasks[0].metadata.assetType,
                    'metadata': body.tasks[0].metadata.metadata, 'state': body.tasks[0].metadata.state, 'createdBy': body.tasks[0].metadata.createdBy,
                    'created': body.tasks[0].metadata.created, 'storageType': body.tasks[0].metadata.storageType
                }
                gO.inf[platform].log.push({
                    'hitApp': hitApp, 'tim': Number(time.tim), 'hou': `${time.hou}:${time.min}:${time.sec}`,
                    'qtd': 1, 'id': id, 'body': inf.body, 'path': retLog.res,
                    'addGet': addGet
                });
                await csf([gO.inf]);
                await commandLine({ 'command': `"${conf[1]}:/ARQUIVOS/WINDOWS/BAT/ESCREVER_e_ou_TECLA.vbs" "[SHIFT+F1][SHIFT+F2]"` })
                if (['QueryImageDeservingClassification', 'Search20', 'DrivingNavigation3DMaps'].includes(hitApp)) {
                    let retTask
                    if (hitApp == 'QueryImageDeservingClassificatio') {
                        retTask = await TryRating_QueryImageDeservingClassification({ 'body': inf.body })
                    } else if (hitApp == 'Search20') {
                        retTask = await TryRating_Search20({ 'body': inf.body })
                    } else if (hitApp == 'DrivingNavigation3DMaps') {
                        retTask = await TryRating_DrivingNavigation3DMaps({ 'body': inf.body })
                    }
                } else if (hasKey({ 'key': 'testQuestionInformation', 'obj': body }).res) {
                    infNotification = {
                        'duration': 5, 'icon': './src/media/notification_1.png', 'retInf': false,
                        'title': `${platform} | AVISO`, 'text': 'Outro tipo de tarefa. BLIND, TEM A RESPOSTA!'
                    };
                    retNotification = await notification(infNotification);
                    await clipboard({ 'value': body.tasks[0].taskData.testQuestionInformation.answer.serializedAnswer })
                } else if (!body.tasks[0].metadata.created) {
                    infNotification = {
                        'duration': 5, 'icon': './src/media/notification_3.png', 'retInf': false,
                        'title': `${platform} | AVISO`, 'text': 'Outro tipo de tarefa. BLIND, NÃO TEM A RESPOSTA!'
                    };
                    retNotification = await notification(infNotification);
                } else {
                    infNotification = {
                        'duration': 5, 'icon': './src/media/notification_3.png', 'retInf': false,
                        'title': `${platform} | ALERTA`, 'text': 'Outro tipo de tarefa.'
                    };
                    retNotification = await notification(infNotification);
                };
            }
        }

        // #### TryRating | /client_log [submit]
        if ((inf.url == `${platform}/client_log`)) {
            console.log(`#### ${platform} | /client_log`)
            let json, body = JSON.parse(inf.body)
            let tasksQtd = 0, tasksSec = 0, tasksQtdHitApp = 0, tasksSecHitApp = 0, tasksQtdHitAppLast = 0
            let tasksSecHitAppLast = 0, lastHour, tasksQtdMon = 0, tasksSecMon = 0
            let hitApp = body.data.templateTaskType.replace(/[^a-zA-Z0-9]/g, '');
            let id = body.data.tasks[0].requestId
            retLog = await log({ 'folder': `${platform}`, 'path': `SEND_${hitApp}.txt`, 'text': inf.body })
            retFile = await file({ 'action': 'change', 'path': retLog.res, 'pathNew': retLog.res.replace(`DIA_${time.day}/`, `DIA_${time.day}/OK/`) })
            gO.inf[platform].log.map(async (value, index) => {
                if (id == value.id) {
                    retFile = await file({ 'action': 'change', 'path': value.path, 'pathNew': value.path.replace(`DIA_${time.day}/`, `DIA_${time.day}/OK/`) })
                    infConfigStorage = { 'path': `./log/${platform}/${time1}/#_DIA_#.json`, 'functionLocal': false, 'action': 'get', 'key': `${platform}` }
                    retConfigStorage = await configStorage(infConfigStorage);
                    if (!retConfigStorage.ret) { json = { 'inf': { 'reg': { 'tasksQtd': 0, 'tasksSec': 0, }, 'taskName': {} }, 'tasks': [] } }
                    else { json = retConfigStorage.res };
                    let dif = Number(time.tim) - value.tim
                    // let blind = hasKey({ 'key': 'testQuestionInformation', 'obj': JSON.parse(value.body) }).res;
                    let blind = JSON.parse(value.body).tasks[0].metadata.created ? false : true
                    json.tasks.push({
                        'taskName': hitApp, 'tim': `${value.tim} | ${time.tim}`, 'hou': `${value.hou} | ${time.hou}:${time.min}:${time.sec}`,
                        'qtd': value.qtd, 'sec': dif, 'blind': blind, 'id': value.id,
                        'addGet': value.addGet
                    });
                    if (!other[hitApp]) { lastHour = other.default.lastHour } else { lastHour = other[hitApp].lastHour }
                    json.tasks.map(async (value, index) => {
                        tasksQtd += value.qtd; tasksSec += value.sec;
                        if (value.taskName == hitApp) {
                            tasksQtdHitApp += value.qtd; tasksSecHitApp += value.sec
                            if (Number(time.tim) < Number(value.tim.split(' | ')[0]) + lastHour) {
                                tasksQtdHitAppLast = value.qtd; tasksSecHitAppLast += value.sec
                            }
                        }
                    });
                    json.inf.reg = { 'tasksQtd': tasksQtd, 'tasksSec': tasksSec, 'tasksHour': secToHour(tasksSec).res }
                    json.inf.taskName[hitApp] = { 'tasksQtd': tasksQtdHitApp, 'tasksSec': tasksSecHitApp, 'tasksHour': secToHour(tasksSecHitApp).res }
                    infConfigStorage = { 'path': `./log/${platform}/${time1}/#_DIA_#.json`, 'functionLocal': false, 'action': 'set', 'key': `${platform}`, 'value': json }
                    retConfigStorage = await configStorage(infConfigStorage);
                    infConfigStorage = {
                        'path': `./log/${platform}/MES_${time.mon}_${time.monNam}/#_MES_#.json`, 'functionLocal': false, 'action': 'set',
                        'key': `DIA_${time.day}`, 'value': json.inf
                    }
                    retConfigStorage = await configStorage(infConfigStorage);
                    infConfigStorage = { 'path': `./log/${platform}/MES_${time.mon}_${time.monNam}/#_MES_#.json`, 'functionLocal': false, 'action': 'get', 'key': `*` }
                    retConfigStorage = await configStorage(infConfigStorage);
                    for (let nameKey in retConfigStorage.res) {
                        tasksQtdMon += retConfigStorage.res[nameKey].reg.tasksQtd; tasksSecMon += retConfigStorage.res[nameKey].reg.tasksSec
                    }
                    infNotification = {
                        'duration': 3, 'icon': './src/media/icon_4.png', 'title': `${platform} | ${hitApp}`, 'retInf': false,
                        'text': `🟢 QTD: ${tasksQtdMon.toString().padStart(4, '0')} | TEMPO: ${secToHour(tasksSecMon).res}\n🔵 QTD: ${tasksQtd.toString().padStart(3, '0')} | TEMPO: ${secToHour(tasksSec).res}\n🔵 QTD: ${tasksQtdHitApp.toString().padStart(3, '0')} | TEMPO: ${secToHour(tasksSecHitApp).res} | MÉDIO: ${secToHour((tasksSecHitAppLast / tasksQtdHitAppLast).toFixed(0)).res.substring(3, 8)}`
                    };
                    retNotification = await notification(infNotification);
                    gO.inf[platform].log.splice(index, 1);
                    await csf([gO.inf]);
                }
            })
        }
        ret['msg'] = `${platform}: OK`;
        ret['res'] = `resposta aqui`;
        ret['ret'] = true;
    } catch (e) {
        let m = await regexE({ 'e': e });
        ret['msg'] = m.res
    };
    return ret
}

if (typeof window !== 'undefined') { // CHROME
    window['TryRating'] = TryRating;
} else { // NODEJS
    global['TryRating'] = TryRating;
}