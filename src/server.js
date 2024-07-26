function startupFun(b, c) { let a = c - b; let s = Math.floor(a / 1000); let m = a % 1000; let f = m.toString().padStart(3, '0'); return `${s}.${f}` }; let startup = new Date();
await import('./resources/@export.js');

let e = import.meta.url, ee = e;
async function serverRun(inf) {
    let ret = { 'ret': false }; e = inf && inf.e ? inf.e : e;
    try {
        logConsole({ 'e': e, 'ee': ee, 'write': true, 'msg': `**************** SERVER **************** [${startupFun(startup, new Date())}]` })

        let infConfigStorage, retConfigStorage; // cs = await csf([{}]); gO.inf = cs.res // ***** CS ***** GET
        infConfigStorage = { 'e': e, 'action': 'get', 'key': 'sniffer' }; retConfigStorage = await configStorage(infConfigStorage); if (!retConfigStorage.ret) { return retConfigStorage }
        else { retConfigStorage = retConfigStorage.res }; let portSocket = retConfigStorage.portSocket, bufferSocket = retConfigStorage.bufferSocket, arrUrl = retConfigStorage.arrUrl

        // CLIENT (NÃO POR COMO 'await'!!!) | MANTER NO FINAL
        client({ 'e': e })

        async function funGetSend(inf) {
            let ret = { 'complete': true, res: {} }
            try {
                let { getSend, url, body, platform } = inf; ret['res']['getSend'] = getSend; let showLog = false; if (arrUrl.find(infRegex => regex({ 'simple': true, 'pattern': infRegex, 'text': url }))) {
                    if (!platform) { platform = url.includes('ewoq') ? 'EWOQ' : url.includes('tryrating') ? 'TryRating' : 'NAO_IDENTIFICADO' }; let urlCurrent;
                    // ######################################################################

                    // #### NTFY | /home
                    if ((getSend == 'send') && regex({ 'simple': true, 'pattern': arrUrl[0], 'text': url })) { ret['res']['body'] = body.replace(/CASA/g, 'AAAAAAAA'); }

                    // #### EWOQ
                    if (platform.includes('EWOQ')) {
                        /* [1] → INÍCIO */; urlCurrent = `/home`; // INSPECIONAR → /(GetNewTasks|GetTemplate|RecordTaskRenderingLatency|SubmitFeedback)/
                        if ((getSend == 'get') && regex({ 'simple': true, 'pattern': arrUrl[1], 'text': url })) { ewoq({ 'platform': platform, 'url': `${platform}${urlCurrent}`, 'body': body }) }

                        /* [2] → RECEBE A TASK */; urlCurrent = `/GetNewTasks`;
                        if ((getSend == 'get') && regex({ 'simple': true, 'pattern': arrUrl[2], 'text': url })) { ewoq({ 'platform': platform, 'url': `${platform}${urlCurrent}`, 'body': body }) }

                        /* [3] → SOLICITA O TEMPLATE */; urlCurrent = `/GetTemplate_[1-SEND]`;
                        if ((getSend == 'send') && regex({ 'simple': true, 'pattern': arrUrl[3], 'text': url })) { ewoq({ 'platform': platform, 'url': `${platform}${urlCurrent}`, 'body': body }) }

                        /* [4] → RECEBE O TEMPLATE */; urlCurrent = `/GetTemplate_[2-GET]`;
                        if ((getSend == 'get') && regex({ 'simple': true, 'pattern': arrUrl[3], 'text': url })) { ewoq({ 'platform': platform, 'url': `${platform}${urlCurrent}`, 'body': body }) }

                        /* [5] → TASK 100% CARREGADA */; urlCurrent = `/RecordTaskRenderingLatency_[TASK_100%_LOADED]`;
                        if ((getSend == 'send') && regex({ 'simple': true, 'pattern': arrUrl[4], 'text': url })) { ewoq({ 'platform': platform, 'url': `${platform}${urlCurrent}`, 'body': body }) }

                        /* [6] → ENVIA A RESPOSTA DA TASK */; urlCurrent = `/SubmitFeedback`;
                        if ((getSend == 'send') && regex({ 'simple': true, 'pattern': arrUrl[5], 'text': url })) { ewoq({ 'platform': platform, 'url': `${platform}${urlCurrent}`, 'body': body }) }
                    }

                    // #### TryRating
                    if (platform.includes('TryRating')) {
                        /* [1] → INÍCIO */; urlCurrent = `/home`;
                        if ((getSend == 'get') && regex({ 'simple': true, 'pattern': arrUrl[6], 'text': url })) { tryRating({ 'platform': platform, 'url': `${platform}${urlCurrent}`, 'body': body }) }

                        /* [2] → RECEBE A TASK */; urlCurrent = `/survey`;
                        if ((getSend == 'get') && regex({ 'simple': true, 'pattern': arrUrl[7], 'text': url })) { tryRating({ 'platform': platform, 'url': `${platform}${urlCurrent}`, 'body': body }) }

                        /* [3] → ENVIA A RESPOSTA DA TASK */; urlCurrent = `/client_log`;
                        if ((getSend == 'send') && regex({ 'simple': true, 'pattern': arrUrl[8], 'text': url })) { tryRating({ 'platform': platform, 'url': `${platform}${urlCurrent}`, 'body': body }) }
                    }

                    // #### Outlier
                    if (platform.includes('Outlier')) {
                        /* [1] → INÍCIO */; urlCurrent = `/en/expert`;
                        if ((getSend == 'get') && regex({ 'simple': true, 'pattern': arrUrl[9], 'text': url })) { outlier({ 'platform': platform, 'url': `${platform}${urlCurrent}`, 'body': body }) }

                        /* [2] → RECEBE A TASK */; urlCurrent = `/internal/v2/tasks/new_queue`;
                        if ((getSend == 'get') && regex({ 'simple': true, 'pattern': arrUrl[10], 'text': url })) { outlier({ 'platform': platform, 'url': `${platform}${urlCurrent}`, 'body': body }) }

                        /* [3] → ENVIA O LINTER */; urlCurrent = `/internal/genai/runPerStepResponseLinter_[1-SEND]`;
                        if ((getSend == 'send') && regex({ 'simple': true, 'pattern': arrUrl[11], 'text': url })) { outlier({ 'platform': platform, 'url': `${platform}${urlCurrent}`, 'body': body }) }

                        /* [4] → RECEBE O LINTER */; urlCurrent = `/internal/genai/runPerStepResponseLinter_[2-GET]`;
                        if ((getSend == 'get') && regex({ 'simple': true, 'pattern': arrUrl[11], 'text': url })) { outlier({ 'platform': platform, 'url': `${platform}${urlCurrent}`, 'body': body }) }

                        /* [5] → ENVIA A RESPOSTA DA TASK */; urlCurrent = `internal/complete/chat`;
                        if ((getSend == 'send') && regex({ 'simple': true, 'pattern': arrUrl[12], 'text': url })) { outlier({ 'platform': platform, 'url': `${platform}${urlCurrent}`, 'body': body }) }
                    }

                    // ######################################################################
                    if (!ret.complete) { showLog = 'REQ/RES CANCELADA' } else if (ret.res && (ret.res.body || ret.res.headers)) { showLog = 'REQ/RES ALTERADA' }
                } else { showLog = `OUTRO URL | ${url}` }; if (showLog) { logConsole({ 'e': e, 'ee': ee, 'write': true, 'msg': `JS → ${showLog}` }); }
            } catch (catchErr) {
                let retRegexE = await regexE({ 'inf': inf, 'e': catchErr, }); ret['msg'] = retRegexE.res;
            }; return { ...({ ret: ret.ret }), ...(ret.msg && { msg: ret.msg }), ...(ret.res && { res: ret.res }), };
        }


        // *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-* TESTES *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*


        // let hitApps = [ // [platform] → COM OU SEM '_teste' | [hitAppType] → blindNao respSim respNao
        //     // { 'platform': 'EWOQ_teste', 'hitApp': 'YouTube_Video_Inappropriateness_Evaluation', 'hitAppType': 'blindNao' },
        //     // { 'platform': 'TryRating_teste', 'hitApp': 'DrivingNavigation3DMaps', 'hitAppType': 'respNao' },
        //     { 'platform': 'Outlier', 'hitApp': 'AI', 'hitAppType': 'blindNao' },
        // ];

        // let platformOption = {
        //     'EWOQ': [
        //         { 'url': arrUrl[1], 'getSend': 'get', 'file': '1-GET_##_VAZIO_##.txt' }, // [1] → INÍCIO
        //         { 'url': arrUrl[2], 'getSend': 'get', 'file': '2-GET_TASK_1-${hitAppType}.txt' }, // [2] → RECEBE A TASK
        //         { 'url': arrUrl[3], 'getSend': 'send', 'file': '3-SEND_TEMPLATE-${hitAppType}.txt' }, // [3] → SOLICITA O TEMPLATE
        //         { 'url': arrUrl[3], 'getSend': 'get', 'file': '4-GET_TEMPLATE-${hitAppType}.txt' }, // [4] → RECEBE O TEMPLATE
        //         // { 'url': arrUrl[2], 'getSend': 'get', 'file': '2-GET_TASK_2-${hitAppType}.txt' }, // [2] → RECEBE A TASK
        //         { 'url': arrUrl[4], 'getSend': 'send', 'file': '5-SEND_TASK_1_100_LOADED-${hitAppType}.txt' }, // [5] → TASK 100% CARREGADA
        //         { 'url': arrUrl[5], 'getSend': 'send', 'file': '6-SEND_TASK_1-${hitAppType}.txt' }, // [6] → ENVIA A RESPOSTA DA TASK
        //         // { 'url': arrUrl[4], 'getSend': 'send', 'file': '5-SEND_TASK_2_100_LOADED-${hitAppType}.txt' }, // [5] → TASK 100% CARREGADA
        //         // { 'url': arrUrl[5], 'getSend': 'send', 'file': '6-SEND_TASK_2-${hitAppType}.txt' }, // [6] → ENVIA A RESPOSTA DA TASK
        //     ],
        //     'TryRating': [
        //         { 'url': arrUrl[6], 'getSend': 'get', 'file': '1-GET_##_VAZIO_##.txt' }, // [1] → INÍCIO
        //         { 'url': arrUrl[7], 'getSend': 'get', 'file': '2-GET_TASK-${hitAppType}.txt' }, // [2] → RECEBE A TASK
        //         { 'url': arrUrl[8], 'getSend': 'send', 'file': '3-SEND_TASK-${hitAppType}.txt' }, // [3] → ENVIA A RESPOSTA DA TASK
        //     ],
        //     'Outlier': [
        //         { 'url': arrUrl[9], 'getSend': 'get', 'file': '1-GET_##_VAZIO_##.txt' }, // [1] → INÍCIO
        //         { 'url': arrUrl[10], 'getSend': 'get', 'file': '2-GET_TASK-${hitAppType}.txt' }, // [2] → RECEBE A TASK
        //         { 'url': arrUrl[11], 'getSend': 'send', 'file': '3-SEND_LINTER-${hitAppType}.txt' }, // [3] → ENVIA O LINTER
        //         { 'url': arrUrl[11], 'getSend': 'get', 'file': '4-GET_LINTER-${hitAppType}.txt' }, // [4] → RECEBE O LINTER
        //         { 'url': arrUrl[12], 'getSend': 'send', 'file': '5-SEND_TASK-${hitAppType}.txt' }, // [5] → ENVIA A RESPOSTA DA TASK
        //     ],
        // }

        // for (let [index, value] of hitApps.entries()) {
        //     let platform = [value.platform.replace('_teste', '')]; platform.push(`${platform[0]}_teste`);
        //     let infFile, retFile, pathLogPlataform = `${letter}:/ARQUIVOS/PROJETOS/Sniffer_Python/log/Plataformas/z_teste/${platform[0]}/${value.hitApp}`; for (let [index, value1] of platformOption[platform[0]].entries()) {
        //         infFile = { 'e': e, 'action': 'read', 'path': `${pathLogPlataform}/${value1.file.replace('${hitAppType}', value.hitAppType)}` }
        //         retFile = await file(infFile); await funGetSend({ 'platform': platform[1], 'getSend': value1.getSend, 'url': value1.url, 'body': retFile.res }); await new Promise(resolve => { setTimeout(resolve, 2000) })
        //     }
        // }


        // *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-* TESTES *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*


        // -------------------------------------------------------------------------------------------------
        let scEr = false; function socketErr(socket, err) { socket.on('error', (err) => { if (!scEr) { scEr = true; try { serverSocketErr } catch (catchErr) { esLintIgnore = catchErr; } }; esLintIgnore = err }); esLintIgnore = err; }
        let sockReq = _net.createServer((socket) => { // ########### REQ [SEND]
            try {
                socketErr(socket, 'REQUEST'); let g = ''; socket.on('data', async (chunk) => {
                    g += chunk.toString(); if (g.endsWith('#fim#')) {
                        g = Buffer.from(g.split("#fim#")[0], 'base64').toString('utf-8'); let d = JSON.parse(g); let r = await funGetSend(d)
                        if ((d.getSend == 'send') && (r.res.getSend == 'send')) {
                            let b = Buffer.from(JSON.stringify(r)).toString('base64'); for (let i = 0; i < b.length; i += bufferSocket) { let p = b.slice(i, i + bufferSocket); socket.write(p) }
                            socket.write('#fim#'); // ENVIAR CARACTERE DE FIM 
                        }; g = ''; // LIMPAR BUFFER
                    }
                });
            } catch (catchErr) { (async () => { let retRegexE = await regexE({ 'inf': inf, 'e': catchErr, }); ret['msg'] = retRegexE.res; })() }
        }); sockReq.listen((portSocket), () => { });
        let sockRes = _net.createServer((socket) => { // ########### RES [GET]
            try {
                socketErr(socket, 'RESPONSE'); let g = ''; socket.on('data', async (chunk) => {
                    g += chunk.toString(); if (g.endsWith('#fim#')) {
                        g = Buffer.from(g.split("#fim#")[0], 'base64').toString('utf-8'); let d = JSON.parse(g); let r = await funGetSend(d)
                        if ((d.getSend == 'get') && (r.res.getSend == 'get')) {
                            let b = Buffer.from(JSON.stringify(r)).toString('base64'); for (let i = 0; i < b.length; i += bufferSocket) { let part = b.slice(i, i + bufferSocket); socket.write(part) };
                            socket.write('#fim#'); // ENVIAR CARACTERE DE FIM 
                        }; g = ''; // LIMPAR BUFFER
                    }
                });
            } catch (catchErr) { (async () => { let retRegexE = await regexE({ 'inf': inf, 'e': catchErr, }); ret['msg'] = retRegexE.res; })() }
        }); sockRes.listen((portSocket + 1), () => { });
        // -------------------------------------------------------------------------------------------------
    } catch (catchErr) {
        let retRegexE = await regexE({ 'inf': inf, 'e': catchErr, }); ret['msg'] = retRegexE.res;
    }
}
// TODAS AS FUNÇÕES PRIMÁRIAS DO 'server.js' / 'serverC6.js' / 'serverJsf.js' DEVEM SE CHAMAR 'serverRun'!!!
serverRun()


