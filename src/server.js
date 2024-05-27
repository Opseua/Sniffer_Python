await import('./resources/@export.js');

let e = import.meta.url, ee = e;
async function serverRun(inf) {
    let ret = { 'ret': false }; e = inf && inf.e ? inf.e : e;
    try {
        logConsole({ 'e': e, 'ee': ee, 'write': true, 'msg': `**************** SERVER ****************` })

        let infConfigStorage, retConfigStorage, infFile, retFile; cs = await csf([{}]); gO.inf = cs.res // ***** CS ***** GET
        infConfigStorage = { 'e': e, 'action': 'get', 'key': 'sniffer' }; retConfigStorage = await configStorage(infConfigStorage); if (!retConfigStorage.ret) { return retConfigStorage }
        else { retConfigStorage = retConfigStorage.res }; let portSocket = retConfigStorage.portSocket, bufferSocket = retConfigStorage.bufferSocket, arrUrl = retConfigStorage.arrUrl

        // CLIENT (NÃO POR COMO 'await'!!!)
        client({ 'e': e })

        let command = `"${letter}:/ARQUIVOS/WINDOWS/PORTABLE_Python/python/pythonSniffer_Python_server.exe"`; command = `${command} "${letter}:/ARQUIVOS/PROJETOS/Sniffer_Python/src/python/start.py"`
        let retCommandLine = await commandLine({ 'awaitFinish': false, 'command': command }); if (!retCommandLine.ret) { return }

        async function sendGet(inf) {
            let ret = { 'complete': true, res: {} }

            try {
                let { sendGet, url, body, platform } = inf; ret['res']['sendGet'] = sendGet; if (arrUrl.find(infRegex => regex({ 'simple': true, 'pattern': infRegex, 'text': url }))) {
                    if (!platform) { platform = url.includes('ewoq') ? 'EWOQ' : url.includes('tryrating') ? 'TryRating' : 'NAO_IDENTIFICADO' }
                    // ######################################################################

                    // #### NTFY | /home
                    if ((sendGet == 'send') && regex({ 'simple': true, 'pattern': arrUrl[0], 'text': url })) { ret['res']['body'] = body.replace(/CASA/g, 'AAAAAAAA'); }

                    // #### EWOQ
                    if (platform.includes('EWOQ')) {
                        // | /home
                        if ((sendGet == 'get') && regex({ 'simple': true, 'pattern': arrUrl[1], 'text': url })) { ewoq({ 'platform': platform, 'url': `${platform}/home`, 'body': body }) }

                        // | /GetTemplate_[1-SEND]
                        if ((sendGet == 'send') && regex({ 'simple': true, 'pattern': arrUrl[2], 'text': url })) { ewoq({ 'platform': platform, 'url': `${platform}/GetTemplate_[1-SEND]`, 'body': body }) }

                        // | /GetTemplate_[2-GET]
                        if ((sendGet == 'get') && regex({ 'simple': true, 'pattern': arrUrl[2], 'text': url })) { ewoq({ 'platform': platform, 'url': `${platform}/GetTemplate_[2-GET]`, 'body': body }) }

                        // | /GetNewTasks
                        if ((sendGet == 'get') && regex({ 'simple': true, 'pattern': arrUrl[3], 'text': url })) { ewoq({ 'platform': platform, 'url': `${platform}/GetNewTasks`, 'body': body }) }

                        // | /RecordTaskRenderingLatency [task 100% loaded] 
                        if ((sendGet == 'send') && regex({ 'simple': true, 'pattern': arrUrl[4], 'text': url })) { ewoq({ 'platform': platform, 'url': `${platform}/RecordTaskRenderingLatency`, 'body': body }) }

                        // | /SubmitFeedback
                        if ((sendGet == 'send') && regex({ 'simple': true, 'pattern': arrUrl[5], 'text': url })) { ewoq({ 'platform': platform, 'url': `${platform}/SubmitFeedback`, 'body': body }) }
                    }

                    // #### TryRating
                    if (platform.includes('TryRating')) {
                        // | /home
                        if ((sendGet == 'get') && regex({ 'simple': true, 'pattern': arrUrl[6], 'text': url })) { tryRating({ 'platform': platform, 'url': `${platform}/home`, 'body': body }) }

                        // | /survey
                        if ((sendGet == 'get') && regex({ 'simple': true, 'pattern': arrUrl[7], 'text': url })) { tryRating({ 'platform': platform, 'url': `${platform}/survey`, 'body': body }) }

                        // | /client_log [submit]
                        if ((sendGet == 'send') && regex({ 'simple': true, 'pattern': arrUrl[8], 'text': url })) { tryRating({ 'platform': platform, 'url': `${platform}/client_log`, 'body': body }) }
                    }

                    // ######################################################################
                    if (!ret.complete) { logConsole({ 'e': e, 'ee': ee, 'write': false, 'msg': `SEND/GET CANCELADA` }) }
                    else if ((ret.res) && (ret.res.body || ret.res.headers)) { logConsole({ 'e': e, 'ee': ee, 'write': false, 'msg': `SEND/GET ALTERADA` }) }
                } else { logConsole({ 'e': e, 'ee': ee, 'write': false, 'msg': `OUTRO URL | ${url}` }) }
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

        // *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-* TESTES *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*

        // ################################################################ EWOQ
        // let platform = 'EWOQ_teste' 
        // // | /home
        // infFile = { 'e': e, 'action': 'read', 'path': `${letter}:/ARQUIVOS/PROJETOS/Sniffer_Python/log/z_teste/EWOQ/1-GET_##_VAZIO_##.txt` }
        // retFile = await file(infFile); await sendGet({ 'platform': `${platform}`, 'sendGet': 'get', 'url': arrUrl[1], 'body': retFile.res })
        // await new Promise(resolve => { setTimeout(resolve, 2000) })

        // // | /GetNewTasks
        // infFile = { 'e': e, 'action': 'read', 'path': `${letter}:/ARQUIVOS/PROJETOS/Sniffer_Python/log/z_teste/EWOQ/4-GET_HonestAds.txt` }
        // retFile = await file(infFile); await sendGet({ 'platform': `${platform}`, 'sendGet': 'get', 'url': arrUrl[3], 'body': retFile.res })
        // await new Promise(resolve => { setTimeout(resolve, 2000) })

        // // | /GetTemplate_[1-SEND]
        // infFile = { 'e': e, 'action': 'read', 'path': `${letter}:/ARQUIVOS/PROJETOS/Sniffer_Python/log/z_teste/EWOQ/2-SEND_template_HonestAds.txt` }
        // retFile = await file(infFile); await sendGet({ 'platform': `${platform}`, 'sendGet': 'send', 'url': arrUrl[2], 'body': retFile.res })
        // await new Promise(resolve => { setTimeout(resolve, 2000) })

        // // | /GetTemplate_[2-GET]
        // infFile = { 'e': e, 'action': 'read', 'path': `${letter}:/ARQUIVOS/PROJETOS/Sniffer_Python/log/z_teste/EWOQ/3-GET_template_HonestAds.txt` }
        // retFile = await file(infFile); await sendGet({ 'platform': `${platform}`, 'sendGet': 'get', 'url': arrUrl[2], 'body': retFile.res })
        // await new Promise(resolve => { setTimeout(resolve, 2000) })

        // // | /GetNewTasks
        // infFile = { 'e': e, 'action': 'read', 'path': `${letter}:/ARQUIVOS/PROJETOS/Sniffer_Python/log/z_teste/EWOQ/4-GET_HonestAds_2.txt` }
        // retFile = await file(infFile); await sendGet({ 'platform': `${platform}`, 'sendGet': 'get', 'url': arrUrl[3], 'body': retFile.res })
        // await new Promise(resolve => { setTimeout(resolve, 2000) })

        // // | /RecordTaskRenderingLatency [task 100% loaded] 
        // infFile = { 'e': e, 'action': 'read', 'path': `${letter}:/ARQUIVOS/PROJETOS/Sniffer_Python/log/z_teste/EWOQ/5-SEND_RecordTaskRendering.txt` }
        // retFile = await file(infFile); await sendGet({ 'platform': `${platform}`, 'sendGet': 'send', 'url': arrUrl[4], 'body': retFile.res })
        // await new Promise(resolve => { setTimeout(resolve, 2000) })

        // // | /SubmitFeedback
        // infFile = { 'e': e, 'action': 'read', 'path': `${letter}:/ARQUIVOS/PROJETOS/Sniffer_Python/log/z_teste/EWOQ/6-SEND_HonestAds.txt` }
        // retFile = await file(infFile); await sendGet({ 'platform': `${platform}`, 'sendGet': 'send', 'url': arrUrl[5], 'body': retFile.res })
        // await new Promise(resolve => { setTimeout(resolve, 2000) })

        // // | /SubmitFeedback
        // infFile = { 'e': e, 'action': 'read', 'path': `${letter}:/ARQUIVOS/PROJETOS/Sniffer_Python/log/z_teste/EWOQ/6-SEND_HonestAds_2.txt` }
        // retFile = await file(infFile); await sendGet({ 'platform': `${platform}`, 'sendGet': 'send', 'url': arrUrl[5], 'body': retFile.res })

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
        //         infFile = { 'e': e, 'action': 'read', 'path': `${letter}:/ARQUIVOS/PROJETOS/Sniffer_Python/log/z_teste/TryRating/${value.hitApp}/1-GET_##_VAZIO_##.txt` }
        //         retFile = await file(infFile); await sendGet({ 'platform': `${platform}`, 'sendGet': 'get', 'url': arrUrl[6], 'body': retFile.res }); await new Promise(resolve => { setTimeout(resolve, 2000) })

        //         // | /survey
        //         infFile = { 'e': e, 'action': 'read', 'path': `${letter}:/ARQUIVOS/PROJETOS/Sniffer_Python/log/z_teste/TryRating/${value.hitApp}/2-GET_${fileBlindResp}.txt` }
        //         retFile = await file(infFile); await sendGet({ 'platform': `${platform}`, 'sendGet': 'get', 'url': arrUrl[7], 'body': retFile.res }); await new Promise(resolve => { setTimeout(resolve, 2000) })

        //         // | /client_log [submit]
        //         infFile = { 'e': e, 'action': 'read', 'path': `${letter}:/ARQUIVOS/PROJETOS/Sniffer_Python/log/z_teste/TryRating/${value.hitApp}/3-SEND_${fileBlindResp}.txt` }
        //         retFile = await file(infFile); await sendGet({ 'platform': `${platform}`, 'sendGet': 'send', 'url': arrUrl[8], 'body': retFile.res }); await new Promise(resolve => { setTimeout(resolve, 2000) })
        //     }
        // }












        // -------------------------------------------------------------------------------------------------
        let sockReq = _net.createServer((socket) => { // ########### REQUEST
            try {
                let g = ''; socket.on('data', async (chunk) => {
                    g += chunk.toString(); if (g.endsWith('#fim#')) {
                        g = Buffer.from(g.split("#fim#")[0], 'base64').toString('utf-8'); let d = JSON.parse(g); let r = await sendGet(d)
                        if ((d.sendGet == 'send') && (r.res.sendGet == 'send')) {
                            let b = Buffer.from(JSON.stringify(r)).toString('base64'); for (let i = 0; i < b.length; i += bufferSocket) { let p = b.slice(i, i + bufferSocket); socket.write(p) }
                            socket.write('#fim#'); // ENVIAR CARACTERE DE FIM 
                        }; g = ''; // LIMPAR BUFFER
                    }
                });
            } catch (catchErr) {
                (async () => {
                    let retRegexE = await regexE({ 'inf': inf, 'e': catchErr, });
                    ret['msg'] = retRegexE.res
                })()
            }
        }); sockReq.listen((portSocket), () => { });
        let sockRes = _net.createServer((socket) => { // ########### RESPONSE
            try {
                let g = ''; socket.on('data', async (chunk) => {
                    g += chunk.toString(); if (g.endsWith('#fim#')) {
                        g = Buffer.from(g.split("#fim#")[0], 'base64').toString('utf-8'); let d = JSON.parse(g); let r = await sendGet(d)
                        if ((d.sendGet == 'get') && (r.res.sendGet == 'get')) {
                            let b = Buffer.from(JSON.stringify(r)).toString('base64'); for (let i = 0; i < b.length; i += bufferSocket) { let part = b.slice(i, i + bufferSocket); socket.write(part) };
                            socket.write('#fim#'); // ENVIAR CARACTERE DE FIM 
                        }; g = ''; // LIMPAR BUFFER
                    }
                });
            } catch (catchErr) {
                (async () => {
                    let retRegexE = await regexE({ 'inf': inf, 'e': catchErr, });
                    ret['msg'] = retRegexE.res
                })()
            }
        }); sockRes.listen((portSocket + 1), () => { });
        // -------------------------------------------------------------------------------------------------
    }
    catch (catchErr) {
        let retRegexE = await regexE({ 'inf': inf, 'e': catchErr, });
        ret['msg'] = retRegexE.res
    }
}
// TODAS AS FUNÇÕES PRIMÁRIAS DO 'server.js' / 'serverC6.js' / 'serverJsf.js' DEVEM SE CHAMAR 'serverRun'!!!
serverRun()


