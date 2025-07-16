let e = currentFile(), ee = e;
async function ewoq(inf = {}) {
    let ret = { 'ret': false, }; e = inf && inf.e ? inf.e : e;
    try {
        let { platform = 'x', body, target, } = inf;

        try { body = JSON.parse(body); } catch (catchErr) { body = false; } let retConfigStorage, infNotification, retLog, pathNew, u = 'http://127.0.0.1:', functionLocal = false, retFile, retRegex;
        let time = dateHour().res, time1 = `MES_${time.mon}_${time.monNam}/DIA_${time.day}`, pathLogPlataform = `Plataformas/${platform}`, teste = '_teste', other = platforms[platform.replace(`${teste}`, '')];

        // CRIAR OBJETO DA PLATAFORMA (PARA EVITAR O ERRO AO ABRIR A TASK SEM PASSAR NA 'HOME')
        if (!gO.inf[platform]) { gO.inf[platform] = { 'log': [], 'token': {}, }; } async function runStopwatch(c) { if (!platform.includes(teste)) { for (let a of c) { await fetch(`${u}${portStopwatch}/${a}`); } } }

        /* [1] → INÍCIO */
        if (target === `/home`) {
            logConsole({ e, ee, 'txt': `#### ${platform} | ${target}`, }); runStopwatch([`reset_1`,]); gO.inf[platform]['log'] = [];
        }

        /* [2] → RECEBE A TASK */
        if (target === `/GetNewTasks`) {
            logConsole({ e, ee, 'txt': `#### ${platform} | ${target}`, }); if (body && body['1']) {
                let id = body['1'][0]['1']['1'].replace(/[^a-zA-Z0-9]/g, ''); retRegex = regex({ 'pattern': '":"locale","(.*?)"', 'text': inf.body, }); let addGet = {
                    'locale': retRegex.ret && retRegex.res['2'] ? retRegex.res['2'].split('":"')[1].split('"')[0] : false, '1': !!body['1'][0]['1'], '2': !!body['1'][0]['2'],
                    '3': !!body['1'][0]['3'], '4': !!body['1'][0]['4'], '5': !!body['1'][0]['5'], '6': !!body['1'][0]['6'], '7': !!body['1'][0]['7'], '8': !!body['1'][0]['8'],
                    '9': !!body['1'][0]['9'], '10': !!body['1'][0]['10'], '11': !!body['1'][0]['11'], '12': !!body['1'][0]['12'], '13': !!body['1'][0]['13'], '14': body['1'][0]['14'] ?? false,
                }; retLog = await log({ e, 'folder': `${pathLogPlataform}`, 'path': `GET_AINDA_NAO_IDENTIFICADO.txt`, 'text': body, }); gO.inf[platform].log.push({
                    'hitApp': body['1'][0]['2']['1'], 'tim': Number(time.tim), 'hou': `${time.hou}:${time.min}:${time.sec}`, 'qtd': 1, id, body, 'token': body['1'][0]['2']['1'], 'path': retLog.res, addGet,
                }); for (let [index, value,] of gO.inf[platform].log.entries()) {
                    if (gO.inf[platform].token.lastToken === value.hitApp) {
                        let hitApp = gO.inf[platform].token[gO.inf[platform].token.lastToken]; gO.inf[platform].log[index]['hitApp'] = hitApp; pathNew = gO.inf[platform].log[index].path;
                        retFile = await file({ e, 'action': 'change', 'path': pathNew, 'pathNew': pathNew.replace('AINDA_NAO_IDENTIFICADO', hitApp), }); gO.inf[platform].log[index].path = retFile.res;
                    }
                }
            }
        }

        /* [3] → SOLICITA O TEMPLATE */
        if (target === `/GetTemplate___[1-SEND]___`) {
            logConsole({ e, ee, 'txt': `#### ${platform} | ${target}`, }); if (body && body['1']) {
                let tk = body['1']; gO.inf[platform].token['lastToken'] = tk; gO.inf[platform].token[tk] = false;
                retLog = await log({ e, 'folder': `${pathLogPlataform}`, 'path': `SEND_template_AINDA_NAO_IDENTIFICADO.txt`, 'text': body, }); gO.inf[platform]['lastTemplate'] = retLog.res;
            }
        }

        /* [4] → RECEBE O TEMPLATE */
        if (target === `/GetTemplate___[2-GET]___`) {
            logConsole({ e, ee, 'txt': `#### ${platform} | ${target}`, }); if (body) {
                retRegex; retRegex = regex({ 'pattern': `raterVisibleName(*)inputTemplate`, 'text': inf.body, }); retRegex = regex({ 'pattern': `"(*)"`, 'text': retRegex.res['3'], });
                let hitApp = retRegex.res['3'].replace(/[^a-zA-Z0-9]/g, ''); gO.inf[platform].token[gO.inf[platform].token.lastToken] = hitApp;
                retLog = await log({ e, 'folder': `${pathLogPlataform}`, 'path': `GET_template_${hitApp}.txt`, 'text': body, }); gO.inf[platform].token['path'] = retLog.res; if (gO.inf[platform].lastTemplate) {
                    pathNew = gO.inf[platform].lastTemplate; retFile = await file({ e, 'action': 'change', 'path': pathNew, 'pathNew': pathNew.replace('AINDA_NAO_IDENTIFICADO', hitApp), });
                    gO.inf[platform].lastTemplate = false; gO.inf[platform].token['pathLastTemplate'] = retFile.res;
                } for (let [index, value,] of gO.inf[platform].log.entries()) {
                    if (gO.inf[platform].token.lastToken === value.hitApp) {
                        hitApp = gO.inf[platform].token[gO.inf[platform].token.lastToken]; gO.inf[platform].log[index]['hitApp'] = hitApp; pathNew = gO.inf[platform].log[index].path;
                        retFile = await file({ e, 'action': 'change', 'path': pathNew, 'pathNew': pathNew.replace('AINDA_NAO_IDENTIFICADO', hitApp), }); gO.inf[platform].log[index].path = retFile.res;
                    }
                } notification({ 'duration': 2, 'icon': 'notification_2.png', 'title': `${platform} | NOVA TASK`, 'text': `${other[hitApp] ? `${other[hitApp].not} ` : ''}${hitApp}`, 'ntfy': false, });
            }
        }

        /* [5] → TASK 100% CARREGADA */
        if (target === `/RecordTaskRenderingLatency___[TASK_100%_LOADED]___`) {
            logConsole({ e, ee, 'txt': `#### ${platform} | ${target}`, }); if (body && body['2']) {
                runStopwatch([`reset_1`, `toggle_1`,]); let id = body['2']['1'].replace(/[^a-zA-Z0-9]/g, ''); for (let [index, value,] of gO.inf[platform].log.entries()) {
                    if (id === value.id) {
                        let hitApp = value.hitApp; body = value.body; let text = ''; gO.inf[platform].log[index]['tim'] = Number(time.tim); gO.inf[platform].log[index]['hou'] = `${time.hou}:${time.min}:${time.sec}`;
                        if (body['1'][0]['11'] && body['1'][0]['11']['1'][0]['4']) {
                            text = body['1'][0]['11']['1'][0]['4']; let infGoogleTranslate = { 'source': 'auto', 'target': 'pt', text, }; let retGoogleTranslate = await googleTranslate(infGoogleTranslate);
                            if (retGoogleTranslate.ret) { text = `# PORTUGUÊS #\n${retGoogleTranslate.res}\n\n# INGLÊS #\n${text}`; } else { text = `# PORTUGUÊS #\nERRO AO TRADUZIR\n\n# INGLÊS #\n${text}`; }
                            notification({ 'duration': 4, 'icon': 'notification_1.png', 'title': `${platform} | BLIND`, 'text': 'Tem a resposta!', 'ntfy': false, }); clipboard({ 'value': text, });
                        } else if (hitApp === 'YouTubeVideoInappropriatenessEvaluation') {
                            // [YouTubeVideoInappropriatenessEvaluation]: PEGAR A DATA DE PUBLICAÇÃO DO VÍDEO
                            retRegex = regex({ 'pattern': 'embed/(.*?)?autoplay', 'text': JSON.stringify(body), }); retRegex = retRegex?.res?.['1'] ? retRegex.res['1'] : false;
                            if (!retRegex) { notification({ 'duration': 4, 'icon': 'notification_1.png', 'title': `${platform} | YouTube`, 'text': 'ID não encontrado', 'ntfy': false, }); } else {
                                let infApi = { 'method': 'GET', 'url': `https://www.youtube.com/watch?v=${retRegex}`, 'headers': { 'accept-language': 'application/json', }, }; let retApi = await api(infApi);
                                retRegex = regex({ 'pattern': 'uploadDate" content="(.*?)">', 'text': retApi?.res?.body || 'nada', }); retRegex = retRegex?.res?.['1'] ? retRegex.res['1'] : false;
                                if (!retRegex) { notification({ 'duration': 4, 'icon': 'notification_1.png', 'title': `${platform} | YouTube`, 'text': 'Data não encontrada', 'ntfy': false, }); } else {
                                    let uploadDate = new Date(retRegex); uploadDate = Math.floor(uploadDate.getTime() / 1000); let retDateHour = Number(time.tim) - 1296000; // 15 DIAS ATRÁS
                                    if (retDateHour > uploadDate) { notification({ 'duration': 4, 'icon': 'notification_3.png', 'title': `${platform} | YouTube`, 'text': retRegex, 'ntfy': false, }); }
                                }
                            }
                        } text = `${body['1'][0]['10']['1'][0]['2']}\n\n${text}`; clipboard({ 'value': text, });
                    }
                }

            }
        }

        /* [6] → ENVIA A RESPOSTA DA TASK */
        if (target === `/SubmitFeedback`) {
            logConsole({ e, ee, 'txt': `#### ${platform} | ${target}`, }); if (body && body['6']) {
                let json; let id = body['6']['1'].replace(/[^a-zA-Z0-9]/g, ''); for (let [index, value,] of gO.inf[platform].log.entries()) {
                    if (id === value.id) {
                        let tasksQtd = 0, tasksSec = 0, tasksQtdHitApp = 0, tasksSecHitApp = 0, tasksQtdHitAppLast = 0, tasksSecHitAppLast = 0, lastHour; let tasksQtdMon = 0, tasksSecMon = 0;
                        let hitApp = gO.inf[platform].token[value.token]; retLog = await log({ e, 'folder': `${pathLogPlataform}`, 'path': `SEND_${hitApp}.txt`, 'text': body, });
                        pathNew = value.path; pathNew = pathNew.substring(pathNew.lastIndexOf('/') + 1); pathNew = value.path.replace(pathNew, `OK/${pathNew}`);
                        await file({ e, 'action': 'change', 'path': value.path, pathNew, }); let pathJson = `./logs/${pathLogPlataform}`;
                        pathNew = retLog.res; pathNew = pathNew.substring(pathNew.lastIndexOf('/') + 1); pathNew = retLog.res.replace(pathNew, `OK/${pathNew}`); let pathJson2 = `MES_${time.mon}_${time.monNam}/#_MES_#.json`;
                        await file({ e, 'action': 'change', 'path': retLog.res, pathNew, }); if (gO.inf[platform].token.path) {
                            pathNew = gO.inf[platform].token.path; pathNew = pathNew.substring(pathNew.lastIndexOf('/') + 1); pathNew = gO.inf[platform].token.path.replace(pathNew, `OK/${pathNew}`);
                            await file({ e, 'action': 'change', 'path': gO.inf[platform].token.path, pathNew, }); gO.inf[platform].token.path = false;
                            pathNew = gO.inf[platform].token.pathLastTemplate; pathNew = pathNew.substring(pathNew.lastIndexOf('/') + 1); pathNew = gO.inf[platform].token.pathLastTemplate.replace(pathNew, `OK/${pathNew}`);
                            await file({ e, 'action': 'change', 'path': gO.inf[platform].token.pathLastTemplate, pathNew, }); gO.inf[platform].token.pathLastTemplate = false;
                        } retConfigStorage = await configStorage({ e, 'path': `${pathJson}/${time1}/#_DIA_#.json`, 'action': 'get', 'key': `*`, functionLocal, });
                        if (!retConfigStorage.ret) { json = { 'inf': { 'reg': { 'tasksQtd': 0, 'tasksSec': 0, }, 'taskName': {}, }, 'tasks': [], }; }
                        else { json = retConfigStorage.res; } let dif = Number(time.tim) - value.tim; let blind = false; json.tasks.push({
                            'taskName': hitApp, 'tim': `${value.tim} | ${time.tim}`, 'hou': `${value.hou} | ${time.hou}:${time.min}:${time.sec}`,
                            'qtd': value.qtd, 'sec': dif, 'tasksHour': dateHour(dif).res, blind, 'id': value.id, 'addGet': value.addGet,
                        }); if (!other[hitApp]) { lastHour = other.default.lastHour; } else { lastHour = other[hitApp].lastHour; } for (let [index, value,] of json.tasks.entries()) {
                            tasksQtd += value.qtd; tasksSec += value.sec; if (value.taskName === hitApp) {
                                tasksQtdHitApp += value.qtd; tasksSecHitApp += value.sec;
                                if (Number(time.tim) < Number(value.tim.split(' | ')[0]) + lastHour) { tasksQtdHitAppLast += value.qtd; tasksSecHitAppLast += value.sec; }
                            }
                        } json.inf.reg = { tasksQtd, tasksSec, 'tasksHour': dateHour(tasksSec).res, };
                        json.inf.taskName[hitApp] = { 'tasksQtd': tasksQtdHitApp, 'tasksSec': tasksSecHitApp, 'tasksHour': dateHour(tasksSecHitApp).res, };
                        retConfigStorage = await configStorage({ e, 'path': `${pathJson}/${time1}/#_DIA_#.json`, 'action': 'set', 'key': `*`, 'value': json, functionLocal, });
                        retConfigStorage = await configStorage({ e, 'path': `${pathJson}/${pathJson2}`, 'action': 'set', 'key': `DIA_${time.day}`, 'value': json.inf, 'returnValueAll': true, functionLocal, });
                        for (let nameKey in retConfigStorage.res) { tasksQtdMon += retConfigStorage.res[nameKey].reg.tasksQtd; tasksSecMon += retConfigStorage.res[nameKey].reg.tasksSec; } let notText = [
                            `🟢 QTD: ${tasksQtdMon.toString().padStart(3, '0')}`, `TEMPO: ${dateHour(tasksSecMon).res}`, `🔵 QTD: ${tasksQtd.toString().padStart(3, '0')}`, `TEMPO: ${dateHour(tasksSec).res}`,
                            `🔵 QTD: ${tasksQtdHitApp.toString().padStart(3, '0')}`, `TEMPO: ${dateHour(tasksSecHitApp).res}`, `MÉDIO: ${dateHour((tasksSecHitAppLast / tasksQtdHitAppLast)).res.substring(3, 8)}`,
                        ]; infNotification = {
                            'duration': 3, 'icon': 'icon_4.png', 'title': `${platform} | ${hitApp} `,
                            'text': `${notText[0]} | ${notText[1]} \n${notText[2]} | ${notText[3]} \n${notText[4]} | ${notText[5]} | ${notText[6]}`, 'ntfy': false,
                        }; notification(infNotification); gO.inf[platform].log.splice(index, 1);
                    }
                }
            }
        }

        ret['msg'] = `${platform}: OK`;
        ret['ret'] = true;

    } catch (catchErr) {
        let retRegexE = await regexE({ inf, 'e': catchErr, }); ret['msg'] = retRegexE.res; ret['ret'] = false; delete ret['res'];
    }

    return { ...({ 'ret': ret.ret, }), ...(ret.msg && { 'msg': ret.msg, }), ...(ret.res && { 'res': ret.res, }), };
}

// CHROME | NODE
globalThis['ewoq'] = ewoq;


