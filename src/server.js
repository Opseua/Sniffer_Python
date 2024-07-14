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

        async function funReqRes(inf) {
            let ret = { 'complete': true, res: {} }
            try {
                let { reqRes, url, body, platform } = inf; ret['res']['reqRes'] = reqRes; if (arrUrl.find(infRegex => regex({ 'simple': true, 'pattern': infRegex, 'text': url }))) {
                    if (!platform) { platform = url.includes('ewoq') ? 'EWOQ' : url.includes('tryrating') ? 'TryRating' : 'NAO_IDENTIFICADO' }
                    // ######################################################################

                    // #### NTFY | /home
                    if ((reqRes == 'req') && regex({ 'simple': true, 'pattern': arrUrl[0], 'text': url })) { ret['res']['body'] = body.replace(/CASA/g, 'AAAAAAAA'); }

                    // #### EWOQ
                    if (platform.includes('EWOQ')) {
                        // | /home
                        if ((reqRes == 'res') && regex({ 'simple': true, 'pattern': arrUrl[1], 'text': url })) { ewoq({ 'platform': platform, 'url': `${platform}/home`, 'body': body }) }

                        // | /GetTemplate_[1-SEND]
                        if ((reqRes == 'req') && regex({ 'simple': true, 'pattern': arrUrl[2], 'text': url })) { ewoq({ 'platform': platform, 'url': `${platform}/GetTemplate_[1-SEND]`, 'body': body }) }

                        // | /GetTemplate_[2-GET]
                        if ((reqRes == 'res') && regex({ 'simple': true, 'pattern': arrUrl[2], 'text': url })) { ewoq({ 'platform': platform, 'url': `${platform}/GetTemplate_[2-GET]`, 'body': body }) }

                        // | /GetNewTasks
                        if ((reqRes == 'res') && regex({ 'simple': true, 'pattern': arrUrl[3], 'text': url })) { ewoq({ 'platform': platform, 'url': `${platform}/GetNewTasks`, 'body': body }) }

                        // | /RecordTaskRenderingLatency [task 100% loaded] 
                        if ((reqRes == 'req') && regex({ 'simple': true, 'pattern': arrUrl[4], 'text': url })) { ewoq({ 'platform': platform, 'url': `${platform}/RecordTaskRenderingLatency`, 'body': body }) }

                        // | /SubmitFeedback
                        if ((reqRes == 'req') && regex({ 'simple': true, 'pattern': arrUrl[5], 'text': url })) { ewoq({ 'platform': platform, 'url': `${platform}/SubmitFeedback`, 'body': body }) }
                    }

                    // #### TryRating
                    if (platform.includes('TryRating')) {
                        // | /home
                        if ((reqRes == 'res') && regex({ 'simple': true, 'pattern': arrUrl[6], 'text': url })) { tryRating({ 'platform': platform, 'url': `${platform}/home`, 'body': body }) }

                        // | /survey
                        if ((reqRes == 'res') && regex({ 'simple': true, 'pattern': arrUrl[7], 'text': url })) { tryRating({ 'platform': platform, 'url': `${platform}/survey`, 'body': body }) }

                        // | /client_log [submit]
                        if ((reqRes == 'req') && regex({ 'simple': true, 'pattern': arrUrl[8], 'text': url })) { tryRating({ 'platform': platform, 'url': `${platform}/client_log`, 'body': body }) }
                    }

                    // ######################################################################
                    if (!ret.complete) { logConsole({ 'e': e, 'ee': ee, 'write': false, 'msg': `JS → SEND/GET CANCELADA` }) }
                    else if ((ret.res) && (ret.res.body || ret.res.headers)) { logConsole({ 'e': e, 'ee': ee, 'write': false, 'msg': `JS → SEND/GET ALTERADA` }) }
                } else { logConsole({ 'e': e, 'ee': ee, 'write': false, 'msg': `JS → OUTRO URL | ${url}` }) }
            } catch (catchErr) {
                let retRegexE = await regexE({ 'inf': inf, 'e': catchErr, }); ret['msg'] = retRegexE.res;
            }; return { ...({ ret: ret.ret }), ...(ret.msg && { msg: ret.msg }), ...(ret.res && { res: ret.res }), };
        }

        // *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-* TESTES *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*

        // ################################################################ EWOQ
        // let platform = 'EWOQ_teste' 
        // // | /home
        // infFile = { 'e': e, 'action': 'read', 'path': `${letter}:/ARQUIVOS/PROJETOS/Sniffer_Python/log/Plataformas/z_teste/EWOQ/1-GET_##_VAZIO_##.txt` }
        // retFile = await file(infFile); await funReqRes({ 'platform': `${platform}`, 'reqRes': 'get', 'url': arrUrl[1], 'body': retFile.res })
        // await new Promise(resolve => { setTimeout(resolve, 2000) })

        // // | /GetNewTasks
        // infFile = { 'e': e, 'action': 'read', 'path': `${letter}:/ARQUIVOS/PROJETOS/Sniffer_Python/log/Plataformas/z_teste/EWOQ/4-GET_HonestAds.txt` }
        // retFile = await file(infFile); await funReqRes({ 'platform': `${platform}`, 'reqRes': 'get', 'url': arrUrl[3], 'body': retFile.res })
        // await new Promise(resolve => { setTimeout(resolve, 2000) })

        // // | /GetTemplate_[1-SEND]
        // infFile = { 'e': e, 'action': 'read', 'path': `${letter}:/ARQUIVOS/PROJETOS/Sniffer_Python/log/Plataformas/z_teste/EWOQ/2-SEND_template_HonestAds.txt` }
        // retFile = await file(infFile); await funReqRes({ 'platform': `${platform}`, 'reqRes': 'send', 'url': arrUrl[2], 'body': retFile.res })
        // await new Promise(resolve => { setTimeout(resolve, 2000) })

        // // | /GetTemplate_[2-GET]
        // infFile = { 'e': e, 'action': 'read', 'path': `${letter}:/ARQUIVOS/PROJETOS/Sniffer_Python/log/Plataformas/z_teste/EWOQ/3-GET_template_HonestAds.txt` }
        // retFile = await file(infFile); await funReqRes({ 'platform': `${platform}`, 'reqRes': 'get', 'url': arrUrl[2], 'body': retFile.res })
        // await new Promise(resolve => { setTimeout(resolve, 2000) })

        // // | /GetNewTasks
        // infFile = { 'e': e, 'action': 'read', 'path': `${letter}:/ARQUIVOS/PROJETOS/Sniffer_Python/log/Plataformas/z_teste/EWOQ/4-GET_HonestAds_2.txt` }
        // retFile = await file(infFile); await funReqRes({ 'platform': `${platform}`, 'reqRes': 'get', 'url': arrUrl[3], 'body': retFile.res })
        // await new Promise(resolve => { setTimeout(resolve, 2000) })

        // // | /RecordTaskRenderingLatency [task 100% loaded] 
        // infFile = { 'e': e, 'action': 'read', 'path': `${letter}:/ARQUIVOS/PROJETOS/Sniffer_Python/log/Plataformas/z_teste/EWOQ/5-SEND_RecordTaskRendering.txt` }
        // retFile = await file(infFile); await funReqRes({ 'platform': `${platform}`, 'reqRes': 'send', 'url': arrUrl[4], 'body': retFile.res })
        // await new Promise(resolve => { setTimeout(resolve, 2000) })

        // // | /SubmitFeedback
        // infFile = { 'e': e, 'action': 'read', 'path': `${letter}:/ARQUIVOS/PROJETOS/Sniffer_Python/log/Plataformas/z_teste/EWOQ/6-SEND_HonestAds.txt` }
        // retFile = await file(infFile); await funReqRes({ 'platform': `${platform}`, 'reqRes': 'send', 'url': arrUrl[5], 'body': retFile.res })
        // await new Promise(resolve => { setTimeout(resolve, 2000) })

        // // | /SubmitFeedback
        // infFile = { 'e': e, 'action': 'read', 'path': `${letter}:/ARQUIVOS/PROJETOS/Sniffer_Python/log/Plataformas/z_teste/EWOQ/6-SEND_HonestAds_2.txt` }
        // retFile = await file(infFile); await funReqRes({ 'platform': `${platform}`, 'reqRes': 'send', 'url': arrUrl[5], 'body': retFile.res })

        // await new Promise(resolve => { setTimeout(resolve, 5000) })

        // ################################################################ TryRating
        // let platform = 'TryRating_teste'; let blindResp = 'RESP_SIM'; let hitApps = [ // → BLIND_NAO RESP_NAO RESP_SIM
        //     { 'hitApp': 'AssistantResponse', 'file': 'BLIND_NAO RESP_NAO' },
        //     { 'hitApp': 'audiocaptioning', 'file': 'BLIND_NAO' },
        //     { 'hitApp': 'Autocomplete', 'file': 'BLIND_NAO RESP_NAO RESP_SIM' }, // resultList
        //     { 'hitApp': 'BeachLocationEvaluation', 'file': 'BLIND_NAO RESP_NAO RESP_SIM' },
        //     { 'hitApp': 'CompetitivePlaces', 'file': 'BLIND_NAO RESP_SIM' },
        //     { 'hitApp': 'DrivingNavigation3DMaps', 'file': 'RESP_SIM' },
        //     { 'hitApp': 'PhotoSearchSatisfaction', 'file': 'BLIND_NAO RESP_NAO RESP_SIM' },
        //     { 'hitApp': 'POIEvaluation', 'file': 'BLIND_NAO RESP_NAO RESP_SIM' },
        //     { 'hitApp': 'QueryClassification', 'file': 'BLIND_NAO RESP_NAO' },
        //     { 'hitApp': 'Search20', 'file': 'BLIND_NAO RESP_NAO RESP_SIM' }, // resultList
        //     { 'hitApp': 'SearchAdsRelevance', 'file': 'BLIND_NAO RESP_SIM' }, // tasks
        // ]; for (let [index, value] of hitApps.entries()) {
        //     let fileBlindResp = blindResp.includes('BLIND_NAO') ? 'BLIND_NAO' : blindResp.includes('RESP_NAO') ? 'RESP_NAO' : blindResp.includes('RESP_SIM') ? 'RESP_SIM' : 'NAO_ENCONTRADO'; if (value.file.includes(fileBlindResp)) {
        //         // | /home
        //         infFile = { 'e': e, 'action': 'read', 'path': `${letter}:/ARQUIVOS/PROJETOS/Sniffer_Python/log/Plataformas/z_teste/TryRating/${value.hitApp}/1-GET_##_VAZIO_##.txt` }
        //         retFile = await file(infFile); await funReqRes({ 'platform': `${platform}`, 'reqRes': 'get', 'url': arrUrl[6], 'body': retFile.res }); await new Promise(resolve => { setTimeout(resolve, 2000) })

        //         // | /survey
        //         infFile = { 'e': e, 'action': 'read', 'path': `${letter}:/ARQUIVOS/PROJETOS/Sniffer_Python/log/Plataformas/z_teste/TryRating/${value.hitApp}/2-GET_${fileBlindResp}.txt` }
        //         retFile = await file(infFile); await funReqRes({ 'platform': `${platform}`, 'reqRes': 'get', 'url': arrUrl[7], 'body': retFile.res }); await new Promise(resolve => { setTimeout(resolve, 2000) })

        //         // | /client_log [submit]
        //         infFile = { 'e': e, 'action': 'read', 'path': `${letter}:/ARQUIVOS/PROJETOS/Sniffer_Python/log/Plataformas/z_teste/TryRating/${value.hitApp}/3-SEND_${fileBlindResp}.txt` }
        //         retFile = await file(infFile); await funReqRes({ 'platform': `${platform}`, 'reqRes': 'send', 'url': arrUrl[8], 'body': retFile.res }); await new Promise(resolve => { setTimeout(resolve, 2000) })
        //     }
        // }



        // *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-* TESTES *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*



        // -------------------------------------------------------------------------------------------------
        let scEr = false; function socketErr(socket, err) { socket.on('error', (err) => { if (!scEr) { scEr = true; try { serverSocketErr } catch (catchErr) { esLintIgnore = catchErr; } }; esLintIgnore = err }); esLintIgnore = err; }
        let sockReq = _net.createServer((socket) => { // ########### REQUEST
            try {
                socketErr(socket, 'REQUEST'); let g = ''; socket.on('data', async (chunk) => {
                    g += chunk.toString(); if (g.endsWith('#fim#')) {
                        g = Buffer.from(g.split("#fim#")[0], 'base64').toString('utf-8'); let d = JSON.parse(g); let r = await funReqRes(d)
                        if ((d.reqRes == 'req') && (r.res.reqRes == 'req')) {
                            let b = Buffer.from(JSON.stringify(r)).toString('base64'); for (let i = 0; i < b.length; i += bufferSocket) { let p = b.slice(i, i + bufferSocket); socket.write(p) }
                            socket.write('#fim#'); // ENVIAR CARACTERE DE FIM 
                        }; g = ''; // LIMPAR BUFFER
                    }
                });
            } catch (catchErr) { (async () => { let retRegexE = await regexE({ 'inf': inf, 'e': catchErr, }); ret['msg'] = retRegexE.res; })() }
        }); sockReq.listen((portSocket), () => { });
        let sockRes = _net.createServer((socket) => { // ########### RESPONSE
            try {
                socketErr(socket, 'RESPONSE'); let g = ''; socket.on('data', async (chunk) => {
                    g += chunk.toString(); if (g.endsWith('#fim#')) {
                        g = Buffer.from(g.split("#fim#")[0], 'base64').toString('utf-8'); let d = JSON.parse(g); let r = await funReqRes(d)
                        if ((d.reqRes == 'res') && (r.res.reqRes == 'res')) {
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


