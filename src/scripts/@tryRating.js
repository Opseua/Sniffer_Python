// let infTryRating, retTryRating
// infTryRating = { 'e': e, 'platform': platform, 'url': `${platform}/home`, 'body': inf.body }
// retTryRating = await ewoq(infTryRating)
// console.log(retTryRating)

let e = import.meta.url, ee = e;
async function tryRating(inf) {
    let ret = { 'ret': false }; e = inf && inf.e ? inf.e : e; // gO.inf[platform].log = { 'a': '4' }; await csf([gO.inf]) // SET
    try {
        let platform = inf.platform ? inf.platform : 'Teste'; let infConfigStorage, retConfigStorage, infFile, retFile, infNotification, retNotification, retLog
        let time = dateHour().res, time1 = `MES_${time.mon}_${time.monNam}/DIA_${time.day}`, time2 = `${time.hou}.${time.min}.${time.sec}.${time.mil}`
        let other = {
            'default': { 'lastHour': 1800 }, 'QueryImageDeservingClassification': { 'lastHour': 600 }, 'audiocaptioning': { 'lastHour': 600 },
            'PhotoSearchSatisfaction': { 'lastHour': 600 },
        }

        // #### TryRating | /home
        if ((inf.url == `${platform}/home`)) {
            logConsole({ 'e': e, 'ee': ee, 'write': false, 'msg': `#### ${platform} | /home` })
            gO.inf[platform] = {}; gO.inf[platform]['log'] = []; await csf([gO.inf]);
            await commandLine({ 'command': `"${letter}:/ARQUIVOS/WINDOWS/BAT/ESCREVER_e_ou_TECLA.vbs" "[SHIFT+F7]"` })
        }

        // #### TryRating | /survey
        if ((inf.url == `${platform}/survey`)) {
            logConsole({ 'e': e, 'ee': ee, 'write': false, 'msg': `#### ${platform} | /survey` })
            if (inf.body !== 'NULL') {
                let body = JSON.parse(inf.body), hitApp = body.templateTaskType.replace(/[^a-zA-Z0-9]/g, ''); let id = body.requestId
                retLog = await log({ 'e': e, 'folder': `${platform}`, 'path': `GET_${hitApp}.txt`, 'text': inf.body })
                let addGet = {
                    'conceptId': body.conceptId, 'projectId': body.projectId, 'templateSchemaVersionId': body.templateSchemaVersionId,
                    'targetLocalIds': body.targetLocalIds, 'name': body.tasks[0].metadata.name, 'assetType': body.tasks[0].metadata.assetType,
                    'metadata': body.tasks[0].metadata.metadata, 'state': body.tasks[0].metadata.state, 'createdBy': body.tasks[0].metadata.createdBy,
                    'created': body.tasks[0].metadata.created, 'storageType': body.tasks[0].metadata.storageType
                }; gO.inf[platform].log.push({
                    'hitApp': hitApp, 'tim': Number(time.tim), 'hou': `${time.hou}:${time.min}:${time.sec}`,
                    'qtd': 1, 'id': id, 'body': inf.body, 'path': retLog.res,
                    'addGet': addGet
                });
                // await csf([gO.inf]);
                await commandLine({ 'command': `"${letter}:/ARQUIVOS/WINDOWS/BAT/ESCREVER_e_ou_TECLA.vbs" "[SHIFT+F7][SHIFT+F8]"` })
                if (['QueryImageDeservingClassification', 'Search20', 'DrivingNavigation3DMaps'].includes(hitApp)) {
                    let retTask
                    if (hitApp == 'QueryImageDeservingClassificatio') { retTask = await tryRating_QueryImageDeservingClassification({ 'body': inf.body }) }
                    else if (hitApp == 'Search20') { retTask = await tryRating_Search20({ 'body': inf.body }) }
                    else if (hitApp == 'DrivingNavigation3DMaps') { retTask = await tryRating_DrivingNavigation3DMaps({ 'body': inf.body }) }
                } else if (hasKey({ 'key': 'testQuestionInformation', 'obj': body }).res) {
                    infNotification = {
                        'duration': 5, 'icon': './src/scripts/media/notification_1.png', 'retInf': false,
                        'title': `${platform} | AVISO`, 'text': 'BLIND, TEM A RESPOSTA!'
                    }; retNotification = await notification(infNotification); await clipboard({ 'value': body.tasks[0].taskData.testQuestionInformation.answer.serializedAnswer })
                } else if (!body.tasks[0].metadata.created) {
                    infNotification = {
                        'duration': 5, 'icon': './src/scripts/media/notification_3.png', 'retInf': false,
                        'title': `${platform} | AVISO`, 'text': 'BLIND, NÃO TEM A RESPOSTA!'
                    }; retNotification = await notification(infNotification);
                }
            }
        }

        // #### TryRating | /client_log [submit]
        if ((inf.url == `${platform}/client_log`)) {
            logConsole({ 'e': e, 'ee': ee, 'write': false, 'msg': `#### ${platform} | /client_log` })
            let json, body = JSON.parse(inf.body); let tasksQtd = 0, tasksSec = 0, tasksQtdHitApp = 0, tasksSecHitApp = 0, tasksQtdHitAppLast = 0
            let tasksSecHitAppLast = 0, lastHour, tasksQtdMon = 0, tasksSecMon = 0; let hitApp = body.data.templateTaskType.replace(/[^a-zA-Z0-9]/g, '');
            let id = body.data.tasks[0].requestId; retLog = await log({ 'e': e, 'folder': `${platform}`, 'path': `SEND_${hitApp}.txt`, 'text': inf.body })
            retFile = await file({ 'e': e, 'action': 'change', 'path': retLog.res, 'pathNew': retLog.res.replace(`DIA_${time.day}/`, `DIA_${time.day}/OK/`) })
            for (let [index, value] of gO.inf[platform].log.entries()) {
                if (id == value.id) {
                    retFile = await file({ 'e': e, 'action': 'change', 'path': value.path, 'pathNew': value.path.replace(`DIA_${time.day}/`, `DIA_${time.day}/OK/`) })
                    infConfigStorage = { 'e': e, 'path': `./log/${platform}/${time1}/#_DIA_#.json`, 'functionLocal': false, 'action': 'get', 'key': `${platform}` }
                    retConfigStorage = await configStorage(infConfigStorage);
                    if (!retConfigStorage.ret) { json = { 'inf': { 'reg': { 'tasksQtd': 0, 'tasksSec': 0, }, 'taskName': {} }, 'tasks': [] } }
                    else { json = retConfigStorage.res }; let dif = Number(time.tim) - value.tim
                    // let blind = hasKey({ 'key': 'testQuestionInformation', 'obj': JSON.parse(value.body) }).res;
                    let blind = JSON.parse(value.body).tasks[0].metadata.created ? false : true
                    json.tasks.push({
                        'taskName': hitApp, 'tim': `${value.tim} | ${time.tim}`, 'hou': `${value.hou} | ${time.hou}:${time.min}:${time.sec}`,
                        'qtd': value.qtd, 'sec': dif, 'blind': blind, 'id': value.id,
                        'addGet': value.addGet
                    }); if (!other[hitApp]) { lastHour = other.default.lastHour } else { lastHour = other[hitApp].lastHour }
                    for (let [index, value] of json.tasks.entries()) {
                        tasksQtd += value.qtd; tasksSec += value.sec;
                        if (value.taskName == hitApp) {
                            tasksQtdHitApp += value.qtd; tasksSecHitApp += value.sec
                            if (Number(time.tim) < Number(value.tim.split(' | ')[0]) + lastHour) { tasksQtdHitAppLast += value.qtd; tasksSecHitAppLast += value.sec }
                        }
                    }; json.inf.reg = { 'tasksQtd': tasksQtd, 'tasksSec': tasksSec, 'tasksHour': secToHour(tasksSec).res }
                    json.inf.taskName[hitApp] = { 'tasksQtd': tasksQtdHitApp, 'tasksSec': tasksSecHitApp, 'tasksHour': secToHour(tasksSecHitApp).res }
                    infConfigStorage = { 'e': e, 'path': `./log/${platform}/${time1}/#_DIA_#.json`, 'functionLocal': false, 'action': 'set', 'key': `${platform}`, 'value': json }
                    retConfigStorage = await configStorage(infConfigStorage);
                    infConfigStorage = {
                        'e': e, 'path': `./log/${platform}/MES_${time.mon}_${time.monNam}/#_MES_#.json`, 'functionLocal': false, 'action': 'set',
                        'key': `DIA_${time.day}`, 'value': json.inf
                    }; retConfigStorage = await configStorage(infConfigStorage);
                    infConfigStorage = { 'e': e, 'path': `./log/${platform}/MES_${time.mon}_${time.monNam}/#_MES_#.json`, 'functionLocal': false, 'action': 'get', 'key': `*` }
                    retConfigStorage = await configStorage(infConfigStorage); for (let nameKey in retConfigStorage.res) {
                        tasksQtdMon += retConfigStorage.res[nameKey].reg.tasksQtd; tasksSecMon += retConfigStorage.res[nameKey].reg.tasksSec
                    }; let notText = [
                        `🟢 QTD: ${tasksQtdMon.toString().padStart(4, '0')}`,
                        `TEMPO: ${secToHour(tasksSecMon).res}`,
                        `🔵 QTD: ${tasksQtd.toString().padStart(4, '0')}`,
                        `TEMPO: ${secToHour(tasksSec).res}`,
                        `🔵 QTD: ${tasksQtdHitApp.toString().padStart(4, '0')}`,
                        `TEMPO: ${secToHour(tasksSecHitApp).res}`,
                        `MÉDIO: ${secToHour((tasksSecHitAppLast / tasksQtdHitAppLast).toFixed(0)).res.substring(3, 8)}`
                    ]; infNotification = {
                        'duration': 3, 'icon': './src/scripts/media/icon_4.png', 'title': `${platform} | ${hitApp} `, 'retInf': false,
                        'text': `${notText[0]} | ${notText[1]} \n${notText[2]} | ${notText[3]} \n${notText[4]} | ${notText[5]} | ${notText[6]}`
                    }; retNotification = await notification(infNotification); gO.inf[platform].log.splice(index, 1);  // await csf([gO.inf]);
                }
            }
        }

        ret['msg'] = `${platform}: OK`;
        ret['res'] = `resposta aqui`;
        ret['ret'] = true;

        // ### LOG FUN ###
        if (inf && inf.logFun) {
            let infFile = { 'e': e, 'action': 'write', 'functionLocal': false, 'logFun': new Error().stack, 'path': 'AUTO', }, retFile
            infFile['rewrite'] = false; infFile['text'] = { 'inf': inf, 'ret': ret }; retFile = await file(infFile);
        }
    } catch (catchErr) {
        let retRegexE = await regexE({ 'inf': inf, 'e': catchErr, 'catchGlobal': false });
        ret['msg'] = retRegexE.res
    };
    return {
        ...({ ret: ret.ret }),
        ...(ret.msg && { msg: ret.msg }),
        ...(ret.res && { res: ret.res }),
    };
}

if (eng) { // CHROME
    window['tryRating'] = tryRating;
} else { // NODEJS
    global['tryRating'] = tryRating;
}