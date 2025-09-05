let e = currentFile(new Error()), ee = e; let nd = 'NaoIdentificado', hitApp = nd;
async function scilliance(inf = {}) {
    let ret = { 'ret': false, }; e = inf.e || e;
    try {
        let { platform = 'x', target, type, } = inf;

        let body; try { if (type === true) { body = JSON.parse(inf.body); } } catch { } let retConfigStorage, infNotification, retLog, pathNew, u = 'http://127.0.0.1:', functionLocal = false;
        let time = dateHour().res, time1 = `MES_${time.mon}_${time.monNam}/DIA_${time.day}`, pathLogPlataform = `Plataformas/${platform}`, teste = '_teste', other = platforms[platform.replace(`${teste}`, '')];

        // CRIAR OBJETO DA PLATAFORMA (PARA EVITAR O ERRO AO ABRIR A TASK SEM PASSAR NA 'HOME')
        if (!gO.inf[platform]) { gO.inf[platform] = { 'log': [], }; } async function runStopwatch(c) { if (!platform.includes(teste)) { for (let a of c) { await fetch(`${u}${portStopwatch}/${a}`); } } }

        /* [1] → INÍCIO (RECEBE O TEMPLATE) */
        if (target === `/ds/config`) {
            targetAlert(platform, target, type); if (hitApp !== nd) { gO.inf[platform]['log'] = []; } if (body && body.instructions) {
                hitApp = body.instructions.title.replace(/[^a-zA-Z0-9]/g, ''); retLog = await log({ e, 'folder': `${pathLogPlataform}`, 'path': `GET_template_${hitApp}.txt`, 'text': body, });
                gO.inf[platform]['lastTemplate'] = retLog.res;
            }
        }

        /* [2] → RECEBE A TASK */
        if (target === `/ds/items`) {
            targetAlert(platform, target, type); if (body && body.assets) {

                runStopwatch([`reset_1`, `toggle_1`,]); let judgeId = body.assets.requests[0].payload.interactionId; retLog = await log({ e, 'folder': `${pathLogPlataform}`, 'path': `GET_${hitApp}.txt`, 'text': body, });
                let tasksBlind = 0, tasksQtd = 1, audioSourceUrl = body.assets.requests[0].payload.audioSourceUrl, addGet = {
                    'usageLogDate': body.assets.requests[0].usageLogDate, 'localeId': body.assets.requests[0].localeId, 'gradable': body.assets.requests[0].gradable,
                    'duration_ms': body.assets.requests[0].payload.duration_ms, 'isASRTrainFlag': body.assets.requests[0].payload.isASRTrainFlag, audioSourceUrl,
                }; gO.inf[platform].log.push({ hitApp, 'tim': Number(time.tim), 'hou': `${time.hou}:${time.min}:${time.sec}`, tasksQtd, tasksBlind, judgeId, 'judgesQtd': 1, addGet, body, 'path': retLog.res, });
            }
        }

        /* [3] → RECEBE O ÁUDIO */
        if (target === `/soundwave`) {
            targetAlert(platform, target, type); if (inf.body) {
                let d = time.day, h = time.hou, m = time.min, s = time.sec, ml = time.mil, mn = time.mon, mm = time.monNam;
                let path = `!fileProjetos!/Sniffer_Python/logs/${pathLogPlataform}/MES_${mn}_${mm}/DIA_${d}/${`${h}.${m}.${s}.${ml}_GET_audio_${hitApp}.wav`}`; gO.inf[platform]['lastAudio'] = path;
                // SALVAR | TRANSCREVER | NOTIFICAÇÃO | ÁREA DE TRANSFERÊNCIA
                await file({ e, 'action': 'write', 'path': `${path}`, 'content': inf.body, 'encoding': false, }); let retAudioTranscribe = await audioTranscribe({ e, 'path': `${path}`, });
                notification({ e, 'title': `ÁREA DE TRANSFERÊNCIA`, 'text': `${retAudioTranscribe.msg}`, 'keepOld': true, 'ntfy': false, 'duration': 2, });
                clipboard({ e, 'action': 'set', 'value': `${retAudioTranscribe.ret ? retAudioTranscribe.res : retAudioTranscribe.msg}`, });
            }
        }

        /* [4] → ENVIA A RESPOSTA DA TASK */
        if (target === `/results`) {
            targetAlert(platform, target, type); runStopwatch([`reset_1`,]); if (body && body.assets) {

                let json, tasksQtd = 0, judgesQtd = 0, judgesSec = 0, tasksBlinds = 0, tasksQtdHitApp = 0, judgesQtdHitApp = 0, judgesSecHitApp = 0, tasksBlindsHitApp = 0, judgesQtdHitAppLast = 0;
                let judgesSecHitAppLast = 0, lastHour, judgesQtdMon = 0, judgesSecMon = 0, judgeId = body.assets.requests[0].payload.interactionId;
                let pathJson = `./logs/${pathLogPlataform}`; retLog = await log({ e, 'folder': `${pathLogPlataform}`, 'path': `SEND_${hitApp}.txt`, 'text': body, }); pathNew = retLog.res;
                pathNew = pathNew.substring(pathNew.lastIndexOf('/') + 1); pathNew = retLog.res.replace(pathNew, `OK/${pathNew}`); await file({ e, 'action': 'change', 'path': retLog.res, pathNew, });

                // TEMPLATE
                if (gO.inf[platform].lastTemplate) {
                    pathNew = gO.inf[platform].lastTemplate; pathNew = pathNew.substring(pathNew.lastIndexOf('/') + 1); pathNew = gO.inf[platform].lastTemplate.replace(pathNew, `OK/${pathNew}`);
                    await file({ e, 'action': 'change', 'path': gO.inf[platform].lastTemplate, pathNew, }); gO.inf[platform].lastTemplate = false;
                }

                // AUDIO
                if (gO.inf[platform].lastAudio) {
                    pathNew = gO.inf[platform].lastAudio; pathNew = pathNew.substring(pathNew.lastIndexOf('/') + 1); pathNew = gO.inf[platform].lastAudio.replace(pathNew, `OK/${pathNew}`);
                    await file({ e, action: 'change', 'path': gO.inf[platform].lastAudio, pathNew, });
                }

                for (let [index, value,] of gO.inf[platform].log.entries()) {
                    if (judgeId === value.judgeId) {
                        // TASK
                        pathNew = value.path; pathNew = pathNew.substring(pathNew.lastIndexOf('/') + 1); let pathJson2 = `MES_${time.mon}_${time.monNam}/#_MES_#.json`;
                        pathNew = value.path.replace(pathNew, `OK/${pathNew}`); await file({ e, 'action': 'change', 'path': value.path, 'pathNew': pathNew.replace(nd, hitApp), });
                        retConfigStorage = await configStorage({ e, 'path': `${pathJson}/${time1}/#_DIA_#.json`, 'action': 'get', 'key': `*`, functionLocal, });
                        if (!retConfigStorage.ret) { json = { 'inf': { 'reg': { 'tasksQtd': 0, 'tasksBlinds': 0, 'judgesQtd': 0, 'judgesSec': 0, }, 'hitApp': {}, }, 'judges': [], }; } else { json = retConfigStorage.res; }
                        let dif = Number(time.tim) - value.tim; json.judges.push({
                            hitApp, 'tim': `${value.tim} | ${time.tim}`, 'hou': `${value.hou} | ${time.hou}:${time.min}:${time.sec}`, 'tasksQtd': value.tasksQtd, 'tasksBlind': value.tasksBlind,
                            'judgesSec': dif, 'judgesHour': dateHour(dif).res, 'judgeId': value.judgeId, 'judgesQtd': value.judgesQtd, 'tasksType': value.tasksType, 'addGet': value.addGet,
                        }); if (!other[hitApp]) { lastHour = other.default.lastHour; } else { lastHour = other[hitApp].lastHour; } for (let [index, value,] of json.judges.entries()) {
                            tasksQtd += value.tasksQtd; judgesQtd += value.judgesQtd; judgesSec += value.judgesSec; tasksBlinds += value.tasksBlind; if (value.hitApp === hitApp) {
                                tasksQtdHitApp += value.tasksQtd; judgesQtdHitApp += value.judgesQtd; judgesSecHitApp += value.judgesSec; tasksBlindsHitApp += value.tasksBlind;
                                if (Number(time.tim) < Number(value.tim.split(' | ')[0]) + lastHour) { judgesQtdHitAppLast += value.judgesQtd; judgesSecHitAppLast += value.judgesSec; }
                            }
                        } json.inf.reg = { tasksQtd, tasksBlinds, judgesQtd, judgesSec, 'judgesHour': dateHour(judgesSec).res, };
                        json.inf.hitApp[hitApp] = { 'tasksQtd': tasksQtdHitApp, 'tasksBlinds': tasksBlindsHitApp, 'judgesQtd': judgesQtdHitApp, 'judgesSec': judgesSecHitApp, 'tasksHour': dateHour(judgesSecHitApp).res, };
                        retConfigStorage = await configStorage({ e, 'path': `${pathJson}/${time1}/#_DIA_#.json`, 'action': 'set', 'key': `*`, 'value': json, functionLocal, });
                        retConfigStorage = await configStorage({ e, 'path': `${pathJson}/${pathJson2}`, 'action': 'set', 'key': `DIA_${time.day}`, 'value': json.inf, 'returnValueAll': true, functionLocal, });
                        for (let nameKey in retConfigStorage.res) { judgesQtdMon += retConfigStorage.res[nameKey].reg.judgesQtd; judgesSecMon += retConfigStorage.res[nameKey].reg.judgesSec; }

                        // FILTRAR APENAS REGISTRO DA SEMANA ATUAL
                        function firstDayWeek(inf = {}) {
                            let { date, } = inf; let d = new Date(date), dW = d.getDay(), dif = dW, f = new Date(d); f.setDate(d.getDate() - dif); let day = String(f.getDate()).padStart(2, '0');
                            let mon = String(f.getMonth() + 1).padStart(2, '0'); let yea = String(f.getFullYear()); return { day, mon, yea, };
                        } let retFirstDayWeek = firstDayWeek({ 'date': `${time.yea}-${time.mon}-${time.day}T${time.hou}:${time.min}:${time.sec}`, }), staDay = retFirstDayWeek.day, staMon = retFirstDayWeek.mon;

                        let filt = Object.fromEntries(Object.entries(retConfigStorage.res).filter(([key,]) => key.substring(4) >= staDay || staMon !== time.mon)); filt = { 'res': filt, };
                        let judgesQtdWee = 0, judgesSecWee = 0; for (let nameKey in filt.res) { judgesQtdWee += filt.res[nameKey].reg.judgesQtd; judgesSecWee += filt.res[nameKey].reg.judgesSec; }

                        let notText = [
                            `🔵 QTD: ${judgesQtdMon.toString().padStart(3, '0')}`, `TEMPO: ${dateHour(judgesSecMon).res}`, `🟡 QTD: ${judgesQtdWee.toString().padStart(3, '0')}`, `TEMPO: ${dateHour(judgesSecWee).res}`,
                            `🟢 QTD: ${judgesQtd.toString().padStart(3, '0')}`, `TEMPO: ${dateHour(judgesSec).res}`, `MÉDIO: ${dateHour((judgesSecHitAppLast / judgesQtdHitAppLast)).res.substring(3, 8)}`,
                        ]; infNotification = {
                            'duration': 2, 'icon': 'icon_4.png', 'title': `${platform} | ${hitApp}`,
                            'text': `${notText[0]} | ${notText[1]} \n${notText[2]} | ${notText[3]} \n${notText[4]} | ${notText[5]} | ${notText[6]}`, 'ntfy': false,
                        }; notification(infNotification); gO.inf[platform].log.splice(index, 1);

                    }
                }
            }
        }

        /* [5] → ENVIA O LOG */
        if (target === `/___log___`) {
            targetAlert(platform, target, type); if (body && body.uniqueBrokeringUuid) {

                retLog = await log({ e, 'folder': `${pathLogPlataform}`, 'path': `SEND_LOG.txt`, 'text': body, }); pathNew = retLog.res;
                pathNew = pathNew.substring(pathNew.lastIndexOf('/') + 1); pathNew = retLog.res.replace(pathNew, `OK/${pathNew}`); await file({ e, 'action': 'change', 'path': retLog.res, pathNew, });

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
globalThis['scilliance'] = scilliance;


