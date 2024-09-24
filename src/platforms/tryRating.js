// let infTryRating, retTryRating
// infTryRating = { 'e': e, 'platform': platform, 'url': `${platform}/home`, 'body': inf.body }
// retTryRating = await ewoq(infTryRating); console.log(retTryRating)~

// ### 'list' Search20 (Task com julgamentos únicos [TASK ID: igual])
// tasks[0].taskData.resultSet.resultList[1].value.name
// tasks[0].taskData.resultSet.resultList[2].value.name
// tasks[0].taskData.resultSet.resultList[1].value.name

// ### 'task' SearchAdsRelevance (Task com julgamentos separados [TASK ID: diferente])
// tasks[0].taskData.query
// tasks[1].taskData.query
// tasks[2].taskData.query

let e = import.meta.url, ee = e;
async function tryRating(inf) {
    let ret = { 'ret': false }; e = inf && inf.e ? inf.e : e; // gO.inf[platform].log = { 'a': '4' }; await csf([gO.inf]) // SET
    try {
        let platform = inf.platform ? inf.platform : 'Teste'; let retConfigStorage, infNotification, retLog, pathNew, urlCurrent
        let time = dateHour().res, time1 = `MES_${time.mon}_${time.monNam}/DIA_${time.day}`, time2 = `${time.hou}.${time.min}.${time.sec}.${time.mil}`; let pathLogPlataform = `Plataformas/${platform}`;
        retConfigStorage = await configStorage({ 'e': e, 'action': 'get', 'key': 'sniffer' }); if (!retConfigStorage.ret) { return retConfigStorage }; let other = retConfigStorage.res.platforms[platform.replace('_teste', '')]

        // CRIAR OBJETO DA PLATAFORMA (PARA EVITAR O ERRO AO ABRIR A TASK SEM PASSAR NA 'HOME')
        if (!gO.inf[platform]) { gO.inf[platform] = {}; gO.inf[platform]['log'] = []; }

        /* [1] → INÍCIO */; urlCurrent = `/home`;
        if ((inf.url == `${platform}${urlCurrent}`)) {
            logConsole({ 'e': e, 'ee': ee, 'write': true, 'msg': `#### ${platform} | ${urlCurrent}` }); await commandLine({ 'notAdm': true, 'command': `!letter!:/ARQUIVOS/WINDOWS/BAT/ESCREVER_e_ou_TECLA.vbs [ALT+F21]` });
            gO.inf[platform]['log'] = []; // await csf([gO.inf]);
        }

        /* [2] → RECEBE A TASK */; urlCurrent = `/survey`;
        if ((inf.url == `${platform}${urlCurrent}`)) {
            logConsole({ 'e': e, 'ee': ee, 'write': true, 'msg': `#### ${platform} | ${urlCurrent}` }); if (inf.body !== 'NULL') {
                await commandLine({ 'notAdm': true, 'command': `!letter!:/ARQUIVOS/WINDOWS/BAT/ESCREVER_e_ou_TECLA.vbs [ALT+F21][F21]` });
                let body = JSON.parse(inf.body), hitApp = body.templateTaskType.replace(/[^a-zA-Z0-9]/g, ''); let judgeId = body.requestId; // await csf([gO.inf]);
                retLog = await log({ 'e': e, 'folder': `${pathLogPlataform}`, 'path': `GET_${hitApp}.txt`, 'text': inf.body });
                // CAPTURAR TODAS AS TASKS DO JULGAMENTO
                let tasksBlind = 0, tasksQtd = 0, tasksType = 'NAO_DEFINIDO', tasksInf = []; for (let [index, value] of body.tasks.entries()) {
                    let blind = !(value?.metadata?.created); let resultList = value?.taskData?.resultSet?.resultList ? value.taskData.resultSet.resultList.length : 0; tasksQtd += resultList > 0 ? resultList : 1
                    tasksType = resultList > 0 ? 'resultList' : 'tasks'; tasksBlind += blind ? 1 : 0; tasksInf.push({
                        'blind': blind, 'name': value.metadata?.name, 'assetType': value.metadata?.assetType, 'metadata': value.metadata?.metadata, 'state': value.metadata?.state,
                        'createdBy': value.metadata?.createdBy, 'created': value.metadata?.created, 'storageType': value.metadata?.storageType,
                    })
                }; let addGet = { 'conceptId': body.conceptId, 'projectId': body.projectId, 'templateSchemaVersionId': body.templateSchemaVersionId, 'targetLocalIds': JSON.stringify(body.targetLocalIds), 'tasksInf': tasksInf, };
                gO.inf[platform].log.push({
                    'hitApp': hitApp, 'tim': Number(time.tim), 'hou': `${time.hou}:${time.min}:${time.sec}`, 'tasksQtd': tasksQtd, 'tasksBlind': tasksBlind, 'judgeId': judgeId, 'judgesQtd': 1, 'tasksType': tasksType,
                    'addGet': addGet, 'body': inf.body, 'path': retLog.res,
                }); if (inf.body.includes(`{"serializedAnswer":{"`)) {
                    // BLIND, TEM A RESPOSTA [HIT APP OU GENÉRICA]
                    let retHitAppGetResponse, notClip = {}; await notification({ 'duration': 4, 'icon': './src/scripts/media/notification_1.png', 'title': `${platform} | BLIND`, 'text': 'Tem a resposta!' });
                    if (hitApp == 'AAA') {/* retHitAppGetResponse = await tryRating_Search20({ 'body': inf.body }); */ } else { retHitAppGetResponse = await tryRatingGetResponse({ 'e': e, 'body': inf.body, 'hitApp': hitApp, }); }
                    notClip['ret'] = retHitAppGetResponse.ret; notClip['res'] = notClip.ret ? retHitAppGetResponse.res : retHitAppGetResponse.msg; await clipboard({ 'e': e, 'value': notClip.res }); infNotification = {
                        'duration': notClip ? 3 : 4, 'icon': `./src/scripts/media/notification_${notClip.ret ? 2 : 3}.png`, 'title': `${platform} | ${notClip.ret ? 'CONCLUÍDO' : 'ERRO'}`, 'text': notClip.res
                    }; await notification(infNotification);  // BLIND, NÃO TEM A RESPOSTA | NÃO É BLIND
                } // ********* else if (!body.tasks[0].metadata?.created) { await notification({ 'duration': 4, 'icon': './src/scripts/media/notification_3.png', 'title': `${platform} | BLIND`, 'text': 'Não tem a resposta!' }) }
                else { await notification({ 'duration': 2, 'icon': './src/scripts/media/notification_2.png', 'title': `${platform} | NÃO É BLIND`, 'text': 'Avaliar manualmente' }); }

                if (hitApp == 'Search20') {
                    // ALTERAR MODO DO MAPA (SOMENTE NA 'Search20')
                    function fun(funInf) { let e = document.querySelector(funInf.e); e = Array.from(document.querySelectorAll('.mktls-option')).find(l => { return l.textContent.trim() === 'Hybrid' }); e.click(); return true }
                    let origin = `messageSendOrigin_${globalWindow.devGet[1]}`; let destination = `${globalWindow.devGet[1].split('roo=')[0]}roo=${globalWindow.devMy}-CHROME-${globalWindow.devices[0][2][3]}`; let actions = [
                        { 'e': e, 'action': 'elementAwait', 'target': `*tryrating*`, 'awaitElementMil': 20000, 'attribute': `class`, 'attributeValue': `mktls-option mktls-show mktls-value`, }, // EXPANDIDA DO MAPA: ESPERAR
                        { 'e': e, 'action': 'elementClick', 'target': `*tryrating*`, 'attribute': `class`, 'attributeValue': `mktls-option mktls-show mktls-value`, }, // EXPANDIDA DO MAPA: CLICAR
                        { 'e': e, 'action': 'inject', 'target': `*tryrating*`, 'fun': `(${fun.toString()})(${JSON.stringify({ 'ele': '.mktls-option.mktls-show.mktls-value' })});`, }, // EXPANDIDA DO MAPA: SELECIONAR
                    ]; for (let [index, value] of actions.entries()) {
                        let message = { 'fun': [{ 'securityPass': globalWindow.securityPass, 'retInf': true, 'name': 'chromeActions', 'par': value }] }; let retListenerChromeActions
                        retListenerChromeActions = await listenerAcionar(origin, { 'destination': destination, 'message': message, 'secondsAwait': 25, }); // console.log(retListenerChromeActions)
                        if (!retListenerChromeActions.ret) { break }; await new Promise(resolve => { setTimeout(resolve, index == 0 ? 3000 : 500) });
                    };
                }
            }
        }

        /* [3] → ENVIA A RESPOSTA DA TASK */; urlCurrent = `/client_log`;
        if ((inf.url == `${platform}${urlCurrent}`)) {
            logConsole({ 'e': e, 'ee': ee, 'write': true, 'msg': `#### ${platform} | ${urlCurrent}` }); let json, body = JSON.parse(inf.body); let tasksQtd = 0, judgesQtd = 0, judgesSec = 0, tasksBlinds = 0;
            let tasksQtdHitApp = 0, judgesQtdHitApp = 0, judgesSecHitApp = 0, tasksBlindsHitApp = 0; let judgesQtdHitAppLast = 0; let judgesSecHitAppLast = 0, lastHour, judgesQtdMon = 0, judgesSecMon = 0;
            let hitApp = body.data.templateTaskType.replace(/[^a-zA-Z0-9]/g, ''); let judgeId = body.data.tasks[0].requestId;
            retLog = await log({ 'e': e, 'folder': `${pathLogPlataform}`, 'path': `SEND_${hitApp}.txt`, 'text': inf.body }); pathNew = retLog.res; pathNew = pathNew.substring(pathNew.lastIndexOf('/') + 1);
            pathNew = retLog.res.replace(pathNew, `OK/${pathNew}`); await file({ 'e': e, 'action': 'change', 'path': retLog.res, 'pathNew': pathNew }); for (let [index, value] of gO.inf[platform].log.entries()) {
                if (judgeId == value.judgeId) {
                    pathNew = value.path; pathNew = pathNew.substring(pathNew.lastIndexOf('/') + 1);
                    pathNew = value.path.replace(pathNew, `OK/${pathNew}`); await file({ 'e': e, 'action': 'change', 'path': value.path, 'pathNew': pathNew })
                    retConfigStorage = await configStorage({ 'e': e, 'path': `./log/${pathLogPlataform}/${time1}/#_DIA_#.json`, 'functionLocal': false, 'action': 'get', 'key': `${platform}` });
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
                    retConfigStorage = await configStorage({ 'e': e, 'path': `./log/${pathLogPlataform}/${time1}/#_DIA_#.json`, 'functionLocal': false, 'action': 'set', 'key': `${platform}`, 'value': json });
                    retConfigStorage = await configStorage({ 'e': e, 'path': `./log/${pathLogPlataform}/MES_${time.mon}_${time.monNam}/#_MES_#.json`, 'functionLocal': false, 'action': 'set', 'key': `DIA_${time.day}`, 'value': json.inf });
                    retConfigStorage = await configStorage({ 'e': e, 'path': `./log/${pathLogPlataform}/MES_${time.mon}_${time.monNam}/#_MES_#.json`, 'functionLocal': false, 'action': 'get', 'key': `*` });
                    for (let nameKey in retConfigStorage.res) { judgesQtdMon += retConfigStorage.res[nameKey].reg.judgesQtd; judgesSecMon += retConfigStorage.res[nameKey].reg.judgesSec };

                    // FILTRAR APENAS REGISTRO DA SEMANA ATUAL
                    function firstDayWeek(inf) {
                        let d = new Date(inf); let dW = d.getDay(); let dif = dW; let f = new Date(d); f.setDate(d.getDate() - dif); let day = String(f.getDate()).padStart(2, '0');
                        let mon = String(f.getMonth() + 1).padStart(2, '0'); let yea = String(f.getFullYear()); return { 'day': day, 'mon': mon, 'yea': yea, };
                    }; let retFirstDayWeek = firstDayWeek(`${time.yea}-${time.mon}-${time.day}T${time.hou}:${time.min}:${time.sec}`); let staDay = retFirstDayWeek.day; let staMon = retFirstDayWeek.mon

                    logConsole({ 'e': e, 'ee': ee, 'write': true, 'msg': `DATA/HORA ${time.day}/${time.mon} ${time.hou}:${time.min}:${time.sec} | INÍCIO DA SEMANA ${staDay}` });

                    let filt = Object.fromEntries(Object.entries(retConfigStorage.res).filter(([key]) => key.substring(4) >= staDay || staMon !== time.mon)); filt = { 'res': filt }
                    let judgesQtdWee = 0; let judgesSecWee = 0; for (let nameKey in filt.res) { judgesQtdWee += filt.res[nameKey].reg.judgesQtd; judgesSecWee += filt.res[nameKey].reg.judgesSec };

                    let notText = [
                        `🔵 QTD: ${judgesQtdMon.toString().padStart(3, '0')}`, `TEMPO: ${dateHour(judgesSecMon).res}`, `🟡 QTD: ${judgesQtdWee.toString().padStart(3, '0')}`, `TEMPO: ${dateHour(judgesSecWee).res}`,
                        `🟢 QTD: ${judgesQtd.toString().padStart(3, '0')}`, `TEMPO: ${dateHour(judgesSec).res}`, `MÉDIO: ${dateHour((judgesSecHitAppLast / judgesQtdHitAppLast)).res.substring(3, 8)}`
                    ]; infNotification = {
                        'duration': 2, 'icon': './src/scripts/media/icon_4.png', 'title': `${platform} | ${hitApp}`,
                        'text': `${notText[0]} | ${notText[1]} \n${notText[2]} | ${notText[3]} \n${notText[4]} | ${notText[5]} | ${notText[6]}`
                    }; await notification(infNotification); gO.inf[platform].log.splice(index, 1); // await csf([gO.inf]);
                }
            }
        }

        ret['msg'] = `${platform}: OK`;
        ret['ret'] = true;

    } catch (catchErr) {
        let retRegexE = await regexE({ 'inf': inf, 'e': catchErr, }); ret['msg'] = retRegexE.res;
    }; return { ...({ ret: ret.ret }), ...(ret.msg && { msg: ret.msg }), ...(ret.res && { res: ret.res }), };
};

// CHROME | NODEJS
(eng ? window : global)['tryRating'] = tryRating;