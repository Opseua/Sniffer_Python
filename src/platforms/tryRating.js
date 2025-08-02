let e = currentFile(), ee = e;
async function tryRating(inf = {}) {
    let ret = { 'ret': false, }; e = inf && inf.e ? inf.e : e;
    try {
        let { platform = 'x', target, type, } = inf;

        let body; try { if (type === true) { body = JSON.parse(inf.body); } } catch (e) { } let retConfigStorage, infNotification, retLog, pathNew, u = 'http://127.0.0.1:', functionLocal = false;
        let time = dateHour().res, time1 = `MES_${time.mon}_${time.monNam}/DIA_${time.day}`, pathLogPlataform = `Plataformas/${platform}`, teste = '_teste', other = platforms[platform.replace(`${teste}`, '')];

        // CRIAR OBJETO DA PLATAFORMA (PARA EVITAR O ERRO AO ABRIR A TASK SEM PASSAR NA 'HOME')
        if (!gO.inf[platform]) { gO.inf[platform] = { 'log': [], }; } async function runStopwatch(c) { if (!platform.includes(teste)) { for (let a of c) { await fetch(`${u}${portStopwatch}/${a}`); } } }

        messageSend({ destination: des, message: { fun: [{ securityPass: gW.securityPass, name: 'chromeActions', par: { e, action: 'badge', text: '', }, },], }, }); // RESETAR: BADGE (USUARIO_3) | TÍTULO ABA
        messageSend({ destination: des, message: { fun: [{ securityPass: gW.securityPass, name: 'tabAction', par: { e, 'action': `changeTitle`, 'search': `*tryrating*`, 'title': `TryRating`, }, },], }, });

        /* [1] → INÍCIO */
        if (target === `/home`) {
            targetAlert(platform, target, type); runStopwatch([`reset_2`,]); gO.inf[platform]['log'] = [];
        }

        /* [2] → RECEBE A TASK */
        if (target === `/survey`) {
            targetAlert(platform, target, type); if (body && body.templateTaskType) {
                runStopwatch([`reset_2`, `toggle_2`,]); let hitApp = body.templateTaskType.replace(/[^a-zA-Z0-9]/g, ''); let judgeId = body.requestId;
                retLog = await log({ e, 'folder': `${pathLogPlataform}`, 'path': `GET_${hitApp}.txt`, 'text': body, });
                let tasksBlind = 0, tasksQtd = 0, tasksType = 'NAO_DEFINIDO', tasksInf = []; for (let [index, value,] of body.tasks.entries()) {
                    let blind = !(value?.metadata?.created); let resultList = value?.taskData?.resultSet?.resultList ? value.taskData.resultSet.resultList.length : 0; tasksQtd += resultList > 0 ? resultList : 1;
                    tasksType = resultList > 0 ? 'resultList' : 'tasks'; tasksBlind += blind ? 1 : 0; tasksInf.push({
                        blind, 'name': value.metadata?.name, 'assetType': value.metadata?.assetType, 'metadata': value.metadata?.metadata, 'state': value.metadata?.state,
                        'createdBy': value.metadata?.createdBy, 'created': value.metadata?.created, 'storageType': value.metadata?.storageType,
                    });
                } let addGet = { 'conceptId': body.conceptId, 'projectId': body.projectId, 'templateSchemaVersionId': body.templateSchemaVersionId, 'targetLocalIds': JSON.stringify(body.targetLocalIds), tasksInf, };
                gO.inf[platform].log.push({ hitApp, 'tim': Number(time.tim), 'hou': `${time.hou}:${time.min}:${time.sec}`, tasksQtd, tasksBlind, judgeId, 'judgesQtd': 1, tasksType, addGet, body, 'path': retLog.res, });

                // CHECAR SE O HITAPP POSSUI [PASTA + ARQUIVOS NECESSÁRIOS]
                let text = await file({ e, 'action': 'list', 'path': `${fileProjetos}/${gW.project}/logs/Plataformas/z${teste}/TryRating/${hitApp}`, 'max': 30, }); text = text.res || false; if (text) {
                    function checkFiles(f, v) { v = v.map(g => f.some(n => regex({ 'simple': true, 'pattern': `*${g.r}*`, 'text': n, })) ? null : g.id).filter(Boolean); return v.length ? v.join(' | ') : false; } let f = [
                        { 'r': '2-GET_TASK*txt', 'id': 'GET_TASK {txt}', }, { 'r': '3-SEND_TASK*txt', 'id': 'SEND_TASK {txt}', }, { 'r': '2-GET_TASK*mhtml', 'id': 'GET_TASK {mhtml}', },
                        { 'r': '3-SEND_TASK*mhtml', 'id': 'SEND_TASK {mhtml}', }, { 'r': 'Guide_EN', 'id': 'Guide [EN]', }, { 'r': 'Guide_PT', 'id': 'Guide [PT]', },
                    ]; text = checkFiles(text.map(f => f.path), f);
                } else { text = `Pasta do hitApp não existe!`; } if (text) { notification({ duration: 4, icon: 'notification_3.png', keepOld: true, title: `${platform} | FALTAM ARQUIVOS`, text, ntfy: false, }); }

                // CHECAR SE É BLIND *** 3 → [BLIND: SIM - RESP: SIM] # 2 → [BLIND: SIM - RESP: NÃO] # 1 → [BLIND: NÃO] # 0 → [BLIND: ???] | BADGE (USUARIO_3): DEFINIR
                let not, retTaskInfTryRating = await taskInfTryRating({ e, body, 'reg': false, 'excludes': ['qtdTask', 'blindNum', 'clipA', 'resA',], });
                if (!retTaskInfTryRating.ret) { logConsole({ e, ee, 'txt': `${JSON.stringify(retTaskInfTryRating)}`, }); return ret; } retTaskInfTryRating = retTaskInfTryRating.res;
                let blindNum = retTaskInfTryRating.res[hitApp]['0'].tasks['0'].blindNum; if (blindNum === 3) {
                    not = { 'duration': 3, 'icon': 1, 'title': `BLIND`, 'text': 'Tem a resposta!', 'bT': 'RESP', 'bC': '#19ff47', };
                    clipboard({ e, 'value': JSON.stringify(retTaskInfTryRating.clip[hitApp]['0'], null, 2), });
                } else if (blindNum === 2) { not = { 'duration': 3, 'icon': 3, 'title': `BLIND`, 'text': 'Não tem a resposta!', 'bT': 'BLIN', 'bC': '#EC1C24', }; }
                else if (blindNum === 1) { not = { 'duration': 2, 'icon': 2, 'title': `NÃO É BLIND`, 'text': 'Avaliar manualmente', 'bT': 'OK', 'bC': '#3F48CC', }; }
                else if (blindNum === 0) { not = { 'duration': 2, 'icon': 4, 'title': `BLIND ???`, 'text': 'Avaliar manualmente', 'bT': '???', 'bC': '#B83DBA', }; }
                notification({ 'duration': not.duration, 'icon': `notification_${not.icon}.png`, 'keepOld': true, 'title': `${platform} | ${not.title}`, 'text': `${not.text}`, 'ntfy': false, });
                let msgLis = { 'fun': [{ 'securityPass': gW.securityPass, 'retInf': true, 'name': 'chromeActions', 'par': { e, 'action': 'badge', 'text': not.bT, 'color': not.bC, }, },], };
                messageSend({ 'destination': des, 'message': msgLis, }); let actions = [], retVU, tabTitle = ''; let target = '*tryrating*';

                if (blindNum === 0 && ['Ratingoftransformedtext', 'BroadMatchRatings',].includes(hitApp)) {
                    messageSend({ 'destination': des, 'message': { 'fun': [{ 'securityPass': gW.securityPass, 'retInf': true, 'name': 'tryRatingSet', 'par': { hitApp, 'path': retLog.res, }, },], }, });
                }

                // SALVAR VIEWPORT E USER NO STORAGE | ALTERAR MODO DO MAPA
                if (['Search20', 'POIClosures',].includes(hitApp)) {
                    function viewportUser(data) {
                        let d0 = data.tasks[0].taskData; let viewportTime; let inputItemMessage = d0?.inputItem?.data?.message || {}; let tartMetadata = d0?.inputItem?.data?.tartMetadata || {};
                        viewportTime = inputItemMessage.timeSinceMapViewportChanged !== void 0 ? inputItemMessage.timeSinceMapViewportChanged : tartMetadata.timeSinceMapViewportChanged;
                        if (!viewportTime && inputItemMessage.place_request_parameters?.category_search_parameters?.viewport_info?.time_since_map_viewport_changed) {
                            viewportTime = inputItemMessage.place_request_parameters.category_search_parameters.viewport_info.time_since_map_viewport_changed;
                        } if (!d0?.inputItem?.data?.tartMetadata?.deviceLocation || !d0?.inputItem?.data?.tartMetadata?.mapRegion) { return { 'viewport': '#####', 'user': '#####', }; }
                        let { lat: userLat, lng: userLng, } = d0.inputItem.data.tartMetadata.deviceLocation; let view = d0.inputItem.data.tartMetadata.mapRegion; let { eastLng, westLng, northLat, southLat, } = view;
                        return { 'viewport': viewportTime >= 60 ? 'STALE' : 'FRESH', 'user': (userLat >= southLat && userLat <= northLat && userLng >= westLng && userLng <= eastLng) ? 'INSIDE' : 'OUTSIDE', };
                    } retVU = viewportUser(body); tabTitle = ['USER <S>Acc', 'VIEW <N>',]; tabTitle = retVU.viewport === 'STALE' ? tabTitle[0] : retVU.user === 'INSIDE' ? tabTitle[0] : tabTitle[1];
                    actions.push({ 'name': 'configStorage', 'par': { e, 'action': 'set', 'key': 'TryRating_viewportUser', 'value': retVU, }, });
                    actions.push({ 'name': 'tabAction', 'par': { e, 'action': `changeTitle`, 'search': target, 'title': `TryRating: ${tabTitle}`, }, }); function funChangeMapAndCorrectAddressCopy() {
                        let d = document; function h(s, c) { let e = d.querySelector(s); if (e && e.offsetParent !== null) { c(e); return true; } return false; } function w(s, c) {
                            if (h(s, c)) { return; } let o = new MutationObserver((m, o) => { if (h(s, (e) => { o.disconnect(); c(e); })) { o.disconnect(); } }); o.observe(d.body, { childList: true, subtree: true, });
                        } function addressFixButtonCopy() { // ADICIONAR VÍRGULA NO ENDEREÇO E BOTÃO PARA COPIAR [POI + ENDEEÇO]
                            let c = document.querySelectorAll('.sd-card-container'); function aOk(b, bc) { b.parentNode.insertBefore(bc, b); } d.querySelectorAll('.sd-richtext-inner p')
                                .forEach(function (el) { el.innerHTML = el.innerHTML.replace(/<br>/g, ', <br>').replace(/(<br>)*<\/p>/, ', </p>'); }); for (let a of c) {
                                    let n = a.querySelector('.sd-card-header .sd-richtext span')?.textContent.trim(); let e = [...a.querySelectorAll('.sd-card-body table tr'),].
                                        find(tr => tr.querySelector('td')?.textContent.trim().toLowerCase() === 'address')?.querySelectorAll('td')[1]?.textContent.trim().replace(/\s+/g, ' '); if (n && e) {
                                            let t = `${n}, ${e}`; let b = a.querySelector('.sd-card-header .tr-cp');
                                            if (b) { let bc = b.cloneNode(true); bc.style.backgroundColor = '#b22222'; bc.onclick = ev => { ev.preventDefault(); void navigator.clipboard.writeText(t); }; aOk(b, bc); }
                                        }
                                }
                        } function selectOption() { // SELECIONAR A OPÇÃO 'Hybrid' DO MAPA
                            w('.mk-tile-layer-selector', (e1) => {
                                setTimeout(() => {
                                    let e2 = e1.querySelector('.mktls-option.mktls-show.mktls-value'); if (!e2) { return; } let e3 = e2.textContent.trim(); if (!e3) { return; } if (e3.includes('Hybrid')) { return; }
                                    let e4 = e1.querySelector('.mktls-option.mktls-show'); if (!e4) { return; } e4.click(); setTimeout(() => {
                                        let e5 = Array.from(e1.querySelectorAll('.mktls-option')).find(v => v.textContent.includes('Hybrid')); if (!e5) { return; } e5.dispatchEvent(new Event('click', { bubbles: true, }));
                                    }, 700);
                                }, 500);
                            });
                        } let i = setInterval(() => d.querySelector('.sd-richtext p') && (setTimeout(() => { addressFixButtonCopy(); }, 500), clearInterval(i)), 500); selectOption(); return true;
                    } actions.push({ 'name': 'chromeActions', 'par': { e, 'action': 'inject', target, 'fun': `(${funChangeMapAndCorrectAddressCopy.toString()})()`, }, });
                }/* TEMPO DA TASK */ function funTaskTime() {
                    let e = document.querySelectorAll('.labeled-attribute__label span'); globalThis['observadorAtivo'] = true; let l = [...e,].find(el => el.textContent.includes('Estimated Rating Time'));
                    if (!l) { setTimeout(funTaskTime, 500); return; } let t = l.closest('.labeled-attribute')?.querySelector('.label-value'); if (!t) { setTimeout(funTaskTime, 500); return; }
                    function eRT(t) { return `${String((t.match(/(\d+)\s?minute/) || [])[1] || 0).padStart(2, '0')}:${String((t.match(/(\d+)\s?second/) || [])[1] || 0).padStart(2, '0')}`; }
                    function tabTit(s) { let t = document.title; let r = /(^TryRating\s)(\d{2}:\d{2})/; r = r.test(t) ? t.replace(r, `$1${s}`) : t.replace('TryRating', `TryRating ${s}`); document.title = r; }
                    let p = t.textContent.trim(); tabTit(eRT(p)); new MutationObserver(() => { let n = t.textContent.trim(); if (n !== p) { p = n; tabTit(eRT(n)); } }).observe(t, { characterData: true, subtree: true, });
                } actions.push({ 'name': 'chromeActions', 'par': { e, 'action': 'inject', target, 'fun': `(${funTaskTime.toString()})()`, }, }); // INJETAR
                for (let [index, value,] of actions.entries()) { await messageSend({ 'destination': des, 'message': { 'fun': [{ 'securityPass': gW.securityPass, 'name': value.name, 'par': value.par, },], }, }); }
            }
        }

        /* [3] → ENVIA A RESPOSTA DA TASK */
        if (target === `/client_log`) {
            targetAlert(platform, target, type); runStopwatch([`reset_2`,]); if (body && body.data) {
                let json; let tasksQtd = 0, judgesQtd = 0, judgesSec = 0, tasksBlinds = 0; let tasksQtdHitApp = 0, judgesQtdHitApp = 0, judgesSecHitApp = 0, tasksBlindsHitApp = 0; let judgesQtdHitAppLast = 0;
                let judgesSecHitAppLast = 0, lastHour, judgesQtdMon = 0, judgesSecMon = 0; let hitApp = body.data.templateTaskType.replace(/[^a-zA-Z0-9]/g, ''); let judgeId = body.data.tasks[0].requestId;
                let pathJson = `./logs/${pathLogPlataform}`; retLog = await log({ e, 'folder': `${pathLogPlataform}`, 'path': `SEND_${hitApp}.txt`, 'text': body, }); pathNew = retLog.res;
                pathNew = pathNew.substring(pathNew.lastIndexOf('/') + 1); pathNew = retLog.res.replace(pathNew, `OK/${pathNew}`); await file({ e, 'action': 'change', 'path': retLog.res, pathNew, });
                for (let [index, value,] of gO.inf[platform].log.entries()) {
                    if (judgeId === value.judgeId) {
                        pathNew = value.path; pathNew = pathNew.substring(pathNew.lastIndexOf('/') + 1); let pathJson2 = `MES_${time.mon}_${time.monNam}/#_MES_#.json`;
                        pathNew = value.path.replace(pathNew, `OK/${pathNew}`); await file({ e, 'action': 'change', 'path': value.path, pathNew, });
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
                            let { date, } = inf; let d = new Date(date); let dW = d.getDay(); let dif = dW; let f = new Date(d); f.setDate(d.getDate() - dif); let day = String(f.getDate()).padStart(2, '0');
                            let mon = String(f.getMonth() + 1).padStart(2, '0'); let yea = String(f.getFullYear()); return { day, mon, yea, };
                        } let retFirstDayWeek = firstDayWeek({ 'date': `${time.yea}-${time.mon}-${time.day}T${time.hou}:${time.min}:${time.sec}`, }); let staDay = retFirstDayWeek.day; let staMon = retFirstDayWeek.mon;

                        let filt = Object.fromEntries(Object.entries(retConfigStorage.res).filter(([key,]) => key.substring(4) >= staDay || staMon !== time.mon)); filt = { 'res': filt, };
                        let judgesQtdWee = 0; let judgesSecWee = 0; for (let nameKey in filt.res) { judgesQtdWee += filt.res[nameKey].reg.judgesQtd; judgesSecWee += filt.res[nameKey].reg.judgesSec; }

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

        ret['msg'] = `${platform}: OK`;
        ret['ret'] = true;

    } catch (catchErr) {
        let retRegexE = await regexE({ inf, 'e': catchErr, }); ret['msg'] = retRegexE.res; ret['ret'] = false; delete ret['res'];
    }

    return { ...({ 'ret': ret.ret, }), ...(ret.msg && { 'msg': ret.msg, }), ...(ret.hasOwnProperty('res') && { 'res': ret.res, }), };
}

// CHROME | NODE
globalThis['tryRating'] = tryRating;


