// await import('./resources/@export.js'); // TESTES

// let infJudgesGetResponse, retJudgesGetResponse 
// infJudgesGetResponse = { 'e': e, 'json': JSON.stringify(jsonOk) }
// retJudgesGetResponse = await judgesGetResponse(infJudgesGetResponse)
// console.log(retJudgesGetResponse)

let e = import.meta.url, ee = e;
async function judgesGetResponse(inf) {
    let ret = { 'ret': false }; e = inf && inf.e ? inf.e : e;
    try {
        let { json } = inf;

        function verificarTipoTarefas(inf) { let { json } = inf; if (json.tasks && Array.isArray(json.tasks)) { if (json.tasks[0].taskData.resultSet) { return 'resultList'; } else { return 'tasks'; } } else { return 'unknown'; } }

        function retornarTarefas(inf) {
            let { json } = inf; let tipoTarefas = verificarTipoTarefas({ 'json': json }); let respostas = [];
            if (tipoTarefas === 'resultList') { json.tasks[0].taskData.resultSet.resultList.forEach(item => { respostas.push(item); }); }
            else if (tipoTarefas === 'tasks') { json.tasks.forEach(task => { respostas.push(task.taskData); }); }; return { 'tipo': tipoTarefas, 'tarefas': respostas };
        }

        function retornarValor(inf) { let { json } = inf; for (let chave of ['name', 'query', 'chave1', 'chave2']) { if (json[chave] !== undefined) { return [json[chave]]; } }; return []; }

        function filtrarChaveValor(inf) {
            let { json, procurar, eArray } = inf; let resultado = eArray ? [] : {}; for (let chave in json) {
                if (typeof json[chave] === 'object' && chave !== procurar) {
                    resultado[chave] = filtrarChaveValor({ 'json': json[chave], 'procurar': procurar, 'eArray': Array.isArray(json[chave]) }); if (Object.keys(resultado[chave]).length === 0) { delete resultado[chave]; }
                } else if (chave === procurar) { resultado[chave] = json[chave]; } else if (json[chave] === procurar) { if (eArray) { resultado.push(chave); } else { resultado[chave] = json[chave]; } }
            }; return resultado;
        }

        function retornarPath(inf) {
            let { json } = inf; let path = inf.path ? inf.path : ''; let paths = {}; for (let key in json) {
                let newPath = `${path}.${key}`; if (key === 'value') { if (Array.isArray(json[key])) { paths[newPath.substring(1)] = [...new Set(json[key])]; } else { paths[newPath.substring(1)] = [json[key]]; } }
                else if (Array.isArray(json[key])) { json[key].forEach((item, index) => { Object.assign(paths, retornarPath({ 'json': item, 'path': `${newPath}.${index}` })); }); }
                else if (typeof json[key] === 'object') { Object.assign(paths, retornarPath({ 'json': json[key], 'path': newPath })); }
            }; return paths;
        }

        // PEGAR AS TAREFAS
        let respostas = {};
        if (json.includes(`{"serializedAnswer":{"`) || json.includes(`{"serializedAnswer":[`)) {
            json = JSON.parse(json)
            let retornoRetornarTarefas = retornarTarefas({ 'json': json })
            for (let [index, value] of retornoRetornarTarefas.tarefas.entries()) {
                let tarefaId = retornoRetornarTarefas.tipo == 'resultList' ? value.surveyKeys['193'] : ''
                value = retornoRetornarTarefas.tipo == 'tasks' ? value : value.value
                let retornoRetornarValor = retornarValor({ 'json': value }); retornoRetornarValor = retornoRetornarValor.length == 0 ? 'SEM_IDENTIFICACAO' : retornoRetornarValor[0]
                if (retornoRetornarTarefas.tipo == 'resultList') {
                    value = filtrarChaveValor({ 'json': json, 'procurar': tarefaId })
                }
                let retornoRetornarPath = retornarPath({ 'json': value });
                if (JSON.stringify(retornoRetornarPath) !== '{}') {
                    retornoRetornarPath = JSON.stringify(retornoRetornarPath)
                    retornoRetornarPath = retornoRetornarPath.replace(/testQuestionInformation.answer.serializedAnswer./g, '')
                    retornoRetornarPath = retornoRetornarPath.replace(new RegExp(`${retornoRetornarValor}`, 'g'), '');
                    retornoRetornarPath = retornoRetornarPath.replace(new RegExp(`${tarefaId}`, 'g'), '');
                    retornoRetornarPath = retornoRetornarPath.replace(new RegExp(`},"`, 'g'), '},"aaa":"aa","');
                    retornoRetornarPath = JSON.parse(retornoRetornarPath)
                    respostas[retornoRetornarValor] = retornoRetornarPath
                }
            };
        } else {
            // console.log('RESPOSTA [NÃO]')
        }

        function inserirChavesSeparadoras(objeto) {
            let novoObjeto = {}; let contador = 1; let add = `######################################`; novoObjeto[`${add}_${contador}_${add}`] = 'x'; contador++;
            for (let chave in objeto) { novoObjeto[chave] = objeto[chave]; if (typeof objeto[chave] === 'object' && !Array.isArray(objeto[chave])) { novoObjeto[`${add}_${contador}_${add}`] = 'x'; contador++; } }; return novoObjeto;
        }; respostas = inserirChavesSeparadoras(respostas)

        function agruparValores(objeto) {
            let newObj = {}; for (let chavePrincipal in objeto) {
                let rootVal = objeto[chavePrincipal]; if (typeof rootVal === 'object') {
                    newObj[chavePrincipal] = {}; for (let subChave in rootVal) {
                        let valor = rootVal[subChave]; let regex = /^(.*)\.(\d+)\.value$/; let match = subChave.match(regex); if (match) {
                            let [, prefixo, /* indice */] = match; let novaSubChave = `${prefixo}.[X].value`; if (!newObj[chavePrincipal][novaSubChave]) { newObj[chavePrincipal][novaSubChave] = []; }
                            if (!newObj[chavePrincipal][novaSubChave].includes(valor[0])) { newObj[chavePrincipal][novaSubChave].push(valor[0]); }
                        }
                    }
                } else { newObj[chavePrincipal] = rootVal; }
            }; return newObj;
        }; respostas = agruparValores(respostas)

        ret['res'] = respostas;
        ret['msg'] = `JUDGES GET RESPONSE: OK`;
        ret['ret'] = true;

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
    window['judgesGetResponse'] = judgesGetResponse;
} else { // NODEJS
    global['judgesGetResponse'] = judgesGetResponse;
}
