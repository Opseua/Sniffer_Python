// let infTryRating, retTryRating
// infTryRating = { 'e': e, 'platform': platform, 'url': `${platform}/home`, 'body': inf.body }
// retTryRating = await ewoq(infTryRating); console.log(retTryRating)

// ### Search20 (Task com julgamentos únicos [TASK ID: igual])
// tasks[0].taskData.resultSet.resultList[1].value.name
// tasks[0].taskData.resultSet.resultList[2].value.name
// tasks[0].taskData.resultSet.resultList[1].value.name

// ### SearchAdsRelevance (Task com julgamentos separados [TASK ID: diferente])
// tasks[0].taskData.query
// tasks[1].taskData.query
// tasks[2].taskData.query

let e = import.meta.url, ee = e;
async function tryRating(inf) {
    let ret = { 'ret': false }; e = inf && inf.e ? inf.e : e; // gO.inf[platform].log = { 'a': '4' }; await csf([gO.inf]) // SET
    try {
        let platform = inf.platform ? inf.platform : 'Teste'; let infConfigStorage, retConfigStorage, infFile, retFile, infNotification, retNotification, retLog
        let time = dateHour().res, time1 = `MES_${time.mon}_${time.monNam}/DIA_${time.day}`, time2 = `${time.hou}.${time.min}.${time.sec}.${time.mil}`
        let other = { 'default': { 'lastHour': 1800 }, 'QueryImageDeservingClassification': { 'lastHour': 600 }, 'audiocaptioning': { 'lastHour': 600 }, 'PhotoSearchSatisfaction': { 'lastHour': 600 }, }

        // #### TryRating | /home
        if ((inf.url == `${platform}/home`)) {
            logConsole({ 'e': e, 'ee': ee, 'write': false, 'msg': `#### ${platform} | /home` })
            gO.inf[platform] = {}; gO.inf[platform]['log'] = []; await commandLine({ 'command': `"${letter}:/ARQUIVOS/WINDOWS/BAT/ESCREVER_e_ou_TECLA.vbs" "[SHIFT+F7]"` }) // await csf([gO.inf]);
        }

        // #### TryRating | /survey
        if ((inf.url == `${platform}/survey`)) {
            logConsole({ 'e': e, 'ee': ee, 'write': false, 'msg': `#### ${platform} | /survey` })
            if (inf.body !== 'NULL') {
                let body = JSON.parse(inf.body), hitApp = body.templateTaskType.replace(/[^a-zA-Z0-9]/g, ''); let judgeId = body.requestId
                retLog = await log({ 'e': e, 'folder': `${platform}`, 'path': `GET_${hitApp}.txt`, 'text': inf.body })
                // CAPTURAR TODAS AS TASKS DO JULGAMENTO
                let tasksBlind = 0, tasksQtd = 0, tasksType = 'NAO_DEFINIDO', tasksInf = []; for (let [index, value] of body.tasks.entries()) {
                    let blind = !(value?.metadata?.created) ? true : false; let resultList = value?.taskData?.resultSet?.resultList ? value.taskData.resultSet.resultList.length : 0; tasksQtd += resultList > 0 ? resultList : 1
                    tasksType = resultList > 0 ? 'resultList' : 'tasks'; tasksBlind += blind ? 1 : 0; tasksInf.push({
                        'blind': blind, 'name': value.metadata.name, 'assetType': value.metadata.assetType, 'metadata': value.metadata.metadata, 'state': value.metadata.state,
                        'createdBy': value.metadata.createdBy, 'created': value.metadata.created, 'storageType': value.metadata.storageType,
                    })
                }; let addGet = { 'conceptId': body.conceptId, 'projectId': body.projectId, 'templateSchemaVersionId': body.templateSchemaVersionId, 'targetLocalIds': JSON.stringify(body.targetLocalIds), 'tasksInf': tasksInf, };
                gO.inf[platform].log.push({
                    'hitApp': hitApp, 'tim': Number(time.tim), 'hou': `${time.hou}:${time.min}:${time.sec}`, 'tasksQtd': tasksQtd, 'tasksBlind': tasksBlind, 'judgeId': judgeId, 'judgesQtd': 1, 'tasksType': tasksType,
                    'addGet': addGet, 'body': inf.body, 'path': retLog.res,
                }); await commandLine({ 'command': `"${letter}:/ARQUIVOS/WINDOWS/BAT/ESCREVER_e_ou_TECLA.vbs" "[SHIFT+F7][SHIFT+F8]"` });// await csf([gO.inf]);
                if (inf.body.includes(`{"serializedAnswer":{"`)) {
                    // BLIND, TEM A RESPOSTA [HIT APP OU GENÉRICA]
                    let retHitAppGetResponse, notClip = {}; infNotification = {
                        'duration': 4, 'icon': './src/scripts/media/notification_1.png', 'retInf': false, 'title': `${platform} | BLIND`,
                        'text': 'Tem a resposta!'
                    }; retNotification = await notification(infNotification);
                    if (hitApp == 'AAA') {/* retHitAppGetResponse = await tryRating_Search20({ 'body': inf.body }); */ }
                    else { retHitAppGetResponse = await tryRatingGetResponse({ 'e': e, 'body': inf.body }); }
                    notClip['ret'] = retHitAppGetResponse.ret; notClip['res'] = notClip.ret ? retHitAppGetResponse.res : retHitAppGetResponse.msg; await clipboard({ 'e': e, 'value': notClip.res }); infNotification = {
                        'duration': notClip ? 3 : 4, 'icon': `./src/scripts/media/notification_${notClip.ret ? 2 : 3}.png`, 'retInf': false, 'title': `${platform} | ${notClip.ret ? 'CONCLUÍDO' : 'ERRO'}`,
                        'text': notClip.res
                    }; retNotification = await notification(infNotification);
                } else if (!body.tasks[0].metadata.created) {
                    // BLIND, NÃO TEM A RESPOSTA
                    infNotification = {
                        'duration': 4, 'icon': './src/scripts/media/notification_3.png', 'retInf': false, 'title': `${platform} | BLIND`,
                        'text': 'Não tem a resposta!'
                    }; retNotification = await notification(infNotification);
                } else {
                    // NNÃO É BLIND
                    infNotification = {
                        'duration': 2, 'icon': './src/scripts/media/notification_2.png', 'retInf': false, 'title': `${platform} | NÃO É BLIND`,
                        'text': 'Avaliar manualmente'
                    }; retNotification = await notification(infNotification);
                }
            }
        }

        // #### TryRating | /client_log [submit]
        if ((inf.url == `${platform}/client_log`)) {
            logConsole({ 'e': e, 'ee': ee, 'write': false, 'msg': `#### ${platform} | /client_log` })
            let json, body = JSON.parse(inf.body); let tasksQtd = 0, judgesQtd = 0, judgesSec = 0, tasksBlinds = 0;
            let tasksQtdHitApp = 0, judgesQtdHitApp = 0, judgesSecHitApp = 0, tasksBlindsHitApp = 0; let judgesQtdHitAppLast = 0; let judgesSecHitAppLast = 0, lastHour, judgesQtdMon = 0, judgesSecMon = 0;
            let hitApp = body.data.templateTaskType.replace(/[^a-zA-Z0-9]/g, ''); let judgeId = body.data.tasks[0].requestId; retLog = await log({ 'e': e, 'folder': `${platform}`, 'path': `SEND_${hitApp}.txt`, 'text': inf.body })
            retFile = await file({ 'e': e, 'action': 'change', 'path': retLog.res, 'pathNew': retLog.res.replace(`DIA_${time.day}/`, `DIA_${time.day}/OK/`) })
            for (let [index, value] of gO.inf[platform].log.entries()) {
                if (judgeId == value.judgeId) {
                    retFile = await file({ 'e': e, 'action': 'change', 'path': value.path, 'pathNew': value.path.replace(`DIA_${time.day}/`, `DIA_${time.day}/OK/`) })
                    infConfigStorage = { 'e': e, 'path': `./log/${platform}/${time1}/#_DIA_#.json`, 'functionLocal': false, 'action': 'get', 'key': `${platform}` }; retConfigStorage = await configStorage(infConfigStorage);
                    if (!retConfigStorage.ret) { json = { 'inf': { 'reg': { 'tasksQtd': 0, 'tasksBlinds': 0, 'judgesQtd': 0, 'judgesSec': 0, }, 'hitApp': {} }, 'judges': [] } } else { json = retConfigStorage.res };
                    let dif = Number(time.tim) - value.tim; json.judges.push({
                        'hitApp': hitApp, 'tim': `${value.tim} | ${time.tim}`, 'hou': `${value.hou} | ${time.hou}:${time.min}:${time.sec}`, 'tasksQtd': value.tasksQtd, 'tasksBlind': value.tasksBlind,
                        'judgesSec': dif, 'judgesHour': dateHour(dif).res, 'judgeId': value.judgeId, 'judgesQtd': value.judgesQtd, 'tasksType': value.tasksType, 'addGet': value.addGet,
                    }); if (!other[hitApp]) { lastHour = other.default.lastHour } else { lastHour = other[hitApp].lastHour }
                    for (let [index, value] of json.judges.entries()) {
                        tasksQtd += value.tasksQtd; judgesQtd += value.judgesQtd; judgesSec += value.judgesSec; tasksBlinds += value.tasksBlind; if (value.hitApp == hitApp) {
                            tasksQtdHitApp += value.tasksQtd; judgesQtdHitApp += value.judgesQtd; judgesSecHitApp += value.judgesSec; tasksBlindsHitApp += value.tasksBlind;
                            if (Number(time.tim) < Number(value.tim.split(' | ')[0]) + lastHour) { judgesQtdHitAppLast += value.judgesQtd; judgesSecHitAppLast += value.judgesSec }
                        }
                    }; json.inf.reg = { 'tasksQtd': tasksQtd, 'tasksBlinds': tasksBlinds, 'judgesQtd': judgesQtd, 'judgesSec': judgesSec, 'judgesHour': dateHour(judgesSec).res, }
                    json.inf.hitApp[hitApp] = { 'tasksQtd': tasksQtdHitApp, 'tasksBlinds': tasksBlindsHitApp, 'judgesQtd': judgesQtdHitApp, 'judgesSec': judgesSecHitApp, 'tasksHour': dateHour(judgesSecHitApp).res, }
                    infConfigStorage = { 'e': e, 'path': `./log/${platform}/${time1}/#_DIA_#.json`, 'functionLocal': false, 'action': 'set', 'key': `${platform}`, 'value': json }
                    retConfigStorage = await configStorage(infConfigStorage);
                    infConfigStorage = {
                        'e': e, 'path': `./log/${platform}/MES_${time.mon}_${time.monNam}/#_MES_#.json`, 'functionLocal': false, 'action': 'set',
                        'key': `DIA_${time.day}`, 'value': json.inf
                    }; retConfigStorage = await configStorage(infConfigStorage);
                    infConfigStorage = { 'e': e, 'path': `./log/${platform}/MES_${time.mon}_${time.monNam}/#_MES_#.json`, 'functionLocal': false, 'action': 'get', 'key': `*` }
                    retConfigStorage = await configStorage(infConfigStorage); for (let nameKey in retConfigStorage.res) {
                        judgesQtdMon += retConfigStorage.res[nameKey].reg.judgesQtd; judgesSecMon += retConfigStorage.res[nameKey].reg.judgesSec
                    }; let notText = [
                        `🟢 QTD: ${judgesQtdMon.toString().padStart(4, '0')}`,
                        `TEMPO: ${dateHour(judgesSecMon).res}`,
                        `🔵 QTD: ${judgesQtd.toString().padStart(4, '0')}`,
                        `TEMPO: ${dateHour(judgesSec).res}`,
                        `🔵 QTD: ${judgesQtdHitApp.toString().padStart(4, '0')}`,
                        `TEMPO: ${dateHour(judgesSecHitApp).res}`,
                        `MÉDIO: ${dateHour((judgesSecHitAppLast / judgesQtdHitAppLast)).res.substring(3, 8)}`
                    ]; infNotification = {
                        'duration': 2, 'icon': './src/scripts/media/icon_4.png', 'title': `${platform} | ${hitApp}`, 'retInf': false,
                        'text': `${notText[0]} | ${notText[1]} \n${notText[2]} | ${notText[3]} \n${notText[4]} | ${notText[5]} | ${notText[6]}`
                    }; retNotification = await notification(infNotification); gO.inf[platform].log.splice(index, 1); // await csf([gO.inf]);
                }
            }
        }

        ret['msg'] = `${platform}: OK`;
        ret['res'] = `resposta aqui`;
        ret['ret'] = true;

    } catch (catchErr) {
        let retRegexE = await regexE({ 'inf': inf, 'e': catchErr, });
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