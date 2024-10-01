// let infIsBlind, retIsBlind, body

// // MODO SIMPLES (JULGAMENTO ÚNICO)
// body = await file({ 'action': 'read', 'path': "!letter!:/ARQUIVOS/PROJETOS/Sniffer_Python/log/Plataformas/TryRating/MES_09_SET/DIA_26/OK/05.57.47.237_GET_Search20.txt", }); // BLIND
// body = await file({ 'action': 'read', 'path': "!letter!:/ARQUIVOS/PROJETOS/Sniffer_Python/log/Plataformas/TryRating/MES_09_SET/DIA_26/OK/05.14.40.543_GET_Search20.txt" }); // RESP
// body = await file({ 'action': 'read', 'path': "!letter!:/ARQUIVOS/PROJETOS/Sniffer_Python/log/Plataformas/TryRating/MES_09_SET/DIA_26/OK/05.51.11.027_GET_Search20.txt" }); // NÃO
// infIsBlind = { 'e': e, 'body': body.res, };

// // MODO EM MASSA (VÁRIOS JULGAMENTOS)
// infIsBlind = { 'e': e, 'plataform': `TryRating`, 'filter': ['MES_09', 'DIA_', 'Search20',], 'reg': true, }; // 'reg' TRUE salva no "log/Plataformas/z_teste/z_#_REG_#/reg.txt"

// retIsBlind = await isBlind(infIsBlind);
// console.log(retIsBlind)

