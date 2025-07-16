/* eslint-disable max-len */

// let pathTxt, body;
// pathTxt = 'D:/ARQUIVOS/PROJETOS/Sniffer_Python/logs/Plataformas/TryRating/MES_09_SET/DIA_28/OK/00.09.01.953_GET_Categorization.txt'; // BLIND + RESP
// pathTxt = 'D:/ARQUIVOS/PROJETOS/Sniffer_Python/logs/Plataformas/TryRating/MES_10_OUT/DIA_25/OK/13.17.39.840_GET_TimeSensitiveEmailCategorizationPortugueseLanguage.txt'; // BLIND + RESP
// pathTxt = 'D:/ARQUIVOS/PROJETOS/Sniffer_Python/logs/Plataformas/TryRating/MES_09_SET/DIA_28/OK/08.12.18.436_GET_EmailCategorizationPortugueseLanguage.txt'; // NÃO
// // ***
// pathTxt = 'D:/ARQUIVOS/PROJETOS/Sniffer_Python/logs/Plataformas/TryRating/MES_09_SET/DIA_21/OK/12.59.14.688_GET_SearchAdsRelevance.txt'; // NÃO
// // ###
// body = await file({ 'action': 'read', 'path': pathTxt }); body = JSON.parse(body.res);
// // ******************************************
// let infTaskInfTryRating, retTaskInfTryRating;
// infTaskInfTryRating = { e, 'plataform': `TryRating`, 'reg': true, 'excludes': ['qtdTaskA', 'blindNumA', 'clip', 'res',], 'includes': ['MES_', 'DIA_', '.',], }; // 'reg' TRUE salva no 'logs/Plataformas/z_teste/reg.txt'
// infTaskInfTryRating = { e, 'body': body, 'reg': true, 'excludes': ['qtdTask', 'blindNum', 'clipA', 'resA',], };
// retTaskInfTryRating = await taskInfTryRating(infTaskInfTryRating); console.log(JSON.stringify(retTaskInfTryRating), '\n');

