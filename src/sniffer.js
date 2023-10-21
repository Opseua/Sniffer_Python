await import('../../Chrome_Extension/src/resources/@functions.js'); import net from 'net'; console.log('SNIFFER PYTHON [JS] RODANDO', '\n');
await import('./scripts/@EWOQ.js');
await import('./scripts/@TryRating.js');

try {
    async function run() {
        let infConfigStorage, retConfigStorage, infFile, retFile
        cs = await csf(['']); gO.inf = cs.res // ***** CS ***** GET
        infConfigStorage = { 'action': 'get', 'key': 'sniffer' }; retConfigStorage = await configStorage(infConfigStorage)
        if (!retConfigStorage.ret) { return } else { retConfigStorage = retConfigStorage.res }; const portSocket = retConfigStorage.portSocket;
        const bufferSocket = retConfigStorage.bufferSocket; const arrUrl = retConfigStorage.arrUrl

        gO.inf['wsArr'] = [devChrome, devBlueStacks]; await wsConnect(gO.inf.wsArr);

        infFile = { 'action': 'inf' }; retFile = await file(infFile); if (!retFile.ret) { return } else { retFile = retFile.res }
        let command = `"${conf[1]}:\\ARQUIVOS\\WINDOWS\\BAT\\RUN_PORTABLE\\1_BACKGROUND.exe"`
        command = `${command} "${conf[1]}:\\ARQUIVOS\\WINDOWS\\PORTABLE_Python\\python-3.11.1.amd64\\python.exe"`
        command = `${command} "${conf[1]}:\\ARQUIVOS\\PROJETOS\\Sniffer_Python\\src\\resources\\start.py"`
        // const infCommandLine = { 'background': false, 'command': command }; const retCommandLine = await commandLine(infCommandLine); if (!retCommandLine.ret) { return }

        async function reqRes(inf) {
            let ret = { 'send': true, res: {} }
            try {
                ret['res']['reqRes'] = inf.reqRes; if (!!arrUrl.find(infRegex => regex({ 'simple': true, 'pattern': infRegex, 'text': inf.url }))) {
                    // ######################################################################

                    // #### NTFY | /home
                    if ((inf.reqRes == 'req') && regex({ 'simple': true, 'pattern': arrUrl[0], 'text': inf.url })) {
                        ret['res']['body'] = inf.body.replace(/CASA/g, 'AAAAAAAA');
                    }

                    // #### EWOQ | /home
                    if ((inf.reqRes == 'res') && regex({ 'simple': true, 'pattern': arrUrl[1], 'text': inf.url })) {
                        const retEWOQ = await EWOQ({ 'platform': inf.platform, 'url': `${inf.platform}/home`, 'body': inf.body })
                    }

                    // #### EWOQ | /GetTemplate_[REQ-1]
                    if ((inf.reqRes == 'req') && regex({ 'simple': true, 'pattern': arrUrl[2], 'text': inf.url })) {
                        const retEWOQ = await EWOQ({ 'platform': inf.platform, 'url': `${inf.platform}/GetTemplate_[REQ-1]`, 'body': inf.body })
                    }

                    // #### EWOQ | /GetTemplate_[RES-2]
                    if ((inf.reqRes == 'res') && regex({ 'simple': true, 'pattern': arrUrl[2], 'text': inf.url })) {
                        const retEWOQ = await EWOQ({ 'platform': inf.platform, 'url': `${inf.platform}/GetTemplate_[RES-2]`, 'body': inf.body })
                    }

                    // #### EWOQ | /GetNewTasks
                    if ((inf.reqRes == 'res') && regex({ 'simple': true, 'pattern': arrUrl[3], 'text': inf.url })) {
                        const retEWOQ = await EWOQ({ 'platform': inf.platform, 'url': `${inf.platform}/GetNewTasks`, 'body': inf.body })
                    }

                    // #### EWOQ | /RecordTaskRenderingLatency [task 100% loaded] 
                    if ((inf.reqRes == 'req') && regex({ 'simple': true, 'pattern': arrUrl[4], 'text': inf.url })) {
                        const retEWOQ = await EWOQ({ 'platform': inf.platform, 'url': `${inf.platform}/RecordTaskRenderingLatency`, 'body': inf.body })
                    }

                    // #### EWOQ | /SubmitFeedback
                    if ((inf.reqRes == 'req') && regex({ 'simple': true, 'pattern': arrUrl[5], 'text': inf.url })) {
                        const retEWOQ = await EWOQ({ 'platform': inf.platform, 'url': `${inf.platform}/SubmitFeedback`, 'body': inf.body })
                    }

                    // #### TryRating | /home
                    if ((inf.reqRes == 'res') && regex({ 'simple': true, 'pattern': arrUrl[6], 'text': inf.url })) {
                        const retTryRating = await TryRating({ 'platform': inf.platform, 'url': `${inf.platform}/home`, 'body': inf.body })
                    }

                    // #### TryRating | /survey
                    if ((inf.reqRes == 'res') && regex({ 'simple': true, 'pattern': arrUrl[7], 'text': inf.url })) {
                        const retTryRating = await TryRating({ 'platform': inf.platform, 'url': `${inf.platform}/survey`, 'body': inf.body })
                    }

                    // #### TryRating | /client_log [submit]
                    if ((inf.reqRes == 'req') && regex({ 'simple': true, 'pattern': arrUrl[8], 'text': inf.url })) {
                        const retTryRating = await TryRating({ 'platform': inf.platform, 'url': `${inf.platform}/client_log`, 'body': inf.body })
                    }

                    // ######################################################################
                    if (!ret.send) { console.log('REQ/RES CANCELADA') } else if ((ret.res) && (ret.res.body || ret.res.headers)) { console.log('REQ/RES ALTERADA') }
                } else { console.log('OUTRO URL |', inf.url) }
            } catch (e) { const m = await regexE({ 'e': e }); console.log(m.res) }; return ret
        }
        

        // *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-* TESTES *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*

        // var platform = 'EWOQ_teste' // ################################ EWOQ
        // // #### EWOQ | /home
        // infFile = { 'action': 'read', 'path': 'D:/ARQUIVOS/PROJETOS/Sniffer_Python/log/z_teste/EWOQ/#_REQ-RES_#/1_RES_GET_##_VAZIO_##.txt' }
        // retFile = await file(infFile);
        // await reqRes({ 'platform': `${platform}`, 'reqRes': 'res', 'url': 'https://rating.ewoq.google.com/u/0', 'body': retFile.res })

        // await new Promise(resolve => { setTimeout(resolve, 2000) })

        // // #### EWOQ | /GetNewTasks
        // infFile = { 'action': 'read', 'path': 'D:/ARQUIVOS/PROJETOS/Sniffer_Python/log/z_teste/EWOQ/#_REQ-RES_#/4-RES_GET_HonestAds.txt' }
        // retFile = await file(infFile);
        // await reqRes({ 'platform': `${platform}`, 'reqRes': 'res', 'url': 'https://rating.ewoq.google.com/u/0/rpc/rating/AssignmentAcquisitionService/GetNewTasks', 'body': retFile.res })

        // await new Promise(resolve => { setTimeout(resolve, 2000) })

        // // #### EWOQ | /GetTemplate_[REQ-1]
        // infFile = { 'action': 'read', 'path': 'D:/ARQUIVOS/PROJETOS/Sniffer_Python/log/z_teste/EWOQ/#_REQ-RES_#/2-REQ_SEND_template_HonestAds.txt' }
        // retFile = await file(infFile);
        // await reqRes({ 'platform': `${platform}`, 'reqRes': 'req', 'url': 'https://rating.ewoq.google.com/u/0/rpc/rating/SafeTemplateService/GetTemplate', 'body': retFile.res })

        // await new Promise(resolve => { setTimeout(resolve, 2000) })

        // // #### EWOQ | /GetTemplate_[RES-2]
        // infFile = { 'action': 'read', 'path': 'D:/ARQUIVOS/PROJETOS/Sniffer_Python/log/z_teste/EWOQ/#_REQ-RES_#/3-RES_GET_template_HonestAds.txt' }
        // retFile = await file(infFile);
        // await reqRes({ 'platform': `${platform}`, 'reqRes': 'res', 'url': 'https://rating.ewoq.google.com/u/0/rpc/rating/SafeTemplateService/GetTemplate', 'body': retFile.res })

        // await new Promise(resolve => { setTimeout(resolve, 2000) })

        // // #### EWOQ | /GetNewTasks
        // infFile = { 'action': 'read', 'path': 'D:/ARQUIVOS/PROJETOS/Sniffer_Python/log/z_teste/EWOQ/#_REQ-RES_#/4-RES_GET_HonestAds_2.txt' }
        // retFile = await file(infFile);
        // await reqRes({ 'platform': `${platform}`, 'reqRes': 'res', 'url': 'https://rating.ewoq.google.com/u/0/rpc/rating/AssignmentAcquisitionService/GetNewTasks', 'body': retFile.res })

        // await new Promise(resolve => { setTimeout(resolve, 2000) })

        // // #### EWOQ | /RecordTaskRenderingLatency [task 100% loaded] 
        // infFile = { 'action': 'read', 'path': 'D:/ARQUIVOS/PROJETOS/Sniffer_Python/log/z_teste/EWOQ/#_REQ-RES_#/5-REQ_SEND_RecordTaskRendering.txt' }
        // retFile = await file(infFile);
        // await reqRes({ 'platform': `${platform}`, 'reqRes': 'req', 'url': 'https://rating.ewoq.google.com/u/0/rpc/rating/LatencyRecordingService/RecordTaskRenderingLatency', 'body': retFile.res })

        // await new Promise(resolve => { setTimeout(resolve, 2000) })

        // // #### EWOQ | /SubmitFeedback
        // infFile = { 'action': 'read', 'path': 'D:/ARQUIVOS/PROJETOS/Sniffer_Python/log/z_teste/EWOQ/#_REQ-RES_#/6-REQ_SEND_HonestAds.txt' }
        // retFile = await file(infFile);
        // await reqRes({ 'platform': `${platform}`, 'reqRes': 'req', 'url': 'https://rating.ewoq.google.com/u/0/rpc/rating/SubmitFeedbackService/SubmitFeedback', 'body': retFile.res })

        // await new Promise(resolve => { setTimeout(resolve, 5000) })

        // // #### EWOQ | /SubmitFeedback
        // infFile = { 'action': 'read', 'path': 'D:/ARQUIVOS/PROJETOS/Sniffer_Python/log/z_teste/EWOQ/#_REQ-RES_#/6-REQ_SEND_HonestAds_2.txt' }
        // retFile = await file(infFile);
        // await reqRes({ 'platform': `${platform}`, 'reqRes': 'req', 'url': 'https://rating.ewoq.google.com/u/0/rpc/rating/SubmitFeedbackService/SubmitFeedback', 'body': retFile.res })

        // await new Promise(resolve => { setTimeout(resolve, 1500) })

        var platform = 'TryRating_teste' // ################################ TryRating
        // #### TryRating | /home
        infFile = { 'action': 'read', 'path': 'D:/ARQUIVOS/PROJETOS/Sniffer_Python/log/z_teste/TryRating/#_REQ-RES_#/1_RES_GET_##_VAZIO_##.txt' }
        retFile = await file(infFile);
        await reqRes({ 'platform': `${platform}`, 'reqRes': 'res', 'url': 'https://www.tryrating.com/app/home', 'body': retFile.res })

        await new Promise(resolve => { setTimeout(resolve, 2000) })

        // #### TryRating | /survey
        infFile = { 'action': 'read', 'path': 'D:/ARQUIVOS/PROJETOS/Sniffer_Python/log/z_teste/TryRating/#_REQ-RES_#/2-RES_GET_Autocomplete.txt' }
        retFile = await file(infFile);
        await reqRes({ 'platform': `${platform}`, 'reqRes': 'res', 'url': 'https://www.tryrating.com/api/survey', 'body': retFile.res })

        await new Promise(resolve => { setTimeout(resolve, 2000) })

        // #### TryRating | /client_log [submit]
        infFile = { 'action': 'read', 'path': 'D:/ARQUIVOS/PROJETOS/Sniffer_Python/log/z_teste/TryRating/#_REQ-RES_#/3-REQ_SEND_Autocomplete.txt' }
        retFile = await file(infFile);
        await reqRes({ 'platform': `${platform}`, 'reqRes': 'req', 'url': 'https://www.tryrating.com/api/client_log', 'body': retFile.res })






























        // -------------------------------------------------------------------------------------------------
        const sockReq = net.createServer((socket) => { // ########### REQUEST
            try {
                let g = ''; socket.on('data', async (chunk) => {
                    g += chunk.toString(); if (g.endsWith('#fim#')) {
                        g = Buffer.from(g.split("#fim#")[0], 'base64').toString('utf-8');
                        const d = JSON.parse(g); const r = await reqRes(d)
                        if ((d.reqRes == 'req') && (r.res.reqRes == 'req')) {
                            const b = Buffer.from(JSON.stringify(r)).toString('base64');
                            for (let i = 0; i < b.length; i += bufferSocket) { const p = b.slice(i, i + bufferSocket); socket.write(p) }
                            socket.write('#fim#'); // ENVIAR CARACTERE DE FIM 
                        }; g = ''; // LIMPAR BUFFER
                    }
                });
            } catch (e) { (async () => { const m = await regexE({ 'e': e }); console.log(m.res) })() }
        }); sockReq.listen((portSocket), () => { });
        const sockRes = net.createServer((socket) => { // ########### RESPONSE
            try {
                let g = ''; socket.on('data', async (chunk) => {
                    g += chunk.toString(); if (g.endsWith('#fim#')) {
                        g = Buffer.from(g.split("#fim#")[0], 'base64').toString('utf-8');
                        const d = JSON.parse(g); const r = await reqRes(d)
                        if ((d.reqRes == 'res') && (r.res.reqRes == 'res')) {
                            const b = Buffer.from(JSON.stringify(r)).toString('base64');
                            for (let i = 0; i < b.length; i += bufferSocket) { const part = b.slice(i, i + bufferSocket); socket.write(part) };
                            socket.write('#fim#'); // ENVIAR CARACTERE DE FIM 
                        }; g = ''; // LIMPAR BUFFER
                    }
                });
            } catch (e) { (async () => { const m = await regexE({ 'e': e }); console.log(m.res) })() }
        }); sockRes.listen((portSocket + 1), () => { });
        // -------------------------------------------------------------------------------------------------

    }
    await run()
}
catch (e) { const m = await regexE({ 'e': e }); console.log(m.res) }