let e = import.meta.url, ee = e;
async function isBlind(inf) {
    let ret = { 'ret': false }; e = inf && inf.e ? inf.e : e;
    try {
        let arrBody = []; let arrRes = []; if (inf.plataform) {
            // JULGAMENTOS (RECEBIDOS): PEGAR [EM MASSA] POR PLATAFORMA
            let arrPaths = []; let retFile = await file({ 'action': 'list', 'path': `!letter!:/ARQUIVOS/PROJETOS/Sniffer_Python/log/Plataformas/${inf.plataform}`, 'max': 12 }); if (!retFile.ret) { return retFile };
            for (let [index, value] of retFile.res.entries()) {
                if (value.isFolder && value.name.includes('MES_')) {
                    let retFile1 = await file({ 'action': 'list', 'path': value.path, 'max': 32 }); if (!retFile1.ret) { return retFile1 }; for (let [index1, value1] of retFile1.res.entries()) {
                        if (value1.isFolder && value1.path.includes('DIA_')) {
                            let retFile2 = await file({ 'action': 'list', 'path': value1.path, 'max': 500 }); if (!retFile2.ret) { return retFile2 }; for (let [index2, value2] of retFile2.res.entries()) {
                                if (value2.isFolder && value2.path.includes('OK')) {
                                    let retFile3 = await file({ 'action': 'list', 'path': value2.path, 'max': 500 }); if (!retFile3.ret) { return retFile3 }
                                    for (let [index3, value3] of retFile3.res.entries()) { if (!value3.isFolder && value3.path.includes('_GET_') && inf.filter.every(i => value3.path.includes(i))) { arrPaths.push(value3.path) } }
                                } else if (!value2.isFolder && value2.path.includes('_GET_') && inf.filter.every(i => value2.path.includes(i))) { arrPaths.push(value2.path) }
                            }
                        }
                    }
                }
            }; if (inf.reg) { await file({ 'e': e, 'action': 'write', 'path': '!letter!:/ARQUIVOS/PROJETOS/Sniffer_Python/log/Plataformas/z_teste/z_#_REG_#/reg.txt', 'rewrite': false, 'text': '\n' }); }; let arrRequestId = [];
            for (let [index, value] of arrPaths.entries()) {
                let retFile = await file({ 'action': 'read', 'path': value, }); if (!retFile.ret) { return retFile }; arrBody.push(retFile.res); if (inf.reg) {
                    // REGISTRAR NO TXT
                    let typeBlind = 0; let txt = ''; typeBlind = retFile.res.includes(`{"serializedAnswer":{"`) ? 1 : 0; let obj = JSON.parse(retFile.res)
                    let hitApp = obj.templateTaskType; let typeTask = !!obj.tasks[0].taskData.resultSet ? 'list' : 'task'; let requestId = obj.requestId; if (!arrRequestId.includes(requestId)) {
                        txt += `*${!!obj.type}`; txt += `*${obj.targetLocalIds.length}`; txt += `*${typeTask}`; txt += `*${typeBlind}`; let metadata = !!(obj.tasks[0].metadata && Object.keys(obj.tasks[0].metadata).length > 0);
                        txt += `*${metadata}`; let date = new Date(obj.timeCreated * 1000); let timeCre = date.getFullYear() + '/' + String(date.getMonth() + 1).padStart(2, '0') + '/' + String(date.getDate()).padStart(2, '0');
                        txt += `*${timeCre}`; let pathSplit = value.split(`/`); txt += `*${pathSplit[pathSplit.length - 1].replace('.txt', '')}`; txt += `*${hitApp}`; txt += `*${obj.projectId}`; arrRequestId.push(requestId);
                        txt += `*${requestId}`; txt += `*${obj.tasks[0].metadata && obj.tasks[0].metadata.name ? obj.tasks[0].metadata.name : false}`; metadata = obj.tasks[0].metadata || {};
                        txt += `*${metadata.assetType || false}`; txt += `*${metadata.state || false}`; txt += `*${metadata.createdBy || false}`; txt += `*${metadata.created || false}`;
                        txt += `*${metadata.storageType || false}`; txt += `*${typeTask === 'list' ? obj.tasks[0].taskData.resultSet.resultList.length : '1'}`;
                        await file({ 'e': e, 'action': 'write', 'path': '!letter!:/ARQUIVOS/PROJETOS/Sniffer_Python/log/Plataformas/z_teste/z_#_REG_#/reg.txt', 'rewrite': true, 'text': `${txt}\n` });
                    }
                }
            }
        } else if (inf.body) {
            // JULGAMENTO (RECEBIDO): [ÚNICO]
            arrBody.push(inf.body)
        }

        // CHECAR SE É BLIND
        for (let [index, value] of arrBody.entries()) {
            // -1 [BLIND: SIM <> RESP: SIM] | 0 [BLIND: NÃO] | 1 [BLIND: SIM <> RESP: NÃO] | 999 [???]
            let blind = 999; let add = {}; let hitApp = false; let body = JSON.parse(value); let plataform = body.requestId ? 'TryRating' : body['1'] ? 'EWOQ' : 'NÃO_IDENTIFICADA';

            if (plataform == 'TryRating') {
                // ### TryRating
                let { requestId: taskId, projectGroupId, projectId, } = body; hitApp = body.templateTaskType.replace(/[^a-zA-Z0-9]/g, ''); add['taskId'] = taskId; add['projectGroupId'] = projectGroupId
                if (value.includes('{"serializedAnswer":{"')) { blind = -1; } // [BLIND: SIM <> RESP: SIM]
                else if (hitApp == 'Search20') {
                    // →→→ Search20
                    if (projectId == 1064208 || (body.tasks[0].metadata && body.tasks[0].metadata.assetType && body.tasks[0].metadata.assetType == 'JSONL')) { blind = 1; } // [BLIND: SIM <> RESP: NÃO]
                    else { blind = 0; } // [BLIND: NÃO]
                } else if (hitApp == 'Search20') {

                }
            }

            arrRes.push({ 'plataform': plataform, 'hitApp': hitApp, 'blind': blind, 'blindTxt': blind == 0 ? '[NÃO]' : blind == -1 ? '[BLIND + RESP]' : '[BLIND]', 'add': add })
        }

        ret['res'] = arrRes
        ret['msg'] = 'IS BLIND: OK'
        ret['ret'] = true;

    } catch (catchErr) {
        let retRegexE = await regexE({ 'inf': inf, 'e': catchErr, }); ret['msg'] = retRegexE.res;
    }; return { ...({ ret: ret.ret }), ...(ret.msg && { msg: ret.msg }), ...(ret.res && { res: ret.res }), };
}

// CHROME | NODEJS
(eng ? window : global)['isBlind'] = isBlind;