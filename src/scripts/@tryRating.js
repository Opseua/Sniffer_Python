async function tryRating(inf) {
    let ret = { 'ret': false }; // gO.inf['tryRating'].log = { 'a': '4' }; await csf([gO.inf]) // SET
    try {
        let infConfigStorage, retConfigStorage, infFile, retFile, infNotification, retNotification, retLog
        let time = dateHour().res, time1 = `MES_${time.mon}_${time.monNam}/DIA_${time.day}`, time2 = `${time.hou}.${time.min}.${time.sec}.${time.mil}`
        let csf = configStorage; inf['tim'] = Number(time.tim); inf['hour'] = `${time1}/${time2}`
        let other = { 'default': { 'lastHour': 3600 }, 'QueryImageDeservingClassification': { 'lastHour': 1800 } }

        // #### tryRating | /home
        if ((inf.url == 'tryRating/home')) {
            gO.inf['tryRating'] = {}; gO.inf.tryRating['log'] = [];
            await commandLine({ 'command': `"${conf[1]}:/ARQUIVOS/WINDOWS/BAT/ESCREVER_e_ou_TECLA.vbs" "[SHIFT+F1]"` })
            await csf([gO.inf]);
            console.log('#### tryRating | /home')
        }

        // #### tryRating | /survey
        if ((inf.url == 'tryRating/survey')) {
            let body = JSON.parse(inf.body), hitApp = body.templateTaskType.replace(/[^a-zA-Z0-9]/g, ''); const id = body.requestId
            retLog = await log({ 'folder': 'TryRating', 'path': `reg.txt`, 'text': time.tim })
            retLog = await log({ 'folder': 'TryRating', 'path': `RES_GET_${hitApp}.txt`, 'text': inf.body })
            const addGet = {
                'conceptId': body.conceptId, 'projectId': body.projectId, 'templateSchemaVersionId': body.templateSchemaVersionId,
                'targetLocalIds': body.targetLocalIds, 'name': body.tasks[0].metadata.name, 'assetType': body.tasks[0].metadata.assetType,
                'metadata': body.tasks[0].metadata.metadata, 'state': body.tasks[0].metadata.state, 'createdBy': body.tasks[0].metadata.createdBy,
                'created': body.tasks[0].metadata.created, 'storageType': body.tasks[0].metadata.storageType
            }
            gO.inf.tryRating.log.push({ 'id': id, 'body': inf.body, 'path': retLog.res, 'lastTaskTimestamp': Number(time.tim), 'addGet': addGet });
            await commandLine({ 'command': `"${conf[1]}:/ARQUIVOS/WINDOWS/BAT/ESCREVER_e_ou_TECLA.vbs" "[SHIFT+F1][SHIFT+F2]"` })
            await csf([gO.inf]);
            console.log('#### tryRating | /survey')

            if (['Search20', 'QueryImageDeservingClassification'].includes(hitApp)) {

                let name; if (typeof window !== 'undefined') { name = window[`tryRating_${hitApp}`] } // CHROME
                else { name = global[`tryRating_${hitApp}`] } // NODEJS

                const retName = await name({ 'body': body });
                console.log(retName)

                // sendWeb = {
                //     "fun": [{ "securityPass": securityPass, "funRet": { "retUrl": false }, "funRun": { "name": `peroptyx_${hitApp}`, "par": { "logFile": retLog.res } } }]
                // }
                // wsSend(gO.inf.wsArr[0], JSON.stringify(sendWeb))
            } else if (hasKey({ 'key': 'testQuestionInformation', 'obj': body }).res) {
                infNotification = {
                    "duration": 5, "icon": "./src/media/notification_1.png",
                    "title": `TryRating | AVISO`, "text": "Outro tipo de tarefa. TEM A RESPOSTA!"
                }; retNotification = await notification(infNotification);
            } else if (body.targetLocalIds.length == 1) {
                infNotification = {
                    "duration": 5, "icon": "./src/media/notification_3.png",
                    "title": `TryRating | AVISO`, "text": "Outro tipo de tarefa. BLIND, NÃO TEM A RESPOSTA!"
                }; retNotification = await notification(infNotification);
            } else {
                infNotification = {
                    "duration": 5, "icon": "./src/media/notification_3.png",
                    "title": `TryRating | ALERTA`, "text": "Outro tipo de tarefa."
                }; retNotification = await notification(infNotification);
            };
        }

        ret['ret'] = true; ret['msg'] = `tryRating: OK`; ret['res'] = `resposta aqui`;
    } catch (e) { const m = await regexE({ 'e': e }); ret['msg'] = m.res };
    if (!ret.ret) { console.log(ret.msg) };
    ret = { 'ret': ret.ret, 'msg': ret.msg, 'res': ret.res }; return ret
}

if (typeof window !== 'undefined') { // CHROME
    window['tryRating'] = tryRating;
} else { // NODEJS
    global['tryRating'] = tryRating;
}