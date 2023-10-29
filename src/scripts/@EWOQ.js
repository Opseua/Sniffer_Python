async function EWOQ(inf) {
    let ret = { 'ret': false }; // gO.inf[platform].log = { 'a': '4' }; await csf([gO.inf]) // SET
    try {
        let platform = inf.platform ? inf.platform : 'Teste'
        let infConfigStorage, retConfigStorage, infFile, retFile, infNotification, retNotification, retLog
        let time = dateHour().res, time1 = `MES_${time.mon}_${time.monNam}/DIA_${time.day}`, time2 = `${time.hou}.${time.min}.${time.sec}.${time.mil}`
        let other = { 'default': { 'lastHour': 3600 } }

        // #### EWOQ | /home
        if ((inf.url == `${platform}/home`)) {
            console.log(`#### ${platform} | /home`)
            gO.inf[platform] = {}; gO.inf[platform]['log'] = []; gO.inf[platform]['token'] = {}
            await commandLine({ 'command': `"${conf[1]}:/ARQUIVOS/WINDOWS/BAT/ESCREVER_e_ou_TECLA.vbs" "[SHIFT+F1]"` })
            await csf([gO.inf]);
        }

        // #### EWOQ | /GetTemplate_[1-SEND]
        if ((inf.url == `${platform}/GetTemplate_[1-SEND]`)) {
            console.log(`#### ${platform} | /GetTemplate_[1-SEND]`)
            const tk = JSON.parse(inf.body)['1']; gO.inf[platform].token['lastToken'] = tk; gO.inf[platform].token[tk] = false
        }

        // #### EWOQ | /GetTemplate_[2-GET]
        if ((inf.url == `${platform}/GetTemplate_[2-GET]`)) {
            console.log(`#### ${platform} | /GetTemplate_[2-GET]`)
            let hitApp = inf.body.match(/raterVisibleName\\u003d\\"(.*?)\\\"\/\\u003e\\n  \\u003cinputTemplate/); if (hitApp.length > 0) {
                hitApp = hitApp[1].replace(/[^a-zA-Z0-9]/g, '');
                gO.inf[platform].token[gO.inf[platform].token.lastToken] = hitApp;
                retLog = await log({ 'folder': `${platform}`, 'path': `GET_template_${hitApp}.txt`, 'text': inf.body });
                gO.inf[platform].token['path'] = retLog.res;
                gO.inf[platform].log.map(async (value, index) => {
                    if (gO.inf[platform].token.lastToken == value.hitApp) {
                        hitApp = gO.inf[platform].token[gO.inf[platform].token.lastToken]; gO.inf[platform].log[index]['hitApp'] = hitApp
                        retLog = await log({ 'folder': `${platform}`, 'path': `GET_${hitApp}.txt`, 'text': value.body });
                        gO.inf[platform].log[index]['path'] = retLog.res
                    }
                }); infNotification = { 'duration': 3, 'icon': './src/media/notification_2.png', 'title': `${platform} | NOVA TASK`, 'text': hitApp, 'retInf': false }
                retNotification = await notification(infNotification);
            }
            await csf([gO.inf]);
        }

        // #### EWOQ | /GetNewTasks
        if ((inf.url == `${platform}/GetNewTasks`)) {
            console.log(`#### ${platform} | /GetNewTasks`)
            let body = JSON.parse(inf.body);
            if (body['1']) {
                const id = body['1'][0]['1']['1'].replace(/[^a-zA-Z0-9]/g, ''); const r = regex({ 'pattern': '":"locale","(.*?)"', 'text': inf.body })
                const addGet = {
                    'locale': r.res['2'].split('":"')[1].split('"')[0],
                    '1': body['1'][0]['1'] ? true : false, '2': body['1'][0]['2'] ? true : false, '3': body['1'][0]['3'] ? true : false,
                    '4': body['1'][0]['4'] ? true : false, '5': body['1'][0]['5'] ? true : false, '6': body['1'][0]['6'] ? true : false,
                    '7': body['1'][0]['7'] ? true : false, '8': body['1'][0]['8'] ? true : false, '9': body['1'][0]['9'] ? true : false,
                    '10': body['1'][0]['10'] ? true : false, '11': body['1'][0]['11'] ? true : false, '12': body['1'][0]['12'] ? true : false,
                    '13': body['1'][0]['13'] ? true : false, '14': body['1'][0]['14'] ? body['1'][0]['14'] : false,
                }
                gO.inf[platform].log.push({
                    'tim': Number(time.tim), 'dateHour': `${time1}/${time2}`,
                    'id': id, 'hitApp': body['1'][0]['2']['1'], 'body': inf.body, 'token': body['1'][0]['2']['1'],
                    'addGet': addGet
                });
                gO.inf[platform].log.map(async (value, index) => {
                    if (gO.inf[platform].token.lastToken == value.hitApp) {
                        let hitApp = gO.inf[platform].token[gO.inf[platform].token.lastToken]; gO.inf[platform].log[index]['hitApp'] = hitApp
                        retLog = await log({ 'folder': `${platform}`, 'path': `GET_${hitApp}.txt`, 'text': value.body });
                        gO.inf[platform].log[index]['path'] = retLog.res
                    }
                })
            }
            await csf([gO.inf]);
        }

        // #### EWOQ | /RecordTaskRenderingLatency [task 100% loaded] 
        if ((inf.url == `${platform}/RecordTaskRenderingLatency`)) {
            console.log(`#### ${platform} | /RecordTaskRenderingLatency [task 100% loaded]`)
            const id = JSON.parse(inf.body)['2']['1'].replace(/[^a-zA-Z0-9]/g, '')
            await commandLine({ 'command': `"${conf[1]}:/ARQUIVOS/WINDOWS/BAT/ESCREVER_e_ou_TECLA.vbs" "[SHIFT+F1][SHIFT+F2]"` })
            gO.inf[platform].log.map(async (value, index) => {
                if (id == value.id) {
                    const body = JSON.parse(value.body); let text
                    if (body['1'][0]['11'] && body['1'][0]['11']['1'][0]['4']) {
                        text = body['1'][0]['11']['1'][0]['4']
                        const infTranslate = { 'source': 'auto', 'target': 'pt', 'text': text };
                        const retTranslate = await translate(infTranslate);
                        if (retTranslate.ret) { text = `# PORTUGUÊS #\n${retTranslate.res}\n\n# INGLÊS #\n${text}` }
                        else { text = `# PORTUGUÊS #\nERRO AO TRADUZIR\n\n# INGLÊS #\n${text}` }
                        infNotification = {
                            'duration': 5, 'icon': './src/media/notification_1.png',
                            'title': `${platform} | TEM A RESPOSTA!`, 'text': text, 'retInf': false
                        }; retNotification = await notification(infNotification);
                    } else {
                        text = body['1'][0]['10']['1'][0]['2']
                        infNotification = {
                            'duration': 3, 'icon': './src/media/notification_2.png',
                            'title': `${platform} | `, 'text': text
                        }; // retNotification = await notification(infNotification);
                    };
                    await clipboard({ 'value': text });
                }
            })
        }

        // #### EWOQ | /SubmitFeedback
        if ((inf.url == `${platform}/SubmitFeedback`)) {
            console.log(`#### ${platform} | /SubmitFeedback`)
            let json, body = JSON.parse(inf.body);
            if (body['6']) {
                const id = body['6']['1'].replace(/[^a-zA-Z0-9]/g, ''); gO.inf[platform].log.map(async (value, index) => {
                    if (id == value.id) {
                        let tasksQtd = 0, tasksSec = 0, tasksQtdHitApp = 0, tasksSecHitApp = 0, tasksQtdHitAppLast = 0, tasksSecHitAppLast = 0, lastHour
                        let tasksQtdMon = 0, tasksSecMon = 0, hitApp = gO.inf[platform].token[value.token];
                        retLog = await log({ 'folder': `${platform}`, 'path': `SEND_${hitApp}.txt`, 'text': inf.body })
                        retFile = await file({ 'action': 'change', 'path': value.path, 'pathNew': value.path.replace(`DIA_${time.day}/`, `DIA_${time.day}/OK/`) })
                        retFile = await file({ 'action': 'change', 'path': retLog.res, 'pathNew': retLog.res.replace(`DIA_${time.day}/`, `DIA_${time.day}/OK/`) })
                        if (gO.inf[platform].token.path) {
                            retFile = await file({
                                'action': 'change', 'path': gO.inf[platform].token.path,
                                'pathNew': gO.inf[platform].token.path.replace(`DIA_${time.day}/`, `DIA_${time.day}/OK/`)
                            }); gO.inf[platform].token.path = false
                        }; const dif = body['9']
                        infConfigStorage = { 'path': `./log/${platform}/${time1}/#_DIA_#.json`, 'functionLocal': false, 'action': 'get', 'key': `${platform}` }
                        retConfigStorage = await configStorage(infConfigStorage);
                        if (!retConfigStorage.ret) { json = { 'inf': { 'reg': { 'tasksQtd': 0, 'tasksSec': 0, }, 'taskName': {} }, 'tasks': [] } }
                        else { json = retConfigStorage.res };
                        const jsonInf1 = new Date(Number(time.timMil) - dif).toLocaleTimeString(undefined, { hour12: false });
                        const jsonInf2 = new Date(Number(time.timMil)).toLocaleTimeString(undefined, { hour12: false }); const jsonInf3 = false;
                        json.tasks.push({
                            'taskName': hitApp, 'start': jsonInf1, 'end': jsonInf2, 'sec': Math.round(dif / 1000), 'blind': jsonInf3, 'id': value.id,
                            'addGet': value.addGet
                        });
                        if (!other[hitApp]) { lastHour = other.default.lastHour } else { lastHour = other[hitApp].lastHour }
                        json.tasks.map(async (value, index) => {
                            tasksQtd += 1; tasksSec += value.sec; if (value.taskName == hitApp) {
                                tasksQtdHitApp += 1; tasksSecHitApp += value.sec
                                const timestamp = new Date(`2023-${time.mon}-${time.day}T${value.start}`).getTime();
                                if (timestamp + lastHour * 1000 > Number(time.timMil)) { tasksQtdHitAppLast += 1; tasksSecHitAppLast += value.sec }
                            }
                        }); json.inf.reg = { 'tasksQtd': tasksQtd, 'tasksSec': tasksSec, 'tasksHour': secToHour(tasksSec).res }
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
                        for (const nameKey in retConfigStorage.res) {
                            tasksQtdMon += retConfigStorage.res[nameKey].reg.tasksQtd; tasksSecMon += retConfigStorage.res[nameKey].reg.tasksSec
                        }
                        infNotification = {
                            'duration': 3, 'icon': './src/media/icon_4.png', 'title': `${platform} | ${hitApp}`, 'retInf': false,
                            'text': `QTD: ${tasksQtdMon.toString().padStart(4, '0')} | TOTAL: ${secToHour(tasksSecMon).res}\nQTD: ${tasksQtd.toString().padStart(4, '0')} | TOTAL: ${secToHour(tasksSec).res} | MÉDIO: ${secToHour((tasksSecHitAppLast / tasksQtdHitAppLast).toFixed(0)).res}`
                        }; retNotification = await notification(infNotification);
                        gO.inf[platform].log.splice(index, 1);
                        await csf([gO.inf]);
                    }
                })
            }
        }

        ret['ret'] = true; ret['msg'] = `${platform}: OK`; ret['res'] = `resposta aqui`;
    } catch (e) { const m = await regexE({ 'e': e }); ret['msg'] = m.res }; return ret
}

if (typeof window !== 'undefined') { // CHROME
    window['EWOQ'] = EWOQ;
} else { // NODEJS
    global['EWOQ'] = EWOQ;
}