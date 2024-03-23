await import('./resources/@export.js');
let e = import.meta.url, ee = e
async function server(inf) {
    let ret = { 'ret': false }; e = inf && inf.e ? inf.e : e;
    if (catchGlobal) {
        let errs = async (errC, ret) => { if (!ret.stop) { ret['stop'] = true; let retRegexE = await regexE({ 'e': errC, 'inf': inf, 'catchGlobal': true }) } };
        if (typeof window !== 'undefined') { window.addEventListener('error', (errC) => errs(errC, ret)); window.addEventListener('unhandledrejection', (errC) => errs(errC, ret)) }
        else { process.on('uncaughtException', (errC) => errs(errC, ret)); process.on('unhandledRejection', (errC) => errs(errC, ret)) }
    }
    try {
        let time = dateHour().res; logConsole({ 'e': e, 'ee': ee, 'write': false, 'msg': `server [Sniffer_Python]` })

        async function run() {
            let infConfigStorage, retConfigStorage, infFile, retFile; cs = await csf([{}]); gO.inf = cs.res // ***** CS ***** GET
            infConfigStorage = { 'e': e, 'action': 'get', 'key': 'sniffer' };
            retConfigStorage = await configStorage(infConfigStorage); if (!retConfigStorage.ret) { return retConfigStorage } else { retConfigStorage = retConfigStorage.res };
            let portSocket = retConfigStorage.portSocket, bufferSocket = retConfigStorage.bufferSocket, arrUrl = retConfigStorage.arrUrl

            // client
            async function runFun1() {
                await import('./client.js');
            }
            runFun1()

            let command = `"${letter}:/ARQUIVOS/WINDOWS/PORTABLE_Python/python-3.11.1.amd64/python.exe"`
            command = `${command} "${letter}:/ARQUIVOS/PROJETOS/Sniffer_Python/src/resources/start.py"`
            let retCommandLine = await commandLine({ 'awaitFinish': false, 'command': command }); if (!retCommandLine.ret) { return }

            async function sendGet(inf) {
                let ret = { 'complete': true, res: {} }
                try {
                    // ret['res']['sendGet'] = inf.sendGet; if (!!arrUrl.find(infRegex => regex({ 'simple': true, 'pattern': infRegex, 'text': inf.url }))) {
                    ret['res']['sendGet'] = inf.sendGet; if (arrUrl.find(infRegex => regex({ 'simple': true, 'pattern': infRegex, 'text': inf.url }))) {
                        // ######################################################################

                        // #### NTFY | /home
                        if ((inf.sendGet == 'send') && regex({ 'simple': true, 'pattern': arrUrl[0], 'text': inf.url })) {
                            ret['res']['body'] = inf.body.replace(/CASA/g, 'AAAAAAAA');
                        }

                        // #### EWOQ | /home
                        if ((inf.sendGet == 'get') && regex({ 'simple': true, 'pattern': arrUrl[1], 'text': inf.url })) {
                            let platform = inf.platform ? inf.platform : 'EWOQ'
                            let retEWOQ = ewoq({ 'platform': platform, 'url': `${platform}/home`, 'body': inf.body })
                        }

                        // #### EWOQ | /GetTemplate_[1-SEND]
                        if ((inf.sendGet == 'send') && regex({ 'simple': true, 'pattern': arrUrl[2], 'text': inf.url })) {
                            let platform = inf.platform ? inf.platform : 'EWOQ'
                            let retEWOQ = ewoq({ 'platform': platform, 'url': `${platform}/GetTemplate_[1-SEND]`, 'body': inf.body })
                        }

                        // #### EWOQ | /GetTemplate_[2-GET]
                        if ((inf.sendGet == 'get') && regex({ 'simple': true, 'pattern': arrUrl[2], 'text': inf.url })) {
                            let platform = inf.platform ? inf.platform : 'EWOQ'
                            let retEWOQ = ewoq({ 'platform': platform, 'url': `${platform}/GetTemplate_[2-GET]`, 'body': inf.body })
                        }

                        // #### EWOQ | /GetNewTasks
                        if ((inf.sendGet == 'get') && regex({ 'simple': true, 'pattern': arrUrl[3], 'text': inf.url })) {
                            let platform = inf.platform ? inf.platform : 'EWOQ'
                            let retEWOQ = ewoq({ 'platform': platform, 'url': `${platform}/GetNewTasks`, 'body': inf.body })
                        }

                        // #### EWOQ | /RecordTaskRenderingLatency [task 100% loaded] 
                        if ((inf.sendGet == 'send') && regex({ 'simple': true, 'pattern': arrUrl[4], 'text': inf.url })) {
                            let platform = inf.platform ? inf.platform : 'EWOQ'
                            let retEWOQ = ewoq({ 'platform': platform, 'url': `${platform}/RecordTaskRenderingLatency`, 'body': inf.body })
                        }

                        // #### EWOQ | /SubmitFeedback
                        if ((inf.sendGet == 'send') && regex({ 'simple': true, 'pattern': arrUrl[5], 'text': inf.url })) {
                            let platform = inf.platform ? inf.platform : 'EWOQ'
                            let retEWOQ = ewoq({ 'platform': platform, 'url': `${platform}/SubmitFeedback`, 'body': inf.body })
                        }

                        // #### TryRating | /home
                        if ((inf.sendGet == 'get') && regex({ 'simple': true, 'pattern': arrUrl[6], 'text': inf.url })) {
                            let platform = inf.platform ? inf.platform : 'TryRating'
                            let retTryRating = tryRating({ 'platform': platform, 'url': `${platform}/home`, 'body': inf.body })
                        }

                        // #### TryRating | /survey
                        if ((inf.sendGet == 'get') && regex({ 'simple': true, 'pattern': arrUrl[7], 'text': inf.url })) {
                            let platform = inf.platform ? inf.platform : 'TryRating'
                            let retTryRating = tryRating({ 'platform': platform, 'url': `${platform}/survey`, 'body': inf.body })
                        }

                        // #### TryRating | /client_log [submit]
                        if ((inf.sendGet == 'send') && regex({ 'simple': true, 'pattern': arrUrl[8], 'text': inf.url })) {
                            let platform = inf.platform ? inf.platform : 'TryRating'
                            let retTryRating = tryRating({ 'platform': platform, 'url': `${platform}/client_log`, 'body': inf.body })
                        }

                        // ######################################################################
                        if (!ret.complete) { logConsole({ 'e': e, 'ee': ee, 'write': false, 'msg': `SEND/GET CANCELADA` }) }
                        else if ((ret.res) && (ret.res.body || ret.res.headers)) { logConsole({ 'e': e, 'ee': ee, 'write': false, 'msg': `SEND/GET ALTERADA` }) }
                    } else { logConsole({ 'e': e, 'ee': ee, 'write': false, 'msg': `OUTRO URL | ${inf.url}` }) }
                } catch (catchErr) {
                    let retRegexE = await regexE({ 'inf': inf, 'e': catchErr, 'catchGlobal': false });
                    ret['msg'] = retRegexE.res
                };
                return {
                    ...({ ret: ret.ret }),
                    ...(ret.msg && { msg: ret.msg }),
                    ...(ret.res && { res: ret.res }),
                };
            }

            // *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-* TESTES *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*

            // var platform = 'EWOQ_teste' // ################################ EWOQ
            // // #### EWOQ | /home
            // infFile = { 'e': e, 'action': 'read', 'path': `${letter}:/ARQUIVOS/PROJETOS/Sniffer_Python/log/z_teste/EWOQ/#_SEND-GET_#/1-GET_##_VAZIO_##.txt` }
            // retFile = await file(infFile);
            // await sendGet({ 'platform': `${platform}`, 'sendGet': 'get', 'url': arrUrl[1], 'body': retFile.res })

            // await new Promise(resolve => { setTimeout(resolve, 2000) })

            // // #### EWOQ | /GetNewTasks
            // infFile = { 'e': e, 'action': 'read', 'path': `${letter}:/ARQUIVOS/PROJETOS/Sniffer_Python/log/z_teste/EWOQ/#_SEND-GET_#/4-GET_HonestAds.txt` }
            // retFile = await file(infFile);
            // await sendGet({ 'platform': `${platform}`, 'sendGet': 'get', 'url': arrUrl[3], 'body': retFile.res })

            // await new Promise(resolve => { setTimeout(resolve, 2000) })

            // // #### EWOQ | /GetTemplate_[1-SEND]
            // infFile = { 'e': e, 'action': 'read', 'path': `${letter}:/ARQUIVOS/PROJETOS/Sniffer_Python/log/z_teste/EWOQ/#_SEND-GET_#/2-SEND_template_HonestAds.txt` }
            // retFile = await file(infFile);
            // await sendGet({ 'platform': `${platform}`, 'sendGet': 'send', 'url': arrUrl[2], 'body': retFile.res })

            // await new Promise(resolve => { setTimeout(resolve, 2000) })

            // // #### EWOQ | /GetTemplate_[2-GET]
            // infFile = { 'e': e, 'action': 'read', 'path': `${letter}:/ARQUIVOS/PROJETOS/Sniffer_Python/log/z_teste/EWOQ/#_SEND-GET_#/3-GET_template_HonestAds.txt` }
            // retFile = await file(infFile);
            // await sendGet({ 'platform': `${platform}`, 'sendGet': 'get', 'url': arrUrl[2], 'body': retFile.res })

            // await new Promise(resolve => { setTimeout(resolve, 2000) })

            // // #### EWOQ | /GetNewTasks
            // infFile = { 'e': e, 'action': 'read', 'path': `${letter}:/ARQUIVOS/PROJETOS/Sniffer_Python/log/z_teste/EWOQ/#_SEND-GET_#/4-GET_HonestAds_2.txt` }
            // retFile = await file(infFile);
            // await sendGet({ 'platform': `${platform}`, 'sendGet': 'get', 'url': arrUrl[3], 'body': retFile.res })

            // await new Promise(resolve => { setTimeout(resolve, 2000) })

            // // #### EWOQ | /RecordTaskRenderingLatency [task 100% loaded] 
            // infFile = { 'e': e, 'action': 'read', 'path': `${letter}:/ARQUIVOS/PROJETOS/Sniffer_Python/log/z_teste/EWOQ/#_SEND-GET_#/5-SEND_RecordTaskRendering.txt` }
            // retFile = await file(infFile);
            // await sendGet({ 'platform': `${platform}`, 'sendGet': 'send', 'url': arrUrl[4], 'body': retFile.res })

            // await new Promise(resolve => { setTimeout(resolve, 2000) })

            // // #### EWOQ | /SubmitFeedback
            // infFile = { 'e': e, 'action': 'read', 'path': `${letter}:/ARQUIVOS/PROJETOS/Sniffer_Python/log/z_teste/EWOQ/#_SEND-GET_#/6-SEND_HonestAds.txt` }
            // retFile = await file(infFile);
            // await sendGet({ 'platform': `${platform}`, 'sendGet': 'send', 'url': arrUrl[5], 'body': retFile.res })

            // await new Promise(resolve => { setTimeout(resolve, 2000) })

            // // #### EWOQ | /SubmitFeedback
            // infFile = { 'e': e, 'action': 'read', 'path': `${letter}:/ARQUIVOS/PROJETOS/Sniffer_Python/log/z_teste/EWOQ/#_SEND-GET_#/6-SEND_HonestAds_2.txt` }
            // retFile = await file(infFile);
            // await sendGet({ 'platform': `${platform}`, 'sendGet': 'send', 'url': arrUrl[5], 'body': retFile.res })

            // await new Promise(resolve => { setTimeout(resolve, 5000) })

            // var platform = 'TryRating_teste' // ################################ TryRating
            // // #### TryRating | /home
            // infFile = { 'e': e, 'action': 'read', 'path': `${letter}:/ARQUIVOS/PROJETOS/Sniffer_Python/log/z_teste/TryRating/#_SEND-GET_#/1-GET_##_VAZIO_##.txt` }
            // retFile = await file(infFile);
            // await sendGet({ 'platform': `${platform}`, 'sendGet': 'get', 'url': arrUrl[6], 'body': retFile.res })
            // sendGet
            // await new Promise(resolve => { setTimeout(resolve, 2000) })

            // // #### TryRating | /survey
            // infFile = { 'e': e, 'action': 'read', 'path': `${letter}:/ARQUIVOS/PROJETOS/Sniffer_Python/log/z_teste/TryRating/#_SEND-GET_#/2-GET_SearchTerms.txt` }
            // retFile = await file(infFile);
            // await sendGet({ 'platform': `${platform}`, 'sendGet': 'get', 'url': arrUrl[7], 'body': retFile.res })

            // await new Promise(resolve => { setTimeout(resolve, 2000) })

            // // #### TryRating | /client_log [submit]
            // infFile = { 'e': e, 'action': 'read', 'path': `${letter}:/ARQUIVOS/PROJETOS/Sniffer_Python/log/z_teste/TryRating/#_SEND-GET_#/3-SEND_SearchTerms.txt` }
            // retFile = await file(infFile);
            // await sendGet({ 'platform': `${platform}`, 'sendGet': 'send', 'url': arrUrl[8], 'body': retFile.res })






























            // -------------------------------------------------------------------------------------------------
            let sockReq = _net.createServer((socket) => { // ########### REQUEST
                try {
                    let g = ''; socket.on('data', async (chunk) => {
                        g += chunk.toString(); if (g.endsWith('#fim#')) {
                            g = Buffer.from(g.split("#fim#")[0], 'base64').toString('utf-8');
                            let d = JSON.parse(g); let r = await sendGet(d)
                            if ((d.sendGet == 'send') && (r.res.sendGet == 'send')) {
                                let b = Buffer.from(JSON.stringify(r)).toString('base64');
                                for (let i = 0; i < b.length; i += bufferSocket) { let p = b.slice(i, i + bufferSocket); socket.write(p) }
                                socket.write('#fim#'); // ENVIAR CARACTERE DE FIM 
                            }; g = ''; // LIMPAR BUFFER
                        }
                    });
                } catch (catchErr) {
                    (async () => {
                        let retRegexE = await regexE({ 'inf': inf, 'e': catchErr, 'catchGlobal': false });
                        ret['msg'] = retRegexE.res
                    })()
                }
            }); sockReq.listen((portSocket), () => { });
            let sockRes = _net.createServer((socket) => { // ########### RESPONSE
                try {
                    let g = ''; socket.on('data', async (chunk) => {
                        g += chunk.toString(); if (g.endsWith('#fim#')) {
                            g = Buffer.from(g.split("#fim#")[0], 'base64').toString('utf-8');
                            let d = JSON.parse(g); let r = await sendGet(d)
                            if ((d.sendGet == 'get') && (r.res.sendGet == 'get')) {
                                let b = Buffer.from(JSON.stringify(r)).toString('base64');
                                for (let i = 0; i < b.length; i += bufferSocket) { let part = b.slice(i, i + bufferSocket); socket.write(part) };
                                socket.write('#fim#'); // ENVIAR CARACTERE DE FIM 
                            }; g = ''; // LIMPAR BUFFER
                        }
                    });
                } catch (catchErr) {
                    (async () => {
                        let retRegexE = await regexE({ 'inf': inf, 'e': catchErr, 'catchGlobal': false });
                        ret['msg'] = retRegexE.res
                    })()
                }
            }); sockRes.listen((portSocket + 1), () => { });
            // -------------------------------------------------------------------------------------------------

        }
        await run()
    }
    catch (err) {
        let retRegexE = await regexE({ 'inf': inf, 'e': e, 'catchGlobal': false });
        ret['msg'] = retRegexE.res
    }
}
await server()

