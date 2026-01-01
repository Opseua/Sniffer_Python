let e = currentFile(new Error()), ee = e;
async function ewoq(inf = {}) {
    let ret = { 'ret': false, }; e = inf.e || e;
    try {
        let { platform = 'x', target, type, } = inf;

        let body; try { if (type === true) { body = JSON.parse(inf.body); } } catch { } let retConfigStorage, infNotification, retLog, pathNew, u = 'http://127.0.0.1:', functionLocal = false, retFile, retRegex;
        let { yea, mon, day, hou, min, sec, tim, monNam, } = dateHour().res; let time0 = `ANO_${yea}/MES_${mon}_${monNam}`, time1 = `${time0}/DIA_${day}`;
        let pathLogPlataform = `Plataformas/${platform}`, teste = '_teste', other = platforms[platform.replace(`${teste}`, '')];

        // CRIAR OBJETO DA PLATAFORMA (PARA EVITAR O ERRO AO ABRIR A TASK SEM PASSAR NA 'HOME')
        if (!gO.inf[platform]) { gO.inf[platform] = { 'log': [], 'token': {}, }; } async function runStopwatch(c) { if (!platform.includes(teste)) { for (let a of c) { await fetch(`${u}${portStopwatch}/${a}`); } } }

        /* [1] → INÍCIO */
        if (target === `/home`) {
            targetAlert(platform, target, type); runStopwatch([`reset_1`,]); gO.inf[platform]['log'] = [];
        }

        /* [2] → RECEBE A TASK */
        if (target === `/GetNewTasks`) {
            targetAlert(platform, target, type); if (body?.[0]) {
                let id = body[0][0][0][0].replace(/[^a-zA-Z0-9]/g, ''); retRegex = regex({ 'pattern': `["locale","(.*?)"]`, 'text': inf.body, }); let token = body[0][0][1][0].replace(/[^a-zA-Z0-9]/g, '');
                let addGet = { 'locale': retRegex?.res?.['1'], ...Object.fromEntries(Array.from({ 'length': (20 + 1), }, (_, i) => [i, !!body?.[0]?.[0]?.[i],])), };
                retLog = await log({ e, 'folder': `${pathLogPlataform}`, 'path': `GET_AINDA_NAO_IDENTIFICADO.txt`, 'text': body, }); gO.inf[platform].log.push({
                    'hitApp': token, 'tim': Number(tim), 'hou': `${hou}:${min}:${sec}`, 'qtd': 1, id, body, token, 'path': retLog.res, addGet,
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
            targetAlert(platform, target, type); if (body?.[0]) {
                let token = body?.[0].replace(/[^a-zA-Z0-9]/g, ''); gO.inf[platform].token['lastToken'] = token; gO.inf[platform].token[token] = false;
                retLog = await log({ e, 'folder': `${pathLogPlataform}`, 'path': `SEND_template_AINDA_NAO_IDENTIFICADO.txt`, 'text': body, }); gO.inf[platform]['lastTemplate'] = retLog.res;
            }
        }

        /* [4] → RECEBE O TEMPLATE */
        if (target === `/GetTemplate___[2-GET]___`) {
            targetAlert(platform, target, type); if (body?.[0]) {
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
                } notification({ 'duration': 2, 'icon': 'iconBlue', 'title': `${platform} | NOVA TASK`, 'text': `${other[hitApp] ? `${other[hitApp].not} ` : ''}${hitApp}`, 'ntfy': false, });
            }
        }

        /* [5] → TASK 100% CARREGADA */
        if (target === `/RecordTaskRenderingLatency___[TASK_100%_LOADED]___`) {
            targetAlert(platform, target, type); if (body?.[0]) {
                runStopwatch([`reset_1`, `toggle_1`,]); let id = body[1][0].replace(/[^a-zA-Z0-9]/g, ''); for (let [index, value,] of gO.inf[platform].log.entries()) {
                    if (id === value.id) {
                        body = value.body; gO.inf[platform].log[index]['tim'] = Number(tim); gO.inf[platform].log[index]['hou'] = `${hou}:${min}:${sec}`; // let hitApp = value.hitApp, text = '';

                        // // MANTER DESATIVADO ATÉ ENTENDER COMO PEGAR A RESPOSTA DA TASK!!!
                        // if (body['1'][0]['11'] && body['1'][0]['11']['1'][0]['4']) {
                        //     text = body['1'][0]['11']['1'][0]['4']; let infGoogleTranslate = { 'source': 'auto', 'target': 'pt', text, }, retGoogleTranslate = await googleTranslate(infGoogleTranslate);
                        //     if (retGoogleTranslate.ret) { text = `# PORTUGUÊS #\n${retGoogleTranslate.res}\n\n# INGLÊS #\n${text}`; } else { text = `# PORTUGUÊS #\nERRO AO TRADUZIR\n\n# INGLÊS #\n${text}`; }
                        //     notification({ 'duration': 4, 'icon': 'iconGreen', 'title': `${platform} | BLIND`, 'text': 'Tem a resposta!', 'ntfy': false, }); clipboard({ 'action': 'set', 'value': text, });
                        // } else if (hitApp === 'YouTubeVideoInappropriatenessEvaluation') {
                        //     // [YouTubeVideoInappropriatenessEvaluation]: PEGAR A DATA DE PUBLICAÇÃO DO VÍDEO
                        //     retRegex = regex({ 'pattern': 'embed/(.*?)?autoplay', 'text': JSON.stringify(body), }); retRegex = retRegex?.res?.['1'] ? retRegex.res['1'] : false;
                        //     if (!retRegex) { notification({ 'duration': 4, 'icon': 'iconGreen', 'title': `${platform} | YouTube`, 'text': 'ID não encontrado', 'ntfy': false, }); } else {
                        //         let infApi = { 'method': 'GET', 'url': `https://www.youtube.com/watch?v=${retRegex}`, 'headers': { 'accept-language': 'application/json', }, }, retApi = await api(infApi);
                        //         retRegex = regex({ 'pattern': 'uploadDate" content="(.*?)">', 'text': retApi?.res?.body || 'nada', }); retRegex = retRegex?.res?.['1'] ? retRegex.res['1'] : false;
                        //         if (!retRegex) { notification({ 'duration': 4, 'icon': 'iconGreen', 'title': `${platform} | YouTube`, 'text': 'Data não encontrada', 'ntfy': false, }); } else {
                        //             let uploadDate = new Date(retRegex); uploadDate = Math.trunc(uploadDate.getTime() / 1000); let retDateHour = Number(tim) - 1296000; // 15 DIAS ATRÁS
                        //             if (retDateHour > uploadDate) { notification({ 'duration': 4, 'icon': 'iconRed', 'title': `${platform} | YouTube`, 'text': retRegex, 'ntfy': false, }); }
                        //         }
                        //     }
                        // }

                    }
                }

            }
        }

        /* [6] → ENVIA A RESPOSTA DA TASK */
        if (target === `/SubmitFeedback`) {
            targetAlert(platform, target, type); if (body?.[5]?.[0]) {
                let json, id = body[5][0].replace(/[^a-zA-Z0-9]/g, ''); for (let [index, value,] of gO.inf[platform].log.entries()) {
                    if (id === value.id) {
                        let tasksQtd = 0, tasksSec = 0, tasksQtdHitApp = 0, tasksSecHitApp = 0, tasksQtdHitAppLast = 0, tasksSecHitAppLast = 0, lastHour, tasksQtdMon = 0, tasksSecMon = 0;
                        let hitApp = gO.inf[platform].token[value.token]; retLog = await log({ e, 'folder': `${pathLogPlataform}`, 'path': `SEND_${hitApp}.txt`, 'text': body, });
                        pathNew = value.path; pathNew = pathNew.substring(pathNew.lastIndexOf('/') + 1); pathNew = value.path.replace(pathNew, `OK/${pathNew}`);
                        await file({ e, 'action': 'change', 'path': value.path, pathNew, }); let pathJson = `./logs/${pathLogPlataform}`;
                        pathNew = retLog.res; pathNew = pathNew.substring(pathNew.lastIndexOf('/') + 1); pathNew = retLog.res.replace(pathNew, `OK/${pathNew}`); let pathJson2 = `${time0}/#_MES_#.json`;
                        await file({ e, 'action': 'change', 'path': retLog.res, pathNew, }); if (gO.inf[platform].token.path) {
                            pathNew = gO.inf[platform].token.path; pathNew = pathNew.substring(pathNew.lastIndexOf('/') + 1); pathNew = gO.inf[platform].token.path.replace(pathNew, `OK/${pathNew}`);
                            await file({ e, 'action': 'change', 'path': gO.inf[platform].token.path, pathNew, }); gO.inf[platform].token.path = false;
                            pathNew = gO.inf[platform].token.pathLastTemplate; pathNew = pathNew.substring(pathNew.lastIndexOf('/') + 1); pathNew = gO.inf[platform].token.pathLastTemplate.replace(pathNew, `OK/${pathNew}`);
                            await file({ e, 'action': 'change', 'path': gO.inf[platform].token.pathLastTemplate, pathNew, }); gO.inf[platform].token.pathLastTemplate = false;
                        } retConfigStorage = await configStorage({ e, 'path': `${pathJson}/${time1}/#_DIA_#.json`, 'action': 'get', 'key': `*`, functionLocal, });
                        if (!retConfigStorage.ret) { json = { 'inf': { 'reg': { 'tasksQtd': 0, 'tasksSec': 0, }, 'taskName': {}, }, 'tasks': [], }; }
                        else { json = retConfigStorage.res; } let dif = Number(tim) - value.tim, blind = false; json.tasks.push({
                            'taskName': hitApp, 'tim': `${value.tim} | ${tim}`, 'hou': `${value.hou} | ${hou}:${min}:${sec}`,
                            'qtd': value.qtd, 'sec': dif, 'tasksHour': dateHour(dif).res, blind, 'id': value.id, 'addGet': value.addGet,
                        }); if (!other[hitApp]) { lastHour = other.default.lastHour; } else { lastHour = other[hitApp].lastHour; } for (let [index, value,] of json.tasks.entries()) {
                            tasksQtd += value.qtd; tasksSec += value.sec; if (value.taskName === hitApp) {
                                tasksQtdHitApp += value.qtd; tasksSecHitApp += value.sec;
                                if (Number(tim) < Number(value.tim.split(' | ')[0]) + lastHour) { tasksQtdHitAppLast += value.qtd; tasksSecHitAppLast += value.sec; }
                            }
                        } json.inf.reg = { tasksQtd, tasksSec, 'tasksHour': dateHour(tasksSec).res, };
                        json.inf.taskName[hitApp] = { 'tasksQtd': tasksQtdHitApp, 'tasksSec': tasksSecHitApp, 'tasksHour': dateHour(tasksSecHitApp).res, };
                        retConfigStorage = await configStorage({ e, 'path': `${pathJson}/${time1}/#_DIA_#.json`, 'action': 'set', 'key': `*`, 'value': json, functionLocal, });
                        retConfigStorage = await configStorage({ e, 'path': `${pathJson}/${pathJson2}`, 'action': 'set', 'key': `DIA_${day}`, 'value': json.inf, 'returnValueAll': true, functionLocal, });
                        for (let nameKey in retConfigStorage.res) { tasksQtdMon += retConfigStorage.res[nameKey].reg.tasksQtd; tasksSecMon += retConfigStorage.res[nameKey].reg.tasksSec; } let notText = [
                            `🟢 QTD: ${tasksQtdMon.toString().padStart(3, '0')}`, `TEMPO: ${dateHour(tasksSecMon).res}`, `🔵 QTD: ${tasksQtd.toString().padStart(3, '0')}`, `TEMPO: ${dateHour(tasksSec).res}`,
                            `🔵 QTD: ${tasksQtdHitApp.toString().padStart(3, '0')}`, `TEMPO: ${dateHour(tasksSecHitApp).res}`, `MÉDIO: ${dateHour((tasksSecHitAppLast / tasksQtdHitAppLast)).res.substring(3, 8)}`,
                        ]; infNotification = {
                            'duration': 3, 'icon': 'iconClock', 'title': `${platform} | ${hitApp} `,
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

    return { ...({ 'ret': ret.ret, }), ...(ret.msg && { 'msg': ret.msg, }), ...(ret.hasOwnProperty('res') && { 'res': ret.res, }), };
}

// CHROME | NODE
globalThis['ewoq'] = ewoq;


