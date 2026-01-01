/* eslint-disable max-len */

// BLIND [NÃO] → POIEvaluationEN
// BLIND [SIM] → POIEvaluation

let e = currentFile(new Error()), ee = e;
async function taskInfTryRating(inf = {}) {
    let ret = { 'ret': false, }; e = inf.e || e;
    try {
        let { body, includes = ['.',], reg, excludes = [], test = false, } = inf;

        let arrBody = [], arrPaths = [], arrRequestId = [], retFile, base = `logs/Plataformas`, arrRes = {
            ...(excludes.includes('qtdTask') ? {} : { 'qtdTask': 0, }), ...(excludes.includes('blindNum') ? {} : { 'blindNum': { '0': {}, '1': {}, '2': {}, '3': {}, }, }),
            ...(excludes.includes('clip') ? {} : { 'clip': {}, }), ...(excludes.includes('res') ? {} : { 'res': {}, }),
        };

        // PEGAR: VALOR DO PATH | ORDENAR CHAVES | FILTRAR RETORNO (QUANDO TEM RESPOSTA [DA ÁREA DE TRANSFERÊNCIA])
        function getValueByPath({ obj, path, split, }) { let keys = path.split(split || '.'); return keys.reduce((a, key) => { if (a && key in a) { return a[key]; } return undefined; }, obj); }
        function keysOrder(o, r) { return Object.fromEntries((r || Object.keys(o).sort((a, b) => a.localeCompare(b))).filter(k => k in o).concat(Object.keys(o).filter(k => !r?.includes(k))).map(k => [k, o[k],])); }
        function filterObj({ obj, rules, }) {
            let newObj = {}; let keysExludeSet = new Set(rules.keysExlude || []); let keysKeepOrder = rules.keysKeepOrder || [];
            keysKeepOrder.forEach(({ keyFather, keyNewName, valuesTypesExlude = [], valuesTypesKeepOrder = [], key, }) => {
                let k = key || keyFather; if (!obj[k]) { return; } let vals = Array.isArray(obj[k]) ? obj[k] : [obj[k],];
                let filtered = vals.filter(v => !valuesTypesExlude.includes(typeof v)); let ordered = valuesTypesKeepOrder.flatMap(t => filtered.filter(v => typeof v === t));
                let remaining = filtered.filter(v => !valuesTypesKeepOrder.includes(typeof v)); newObj[keyNewName || k] = [...ordered, ...remaining,];
            }); Object.keys(obj).forEach(k => { if (!keysExludeSet.has(k) && !keysKeepOrder.some(r => (r.key || r.keyFather) === k)) { newObj[k] = obj[k]; } }); return newObj;
        }

        // PEGAR: PERGUNTAS E OPÇÕES (RADIO/SELET/ETC)
        async function questionsOptions(inf = {}) {
            let { obj, } = inf; let res = {}, infObjFilter = { e, obj, 'noCaseSensitive': true, 'split': '=', 'keys': ['ratingFieldKey',], 'filters': [{ 'includes': [`*Checkbox*`, `*Dropdown*`, `*Radio*`,], },], };
            let retObjFilter = await objFilter(infObjFilter); for (let [index, valueOk,] of retObjFilter.res.entries()) {
                let { key, } = valueOk; key = key.replace('=ratingFieldKey', ''); let retGetValueByPath = getValueByPath({ obj, 'path': key, 'split': '=', });
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
            let { 'questionsOptions': questionsOptionsObj, 'tasksResponses': tasksResponsesObj, } = inf; let { tasks, responses, } = tasksResponsesObj; let res = { 'searchByKey': [], 'searchByValue': [], };
            let getValues = (data) => Array.isArray(data) ? data.map(i => i.value) : [data.value ?? data,]; let infObjFilter, retObjFilter; for (let [index, value,] of Object.keys(tasks).filter(k => k !== '0').entries()) {
                let father = value; let childrens = Object.keys(tasks[father]).filter(k => k !== '0'); for (let [index1, value1,] of childrens.entries()) {
                    let children = value1; for (let [index2, value2,] of Object.keys(questionsOptionsObj).entries()) {
                        let ratingFieldKey = value2; value2 = questionsOptionsObj[value2]; let { fieldType, question, options, } = value2; let keys = [ratingFieldKey,];
                        let valuesLabel = options.some(i => i.label) ? options.map(i => i.label) : [], valuesValue = options.some(i => i.value) ? options.map(i => i.value) : [];

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
            let { 'responsesGet': responsesGetObj, } = inf; let { searchByKey, searchByValue, } = responsesGetObj; let res = {}; for (let [index, valueOk,] of [...searchByKey, ...searchByValue,].entries()) {
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

        // JUNTAR: TASKS | PERGUNTAS E OPÇÕES (RADIO/SELET/ETC) | RESPOSTAS 
        // blindNum:   0 → [BLIND: ???] | 1 → [BLIND: NÃO] | 2 → [BLIND: SIM] | 3 → [RESP: SIM]
        // qualityNum: 0 → [REQUIRED FOR QUALIFICATION TEST: ???] | 1 → [REQUIRED FOR QUALIFICATION TEST: NÃO] | 2 → [REQUIRED FOR QUALIFICATION TEST: SIM]
        async function returnObj(inf = {}) {
            let clip = {}, add = { 'blindNum': 0, 'qualityNum': 0, 'qtdJudge': 0, 'qtdBlind': 0, 'qtdResp': 0, 'qtdQuality': 0, }, { 'tasksResponses': tasksResponsesObj, 'responsesFilter': responsesFilterObj, compact, } = inf;
            let { tasks, } = tasksResponsesObj; let { type, conceptId, projectId, requestId, hitApp, targetLocalIds, timeCreated, taskType, } = tasks['0'];
            let res = { type, conceptId, projectId, requestId, hitApp, targetLocalIds, timeCreated, 'tasks': { '0': { ...add, taskType, }, }, };
            for (let [index, value,] of Object.keys(tasks).filter(k => k !== '0').entries()) {
                let father = value, childrens = Object.keys(tasks[father]).filter(k => k !== '0'); if (!res.tasks[father]) { res.tasks[father] = { '0': { ...add, }, }; }
                for (let [index1, value1,] of childrens.entries()) { /// SE TEM A CHAVE 'created' NÃO É BLIND
                    let children = value1; if (!res.tasks[father][children]) { delete tasks[father][children].taskType; res.tasks[father][children] = { '0': { 'blindNum': 0, 'qualityNum': 0, }, judge: 'x', task: tasks[father][children], }; }
                    let judge = res.tasks[father][children]['task'], judgeObj = judge, blindNum = 0, qualityNum = 0, notIsBlind = !!res.tasks[father][children]['task']?.metadata?.created;
                    let idxTask = taskType === 'tasks' ? index : index1; let quality = judgeObj?.testQuestionInformation?.requiredForQualificationTest; quality = quality === undefined ? null : quality;

                    // CHAVES QUE PODEM TER A RESPOSTA
                    let ___text = judgeObj?.text, ___comment = judgeObj?.testQuestionInformation?.comment; ___text = ___text === undefined ? null : ___text; ___comment = ___comment === undefined ? null : ___comment;
                    qualityNum = quality === false ? 1 : quality === true ? 2 : 0;

                    // IDENTIFICAÇÃO DO JULGAMENTO
                    if (['Search20', 'AddressVerification',].includes(hitApp)) {
                        judge = `${judge?.value?.name || 'null'} = ${judge?.value?.address?.[0] || 'null'}`; judge = judge.replace(/, /g, ',').replace(/,/g, ', ');
                    } else if (['Categorization', 'EmailCategorizationPortugueseLanguage', 'TimeSensitiveEmailCategorizationPortugueseLanguage',].includes(hitApp)) {
                        judge = `${judge?.sender || 'null'}`;
                    } else if (['SearchAdsRelevance',].includes(hitApp)) {
                        judge = `${judge?.query || 'null'} = ${judge?.appname || 'null'}`;
                    } else { judge = `Sem identificação`; }

                    // ATRIBUIR BLIND E RESPOSTA
                    if (responsesFilterObj?.[father]?.[children]) {
                        // 3 → [BLIND: SIM | RESP: SIM]
                        blindNum = 3; let r = responsesFilterObj[father][children]; if (compact) { Object.values(r).forEach(o => delete o.optionsIgnore); } res.tasks[father][children]['response'] = r;
                        let objOk = Object.fromEntries(Object.entries(r).map(([k, v,]) => [k, v.value,])); if (['POIEvaluation',].some(a => hitApp.includes(a))) {
                            // FILTRAR RESPOSTA (PARA REMOVER CHAVES DESNCESSÁRIAS E ORDENAR IGUAL AS PERGUNTAS)
                            let rules = {
                                'keysExlude': ['validity', 'entry_point_general_dropdown', 'entry_point_primary_dropdown', 'address_primary_street',], 'keysKeepOrder': [
                                    { 'key': 'validity', 'keyNewName': 'POI Validity', 'valuesTypesExlude': ['boolean', 'object',], 'valuesTypesKeepOrder': ['string',], },
                                    { 'key': 'name_primary_dropdown', 'keyNewName': 'Name', 'valuesTypesExlude': ['boolean', 'object',], 'valuesTypesKeepOrder': ['string',], },
                                    { 'key': 'address_primary_dropdown', 'keyNewName': 'Address', 'valuesTypesExlude': ['boolean', 'object',], 'valuesTypesKeepOrder': ['string',], },
                                    { 'key': 'phone_primary_dropdown', 'keyNewName': 'Phone', 'valuesTypesExlude': ['boolean', 'object',], 'valuesTypesKeepOrder': ['string',], },
                                    { 'key': 'url_primary_dropdown', 'keyNewName': 'URL', 'valuesTypesExlude': ['boolean', 'object',], 'valuesTypesKeepOrder': ['string',], },
                                    { 'key': 'category_primary_dropdown', 'keyNewName': 'Category', 'valuesTypesExlude': ['boolean', 'object',], 'valuesTypesKeepOrder': ['string',], },
                                    { 'key': 'pin_primary_dropdown', 'keyNewName': 'Pin', 'valuesTypesExlude': ['boolean', 'object',], 'valuesTypesKeepOrder': ['string',], },
                                    { 'key': 'hours_primary_dropdown', 'keyNewName': 'Hours', 'valuesTypesExlude': ['boolean', 'object',], 'valuesTypesKeepOrder': ['string',], },
                                ],
                            }; objOk = filterObj({ 'obj': objOk, rules, });
                        }
                        objOk = { '0': { quality, ___text, ___comment, }, ...objOk, }; clip[`(Nº: ${idxTask + 1}) [${father}] {${children}} <${judge}>`] = objOk;
                    } else if ((hitApp === 'Search20' && projectId === 1064208) || !notIsBlind) {
                        // 2 → [BLIND: SIM | RESP: NÃO]
                        blindNum = 2;
                    } else if ((hitApp === 'Search20' && projectId === 111) || notIsBlind) {
                        // 1 → [BLIND: NÃO]
                        blindNum = 1;
                    }

                    // ATRIBUIR [geral|father|children]: blindNum
                    if (blindNum > res.tasks['0'].blindNum) { res.tasks['0'].blindNum = blindNum; }
                    if (blindNum > res.tasks[father]['0'].blindNum) { res.tasks[father]['0'].blindNum = blindNum; }
                    res.tasks[father][children]['0'].blindNum = blindNum;

                    // ATRIBUIR [geral|father|children]: qualityNum
                    if (qualityNum > res.tasks['0'].qualityNum) { res.tasks['0'].qualityNum = qualityNum; }
                    if (qualityNum > res.tasks[father]['0'].qualityNum) { res.tasks[father]['0'].qualityNum = qualityNum; }
                    res.tasks[father][children]['0'].qualityNum = qualityNum;

                    // ATRIBUIR [geral|father]: qtdJudge | qtdBlind
                    res.tasks['0'].qtdJudge++; res.tasks[father]['0'].qtdJudge++; if (blindNum > (res.tasks['0'].blindNum > 2 ? 2 : 1)) { res.tasks['0'].qtdBlind++; res.tasks[father]['0'].qtdBlind++; }
                    // ATRIBUIR [geral|father]: qtdResp | [children]: identificação do julgamento
                    if (blindNum > 2) { res.tasks['0'].qtdResp++; res.tasks[father]['0'].qtdResp++; } if (quality) { res.tasks['0'].qtdQuality++; res.tasks[father]['0'].qtdQuality++; }
                    res.tasks[father][children].judge = judge;
                }
            } return { clip, res, };
        }

        // ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

        if (body) {
            // JULGAMENTO (RECEBIDO): [ÚNICO]
            arrBody.push({ 'path': false, 'body': (typeof body === 'object' ? body : JSON.parse(body)), });
        } else {
            // JULGAMENTOS (RECEBIDOS): PEGAR [EM MASSA]
            let basePath = `${fileProjetos}/${gW.project}/${base}/TryRating`, queue = [basePath,]; while (queue.length) {
                let currentPath = queue.shift(), r = await file({ 'action': 'list', 'path': currentPath, 'max': 500, }); if (!r.ret) { return r; } for (let v of r.res) {
                    let boolean = false; if (v.isFolder) {
                        if (v.name.startsWith(`ANO_`)) { boolean = true; } else if (v.name.startsWith(`MES_`)) { boolean = true; }
                        else if (v.name.startsWith(`DIA_`)) { boolean = true; } else if (v.name === `OK`) { boolean = true; } if (boolean) { queue.push(v.path); }
                    } else if (v.name.endsWith(`.txt`) && v.name.includes('-GET-') && includes.every(i => v.path.includes(i))) { arrPaths.push(v.path); }
                }
            } for (let [index, value,] of arrPaths.entries()) {
                retFile = await file({ 'action': 'read', 'path': value, }); if (!retFile.ret) { return retFile; } retFile = JSON.parse(retFile.res); let requestId = retFile.requestId;
                if (!arrRequestId.includes(requestId)) { arrRequestId.push(requestId); arrBody.push({ 'path': value, 'body': retFile, }); }
            } console.log(`TOTAL: ${arrPaths.length} | SEM ID DUPLICADO: ${arrBody.length}`);
        } let pathReg = `${fileProjetos}/${gW.project}/${base}/z_OUTROS/regTryRating.txt`; if (reg) { await file({ e, 'action': 'write', 'path': pathReg, 'content': 'x\n', }); }

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

            let r = retReturnObj, hitApp = r.res.hitApp, blindNum = r.res.tasks['0'].blindNum, path = value.path; if (path) { path = path.split(`/`); path = path[path.length - 1].replace('.txt', ''); }
            let d = dateHour(new Date(r.res.timeCreated * 1000)).res; let timeCreated = `${d.day}/${d.mon}/${d.yea}`; if (reg) {
                // REGISTRAR NO TXT
                let targetLocalIds = r.res.targetLocalIds, taskType = r.res.tasks['0'].taskType, type = r.res.type, conceptId = r.res.conceptId, projectId = r.res.projectId, requestId = r.res.requestId;
                let metadata = Object.values(r.res.tasks).flatMap(task => Object.values(task || {}).map(s => s.task?.metadata && Object.keys(s.task.metadata).length > 0)).filter(v => v !== undefined).join(' | ');
                let metadataName = Object.values(r.res.tasks).flatMap(task => Object.values(task || {}).flatMap(s => { let m = s.task?.metadata; return m ? (m.name ? [m.name,] : [false,]) : []; })).join(' | ');
                let metadataAssetType = Object.values(r.res.tasks).flatMap(task => Object.values(task || {}).flatMap(s => { let m = s.task?.metadata; return m ? (m.assetType ? [m.assetType,] : [false,]) : []; })).join(' | ');
                let metadataState = Object.values(r.res.tasks).flatMap(task => Object.values(task || {}).flatMap(s => { let m = s.task?.metadata; return m ? (m.state ? [m.state,] : [false,]) : []; })).join(' | ');
                let metadataCreatedBy = Object.values(r.res.tasks).flatMap(task => Object.values(task || {}).flatMap(s => { let m = s.task?.metadata; return m ? (m.createdBy ? [m.createdBy,] : [false,]) : []; })).join(' | ');
                let metadataCreated = Object.values(r.res.tasks).flatMap(task => Object.values(task || {}).flatMap(s => { let m = s.task?.metadata; return m ? (m.created ? [m.created,] : [false,]) : []; })).join(' | ');
                let metadataStorageType = Object.values(r.res.tasks).flatMap(task => Object.values(task || {}).flatMap(s => { let m = s.task?.metadata; return m ? (m.storageType ? [m.storageType,] : [false,]) : []; })).join(' | ');
                let qtdJudge = r.res.tasks['0'].qtdJudge, qtdBlind = r.res.tasks['0'].qtdBlind, qtdResp = r.res.tasks['0'].qtdResp, t = [
                    type, conceptId, projectId, requestId, hitApp, targetLocalIds.length, path, blindNum, timeCreated, taskType, metadata, metadataName, metadataAssetType, metadataState,
                    metadataCreatedBy, metadataCreated, metadataStorageType, qtdJudge, qtdBlind, qtdResp,
                ].join('*'); t = await file({ e, 'action': 'write', 'path': pathReg, 'add': true, 'content': `${t}\n`, }); if (!t.ret) { return t; }
            }
            // qtdTask | res | blindNum | clip
            if (arrRes.qtdTask || arrRes.qtdTask === 0) { arrRes.qtdTask++; } if (arrRes.res) { if (!arrRes.res[hitApp]) { arrRes.res[hitApp] = []; } arrRes.res[hitApp].push(retReturnObj.res); }
            if (arrRes.blindNum) { if (!arrRes.blindNum[blindNum][hitApp]) { arrRes.blindNum[blindNum][hitApp] = []; } arrRes.blindNum[blindNum][hitApp].push({ 'date': timeCreated, path, }); } if (arrRes.clip) {
                if (!arrRes.clip[hitApp] && blindNum === 3) { arrRes.clip[hitApp] = []; } if (blindNum === 3) {
                    let clip = retReturnObj.clip, order = []; if (hitApp === 'Search20') { order = ['closed_dne', 'Relevance', 'Name', 'Address', 'Pin',]; }
                    clip = Object.fromEntries(Object.entries(clip).map(([k, v,]) => [k, keysOrder(v, order),])); arrRes.clip[hitApp].push(clip);
                }
            }
        } let res = {
            ...(arrRes.qtdTask || arrRes.qtdTask === 0 ? { 'qtdTask': arrRes.qtdTask, } : {}),
            ...(arrRes.blindNum ? { 'blindNum': { '0': keysOrder(arrRes.blindNum['0']), '1': keysOrder(arrRes.blindNum['1']), '2': keysOrder(arrRes.blindNum['2']), '3': keysOrder(arrRes.blindNum['3']), }, } : {}),
            ...(arrRes.clip ? { 'clip': keysOrder(arrRes.clip), } : {}), ...(arrRes.res ? { 'res': keysOrder(arrRes.res), } : {}),
        };

        // REDUZIR RESPOSTA PARA OTIMIZAR A LEITURA
        let clipOk = {}, clip = res?.clip, order = [`eligibility`, `state`, `url`, `name`, `address`, `pin`, `phone`, `category`, `hours`,], keys = ['label', 'value',];
        let ignoreDuplicateKeys = true, ignoreTranslate = !!test, ignoreBreakLine = false; let tasksArr = [`POIEvaluation`, `POIEvaluationEN`,]; if (clip) {
            let x = { order, keys, ignoreDuplicateKeys, ignoreTranslate, ignoreBreakLine, }; for (let key in clip) {
                if (tasksArr.includes(key) && Array.isArray(clip[key])) {
                    clipOk[key] = []; for (let item of clip[key]) { let retOk = await taskInfReduceTryRating({ 'obj': item, ...x, }); clipOk[key].push(retOk?.res || item); }
                } else { clipOk[key] = clip[key]; }
            } res.clip = clipOk;
        }

        ret['ret'] = true;
        ret['msg'] = 'TASK INF TRYRATING: OK';
        ret['res'] = res;

    } catch (catchErr) {
        let retRegexE = await regexE({ inf, 'e': catchErr, }); ret['msg'] = retRegexE.res; ret['ret'] = false; delete ret['res'];
    }

    return { ...({ 'ret': ret.ret, }), ...(ret.msg && { 'msg': ret.msg, }), ...(ret.hasOwnProperty('res') && { 'res': ret.res, }), };
}

// CHROME | NODE
globalThis['taskInfTryRating'] = taskInfTryRating;


