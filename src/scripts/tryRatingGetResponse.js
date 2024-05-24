// let infTryRatingGetResponse, retTryRatingGetResponse
// infTryRatingGetResponse = { 'e': e, 'body': inf.body }
// retTryRatingGetResponse = await tryRatingGetResponse(infTryRatingGetResponse); console.log(retTryRatingGetResponse)

let e = import.meta.url, ee = e;
async function tryRatingGetResponse(inf) {
    let ret = { 'ret': false }; e = inf && inf.e ? inf.e : e;
    try {
        let { body } = inf;

        function getTaskType(inf) { let { obj } = inf; if (obj.tasks && Array.isArray(obj.tasks)) { if (obj.tasks[0].taskData.resultSet) { return 'resultList'; } else { return 'tasks'; } } else { return 'unknown'; } }

        function getTasks(inf) {
            let { obj } = inf; let retGetTaskType = getTaskType({ 'obj': obj }); let responses = []; if (retGetTaskType === 'resultList') { obj.tasks[0].taskData.resultSet.resultList.forEach(item => { responses.push(item); }); }
            else if (retGetTaskType === 'tasks') { obj.tasks.forEach(task => { responses.push(task.taskData); }); }; return { 'type': retGetTaskType, 'tasks': responses };
        }

        function getValue(inf) {
            let { obj } = inf; for (let key of ['name', 'query', 'highlightMain', 'NAME', 'textQuery', 'chave1', 'chave2']) { if (obj[key] !== undefined) { return [obj[key]]; } }
            for (let key in obj) { if (typeof obj[key] === 'object' && obj[key] !== null) { let value = getValue({ obj: obj[key] }); if (value.length > 0) { return value; } } }; return [];
        }

        function filterKeyValue(inf) {
            let { obj, search, eArray } = inf; let result = eArray ? [] : {}; for (let key in obj) {
                if (typeof obj[key] === 'object' && key !== search) {
                    result[key] = filterKeyValue({ 'obj': obj[key], 'search': search, 'eArray': Array.isArray(obj[key]) }); if (Object.keys(result[key]).length === 0) { delete result[key]; }
                } else if (key === search) { result[key] = obj[key]; } else if (obj[key] === search) { if (eArray) { result.push(key); } else { result[key] = obj[key]; } }
            }; return result;
        }

        function getPathObj(inf) {
            let { obj } = inf; let path = inf.path ? inf.path : ''; let paths = {}; for (let key in obj) {
                let newPath = `${path}.${key}`; if (key === 'value') { if (Array.isArray(obj[key])) { paths[newPath.substring(1)] = [...new Set(obj[key])]; } else { paths[newPath.substring(1)] = [obj[key]]; } }
                else if (Array.isArray(obj[key])) { obj[key].forEach((item, index) => { Object.assign(paths, getPathObj({ 'obj': item, 'path': `${newPath}.${index}` })); }); }
                else if (typeof obj[key] === 'object') { Object.assign(paths, getPathObj({ 'obj': obj[key], 'path': newPath })); }
            }; return paths;
        }

        // PEGAR AS TAREFAS
        let responses = {}; if (body.includes(`{"serializedAnswer":{"`)) {
            let obj = JSON.parse(body); let retGetTasks = getTasks({ 'obj': obj }); for (let [index, value] of retGetTasks.tasks.entries()) {
                let res = retGetTasks.type == 'tasks' ? value : value.value; let taskId = 'SEM_IDENTIFICACAO'; if (retGetTasks.type == 'resultList') {
                    if (value.surveyKeys) {
                        let serializedAnswer = JSON.stringify(obj.tasks[0].taskData.testQuestionInformation.answer.serializedAnswer)
                        for (let [index1, value1] of Object.keys(value.surveyKeys).entries()) { if (serializedAnswer.includes(value.surveyKeys[value1])) { taskId = value.surveyKeys[value1]; break }; }
                    }
                }; let retGetValue = getValue({ 'obj': res }); retGetValue = retGetValue.length == 0 ? 'SEM_IDENTIFICACAO' : retGetValue[0]
                if (retGetTasks.type == 'resultList') { res = filterKeyValue({ 'obj': obj, 'search': taskId }) }
                let retGetPathObj = JSON.stringify(getPathObj({ 'obj': res }))
                if (retGetPathObj !== '{}') {
                    retGetPathObj = retGetPathObj.replace(/testQuestionInformation.answer.serializedAnswer./g, '');
                    retGetPathObj = retGetPathObj.replace(new RegExp(`${retGetValue}\\.`, 'g'), '');
                    retGetPathObj = retGetPathObj.replace(new RegExp(`${taskId}\\.`, 'g'), '');
                    retGetPathObj = JSON.parse(retGetPathObj);
                    responses[`${retGetValue} [${Math.random().toString(36).substring(2, 5)}]`] = retGetPathObj
                }
            };
        }

        function insertSeparator(inf) {
            let { obj } = inf; let objNew = {}; let qtd = 1; let keys = Object.keys(obj); if (keys.length > 0) {
                let add = `###################################`; objNew[`${add}_${qtd}_${add}`] = 'x'; qtd++; keys.forEach((key, index) => {
                    objNew[key] = obj[key]; if (typeof obj[key] === 'object' && !Array.isArray(obj[key]) && index !== (keys.length - 1)) { objNew[`${add}_${qtd}_${add}`] = 'x'; qtd++; }
                });
            } return objNew;
        }; responses = insertSeparator({ 'obj': responses })

        function agroupValues(inf) {
            let { obj } = inf; let objNew = {}; for (let keyMain in obj) {
                let rootVal = obj[keyMain]; if (typeof rootVal === 'object') {
                    objNew[keyMain] = {}; for (let subKey in rootVal) {
                        let valor = rootVal[subKey]; let regex = /^(.*)\.(\d+)\.value$/; let match = subKey.match(regex); if (match) {
                            let [, prefixo, /* indice */] = match; let subKeyNew = `${prefixo}.[X].value`; if (!objNew[keyMain][subKeyNew]) { objNew[keyMain][subKeyNew] = []; }
                            if (!objNew[keyMain][subKeyNew].includes(valor[0])) { objNew[keyMain][subKeyNew].push(valor[0]); }
                        }
                    }
                } else { objNew[keyMain] = rootVal; }
            }; return objNew;
        }; responses = agroupValues({ 'obj': responses })

        if (Object.keys(responses).length == 0) {
            ret['msg'] = `TRYRATING GET RESPONSE: ERRO | NENHUMA RESPOSTA ENCONTRADA`;
        } else {
            ret['res'] = responses;
            ret['msg'] = `TRYRATING GET RESPONSE: OK`;
            ret['ret'] = true;
        }

    } catch (catchErr) {
        let retRegexE = await regexE({ 'inf': inf, 'e': catchErr, });
        ret['msg'] = retRegexE.res
    };
    return {
        ...({ ret: ret.ret }),
        ...(ret.msg && { msg: ret.msg }),
        ...(ret.res && { res: ret.res }),
    };
}

if (eng) { // CHROME
    window['tryRatingGetResponse'] = tryRatingGetResponse;
} else { // NODEJS
    global['tryRatingGetResponse'] = tryRatingGetResponse;
}
