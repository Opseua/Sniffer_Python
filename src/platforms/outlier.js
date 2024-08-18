// let infOutlier, retOutlier
// infOutlier = { 'e': e, 'platform': platform, 'url': `${platform}/home`, 'body': inf.body }
// retOutlier = await ewoq(infOutlier); console.log(retOutlier)

let e = import.meta.url, ee = e;
async function outlier(inf) {
    let ret = { 'ret': false }; e = inf && inf.e ? inf.e : e; // gO.inf[platform].log = { 'a': '4' }; await csf([gO.inf]) // SET
    try {
        let platform = inf.platform ? inf.platform : 'Teste'; let retConfigStorage, infNotification, retLog, pathNew, urlCurrent
        let time = dateHour().res, time1 = `MES_${time.mon}_${time.monNam}/DIA_${time.day}`, time2 = `${time.hou}.${time.min}.${time.sec}.${time.mil}`; let pathLogPlataform = `Plataformas/${platform}`;
        retConfigStorage = await configStorage({ 'e': e, 'action': 'get', 'key': 'sniffer' }); if (!retConfigStorage.ret) { return retConfigStorage }; let other = retConfigStorage.res.platforms[platform.replace('_teste', '')]

        // CRIAR OBJETO DA PLATAFORMA (PARA EVITAR O ERRO AO ABRIR A TASK SEM PASSAR NA 'HOME')
        if (!gO.inf[platform]) { gO.inf[platform] = {}; gO.inf[platform]['log'] = []; }

        /* [1] → INÍCIO */; urlCurrent = `/en/expert`;
        if ((inf.url == `${platform}${urlCurrent}`)) {
            logConsole({ 'e': e, 'ee': ee, 'write': true, 'msg': `#### ${platform} | ${urlCurrent}` }); // await commandLine({ 'notAdm': true, 'command': `!letter!:/ARQUIVOS/WINDOWS/BAT/ESCREVER_e_ou_TECLA.vbs [CTRL+F22]` });
            gO.inf[platform]['log'] = []; // await csf([gO.inf]);
        }

        /* [2] → RECEBE A TASK */; urlCurrent = `/internal/v2/tasks/new_queue`;
        if ((inf.url == `${platform}${urlCurrent}`)) {
            logConsole({ 'e': e, 'ee': ee, 'write': true, 'msg': `#### ${platform} | ${urlCurrent}` }); if (inf.body !== 'NULL') {
                // await commandLine({ 'notAdm': true, 'command': `!letter!:/ARQUIVOS/WINDOWS/BAT/ESCREVER_e_ou_TECLA.vbs [CTRL+F22][F22]` });
                let body = JSON.parse(inf.body)[0], hitApp = body.project.name; /* bpdy.project.taskerName */; hitApp = hitApp.replace(/[^a-zA-Z0-9]/g, ''); let judgeId = body._id
                retLog = await log({ 'e': e, 'folder': `${pathLogPlataform}`, 'path': `GET_${hitApp}.txt`, 'text': inf.body });
                let tasksQtd = 1; let tasksBlind = false
                let addGet = {
                    'assignmentType': body.assignmentType, 'name': body.project.name, 'taskerName': body.project.taskerName, 'isBenchmarkingProject': body.project.isBenchmarkingProject,
                    'usedForBenchmarkingFrequencies': body.project.usedForBenchmarkingFrequencies, 'isTest': body.project.isTest, 'createdAt': body.project.createdAt, 'updatedAt': body.project.updatedAt,
                    'lastQualityQueueEmail': body.project.lastQualityQueueEmail, 'reviewLevel': body.reviewLevel
                };
                gO.inf[platform].log.push({
                    'hitApp': hitApp, 'tim': Number(time.tim), 'hou': `${time.hou}:${time.min}:${time.sec}`, 'tasksQtd': tasksQtd, 'tasksBlind': tasksBlind, 'judgeId': judgeId, 'judgesQtd': 1,
                    'addGet': addGet, 'body': inf.body, 'path': retLog.res,
                });
            }
        }

        /* [3] → ENVIA O LINTER */; urlCurrent = `/internal/genai/runPerStepResponseLinter_[1-SEND]`;
        if ((inf.url == `${platform}${urlCurrent}`)) {
            logConsole({ 'e': e, 'ee': ee, 'write': true, 'msg': `#### ${platform} | ${urlCurrent}` });
            let body = JSON.parse(inf.body);
            let judgeId = body.assignmentId;
            for (let [index, value] of gO.inf[platform].log.entries()) {
                if (judgeId == value.judgeId) {
                    let hitApp = value.hitApp
                    retLog = await log({ 'e': e, 'folder': `${pathLogPlataform}`, 'path': `SEND_LINTER-${hitApp}.txt`, 'text': inf.body });
                    gO.inf[platform].log[index]['lastLinters'] = gO.inf[platform].log[index].lastLinters ?? []; gO.inf[platform].log[index].lastLinters.push(retLog.res);
                }
            }
        }

        /* [4] → RECEBE O LINTER */; urlCurrent = `/internal/genai/runPerStepResponseLinter_[2-GET]`;
        if ((inf.url == `${platform}${urlCurrent}`)) {
            logConsole({ 'e': e, 'ee': ee, 'write': true, 'msg': `#### ${platform} | ${urlCurrent}` });
            for (let [index, value] of gO.inf[platform].log.entries()) {
                let hitApp = value.hitApp;
                retLog = await log({ 'e': e, 'folder': `${pathLogPlataform}`, 'path': `GET_LINTER-${hitApp}.txt`, 'text': inf.body });
                gO.inf[platform].log[index]['lastLinters'] = gO.inf[platform].log[index].lastLinters ?? []; gO.inf[platform].log[index].lastLinters.push(retLog.res);
                break
            }
        }

        /* [5] → ENVIA A RESPOSTA DA TASK */; urlCurrent = `internal/complete/chat`;
        if ((inf.url == `${platform}${urlCurrent}`)) {
            logConsole({ 'e': e, 'ee': ee, 'write': true, 'msg': `#### ${platform} | ${urlCurrent}` });
            let json, body = JSON.parse(inf.body); let tasksQtd = 0, judgesQtd = 0, judgesSec = 0, tasksBlinds = 0;
            let tasksQtdHitApp = 0, judgesQtdHitApp = 0, judgesSecHitApp = 0, tasksBlindsHitApp = 0; let judgesQtdHitAppLast = 0; let judgesSecHitAppLast = 0, lastHour, judgesQtdMon = 0, judgesSecMon = 0;
            let judgeId = body.task_id;
            for (let [index, value] of gO.inf[platform].log.entries()) {
                if (judgeId == value.judgeId) {
                    let hitApp = value.hitApp
                    retLog = await log({ 'e': e, 'folder': `${pathLogPlataform}`, 'path': `SEND_${hitApp}.txt`, 'text': inf.body });
                    gO.inf[platform].log[index]['lastLinters'] = gO.inf[platform].log[index].lastLinters ?? []; gO.inf[platform].log[index].lastLinters.push(retLog.res);
                    gO.inf[platform].log[index].lastLinters.push(value.path);
                    for (let [index1, value1] of gO.inf[platform].log[index].lastLinters.entries()) {
                        pathNew = value1; pathNew = pathNew.substring(pathNew.lastIndexOf('/') + 1); pathNew = value1.replace(pathNew, `OK/${pathNew}`); await file({ 'e': e, 'action': 'change', 'path': value1, 'pathNew': pathNew })
                    }
                    retConfigStorage = await configStorage({ 'e': e, 'path': `./log/${pathLogPlataform}/${time1}/#_DIA_#.json`, 'functionLocal': false, 'action': 'get', 'key': `${platform}` });
                    if (!retConfigStorage.ret) { json = { 'inf': { 'reg': { 'tasksQtd': 0, 'tasksBlinds': 0, 'judgesQtd': 0, 'judgesSec': 0, }, 'hitApp': {} }, 'judges': [] } } else { json = retConfigStorage.res };
                    let dif = Number(time.tim) - value.tim; json.judges.push({
                        'hitApp': hitApp, 'tim': `${value.tim} | ${time.tim}`, 'hou': `${value.hou} | ${time.hou}:${time.min}:${time.sec}`, 'tasksQtd': value.tasksQtd, 'tasksBlind': value.tasksBlind,
                        'judgesSec': dif, 'judgesHour': dateHour(dif).res, 'judgeId': value.judgeId, 'judgesQtd': value.judgesQtd, 'addGet': value.addGet,
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
                    for (let nameKey in retConfigStorage.res) { judgesQtdMon += retConfigStorage.res[nameKey].reg.judgesQtd; judgesSecMon += retConfigStorage.res[nameKey].reg.judgesSec }; let notText = [
                        `🟢 QTD: ${judgesQtdMon.toString().padStart(3, '0')}`, `TEMPO: ${dateHour(judgesSecMon).res}`, `🔵 QTD: ${judgesQtd.toString().padStart(3, '0')}`, `TEMPO: ${dateHour(judgesSec).res}`,
                        `🔵 QTD: ${judgesQtdHitApp.toString().padStart(3, '0')}`, `TEMPO: ${dateHour(judgesSecHitApp).res}`, `MÉDIO: ${dateHour((judgesSecHitAppLast / judgesQtdHitAppLast)).res.substring(3, 8)}`
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
(eng ? window : global)['outlier'] = outlier;