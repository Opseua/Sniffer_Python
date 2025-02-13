// let infTryRating, retTryRating;
// infTryRating = { e, 'platform': platform, 'url': `${platform}/home`, 'body': body, };
// retTryRating = await ewoq(infTryRating); console.log(retTryRating);

// // ### 'list' Search20 (Task com julgamentos únicos [TASK ID: igual])
// // tasks[0].taskData.resultSet.resultList[1].value.name
// // tasks[0].taskData.resultSet.resultList[2].value.name
// // tasks[0].taskData.resultSet.resultList[1].value.name

// // ### 'task' SearchAdsRelevance (Task com julgamentos separados [TASK ID: diferente])
// // tasks[0].taskData.query
// // tasks[1].taskData.query
// // tasks[2].taskData.query

let e = import.meta.url, ee = e;
async function tryRating(inf = {}) {
    let ret = { 'ret': false, }; e = inf && inf.e ? inf.e : e; // gO.inf[platform].log = { 'a': '4' }; csf([gO.inf]) // SET
    try {
        let { platform, url, body, } = inf;

        try { body = JSON.parse(body); } catch (catchErr) { esLintIgnore = catchErr; body = false; }; platform = platform || 'Teste'; let retConfigStorage, infNotification, retLog, pathNew, urlCurrent, retFile;
        let time = dateHour().res; let time1 = `MES_${time.mon}_${time.monNam}/DIA_${time.day}`; let pathLogPlataform = `Plataformas/${platform}`; let other = platforms[platform.replace('_teste', '')];

        // CRIAR OBJETO DA PLATAFORMA (PARA EVITAR O ERRO AO ABRIR A TASK SEM PASSAR NA 'HOME')
        if (!gO.inf[platform]) { gO.inf[platform] = {}; gO.inf[platform]['log'] = []; };
        function runClavier(com) { commandLine({ 'notBackground': true, 'command': `!fileWindows!/PORTABLE_Clavier/Clavier.exe /sendkeys "${com}"`, }); };
        listenerAcionar(ori, { 'destination': des, 'message': { 'fun': [{ 'securityPass': gW.securityPass, 'name': 'chromeActions', 'par': { e, 'action': 'badge', 'text': '', }, },], }, }); // BADGE (USUARIO_3): RESETAR

        /* [1] → INÍCIO */; urlCurrent = `/home`;
        if ((url === `${platform}${urlCurrent}`)) { logConsole({ e, ee, 'write': true, 'msg': `#### ${platform} | ${urlCurrent}`, }); runClavier(`[CTRL+F21]`); gO.inf[platform]['log'] = []; /* csf([gO.inf]) */; }

        /* [2] → RECEBE A TASK */; urlCurrent = `/survey`;
        if ((url === `${platform}${urlCurrent}`)) {
            logConsole({ e, ee, 'write': true, 'msg': `#### ${platform} | ${urlCurrent}`, }); if (body) {
                runClavier(`[CTRL+F21][F21]`); let hitApp = body.templateTaskType.replace(/[^a-zA-Z0-9]/g, ''); let judgeId = body.requestId;
                retLog = await log({ e, 'folder': `${pathLogPlataform}`, 'path': `GET_${hitApp}.txt`, 'text': body, }); // CAPTURAR TODAS AS TASKS DO JULGAMENTO
                let tasksBlind = 0, tasksQtd = 0, tasksType = 'NAO_DEFINIDO', tasksInf = []; for (let [index, value,] of body.tasks.entries()) {
                    let blind = !(value?.metadata?.created); let resultList = value?.taskData?.resultSet?.resultList ? value.taskData.resultSet.resultList.length : 0; tasksQtd += resultList > 0 ? resultList : 1;
                    tasksType = resultList > 0 ? 'resultList' : 'tasks'; tasksBlind += blind ? 1 : 0; tasksInf.push({
                        'blind': blind, 'name': value.metadata?.name, 'assetType': value.metadata?.assetType, 'metadata': value.metadata?.metadata, 'state': value.metadata?.state,
                        'createdBy': value.metadata?.createdBy, 'created': value.metadata?.created, 'storageType': value.metadata?.storageType,
                    });
                }; let addGet = { 'conceptId': body.conceptId, 'projectId': body.projectId, 'templateSchemaVersionId': body.templateSchemaVersionId, 'targetLocalIds': JSON.stringify(body.targetLocalIds), tasksInf, };
                gO.inf[platform].log.push({
                    'hitApp': hitApp, 'tim': Number(time.tim), 'hou': `${time.hou}:${time.min}:${time.sec}`, 'tasksQtd': tasksQtd, 'tasksBlind': tasksBlind, 'judgeId': judgeId, 'judgesQtd': 1, 'tasksType': tasksType,
                    'addGet': addGet, 'body': body, 'path': retLog.res,
                });

                // CHECAR SE O HITAPP POSSUI [PASTA + ARQUIVOS NECESSÁRIOS]
                retFile = await file({ e, 'action': 'list', 'path': `${fileProjetos}/Sniffer_Python/log/Plataformas/z_teste/TryRating/${hitApp}`, 'max': 30, });
                let platInf = { 't': '', 'folder': '###', 'guideEn': '{Guide_EN}', 'guidePt': '{Guide_PT}', 'page': '(page_tryrating)', 'get': '(2-GET_TASK-)', }; if (retFile.ret) {
                    platInf['folder'] = false; if (retFile.res.length > 0) {
                        for (let [/*i*/, v,] of retFile.res.entries()) {
                            if (v.name.includes('Guide_EN')) { platInf['guideEn'] = false; }; if (v.name.includes('Guide_PT')) { platInf['guidePt'] = false; };
                            if (v.name.includes('page_tryrating')) { platInf['page'] = false; }; if (v.name.includes('2-GET_TASK-')) { platInf['get'] = false; };
                        };
                    }
                }; Object.keys(platInf).forEach((k /*i*/) => { if (k !== 't' && platInf[k]) { platInf['t'] = `${platInf['t']}${platInf[k]} `; } });
                if (!!platInf.t) { await notification({ 'duration': 4, 'icon': 'notification_3.png', 'keepOld': true, 'title': `${platform} | FALTAM ARQUIVOS`, 'text': `${hitApp}\n${platInf.t}`, }); }

                // CHECAR SE É BLIND *** 3 → [BLIND: SIM - RESP: SIM] # 2 → [BLIND: SIM - RESP: NÃO] # 1 → [BLIND: NÃO] # 0 → [BLIND: ???] | BADGE (USUARIO_3): DEFINIR
                let not; let retTaskInfTryRating = await taskInfTryRating({ e, 'body': body, 'reg': false, 'excludes': ['qtdTask', 'blindNum', 'clipA', 'resA',], });
                if (!retTaskInfTryRating.ret) { logConsole({ e, ee, 'write': true, 'msg': `${JSON.stringify(retTaskInfTryRating)}`, }); return ret; }; retTaskInfTryRating = retTaskInfTryRating.res;
                let blindNum = retTaskInfTryRating.res[hitApp]['0'].tasks['0'].blindNum; if (blindNum === 3) {
                    not = { 'duration': 3, 'icon': 1, 'title': `BLIND`, 'text': 'Tem a resposta!', 'bT': 'resp', 'bC': '#19ff47', };
                    clipboard({ e, 'value': JSON.stringify(retTaskInfTryRating.clip[hitApp]['0'], null, 2), });
                } else if (blindNum === 2) { not = { 'duration': 3, 'icon': 3, 'title': `BLIND`, 'text': 'Não tem a resposta!', 'bT': 'blind', 'bC': '#EC1C24', }; }
                else if (blindNum === 1) { not = { 'duration': 2, 'icon': 2, 'title': `NÃO É BLIND`, 'text': 'Avaliar manualmente', 'bT': 'ok', 'bC': '#3F48CC', }; }
                else if (blindNum === 0) { not = { 'duration': 2, 'icon': 4, 'title': `BLIND ???`, 'text': 'Avaliar manualmente', 'bT': '???', 'bC': '#B83DBA', }; }
                await notification({ 'duration': not.duration, 'icon': `notification_${not.icon}.png`, 'keepOld': true, 'title': `${platform} | ${not.title}`, 'text': `${not.text}`, });
                let msgLis = { 'fun': [{ 'securityPass': gW.securityPass, 'retInf': true, 'name': 'chromeActions', 'par': { e, 'action': 'badge', 'text': not.bT, 'color': not.bC, }, },], };
                let retLisAci = await listenerAcionar(ori, { 'destination': des, 'message': msgLis, }); logConsole({ e, ee, 'write': true, 'msg': `listenerAcionar\n${JSON.stringify(retLisAci)}`, });

                if (blindNum === 0 && ['Ratingoftransformedtext', 'BroadMatchRatings',].includes(hitApp)) {
                    let msgLis = { 'fun': [{ 'securityPass': gW.securityPass, 'retInf': true, 'name': 'tryRatingSet', 'par': { 'hitApp': hitApp, 'path': retLog.res, }, },], };
                    await listenerAcionar(ori, { 'destination': des, 'message': msgLis, });
                }

                // [Search20]: ALTERAR MODO DO MAPA
                if (hitApp === 'Search20') {
                    function fun(f) { let e = document.querySelector(f.e); e = Array.from(document.querySelectorAll('.mktls-option')).find(l => { return l.textContent.trim() === 'Hybrid'; }); e.click(); return true; };
                    let actions = [
                        { e, 'action': 'elementAwait', 'target': `*tryrating*`, 'awaitElementMil': 20000, 'attribute': `class`, 'attributeValue': `mktls-option mktls-show mktls-value`, }, // EXPANDIDA DO MAPA: ESPERAR
                        { e, 'action': 'elementClick', 'target': `*tryrating*`, 'attribute': `class`, 'attributeValue': `mktls-option mktls-show mktls-value`, }, // EXPANDIDA DO MAPA: CLICAR
                        { e, 'action': 'inject', 'target': `*tryrating*`, 'fun': `(${fun.toString()})(${JSON.stringify({ 'ele': '.mktls-option.mktls-show.mktls-value', })});`, }, // EXPANDIDA DO MAPA: SELECIONAR
                    ]; for (let [index, value,] of actions.entries()) {
                        let retLisChrAct = await listenerAcionar(ori, { 'destination': des, 'message': { 'fun': [{ 'securityPass': gW.securityPass, 'retInf': true, 'name': 'chromeActions', 'par': value, },], }, });
                        if (!retLisChrAct.ret) { break; }; await new Promise(resolve => { setTimeout(resolve, index === 0 ? 3000 : 500); }); // console.log(retLisChrAct);
                    };
                }

            }
        }

        /* [3] → ENVIA A RESPOSTA DA TASK */; urlCurrent = `/client_log`;
        if ((url === `${platform}${urlCurrent}`)) {
            logConsole({ e, ee, 'write': true, 'msg': `#### ${platform} | ${urlCurrent}`, }); runClavier(`[CTRL+F21]`); if (body) {
                let json; let tasksQtd = 0, judgesQtd = 0, judgesSec = 0, tasksBlinds = 0; let tasksQtdHitApp = 0, judgesQtdHitApp = 0, judgesSecHitApp = 0, tasksBlindsHitApp = 0; let judgesQtdHitAppLast = 0;
                let judgesSecHitAppLast = 0, lastHour, judgesQtdMon = 0, judgesSecMon = 0; let hitApp = body.data.templateTaskType.replace(/[^a-zA-Z0-9]/g, ''); let judgeId = body.data.tasks[0].requestId;
                let pathJson = `./log/${pathLogPlataform}`; retLog = await log({ e, 'folder': `${pathLogPlataform}`, 'path': `SEND_${hitApp}.txt`, 'text': body, }); pathNew = retLog.res;
                pathNew = pathNew.substring(pathNew.lastIndexOf('/') + 1); pathNew = retLog.res.replace(pathNew, `OK/${pathNew}`); await file({ e, 'action': 'change', 'path': retLog.res, 'pathNew': pathNew, });
                for (let [index, value,] of gO.inf[platform].log.entries()) {
                    if (judgeId === value.judgeId) {
                        pathNew = value.path; pathNew = pathNew.substring(pathNew.lastIndexOf('/') + 1); let pathJson2 = `MES_${time.mon}_${time.monNam}/#_MES_#.json`;
                        pathNew = value.path.replace(pathNew, `OK/${pathNew}`); await file({ e, 'action': 'change', 'path': value.path, 'pathNew': pathNew, });
                        retConfigStorage = await configStorage({ e, 'path': `${pathJson}/${time1}/#_DIA_#.json`, 'functionLocal': false, 'action': 'get', 'key': `${platform}`, });
                        if (!retConfigStorage.ret) { json = { 'inf': { 'reg': { 'tasksQtd': 0, 'tasksBlinds': 0, 'judgesQtd': 0, 'judgesSec': 0, }, 'hitApp': {}, }, 'judges': [], }; } else { json = retConfigStorage.res; };
                        let dif = Number(time.tim) - value.tim; json.judges.push({
                            'hitApp': hitApp, 'tim': `${value.tim} | ${time.tim}`, 'hou': `${value.hou} | ${time.hou}:${time.min}:${time.sec}`, 'tasksQtd': value.tasksQtd, 'tasksBlind': value.tasksBlind,
                            'judgesSec': dif, 'judgesHour': dateHour(dif).res, 'judgeId': value.judgeId, 'judgesQtd': value.judgesQtd, 'tasksType': value.tasksType, 'addGet': value.addGet,
                        }); if (!other[hitApp]) { lastHour = other.default.lastHour; } else { lastHour = other[hitApp].lastHour; }; for (let [index, value,] of json.judges.entries()) {
                            tasksQtd += value.tasksQtd; judgesQtd += value.judgesQtd; judgesSec += value.judgesSec; tasksBlinds += value.tasksBlind; if (value.hitApp === hitApp) {
                                tasksQtdHitApp += value.tasksQtd; judgesQtdHitApp += value.judgesQtd; judgesSecHitApp += value.judgesSec; tasksBlindsHitApp += value.tasksBlind;
                                if (Number(time.tim) < Number(value.tim.split(' | ')[0]) + lastHour) { judgesQtdHitAppLast += value.judgesQtd; judgesSecHitAppLast += value.judgesSec; }
                            }
                        }; json.inf.reg = { 'tasksQtd': tasksQtd, 'tasksBlinds': tasksBlinds, 'judgesQtd': judgesQtd, 'judgesSec': judgesSec, 'judgesHour': dateHour(judgesSec).res, };
                        json.inf.hitApp[hitApp] = { 'tasksQtd': tasksQtdHitApp, 'tasksBlinds': tasksBlindsHitApp, 'judgesQtd': judgesQtdHitApp, 'judgesSec': judgesSecHitApp, 'tasksHour': dateHour(judgesSecHitApp).res, };
                        retConfigStorage = await configStorage({ e, 'path': `${pathJson}/${time1}/#_DIA_#.json`, 'functionLocal': false, 'action': 'set', 'key': `${platform}`, 'value': json, });
                        retConfigStorage = await configStorage({ e, 'path': `${pathJson}/${pathJson2}`, 'functionLocal': false, 'action': 'set', 'key': `DIA_${time.day}`, 'value': json.inf, 'returnValueAll': true, });
                        for (let nameKey in retConfigStorage.res) { judgesQtdMon += retConfigStorage.res[nameKey].reg.judgesQtd; judgesSecMon += retConfigStorage.res[nameKey].reg.judgesSec; };

                        // FILTRAR APENAS REGISTRO DA SEMANA ATUAL
                        function firstDayWeek(inf = {}) {
                            let { date, } = inf; let d = new Date(date); let dW = d.getDay(); let dif = dW; let f = new Date(d); f.setDate(d.getDate() - dif); let day = String(f.getDate()).padStart(2, '0');
                            let mon = String(f.getMonth() + 1).padStart(2, '0'); let yea = String(f.getFullYear()); return { 'day': day, 'mon': mon, 'yea': yea, };
                        }; let retFirstDayWeek = firstDayWeek({ 'date': `${time.yea}-${time.mon}-${time.day}T${time.hou}:${time.min}:${time.sec}`, }); let staDay = retFirstDayWeek.day; let staMon = retFirstDayWeek.mon;

                        logConsole({ e, ee, 'write': true, 'msg': `DATA/HORA ${time.day}/${time.mon} ${time.hou}:${time.min}:${time.sec} | INÍCIO DA SEMANA ${staDay}`, });

                        let filt = Object.fromEntries(Object.entries(retConfigStorage.res).filter(([key,]) => key.substring(4) >= staDay || staMon !== time.mon)); filt = { 'res': filt, };
                        let judgesQtdWee = 0; let judgesSecWee = 0; for (let nameKey in filt.res) { judgesQtdWee += filt.res[nameKey].reg.judgesQtd; judgesSecWee += filt.res[nameKey].reg.judgesSec; };

                        let notText = [
                            `🔵 QTD: ${judgesQtdMon.toString().padStart(3, '0')}`, `TEMPO: ${dateHour(judgesSecMon).res}`, `🟡 QTD: ${judgesQtdWee.toString().padStart(3, '0')}`, `TEMPO: ${dateHour(judgesSecWee).res}`,
                            `🟢 QTD: ${judgesQtd.toString().padStart(3, '0')}`, `TEMPO: ${dateHour(judgesSec).res}`, `MÉDIO: ${dateHour((judgesSecHitAppLast / judgesQtdHitAppLast)).res.substring(3, 8)}`,
                        ]; infNotification = {
                            'duration': 2, 'icon': 'icon_4.png', 'title': `${platform} | ${hitApp}`,
                            'text': `${notText[0]} | ${notText[1]} \n${notText[2]} | ${notText[3]} \n${notText[4]} | ${notText[5]} | ${notText[6]}`,
                        }; await notification(infNotification); gO.inf[platform].log.splice(index, 1); // csf([gO.inf]);
                    }
                }
            }
        }

        ret['msg'] = `${platform}: OK`;
        ret['ret'] = true;

    } catch (catchErr) {
        let retRegexE = await regexE({ 'inf': inf, 'e': catchErr, }); ret['msg'] = retRegexE.res; ret['ret'] = false; delete ret['res'];
    };

    return { ...({ 'ret': ret.ret, }), ...(ret.msg && { 'msg': ret.msg, }), ...(ret.res && { 'res': ret.res, }), };
};

// CHROME | NODEJS
(eng ? window : global)['tryRating'] = tryRating;


