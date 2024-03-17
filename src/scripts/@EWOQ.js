// let infEwoq, retEwoq
// infEwoq = { 'e': e, 'platform': platform, 'url': `${platform}/home`, 'body': inf.body }
// retEwoq = await ewoq(infEwoq)
// console.log(retEwoq)

let e = import.meta.url;
async function ewoq(inf) {
    let ret = { 'ret': false }; e = inf && inf.e ? inf.e : e; // gO.inf[platform].log = { 'a': '4' }; await csf([gO.inf]) // SET
    try {
        let platform = inf.platform ? inf.platform : 'Teste'
        let infConfigStorage, retConfigStorage, infFile, retFile, infNotification, retNotification, retLog
        let time = dateHour().res, time1 = `MES_${time.mon}_${time.monNam}/DIA_${time.day}`, time2 = `${time.hou}.${time.min}.${time.sec}.${time.mil}`
        let other = { 'default': { 'lastHour': 1200 } }

        // #### EWOQ | /home
        if ((inf.url == `${platform}/home`)) {
            console.log(`#### ${platform} | /home`)
            gO.inf[platform] = {};
            gO.inf[platform]['log'] = [];
            gO.inf[platform]['token'] = {}
            await csf([gO.inf]);
            await commandLine({ 'command': `"${letter}:/ARQUIVOS/WINDOWS/BAT/ESCREVER_e_ou_TECLA.vbs" "[SHIFT+F1]"` })
        }

        // #### EWOQ | /GetTemplate_[1-SEND]
        if ((inf.url == `${platform}/GetTemplate_[1-SEND]`)) {
            console.log(`#### ${platform} | /GetTemplate_[1-SEND]`)
            let tk = JSON.parse(inf.body)['1'];
            gO.inf[platform].token['lastToken'] = tk;
            gO.inf[platform].token[tk] = false
        }

        // #### EWOQ | /GetTemplate_[2-GET]
        if ((inf.url == `${platform}/GetTemplate_[2-GET]`)) {
            console.log(`#### ${platform} | /GetTemplate_[2-GET]`)
            let hitApp = inf.body.match(/raterVisibleName\\u003d\\"(.*?)\\\"\/\\u003e\\n  \\u003cinputTemplate/);
            if (hitApp.length > 0) {
                hitApp = hitApp[1].replace(/[^a-zA-Z0-9]/g, '');
                gO.inf[platform].token[gO.inf[platform].token.lastToken] = hitApp;
                retLog = await log({ 'e': e, 'folder': `${platform}`, 'path': `GET_template_${hitApp}.txt`, 'text': inf.body });
                gO.inf[platform].token['path'] = retLog.res;
                for (let [index, value] of gO.inf[platform].log.entries()) {
                    if (gO.inf[platform].token.lastToken == value.hitApp) {
                        hitApp = gO.inf[platform].token[gO.inf[platform].token.lastToken];
                        gO.inf[platform].log[index]['hitApp'] = hitApp
                        retLog = await log({ 'e': e, 'folder': `${platform}`, 'path': `GET_${hitApp}.txt`, 'text': value.body });
                        gO.inf[platform].log[index]['path'] = retLog.res
                    }
                }
                let textNot = {
                    'b': [
                        'YouTubeVideoInappropriatenessEvaluation', 'YouTubeAdRelevanceEvaluation', 'SearchExperiencetoProductUsefulness',
                        'GLSJobtypeTestTemplate', 'CQPremiumTask', 'UserInterestEvaluation', 'CQPremiumTask', 'AdTargetingEvaluation',
                        'KeywordQueryRelevanceEvaluation',
                    ],
                    'r': ['SearchExperiencetoAdUsefulness', 'SearchExperiencetoAdUsefulnessLandingPageOnly',]
                }
                if (textNot.b.includes(hitApp)) {
                    textNot = '[B] '
                } else if (textNot.r.includes(hitApp)) {
                    textNot = '[R] '
                } else {
                    textNot = ''
                }
                infNotification = { 'duration': 3, 'icon': './src/scripts/media/notification_2.png', 'title': `${platform} | NOVA TASK`, 'text': `${textNot}${hitApp}`, 'retInf': false }
                retNotification = await notification(infNotification);
            }
            // await csf([gO.inf]);
        }

        // #### EWOQ | /GetNewTasks
        if ((inf.url == `${platform}/GetNewTasks`)) {
            console.log(`#### ${platform} | /GetNewTasks`)
            let body = JSON.parse(inf.body);
            if (body['1']) {
                let id = body['1'][0]['1']['1'].replace(/[^a-zA-Z0-9]/g, '');
                let retRegex = regex({ 'pattern': '":"locale","(.*?)"', 'text': inf.body })
                let addGet = {
                    'locale': retRegex.ret && retRegex.res['2'] ? retRegex.res['2'].split('":"')[1].split('"')[0] : false,
                    '1': body['1'][0]['1'] ? true : false, '2': body['1'][0]['2'] ? true : false, '3': body['1'][0]['3'] ? true : false,
                    '4': body['1'][0]['4'] ? true : false, '5': body['1'][0]['5'] ? true : false, '6': body['1'][0]['6'] ? true : false,
                    '7': body['1'][0]['7'] ? true : false, '8': body['1'][0]['8'] ? true : false, '9': body['1'][0]['9'] ? true : false,
                    '10': body['1'][0]['10'] ? true : false, '11': body['1'][0]['11'] ? true : false, '12': body['1'][0]['12'] ? true : false,
                    '13': body['1'][0]['13'] ? true : false, '14': body['1'][0]['14'] ? body['1'][0]['14'] : false,
                }
                gO.inf[platform].log.push({
                    'hitApp': body['1'][0]['2']['1'], 'tim': Number(time.tim), 'hou': `${time.hou}:${time.min}:${time.sec}`,
                    'qtd': 1, 'id': id, 'body': inf.body, 'token': body['1'][0]['2']['1'],
                    'addGet': addGet
                });
                for (let [index, value] of gO.inf[platform].log.entries()) {
                    if (gO.inf[platform].token.lastToken == value.hitApp) {
                        let hitApp = gO.inf[platform].token[gO.inf[platform].token.lastToken];
                        gO.inf[platform].log[index]['hitApp'] = hitApp
                        retLog = await log({ 'e': e, 'folder': `${platform}`, 'path': `GET_${hitApp}.txt`, 'text': value.body });
                        gO.inf[platform].log[index]['path'] = retLog.res
                    }
                }
            }
            // await csf([gO.inf]);
        }

        // #### EWOQ | /RecordTaskRenderingLatency [task 100% loaded] 
        if ((inf.url == `${platform}/RecordTaskRenderingLatency`)) {
            console.log(`#### ${platform} | /RecordTaskRenderingLatency [task 100% loaded]`)
            let id = JSON.parse(inf.body)['2']['1'].replace(/[^a-zA-Z0-9]/g, '')
            await commandLine({ 'command': `"${letter}:/ARQUIVOS/WINDOWS/BAT/ESCREVER_e_ou_TECLA.vbs" "[SHIFT+F1][SHIFT+F2]"` })
            for (let [index, value] of gO.inf[platform].log.entries()) {
                if (id == value.id) {
                    let body = JSON.parse(value.body), text
                    gO.inf[platform].log[index]['tim'] = Number(time.tim)
                    gO.inf[platform].log[index]['hou'] = `${time.hou}:${time.min}:${time.sec}`
                    if (body['1'][0]['11'] && body['1'][0]['11']['1'][0]['4']) {
                        text = body['1'][0]['11']['1'][0]['4']
                        let infTranslate = { 'source': 'auto', 'target': 'pt', 'text': text };
                        let retTranslate = await translate(infTranslate);
                        if (retTranslate.ret) {
                            text = `# PORTUGUÊS #\n${retTranslate.res}\n\n# INGLÊS #\n${text}`
                        } else {
                            text = `# PORTUGUÊS #\nERRO AO TRADUZIR\n\n# INGLÊS #\n${text}`
                        }
                        infNotification = {
                            'duration': 5, 'icon': './src/scripts/media/notification_1.png',
                            'title': `${platform} | TEM A RESPOSTA!`, 'text': text, 'retInf': false
                        };
                        retNotification = await notification(infNotification);
                    } else {
                        text = body['1'][0]['10']['1'][0]['2']
                        infNotification = {
                            'duration': 3, 'icon': './src/scripts/media/notification_2.png',
                            'title': `${platform} | `, 'text': text
                        };
                        // retNotification = await notification(infNotification);
                        if (value.hitApp == 'YouTubeVideoInappropriatenessEvaluation') {
                            let rg = regex({ 'pattern': 'embed/(.*?)?autoplay', 'text': value.body });
                            rg = rg.res['1'] ? rg.res['1'] : false
                            if (!rg) {
                                infNotification = {
                                    'duration': 3, 'icon': './src/scripts/media/notification_1.png',
                                    'title': `${platform} | YouTube`, 'text': 'ID não encontrado', 'retInf': false
                                };
                                retNotification = await notification(infNotification);
                            } else {
                                let infApi = { // ########## TYPE → json
                                    'method': 'GET', 'url': `https://www.youtube.com/watch?v=${rg}`,
                                    'headers': { 'accept-language': 'application/json' }, 'body': {}
                                };
                                let retApi = await api(infApi);
                                rg = regex({ 'pattern': 'uploadDate" content="(.*?)">', 'text': retApi.res.body });
                                rg = rg.res['1'] ? rg.res['1'] : false
                                if (!rg) {
                                    infNotification = {
                                        'duration': 3, 'icon': './src/scripts/media/notification_1.png',
                                        'title': `${platform} | YouTube`, 'text': 'Data não encontrada', 'retInf': false
                                    };
                                    retNotification = await notification(infNotification);
                                } else {
                                    let uploadDate = new Date(rg);
                                    uploadDate = Math.floor(uploadDate.getTime() / 1000);
                                    let retDateHour = Number(time.tim) - 1296000 // 15 DIAS ATRÁS
                                    if (retDateHour > uploadDate) {
                                        infNotification = {
                                            'duration': 3, 'icon': './src/scripts/media/notification_3.png',
                                            'title': `${platform} | YouTube`, 'text': rg, 'retInf': false
                                        };
                                        retNotification = await notification(infNotification);
                                    }
                                }
                            }
                        }
                    };
                    await clipboard({ 'value': text });
                    // await csf([gO.inf]);
                }
            }
        }

        // #### EWOQ | /SubmitFeedback
        if ((inf.url == `${platform}/SubmitFeedback`)) {
            console.log(`#### ${platform} | /SubmitFeedback`)
            let json, body = JSON.parse(inf.body);
            let id = body['6']['1'].replace(/[^a-zA-Z0-9]/g, '');
            for (let [index, value] of gO.inf[platform].log.entries()) {
                if (id == value.id) {
                    let tasksQtd = 0, tasksSec = 0, tasksQtdHitApp = 0, tasksSecHitApp = 0, tasksQtdHitAppLast = 0, tasksSecHitAppLast = 0, lastHour
                    let tasksQtdMon = 0, tasksSecMon = 0, hitApp = gO.inf[platform].token[value.token];
                    retLog = await log({ 'e': e, 'folder': `${platform}`, 'path': `SEND_${hitApp}.txt`, 'text': inf.body })
                    retFile = await file({ 'e': e, 'action': 'change', 'path': value.path, 'pathNew': value.path.replace(`DIA_${time.day}/`, `DIA_${time.day}/OK/`) })
                    retFile = await file({ 'e': e, 'action': 'change', 'path': retLog.res, 'pathNew': retLog.res.replace(`DIA_${time.day}/`, `DIA_${time.day}/OK/`) })
                    if (gO.inf[platform].token.path) {
                        retFile = await file({
                            'action': 'change', 'path': gO.inf[platform].token.path,
                            'pathNew': gO.inf[platform].token.path.replace(`DIA_${time.day}/`, `DIA_${time.day}/OK/`)
                        });
                        gO.inf[platform].token.path = false
                    };
                    infConfigStorage = { 'e': e, 'path': `./log/${platform}/${time1}/#_DIA_#.json`, 'functionLocal': false, 'action': 'get', 'key': `${platform}` }
                    retConfigStorage = await configStorage(infConfigStorage);
                    if (!retConfigStorage.ret) {
                        json = { 'inf': { 'reg': { 'tasksQtd': 0, 'tasksSec': 0, }, 'taskName': {} }, 'tasks': [] }
                    } else {
                        json = retConfigStorage.res
                    };
                    let dif = Number(time.tim) - value.tim
                    let blind = false;
                    json.tasks.push({
                        'taskName': hitApp, 'tim': `${value.tim} | ${time.tim}`, 'hou': `${value.hou} | ${time.hou}:${time.min}:${time.sec}`,
                        'qtd': value.qtd, 'sec': dif, 'blind': blind, 'id': value.id,
                        'addGet': value.addGet
                    });
                    if (!other[hitApp]) {
                        lastHour = other.default.lastHour
                    } else {
                        lastHour = other[hitApp].lastHour
                    }
                    for (let [index, value] of json.tasks.entries()) {
                        tasksQtd += value.qtd; tasksSec += value.sec;
                        if (value.taskName == hitApp) {
                            tasksQtdHitApp += value.qtd; tasksSecHitApp += value.sec
                            if (Number(time.tim) < Number(value.tim.split(' | ')[0]) + lastHour) {
                                tasksQtdHitAppLast += value.qtd; tasksSecHitAppLast += value.sec
                            }
                        }
                    }
                    json.inf.reg = { 'tasksQtd': tasksQtd, 'tasksSec': tasksSec, 'tasksHour': secToHour(tasksSec).res }
                    json.inf.taskName[hitApp] = { 'tasksQtd': tasksQtdHitApp, 'tasksSec': tasksSecHitApp, 'tasksHour': secToHour(tasksSecHitApp).res }
                    infConfigStorage = { 'e': e, 'path': `./log/${platform}/${time1}/#_DIA_#.json`, 'functionLocal': false, 'action': 'set', 'key': `${platform}`, 'value': json }
                    retConfigStorage = await configStorage(infConfigStorage);
                    infConfigStorage = {
                        'e': e, 'path': `./log/${platform}/MES_${time.mon}_${time.monNam}/#_MES_#.json`, 'functionLocal': false, 'action': 'set',
                        'key': `DIA_${time.day}`, 'value': json.inf
                    }
                    retConfigStorage = await configStorage(infConfigStorage);
                    infConfigStorage = { 'e': e, 'path': `./log/${platform}/MES_${time.mon}_${time.monNam}/#_MES_#.json`, 'functionLocal': false, 'action': 'get', 'key': `*` }
                    retConfigStorage = await configStorage(infConfigStorage);
                    for (let nameKey in retConfigStorage.res) {
                        tasksQtdMon += retConfigStorage.res[nameKey].reg.tasksQtd; tasksSecMon += retConfigStorage.res[nameKey].reg.tasksSec
                    }
                    let notText = [
                        `🟢 QTD: ${tasksQtdMon.toString().padStart(4, '0')}`,
                        `TEMPO: ${secToHour(tasksSecMon).res}`,
                        `🔵 QTD: ${tasksQtd.toString().padStart(4, '0')}`,
                        `TEMPO: ${secToHour(tasksSec).res}`,
                        `🔵 QTD: ${tasksQtdHitApp.toString().padStart(4, '0')}`,
                        `TEMPO: ${secToHour(tasksSecHitApp).res}`,
                        `MÉDIO: ${secToHour((tasksSecHitAppLast / tasksQtdHitAppLast).toFixed(0)).res.substring(3, 8)}`
                    ]
                    infNotification = {
                        'duration': 3, 'icon': './src/scripts/media/icon_4.png', 'title': `${platform} | ${hitApp} `, 'retInf': false,
                        'text': `${notText[0]} | ${notText[1]} \n${notText[2]} | ${notText[3]} \n${notText[4]} | ${notText[5]} | ${notText[6]}`
                    };
                    retNotification = await notification(infNotification);
                    gO.inf[platform].log.splice(index, 1);
                    // await csf([gO.inf]);
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
    } catch (err) {
        let retRegexE = await regexE({ 'inf': inf, 'e': err, 'catchGlobal': false });
        ret['msg'] = retRegexE.res
    };
    return {
        ...({ ret: ret.ret }),
        ...(ret.msg && { msg: ret.msg }),
        ...(ret.res && { res: ret.res }),
    };
}

if (eng) { // CHROME
    window['ewoq'] = ewoq;
} else { // NODEJS
    global['ewoq'] = ewoq;
}