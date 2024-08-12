// let infEwoq, retEwoq
// infEwoq = { 'e': e, 'platform': platform, 'url': `${platform}/home`, 'body': inf.body }
// retEwoq = await ewoq(infEwoq); console.log(retEwoq)

let e = import.meta.url, ee = e;
async function ewoq(inf) {
    let ret = { 'ret': false }; e = inf && inf.e ? inf.e : e; // gO.inf[platform].log = { 'a': '4' }; await csf([gO.inf]) // SET
    try {
        let platform = inf.platform ? inf.platform : 'Teste'; let retConfigStorage, infNotification, retLog, pathNew, urlCurrent, retFile
        let time = dateHour().res, time1 = `MES_${time.mon}_${time.monNam}/DIA_${time.day}`, time2 = `${time.hou}.${time.min}.${time.sec}.${time.mil}`; let pathLogPlataform = `Plataformas/${platform}`;
        retConfigStorage = await configStorage({ 'e': e, 'action': 'get', 'key': 'sniffer' }); if (!retConfigStorage.ret) { return retConfigStorage }; let other = retConfigStorage.res.platforms[platform.replace('_teste', '')]

        // CRIAR OBJETO DA PLATAFORMA (PARA EVITAR O ERRO AO ABRIR A TASK SEM PASSAR NA 'HOME')
        if (!gO.inf[platform]) { gO.inf[platform] = {}; gO.inf[platform]['log'] = []; gO.inf[platform]['token'] = {}; }

        /* [1] → INÍCIO */; urlCurrent = `/home`;
        if ((inf.url == `${platform}${urlCurrent}`)) {
            logConsole({ 'e': e, 'ee': ee, 'write': true, 'msg': `#### ${platform} | ${urlCurrent}` }); await commandLine({ 'notAdm': true, 'command': `!letter!:/ARQUIVOS/WINDOWS/BAT/ESCREVER_e_ou_TECLA.vbs [CTRL+F20]` });
            gO.inf[platform]['log'] = []; // await csf([gO.inf]);
        }

        /* [2] → RECEBE A TASK */; urlCurrent = `/GetNewTasks`;
        if ((inf.url == `${platform}${urlCurrent}`)) {
            logConsole({ 'e': e, 'ee': ee, 'write': true, 'msg': `#### ${platform} | ${urlCurrent}` }); let body = JSON.parse(inf.body); if (body['1']) {
                let id = body['1'][0]['1']['1'].replace(/[^a-zA-Z0-9]/g, ''); let retRegex = regex({ 'pattern': '":"locale","(.*?)"', 'text': inf.body }); let addGet = {
                    'locale': retRegex.ret && retRegex.res['2'] ? retRegex.res['2'].split('":"')[1].split('"')[0] : false, '1': body['1'][0]['1'] ? true : false, '2': body['1'][0]['2'] ? true : false,
                    '3': body['1'][0]['3'] ? true : false, '4': body['1'][0]['4'] ? true : false, '5': body['1'][0]['5'] ? true : false, '6': body['1'][0]['6'] ? true : false,
                    '7': body['1'][0]['7'] ? true : false, '8': body['1'][0]['8'] ? true : false, '9': body['1'][0]['9'] ? true : false, '10': body['1'][0]['10'] ? true : false,
                    '11': body['1'][0]['11'] ? true : false, '12': body['1'][0]['12'] ? true : false, '13': body['1'][0]['13'] ? true : false, '14': body['1'][0]['14'] ?? false,
                }; retLog = await log({ 'e': e, 'folder': `${pathLogPlataform}`, 'path': `GET_AINDA_NAO_IDENTIFICADO.txt`, 'text': inf.body }); gO.inf[platform].log.push({
                    'hitApp': body['1'][0]['2']['1'], 'tim': Number(time.tim), 'hou': `${time.hou}:${time.min}:${time.sec}`, 'qtd': 1, 'id': id, 'body': inf.body, 'token': body['1'][0]['2']['1'], 'path': retLog.res, 'addGet': addGet
                }); for (let [index, value] of gO.inf[platform].log.entries()) {
                    if (gO.inf[platform].token.lastToken == value.hitApp) {
                        let hitApp = gO.inf[platform].token[gO.inf[platform].token.lastToken]; gO.inf[platform].log[index]['hitApp'] = hitApp; pathNew = gO.inf[platform].log[index].path
                        retFile = await file({ 'e': e, 'action': 'change', 'path': pathNew, 'pathNew': pathNew.replace('AINDA_NAO_IDENTIFICADO', hitApp) }); gO.inf[platform].log[index].path = retFile.res;
                    }
                }
            } // await csf([gO.inf]);
        }

        /* [3] → SOLICITA O TEMPLATE */; urlCurrent = `/GetTemplate_[1-SEND]`;
        if ((inf.url == `${platform}${urlCurrent}`)) {
            logConsole({ 'e': e, 'ee': ee, 'write': true, 'msg': `#### ${platform} | ${urlCurrent}` }); let tk = JSON.parse(inf.body)['1']; gO.inf[platform].token['lastToken'] = tk; gO.inf[platform].token[tk] = false
            retLog = await log({ 'e': e, 'folder': `${pathLogPlataform}`, 'path': `SEND_template_AINDA_NAO_IDENTIFICADO.txt`, 'text': inf.body }); gO.inf[platform]['lastTemplate'] = retLog.res
        }

        /* [4] → RECEBE O TEMPLATE */; urlCurrent = `/GetTemplate_[2-GET]`;
        if ((inf.url == `${platform}${urlCurrent}`)) {
            logConsole({ 'e': e, 'ee': ee, 'write': true, 'msg': `#### ${platform} | ${urlCurrent}` }); let hitApp = inf.body.match(/raterVisibleName\\u003d\\"(.*?)\\\"\/\\u003e\\n  \\u003cinputTemplate/); if (hitApp.length > 0) {
                hitApp = hitApp[1].replace(/[^a-zA-Z0-9]/g, ''); gO.inf[platform].token[gO.inf[platform].token.lastToken] = hitApp;
                retLog = await log({ 'e': e, 'folder': `${pathLogPlataform}`, 'path': `GET_template_${hitApp}.txt`, 'text': inf.body }); gO.inf[platform].token['path'] = retLog.res; if (gO.inf[platform].lastTemplate) {
                    pathNew = gO.inf[platform].lastTemplate; retFile = await file({ 'e': e, 'action': 'change', 'path': pathNew, 'pathNew': pathNew.replace('AINDA_NAO_IDENTIFICADO', hitApp) });
                    gO.inf[platform].lastTemplate = false; gO.inf[platform].token['pathLastTemplate'] = retFile.res
                }; for (let [index, value] of gO.inf[platform].log.entries()) {
                    if (gO.inf[platform].token.lastToken == value.hitApp) {
                        hitApp = gO.inf[platform].token[gO.inf[platform].token.lastToken]; gO.inf[platform].log[index]['hitApp'] = hitApp; pathNew = gO.inf[platform].log[index].path
                        retFile = await file({ 'e': e, 'action': 'change', 'path': pathNew, 'pathNew': pathNew.replace('AINDA_NAO_IDENTIFICADO', hitApp) }); gO.inf[platform].log[index].path = retFile.res
                    }
                }; let textNot = other[hitApp] ? `${other[hitApp].not} ` : '';
                await notification({ 'duration': 2, 'icon': './src/scripts/media/notification_2.png', 'title': `${platform} | NOVA TASK`, 'text': `${textNot}${hitApp}`, 'retInf': false });
            } // await csf([gO.inf]);
        }

        /* [5] → TASK 100% CARREGADA */; urlCurrent = `/RecordTaskRenderingLatency_[TASK_100%_LOADED]`;
        if ((inf.url == `${platform}${urlCurrent}`)) {
            logConsole({ 'e': e, 'ee': ee, 'write': true, 'msg': `#### ${platform} | ${urlCurrent}` }); await commandLine({ 'notAdm': true, 'command': `!letter!:/ARQUIVOS/WINDOWS/BAT/ESCREVER_e_ou_TECLA.vbs [CTRL+F20][F20]` });
            let id = JSON.parse(inf.body)['2']['1'].replace(/[^a-zA-Z0-9]/g, ''); for (let [index, value] of gO.inf[platform].log.entries()) {
                if (id == value.id) {
                    let body = JSON.parse(value.body), text; gO.inf[platform].log[index]['tim'] = Number(time.tim); gO.inf[platform].log[index]['hou'] = `${time.hou}:${time.min}:${time.sec}`
                    if (body['1'][0]['11'] && body['1'][0]['11']['1'][0]['4']) {
                        text = body['1'][0]['11']['1'][0]['4']; let infTranslate = { 'source': 'auto', 'target': 'pt', 'text': text }; let retTranslate = await translate(infTranslate);
                        if (retTranslate.ret) { text = `# PORTUGUÊS #\n${retTranslate.res}\n\n# INGLÊS #\n${text}` } else { text = `# PORTUGUÊS #\nERRO AO TRADUZIR\n\n# INGLÊS #\n${text}` };
                        await notification({ 'duration': 4, 'icon': './src/scripts/media/notification_1.png', 'title': `${platform} | BLIND`, 'text': 'Tem a resposta!', 'retInf': false }); await clipboard({ 'value': text });
                    } else {
                        text = body['1'][0]['10']['1'][0]['2']; if (value.hitApp == 'YouTubeVideoInappropriatenessEvaluation') {
                            let rg = regex({ 'pattern': 'embed/(.*?)?autoplay', 'text': value.body }); rg = rg?.res?.['1'] ? rg.res['1'] : false; if (!rg) {
                                await notification({ 'duration': 4, 'icon': './src/scripts/media/notification_1.png', 'title': `${platform} | YouTube`, 'text': 'ID não encontrado', 'retInf': false });
                            } else {
                                let infApi = { 'method': 'GET', 'url': `https://www.youtube.com/watch?v=${rg}`, 'headers': { 'accept-language': 'application/json' }, 'body': {} };
                                let retApi = await api(infApi); rg = regex({ 'pattern': 'uploadDate" content="(.*?)">', 'text': retApi.res.body }); rg = rg?.res?.['1'] ? rg.res['1'] : false
                                if (!rg) { await notification({ 'duration': 4, 'icon': './src/scripts/media/notification_1.png', 'title': `${platform} | YouTube`, 'text': 'Data não encontrada', 'retInf': false }); } else {
                                    let uploadDate = new Date(rg); uploadDate = Math.floor(uploadDate.getTime() / 1000); let retDateHour = Number(time.tim) - 1296000 // 15 DIAS ATRÁS
                                    if (retDateHour > uploadDate) { await notification({ 'duration': 4, 'icon': './src/scripts/media/notification_3.png', 'title': `${platform} | YouTube`, 'text': rg, 'retInf': false }); }
                                }
                            }
                        }
                    }; await clipboard({ 'value': text }); // await csf([gO.inf]);
                }
            }
        }

        /* [6] → ENVIA A RESPOSTA DA TASK */; urlCurrent = `/SubmitFeedback`;
        if ((inf.url == `${platform}${urlCurrent}`)) {
            logConsole({ 'e': e, 'ee': ee, 'write': true, 'msg': `#### ${platform} | ${urlCurrent}` }); let json, body = JSON.parse(inf.body); let id = body['6']['1'].replace(/[^a-zA-Z0-9]/g, '');
            for (let [index, value] of gO.inf[platform].log.entries()) {
                if (id == value.id) {
                    let tasksQtd = 0, tasksSec = 0, tasksQtdHitApp = 0, tasksSecHitApp = 0, tasksQtdHitAppLast = 0, tasksSecHitAppLast = 0, lastHour; let tasksQtdMon = 0, tasksSecMon = 0, hitApp = gO.inf[platform].token[value.token];
                    retLog = await log({ 'e': e, 'folder': `${pathLogPlataform}`, 'path': `SEND_${hitApp}.txt`, 'text': inf.body }); pathNew = value.path; pathNew = pathNew.substring(pathNew.lastIndexOf('/') + 1);
                    pathNew = value.path.replace(pathNew, `OK/${pathNew}`); await file({ 'e': e, 'action': 'change', 'path': value.path, 'pathNew': pathNew })
                    pathNew = retLog.res; pathNew = pathNew.substring(pathNew.lastIndexOf('/') + 1); pathNew = retLog.res.replace(pathNew, `OK/${pathNew}`);
                    await file({ 'e': e, 'action': 'change', 'path': retLog.res, 'pathNew': pathNew }); if (gO.inf[platform].token.path) {
                        pathNew = gO.inf[platform].token.path; pathNew = pathNew.substring(pathNew.lastIndexOf('/') + 1); pathNew = gO.inf[platform].token.path.replace(pathNew, `OK/${pathNew}`);
                        await file({ 'e': e, 'action': 'change', 'path': gO.inf[platform].token.path, 'pathNew': pathNew }); gO.inf[platform].token.path = false
                        pathNew = gO.inf[platform].token.pathLastTemplate; pathNew = pathNew.substring(pathNew.lastIndexOf('/') + 1); pathNew = gO.inf[platform].token.pathLastTemplate.replace(pathNew, `OK/${pathNew}`);
                        await file({ 'e': e, 'action': 'change', 'path': gO.inf[platform].token.pathLastTemplate, 'pathNew': pathNew }); gO.inf[platform].token.pathLastTemplate = false
                    }; retConfigStorage = await configStorage({ 'e': e, 'path': `./log/${pathLogPlataform}/${time1}/#_DIA_#.json`, 'functionLocal': false, 'action': 'get', 'key': `${platform}` });
                    if (!retConfigStorage.ret) { json = { 'inf': { 'reg': { 'tasksQtd': 0, 'tasksSec': 0, }, 'taskName': {} }, 'tasks': [] } }
                    else { json = retConfigStorage.res }; let dif = Number(time.tim) - value.tim; let blind = false; json.tasks.push({
                        'taskName': hitApp, 'tim': `${value.tim} | ${time.tim}`, 'hou': `${value.hou} | ${time.hou}:${time.min}:${time.sec}`,
                        'qtd': value.qtd, 'sec': dif, 'tasksHour': dateHour(dif).res, 'blind': blind, 'id': value.id, 'addGet': value.addGet
                    }); if (!other[hitApp]) { lastHour = other.default.lastHour } else { lastHour = other[hitApp].lastHour }; for (let [index, value] of json.tasks.entries()) {
                        tasksQtd += value.qtd; tasksSec += value.sec; if (value.taskName == hitApp) {
                            tasksQtdHitApp += value.qtd; tasksSecHitApp += value.sec; if (Number(time.tim) < Number(value.tim.split(' | ')[0]) + lastHour) { tasksQtdHitAppLast += value.qtd; tasksSecHitAppLast += value.sec }
                        }
                    }; json.inf.reg = { 'tasksQtd': tasksQtd, 'tasksSec': tasksSec, 'tasksHour': dateHour(tasksSec).res }
                    json.inf.taskName[hitApp] = { 'tasksQtd': tasksQtdHitApp, 'tasksSec': tasksSecHitApp, 'tasksHour': dateHour(tasksSecHitApp).res }
                    retConfigStorage = await configStorage({ 'e': e, 'path': `./log/${pathLogPlataform}/${time1}/#_DIA_#.json`, 'functionLocal': false, 'action': 'set', 'key': `${platform}`, 'value': json });
                    retConfigStorage = await configStorage({ 'e': e, 'path': `./log/${pathLogPlataform}/MES_${time.mon}_${time.monNam}/#_MES_#.json`, 'functionLocal': false, 'action': 'set', 'key': `DIA_${time.day}`, 'value': json.inf });
                    retConfigStorage = await configStorage({ 'e': e, 'path': `./log/${pathLogPlataform}/MES_${time.mon}_${time.monNam}/#_MES_#.json`, 'functionLocal': false, 'action': 'get', 'key': `*` });
                    for (let nameKey in retConfigStorage.res) { tasksQtdMon += retConfigStorage.res[nameKey].reg.tasksQtd; tasksSecMon += retConfigStorage.res[nameKey].reg.tasksSec }; let notText = [
                        `🟢 QTD: ${tasksQtdMon.toString().padStart(3, '0')}`, `TEMPO: ${dateHour(tasksSecMon).res}`, `🔵 QTD: ${tasksQtd.toString().padStart(3, '0')}`, `TEMPO: ${dateHour(tasksSec).res}`,
                        `🔵 QTD: ${tasksQtdHitApp.toString().padStart(3, '0')}`, `TEMPO: ${dateHour(tasksSecHitApp).res}`, `MÉDIO: ${dateHour((tasksSecHitAppLast / tasksQtdHitAppLast)).res.substring(3, 8)}`
                    ]; infNotification = {
                        'duration': 3, 'icon': './src/scripts/media/icon_4.png', 'title': `${platform} | ${hitApp} `, 'retInf': false,
                        'text': `${notText[0]} | ${notText[1]} \n${notText[2]} | ${notText[3]} \n${notText[4]} | ${notText[5]} | ${notText[6]}`
                    }; await notification(infNotification); gO.inf[platform].log.splice(index, 1);  // await csf([gO.inf]);
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
(eng ? window : global)['ewoq'] = ewoq;