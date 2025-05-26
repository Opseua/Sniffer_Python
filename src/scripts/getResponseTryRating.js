// let infGetResponseTryRating, retGetResponseTryRating;
// infGetResponseTryRating = { e, 'body': inf.body, };
// retGetResponseTryRating = await getResponseTryRating(infGetResponseTryRating); console.log(retGetResponseTryRating);

let e = import.meta.url, ee = e;
async function getResponseTryRating(inf = {}) {
    let ret = { 'ret': false, }; e = inf && inf.e ? inf.e : e;
    try {
        let { body, hitApp, } = inf;

        // TAREFAS: IDENTIFICAR TIPO ('resultList'/'tasks')
        function getTaskType(inf = {}) { let { obj, } = inf; if (obj.tasks && Array.isArray(obj.tasks)) { if (obj.tasks[0].taskData.resultSet) { return 'resultList'; } else { return 'tasks'; } } else { return 'n_a'; } }

        // TAREFAS: PEGAR CONTEÚDO
        function getTasks(inf = {}) {
            let { obj, } = inf; let retGetTaskType = getTaskType({ obj, }); let resOk = []; if (retGetTaskType === 'resultList') { obj.tasks[0].taskData.resultSet.resultList.forEach(item => { resOk.push(item); }); }
            else if (retGetTaskType === 'tasks') { obj.tasks.forEach(task => { resOk.push(task.taskData); }); } return { 'type': retGetTaskType, 'tasks': resOk, };
        }

        // TAREFAS: PEGAR VALOR DA CHAVE
        function getValue(inf = {}) {
            let { obj, keysSearch, } = inf; for (let key of keysSearch) { if (obj[key] !== undefined) { return [obj[key],]; } }
            for (let key in obj) { if (typeof obj[key] === 'object' && obj[key] !== null) { let value = getValue({ 'obj': obj[key], keysSearch, }); if (value.length > 0) { return value; } } } return [];
        }

        // FILTRAR CHAVE
        function filterKey(inf = {}) {
            let { obj, search, eArray, } = inf; let result = eArray ? [] : {}; for (let key in obj) {
                if (typeof obj[key] === 'object' && key !== search) {
                    result[key] = filterKey({ 'obj': obj[key], search, 'eArray': Array.isArray(obj[key]), }); if (Object.keys(result[key]).length === 0) { delete result[key]; }
                } else if (key === search) { result[key] = obj[key]; } else if (obj[key] === search) { if (eArray) { result.push(key); } else { result[key] = obj[key]; } }
            } return result;
        }

        // CRIAR PATH GENÉRICO DO VALOR DA CHAVE
        function getPathObj(inf = {}) {
            let { obj, path, } = inf; path = path || ''; let paths = {}; for (let key in obj) {
                let newPath = `${path}.${key}`; if (key === 'value') { if (Array.isArray(obj[key])) { paths[newPath.substring(1)] = [...new Set(obj[key]),]; } else { paths[newPath.substring(1)] = [obj[key],]; } }
                else if (Array.isArray(obj[key])) { obj[key].forEach((item, index) => { Object.assign(paths, getPathObj({ 'obj': item, 'path': `${newPath}.${index}`, })); }); }
                else if (typeof obj[key] === 'object') { Object.assign(paths, getPathObj({ 'obj': obj[key], 'path': newPath, })); }
            } return paths;
        }

        // PEGAR AS TAREFAS
        let responses = {}; if (body.includes(`{"serializedAnswer":{"`)) {
            let obj = JSON.parse(body); let retGetTasks = getTasks({ obj, }); for (let [index, value,] of retGetTasks.tasks.entries()) {
                let res = retGetTasks.type === 'tasks' ? value : value.value; let taskId = 'SEM_IDENTIFICACAO'; if (retGetTasks.type === 'resultList') {
                    if (value.surveyKeys) {
                        let serializedAnswer = JSON.stringify(obj.tasks[0].taskData.testQuestionInformation.answer.serializedAnswer);
                        for (let [index1, value1,] of Object.keys(value.surveyKeys).entries()) { if (serializedAnswer.includes(value.surveyKeys[value1])) { taskId = value.surveyKeys[value1]; break; } }
                    }
                } let keysValue = ''; for (let [index, value,] of [['name', 'query', 'highlightMain', 'NAME', 'textQuery', 'keyword', 'pref_name', 'chave1', 'chave2',], ['address',],].entries()) {
                    let retGetValue = getValue({ 'obj': res, 'keysSearch': value, }); keysValue = retGetValue.length === 0 ? `${keysValue}SEM_IDENTIFICACAO = ` : `${keysValue}${retGetValue[0]} = `;
                } if (retGetTasks.type === 'resultList') { res = filterKey({ obj, 'search': taskId, }); } let retGetPathObj = JSON.stringify(getPathObj({ 'obj': res, })); if (retGetPathObj !== '{}') {
                    retGetPathObj = retGetPathObj.replace(/testQuestionInformation.answer.serializedAnswer./g, ''); retGetPathObj = retGetPathObj.replace(new RegExp(`${keysValue} \\.`, 'g'), '');
                    retGetPathObj = retGetPathObj.replace(new RegExp(`${taskId} \\.`, 'g'), ''); retGetPathObj = JSON.parse(retGetPathObj); responses[`${keysValue} [${Math.random().toString(36).substring(2, 5)}]`] = retGetPathObj;
                }
            }
        }

        // INSERIR SEPARADOR DE TAREFAS
        function insertSeparator(inf = {}) {
            let { obj, } = inf; let objNew = {}; let qtd = 1; let add = '###################################';
            function adSe() { objNew[`${add}_${qtd}_${add}`] = 'x'; objNew[`_${qtd}`] = '.'; qtd++; } let keys = Object.keys(obj);
            if (keys.length > 0) { adSe(); keys.forEach((k, i) => { objNew[k] = obj[k]; if (typeof obj[k] === 'object' && !Array.isArray(obj[k]) && i !== (keys.length - 1)) { adSe(); } }); } return objNew;
        } responses = insertSeparator({ 'obj': responses, });

        // AGRUPAR VALORES
        function agroupValues(inf = {}) {
            let { obj, } = inf; let objNew = {}; for (let keyMain in obj) {
                let rootVal = obj[keyMain]; if (typeof rootVal === 'object') {
                    objNew[keyMain] = {}; for (let subKey in rootVal) {
                        let valor = rootVal[subKey]; let regex; regex = /^(.*)\.\d{1,2}\.value$/; regex = regex.test(subKey) ? regex : /^(.*)\.value$/; let match = subKey.match(regex); if (match) {
                            let [, prefixo, /* indice */] = match; let subKeyNew = prefixo;  // 'valor[0]' IGNORAR VALORES 'false' →→→ EXEMPLO: 'Closed-DNE.unexpected_language' → false
                            if (valor[0]) { if (!objNew[keyMain][subKeyNew]) { objNew[keyMain][subKeyNew] = []; } if (!objNew[keyMain][subKeyNew].includes(valor[0])) { objNew[keyMain][subKeyNew].push(valor[0]); } }
                        }
                    }
                } else { objNew[keyMain] = rootVal; }
            } return objNew;
        } responses = agroupValues({ 'obj': responses, });

        if (Object.keys(responses).length === 0) {
            ret['msg'] = `TRYRATING GET RESPONSE: ERRO | NENHUMA RESPOSTA ENCONTRADA`;
        } else {
            // REMOVER CAMINHO DESNECESSÁRIO DO PATH JSON
            let text = JSON.stringify(responses); let replace = ['tasks.0.taskData.', 'tasks.1.taskData.', 'tasks.3.taskData.', 'tasks.3.taskData.', '[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}\./g',];
            replace.forEach(s => { if (s.includes('/g')) { s = s.replace('/g', ''); } else { s = s.replace(/[*.+?^${}()|[\]\\]/g, '\\$&'); } text = text.replace(new RegExp(s, 'g'), ''); });
            text = text.replace(/, /g, ',').replace(/,/g, ', '); // [Search20] CORRIGIR ENDEREÇO 'Rua, 1351,Bairro,Município - SP,01441-000,Brasil' → 'Maria Silva, 1351, Jardim América, São Paulo - SP, 01441-000, Brasil'

            // RESPOSTAS NA MESMA ORDEM DO JULGAMENTO
            responses = JSON.parse(text); let keysOrder = []; if (hitApp === 'Search20') { keysOrder = ['Closed-DNE.closed_dne', 'Relevance.Relevance', 'Data.Name', 'Data.Address', 'Relevance.Pin',]; }
            let keysReorder = obj => Object.fromEntries(Object.entries(obj).map(([k, v,]) =>
                [k, typeof v === 'object' && !Array.isArray(v) ? Object.fromEntries([...keysOrder.flatMap(ok => Object.entries(v).filter(([ik,]) => ik.includes(ok))),
                ...Object.entries(v).filter(([ik,]) => !keysOrder.some(ok => ik.includes(ok))),]) : v,]
            )); responses = keysReorder(responses);

            ret['res'] = responses;
            ret['msg'] = `TRYRATING GET RESPONSE: OK`;
            ret['ret'] = true;
        }

    } catch (catchErr) {
        let retRegexE = await regexE({ inf, 'e': catchErr, }); ret['msg'] = retRegexE.res; ret['ret'] = false; delete ret['res'];
    }

    return { ...({ 'ret': ret.ret, }), ...(ret.msg && { 'msg': ret.msg, }), ...(ret.res && { 'res': ret.res, }), };
}

// CHROME | NODE
globalThis['getResponseTryRating'] = getResponseTryRating;