let e = currentFile(), ee = e;
async function taskInfTryRating(inf = {}) {
    let ret = { 'ret': false, }; e = inf && inf.e ? inf.e : e;
    try {
        let { body, plataform, includes = [], reg, excludes = [], } = inf;

        let arrBody = []; let arrPaths = []; let arrRequestId = []; let arrRes = {
            ...(excludes.includes('qtdTask') ? {} : { 'qtdTask': 0, }), ...(excludes.includes('blindNum') ? {} : { 'blindNum': { '0': {}, '1': {}, '2': {}, '3': {}, }, }),
            ...(excludes.includes('clip') ? {} : { 'clip': {}, }), ...(excludes.includes('res') ? {} : { 'res': {}, }),
        };

        // PEGAR: VALOR DO PATH | ORDENAR CHAVES
        function getValueByPath({ obj, path, split, }) { let keys = path.split(split || '.'); return keys.reduce((a, key) => { if (a && key in a) { return a[key]; } return undefined; }, obj); }
        function keysOrder(o, r) { return Object.fromEntries((r || Object.keys(o).sort((a, b) => a.localeCompare(b))).filter(k => k in o).concat(Object.keys(o).filter(k => !r?.includes(k))).map(k => [k, o[k],])); }

        // PEGAR: PERGUNTAS E OPÇÕES (RADIO/SELET/ETC)
        async function questionsOptions(inf = {}) {
            let { obj, } = inf; let res = {}; let infObjFilter = { e, obj, 'noCaseSensitive': true, 'split': '=', 'keys': ['ratingFieldKey',], 'filters': [{ 'includes': [`*Checkbox*`, `*Dropdown*`, `*Radio*`,], },], };
            let retObjFilter = await objFilter(infObjFilter); for (let [index, valueOk,] of retObjFilter.res.entries()) {
                let { key, value, } = valueOk; key = key.replace('=ratingFieldKey', ''); let retGetValueByPath = getValueByPath({ obj, 'path': key, 'split': '=', });
                let { fieldType, ratingFieldKey, label, options, } = retGetValueByPath; fieldType = fieldType ? fieldType.toLowerCase() : 'ignorarIsso';
                fieldType = fieldType.includes('checkbox') ? 'checkbox' : fieldType.includes('select') ? 'select' : fieldType.includes('radio') ? 'radio' : fieldType;
                res[ratingFieldKey] = { fieldType, 'question': label || `QUESTION_${ratingFieldKey}`, 'options': options ? options.map(({ label, value, }) => ({ label, value, })) : [], };
            } return res;
        }

        // SEPARAR: TASKS | POSSÍVEIS RESPOSTAS
        async function tasksResponses(inf = {}) {
            let { obj, } = inf; let { type = 'x', conceptId = 'x', projectId, requestId, templateTaskType, targetLocalIds, timeCreated, } = obj; let taskType = 'x';
            let res = { 'tasks': { '0': { type, conceptId, projectId, requestId, 'hitApp': templateTaskType.replace(/[^a-zA-Z0-9]/g, ''), targetLocalIds, timeCreated, taskType, }, }, 'responses': {}, };
            obj.tasks.forEach(task => {
                let taskKey = task.taskKey; if (!res.tasks[taskKey]) { res.tasks[taskKey] = {}; }
                if (!res.responses[taskKey]) { res.responses[taskKey] = {}; } if (task.taskData.resultSet && task.taskData.resultSet.resultList) {
                   /* [resultList] */  taskType = 'resultList'; let resultList = task.taskData.resultSet.resultList; resultList.forEach(item => {
                    let surveyKey = Object.values(item.surveyKeys)[0]; if (!res.tasks[taskKey][surveyKey]) { res.tasks[taskKey][surveyKey] = {}; }
                    Object.assign(res.tasks[taskKey][surveyKey], { 'taskType': 'resultList', ...item, 'metadata': { ...task.metadata || {}, }, });
                }); res.responses[taskKey]['FAKE_ID'] = { ...task.taskData.testQuestionInformation?.answer?.serializedAnswer || {}, };
                } else {
                   /* [tasks] */  taskType = 'tasks'; let requestId = task.requestId; if (!res.tasks[taskKey][requestId]) { res.tasks[taskKey][requestId] = {}; }
                    res.tasks[taskKey][requestId] = { 'taskType': 'tasks', ...task.taskData, 'metadata': { ...task.metadata || {}, }, }; res.responses[taskKey][requestId] = task.taskData;
                }
            }); res.tasks['0'].taskType = taskType; return res;
        }

        // PEGAR: RESPOSTAS (BUSCANDO PELA CHAVE E VALOR)
        async function responsesGet(inf = {}) {
            let { questionsOptions: questionsOptionsObj, tasksResponses: tasksResponsesObj, } = inf; let { tasks, responses, } = tasksResponsesObj; let res = { 'searchByKey': [], 'searchByValue': [], };
            let getValues = (data) => Array.isArray(data) ? data.map(i => i.value) : [data.value ?? data,]; let infObjFilter, retObjFilter; for (let [index, value,] of Object.keys(tasks).filter(k => k !== '0').entries()) {
                let father = value; let childrens = Object.keys(tasks[father]).filter(k => k !== '0'); for (let [index1, value1,] of childrens.entries()) {
                    let children = value1; for (let [index2, value2,] of Object.keys(questionsOptionsObj).entries()) {
                        let ratingFieldKey = value2; value2 = questionsOptionsObj[value2]; let { fieldType, question, options, } = value2; let keys = [ratingFieldKey,];
                        let valuesLabel = options.some(i => i.label) ? options.map(i => i.label) : []; let valuesValue = options.some(i => i.value) ? options.map(i => i.value) : [];

                        // ------------------------------------------------------------------- (ANTIGO) -------------------------------------------------------------------------------------------------------
                        // [PELA KEY] | EXEMPLO → 'Relevance'
                        infObjFilter = { e, 'obj': responses, 'noCaseSensitive': true, 'keys': [ratingFieldKey,], 'filters': [{ 'includes': [`*${father}*`,], }, { 'includes': [`*${children}*`,], },], };
                        retObjFilter = await objFilter(infObjFilter); retObjFilter = retObjFilter.res; // console.log('\n→', JSON.stringify(retObjFilter), '\n');
                        res.searchByKey.push(...retObjFilter.map(valueKey => ({ father, children, fieldType, ratingFieldKey, question, 'path': valueKey.key, 'value': getValues(valueKey.value), 'optionsIgnore': options, })));
                        // (ANTIGO) [PELO VALUE] | EXEMPLO → 'Navigational'
                        infObjFilter = { e, 'obj': responses, 'noCaseSensitive': true, 'values': options.map(i => i.label || i.value), 'filters': [{ 'includes': [`*${father}*`,], }, { 'includes': [`*${children}*`,], },], };
                        retObjFilter = await objFilter(infObjFilter); retObjFilter = retObjFilter.res; // console.log('\n→', JSON.stringify(retObjFilter), '\n');
                        res.searchByValue.push(...retObjFilter.map(valueValue => ({ father, children, fieldType, ratingFieldKey, question, 'path': valueValue.key, 'value': getValues(valueValue.value), 'optionsIgnore': options, })));

                        // ------------------------------------------------------------------- (NOVO) -------------------------------------------------------------------------------------------------------
                        if (!['Search20',].includes(tasks['0'].hitApp)) {
                            // [PELA CHAVE] | EXEMPLO → 'Relevance' *** { 'Relevance': 'aaa' }
                            infObjFilter = { e, 'obj': responses, 'noCaseSensitive': true, keys, 'filters': [{ 'includes': [`*${father}*`,], }, { 'includes': [`*${children}*`,], },], };
                            retObjFilter = await objFilter(infObjFilter); retObjFilter = retObjFilter.res; // console.log('1 byKey ***', JSON.stringify(keys), '\n→', JSON.stringify(retObjFilter), '\n');
                            res.searchByKey.push(...retObjFilter.map(v => ({ father, children, fieldType, ratingFieldKey, question, 'path': v.key, 'type': 'byKey', 'value': getValues(v.value), 'optionsIgnore': options, })));

                            // [PELA CHAVE {label}] | EXEMPLO → 'Relevance' *** { 'Relevance': 'aaa' }
                            infObjFilter = { e, 'obj': responses, 'noCaseSensitive': true, 'keys': valuesLabel, 'filters': [{ 'includes': [`*${father}*`,], }, { 'includes': [`*${children}*`,], },], };
                            retObjFilter = await objFilter(infObjFilter); retObjFilter = retObjFilter.res; // console.log('2 byKey-label ***', JSON.stringify(valuesLabel), '\n→', JSON.stringify(retObjFilter), '\n');
                            res.searchByKey.push(...retObjFilter.map(v => ({ father, children, fieldType, ratingFieldKey, question, 'path': v.key, 'type': 'byKey-label', 'value': getValues(v.value), 'optionsIgnore': options, })));

                            // [PELA CHAVE {value}] | EXEMPLO → 'Relevance' *** { 'Relevance': 'aaa' }
                            infObjFilter = { e, 'obj': responses, 'noCaseSensitive': true, 'keys': valuesValue, 'filters': [{ 'includes': [`*${father}*`,], }, { 'includes': [`*${children}*`,], },], };
                            retObjFilter = await objFilter(infObjFilter); retObjFilter = retObjFilter.res; // console.log('3 byKey-value ***', JSON.stringify(valuesValue), '\n→', JSON.stringify(retObjFilter), '\n');
                            res.searchByKey.push(...retObjFilter.map(v => ({ father, children, fieldType, ratingFieldKey, question, 'path': v.key, 'type': 'byKey-value', 'value': getValues(v.value), 'optionsIgnore': options, })));

                            // [PELO VALOR] | EXEMPLO → 'Navigational' *** { 'aaa': 'Navigational' }
                            infObjFilter = { e, 'obj': responses, 'noCaseSensitive': true, 'values': keys, 'filters': [{ 'includes': [`*${father}*`,], }, { 'includes': [`*${children}*`,], },], };
                            retObjFilter = await objFilter(infObjFilter); retObjFilter = retObjFilter.res; // console.log('4 byValue ***', JSON.stringify(keys), '\n→', JSON.stringify(retObjFilter), '\n');
                            res.searchByValue.push(...retObjFilter.map(v => ({ father, children, fieldType, ratingFieldKey, question, 'path': v.key, 'type': 'byValue', 'value': getValues(v.value), 'optionsIgnore': options, })));

                            // [PELO VALOR {label}] | EXEMPLO → 'Navigational' *** { 'aaa': 'Navigational' }
                            infObjFilter = { e, 'obj': responses, 'noCaseSensitive': true, 'values': valuesLabel, 'filters': [{ 'includes': [`*${father}*`,], }, { 'includes': [`*${children}*`,], },], };
                            retObjFilter = await objFilter(infObjFilter); retObjFilter = retObjFilter.res; // console.log('5 byValue-label ***', JSON.stringify(valuesLabel), '\n→', JSON.stringify(retObjFilter), '\n');
                            res.searchByValue.push(...retObjFilter.map(v => ({ father, children, fieldType, ratingFieldKey, question, 'path': v.key, 'type': 'byValue-label', 'value': getValues(v.value), 'optionsIgnore': options, })));

                            // [PELO VALOR {value}] | EXEMPLO → 'Navigational' *** { 'aaa': 'Navigational' }
                            infObjFilter = { e, 'obj': responses, 'noCaseSensitive': true, 'values': valuesValue, 'filters': [{ 'includes': [`*${father}*`,], }, { 'includes': [`*${children}*`,], },], };
                            retObjFilter = await objFilter(infObjFilter); retObjFilter = retObjFilter.res; // console.log('6 byValue-value ***', JSON.stringify(valuesValue), '\n→', JSON.stringify(retObjFilter), '\n');
                            res.searchByValue.push(...retObjFilter.map(v => ({ father, children, fieldType, ratingFieldKey, question, 'path': v.key, 'type': 'byValue-value', 'value': getValues(v.value), 'optionsIgnore': options, })));
                        }
                        // ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
                    }
                }
            } return res;
        }

        // FILTRAR: RESPOSTAS [DUPLICADOS EM 'value' E 'label' AO MESMO TEMPO] | 'false' DO 'Business/POI is closed or does not exist' | 'ratingFieldKey' NÃO CORRESPONDENTE
        async function responsesFilter(inf = {}) {
            let { responsesGet: responsesGetObj, } = inf; let { searchByKey, searchByValue, } = responsesGetObj; let res = {}; for (let [index, valueOk,] of [...searchByKey, ...searchByValue,].entries()) {
                let { father, children, fieldType, ratingFieldKey, question, path, type, value, optionsIgnore, } = valueOk; let alternativeMode = ['byKey-labelAAA', 'byKey-value',].includes(type);
                if (!(fieldType === 'checkbox' && value[0] !== true)) {
                    if ((path.toLowerCase() + '.').includes(`.${ratingFieldKey.toLowerCase()}.`) || alternativeMode) {
                        if (!res[father]) { res[father] = {}; } if (!res[father][children]) { res[father][children] = {}; }
                        if (!res[father][children][ratingFieldKey]) { res[father][children][ratingFieldKey] = { fieldType, question, 'value': [], optionsIgnore, }; }
                        res[father][children][ratingFieldKey]['fieldType'] = fieldType; res[father][children][ratingFieldKey]['question'] = question; res[father][children][ratingFieldKey]['value'].push(...value);
                        res[father][children][ratingFieldKey]['value'] = [...new Set(res[father][children][ratingFieldKey]['value']),];
                    }
                }
            } return res;
        }

        // JUNTAR: TASKS | PERGUNTAS E OPÇÕES (RADIO/SELET/ETC) | RESPOSTAS | 0 → [BLIND: ???] | 1 → [BLIND: NÃO] | 2 → [BLIND: SIM <> RESP: NÃO] | 3 → [BLIND: SIM <> RESP: SIM]
        async function returnObj(inf = {}) {
            let clip = {}; let add = { 'blindNum': 0, 'qtdJudge': 0, 'qtdBlind': 0, 'qtdResp': 0, }; let { tasksResponses: tasksResponsesObj, responsesFilter: responsesFilterObj, compact, } = inf;
            let { tasks, } = tasksResponsesObj; let { type, conceptId, projectId, requestId, hitApp, targetLocalIds, timeCreated, taskType, } = tasks['0'];
            let res = { type, conceptId, projectId, requestId, hitApp, targetLocalIds, timeCreated, 'tasks': { '0': { ...add, taskType, }, }, };
            for (let [index, value,] of Object.keys(tasks).filter(k => k !== '0').entries()) {
                let father = value; let childrens = Object.keys(tasks[father]).filter(k => k !== '0'); if (!res.tasks[father]) { res.tasks[father] = { '0': { ...add, }, }; }
                for (let [index1, value1,] of childrens.entries()) {
                    let children = value1; if (!res.tasks[father][children]) { delete tasks[father][children].taskType; res.tasks[father][children] = { '0': { blindNum: 0, }, judge: 'x', task: tasks[father][children], }; }
                    let judge = res.tasks[father][children]['task']; let blindNum = 0; let notIsBlind = !!res.tasks[father][children]['task']?.metadata?.created; // SE TEM A CHAVE 'created' NÃO É BLIND
                    // IDENTIFICAÇÃO DO JULGAMENTO
                    if (['Search20', 'AddressVerification',].includes(hitApp)) {
                        judge = `${judge?.value?.name || 'null'} = ${judge?.value?.address?.[0] || 'null'}`; judge = judge.replace(/, /g, ',').replace(/,/g, ', ');
                    } else if (['Categorization', 'EmailCategorizationPortugueseLanguage', 'TimeSensitiveEmailCategorizationPortugueseLanguage',].includes(hitApp)) {
                        judge = `${judge?.sender || 'null'}`;
                    } else if (['SearchAdsRelevance',].includes(hitApp)) {
                        judge = `${judge?.query || 'null'} = ${judge?.appname || 'null'}`;
                    } else { judge = 'Outro hitApp'; }
                    // ATRIBUIR BLIND
                    if (responsesFilterObj?.[father]?.[children]) {
                        // 3 → [BLIND: SIM | RESP: SIM]
                        blindNum = 3; let r = responsesFilterObj[father][children]; if (compact) { Object.values(r).forEach(o => delete o.optionsIgnore); } res.tasks[father][children]['response'] = r;
                        clip[`${judge} [${Math.random().toString(36).substring(2, 5)}]`] = Object.fromEntries(Object.entries(r).map(([k, v,]) => [k, v.value,]));
                    } else if ((hitApp === 'Search20' && projectId === 1064208) || !notIsBlind) {
                        // 2 → [BLIND: SIM | RESP: NÃO]
                        blindNum = 2;
                    } else if ((hitApp === 'Search20' && projectId === 111) || notIsBlind) {
                        // 1 → [BLIND: NÃO]
                        blindNum = 1;
                    }

                    // ATRIBUIR [geral|father|children]: blindNum
                    if (blindNum > res.tasks['0'].blindNum) { res.tasks['0'].blindNum = blindNum; }
                    if (blindNum > res.tasks[father]['0'].blindNum) { res.tasks[father]['0'].blindNum = blindNum; } res.tasks[father][children]['0'].blindNum = blindNum;
                    // ATRIBUIR [geral|father]: qtdJudge | qtdBlind
                    res.tasks['0'].qtdJudge++; res.tasks[father]['0'].qtdJudge++; if (blindNum > (res.tasks['0'].blindNum > 2 ? 2 : 1)) { res.tasks['0'].qtdBlind++; res.tasks[father]['0'].qtdBlind++; }
                    // ATRIBUIR [geral|father]: qtdResp | [children]: identificação do julgamento
                    if (blindNum > 2) { res.tasks['0'].qtdResp++; res.tasks[father]['0'].qtdResp++; } res.tasks[father][children].judge = judge;
                }
            } return { clip, res, };
        }

        // ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

        if (body) {
            // JULGAMENTO (RECEBIDO): [ÚNICO]
            arrBody.push({ 'path': false, 'body': (typeof body === 'object' ? body : JSON.parse(body)), });
        } else if (plataform) {
            // JULGAMENTOS (RECEBIDOS): PEGAR [EM MASSA] POR PLATAFORMA
            let retFile = await file({ 'action': 'list', 'path': `${fileProjetos}/${gW.project}/logs/Plataformas/${plataform}`, 'max': 24, }); if (!retFile.ret) { return retFile; }
            for (let [index, value,] of retFile.res.entries()) {
                if (value.isFolder && value.name.includes('MES_')) {
                    let retFile1 = await file({ 'action': 'list', 'path': value.path, 'max': 32, }); if (!retFile1.ret) { return retFile1; } for (let [index1, value1,] of retFile1.res.entries()) {
                        if (value1.isFolder && value1.path.includes('DIA_')) {
                            let retFile2 = await file({ 'action': 'list', 'path': value1.path, 'max': 500, }); if (!retFile2.ret) { return retFile2; } for (let [index2, value2,] of retFile2.res.entries()) {
                                if (value2.isFolder && value2.path.includes('OK')) {
                                    let retFile3 = await file({ 'action': 'list', 'path': value2.path, 'max': 500, }); if (!retFile3.ret) { return retFile3; }
                                    for (let [index3, value3,] of retFile3.res.entries()) {
                                        if (!value3.isFolder && value3.path.includes('_GET_') && includes.every(i => value3.path.includes(i))) { arrPaths.push(value3.path); }
                                    }
                                } else if (!value2.isFolder && value2.path.includes('_GET_') && includes.every(i => value2.path.includes(i))) { arrPaths.push(value2.path); }
                            }
                        }
                    }
                }
            } for (let [index, value,] of arrPaths.entries()) {
                let retFile = await file({ 'action': 'read', 'path': value, }); if (!retFile.ret) { return retFile; } retFile = JSON.parse(retFile.res); let requestId = retFile.requestId;
                if (!arrRequestId.includes(requestId)) { arrRequestId.push(requestId); arrBody.push({ 'path': value, 'body': retFile, }); }
            }
        } let pathReg = `${fileProjetos}/${gW.project}/logs/Plataformas/z_teste/reg.txt`; if (reg) { await file({ e, 'action': 'write', 'path': pathReg, 'content': 'x\n', }); }

        // ******************************************************************************************************************************************************************************************************************

        for (let [index, value,] of arrBody.entries()) {
            // → PEGAR: PERGUNTAS E OPÇÕES
            let retQuestionsOptions = await questionsOptions({ 'obj': value.body, }); // console.log(JSON.stringify(retQuestionsOptions), '\n');
            // → SEPARAR: TASKS | POSSÍVEIS RESPOSTAS
            let retTasksResponses = await tasksResponses({ 'obj': value.body, }); // console.log(JSON.stringify(retTasksResponses), '\n');
            // → ENCONTRAR: RESPOSTAS
            let retResponsesGet = await responsesGet({ 'questionsOptions': retQuestionsOptions, 'tasksResponses': retTasksResponses, }); // console.log(JSON.stringify(retResponsesGet), '\n');
            // → FILTRAR: RESPOSTAS
            let retResponsesFilter = await responsesFilter({ 'responsesGet': retResponsesGet, }); // console.log(JSON.stringify(retResponsesFilter), '\n');
            // → RETORNO
            let retReturnObj = await returnObj({ 'tasksResponses': retTasksResponses, 'responsesFilter': retResponsesFilter, 'compact': true, }); // console.log(JSON.stringify(retReturnObj), '\n');

            let r = retReturnObj; let hitApp = r.res.hitApp; let blindNum = r.res.tasks['0'].blindNum; let path = value.path; if (path) { path = path.split(`/`); path = path[path.length - 1].replace('.txt', ''); }
            let d = dateHour(new Date(r.res.timeCreated * 1000)).res; let timeCreated = `${d.day}/${d.mon}/${d.yea}`; if (reg) {
                // REGISTRAR NO TXT
                let targetLocalIds = r.res.targetLocalIds; let taskType = r.res.tasks['0'].taskType; let type = r.res.type; let conceptId = r.res.conceptId; let projectId = r.res.projectId; let requestId = r.res.requestId;
                let metadata = Object.values(r.res.tasks).flatMap(task => Object.values(task || {}).map(s => s.task?.metadata && Object.keys(s.task.metadata).length > 0)).filter(v => v !== undefined).join(' | ');
                let metadataName = Object.values(r.res.tasks).flatMap(task => Object.values(task || {}).flatMap(s => { let m = s.task?.metadata; return m ? (m.name ? [m.name,] : [false,]) : []; })).join(' | ');
                let metadataAssetType = Object.values(r.res.tasks).flatMap(task => Object.values(task || {}).flatMap(s => { let m = s.task?.metadata; return m ? (m.assetType ? [m.assetType,] : [false,]) : []; })).join(' | ');
                let metadataState = Object.values(r.res.tasks).flatMap(task => Object.values(task || {}).flatMap(s => { let m = s.task?.metadata; return m ? (m.state ? [m.state,] : [false,]) : []; })).join(' | ');
                let metadataCreatedBy = Object.values(r.res.tasks).flatMap(task => Object.values(task || {}).flatMap(s => { let m = s.task?.metadata; return m ? (m.createdBy ? [m.createdBy,] : [false,]) : []; })).join(' | ');
                let metadataCreated = Object.values(r.res.tasks).flatMap(task => Object.values(task || {}).flatMap(s => { let m = s.task?.metadata; return m ? (m.created ? [m.created,] : [false,]) : []; })).join(' | ');
                let metadataStorageType = Object.values(r.res.tasks).flatMap(task => Object.values(task || {}).flatMap(s => { let m = s.task?.metadata; return m ? (m.storageType ? [m.storageType,] : [false,]) : []; })).join(' | ');
                let qtdJudge = r.res.tasks['0'].qtdJudge; let qtdBlind = r.res.tasks['0'].qtdBlind; let qtdResp = r.res.tasks['0'].qtdResp; let t = [
                    type, conceptId, projectId, requestId, hitApp, targetLocalIds.length, path, blindNum, timeCreated, taskType, metadata, metadataName, metadataAssetType, metadataState,
                    metadataCreatedBy, metadataCreated, metadataStorageType, qtdJudge, qtdBlind, qtdResp,
                ].join('*'); t = await file({ e, 'action': 'write', 'path': pathReg, 'add': true, 'content': `${t}\n`, }); if (!t.ret) { return t; }
            }
            // qtdTask | res | blindNum | clip
            if (arrRes.qtdTask || arrRes.qtdTask === 0) { arrRes.qtdTask++; } if (arrRes.res) { if (!arrRes.res[hitApp]) { arrRes.res[hitApp] = []; } arrRes.res[hitApp].push(retReturnObj.res); }
            if (arrRes.blindNum) { if (!arrRes.blindNum[blindNum][hitApp]) { arrRes.blindNum[blindNum][hitApp] = []; } arrRes.blindNum[blindNum][hitApp].push({ 'date': timeCreated, path, }); } if (arrRes.clip) {
                if (!arrRes.clip[hitApp] && blindNum === 3) { arrRes.clip[hitApp] = []; } if (blindNum === 3) {
                    let clip = retReturnObj.clip; let order = []; if (hitApp === 'Search20') { order = ['closed_dne', 'Relevance', 'Name', 'Address', 'Pin',]; }
                    clip = Object.fromEntries(Object.entries(clip).map(([k, v,]) => [k, keysOrder(v, order),])); arrRes.clip[hitApp].push(clip);
                }
            }
        } let res = {
            ...(arrRes.qtdTask || arrRes.qtdTask === 0 ? { 'qtdTask': arrRes.qtdTask, } : {}),
            ...(arrRes.blindNum ? { 'blindNum': { '0': keysOrder(arrRes.blindNum['0']), '1': keysOrder(arrRes.blindNum['1']), '2': keysOrder(arrRes.blindNum['2']), '3': keysOrder(arrRes.blindNum['3']), }, } : {}),
            ...(arrRes.clip ? { 'clip': keysOrder(arrRes.clip), } : {}), ...(arrRes.res ? { 'res': keysOrder(arrRes.res), } : {}),
        };

        ret['ret'] = true;
        ret['msg'] = 'TASK INF: OK';
        ret['res'] = res;

    } catch (catchErr) {
        let retRegexE = await regexE({ inf, 'e': catchErr, }); ret['msg'] = retRegexE.res; ret['ret'] = false; delete ret['res'];
    }

    return { ...({ 'ret': ret.ret, }), ...(ret.msg && { 'msg': ret.msg, }), ...(ret.res && { 'res': ret.res, }), };
}

// CHROME | NODE
globalThis['taskInfTryRating'] = taskInfTryRating;


