await import('../../Chrome_Extension/src/resources/@functions.js'); import net from 'net'; console.log('SNIFFER PYTHON [JS] RODANDO', '\n');
await import('./scripts/@EWOQ.js');
await import('./scripts/@TryRating.js');

try {
    async function run() {
        let infConfigStorage, retConfigStorage, infFile, retFile; cs = await csf(['']); gO.inf = cs.res // ***** CS ***** GET
        infConfigStorage = { 'action': 'get', 'key': 'sniffer' }; retConfigStorage = await configStorage(infConfigStorage)
        if (!retConfigStorage.ret) { return } else { retConfigStorage = retConfigStorage.res }; const portSocket = retConfigStorage.portSocket;
        const bufferSocket = retConfigStorage.bufferSocket; const arrUrl = retConfigStorage.arrUrl

        await wsConnect([devChrome, devBlueStacks]);

        infFile = { 'action': 'inf' }; retFile = await file(infFile); if (!retFile.ret) { return } else { retFile = retFile.res }
        let command = `"${conf[1]}:\\ARQUIVOS\\WINDOWS\\BAT\\RUN_PORTABLE\\1_BACKGROUND.exe"`
        command = `${command} "${conf[1]}:\\ARQUIVOS\\WINDOWS\\PORTABLE_Python\\python-3.11.1.amd64\\python.exe"`
        command = `${command} "${conf[1]}:\\ARQUIVOS\\PROJETOS\\Sniffer_Python\\src\\resources\\start.py"`
        // const retCommandLine = await commandLine({ 'background': false, 'command': command }); if (!retCommandLine.ret) { return }

        async function sendGet(inf) {
            let ret = { 'complete': true, res: {} }
            try {
                ret['res']['sendGet'] = inf.sendGet; if (!!arrUrl.find(infRegex => regex({ 'simple': true, 'pattern': infRegex, 'text': inf.url }))) {
                    // ######################################################################

                    // #### NTFY | /home
                    if ((inf.sendGet == 'send') && regex({ 'simple': true, 'pattern': arrUrl[0], 'text': inf.url })) {
                        ret['res']['body'] = inf.body.replace(/CASA/g, 'AAAAAAAA');
                    }

                    // #### EWOQ | /home
                    if ((inf.sendGet == 'get') && regex({ 'simple': true, 'pattern': arrUrl[1], 'text': inf.url })) {
                        const platform = inf.platform ? inf.platform : 'EWOQ'
                        const retEWOQ = EWOQ({ 'platform': platform, 'url': `${platform}/home`, 'body': inf.body })
                    }

                    // #### EWOQ | /GetTemplate_[1-SEND]
                    if ((inf.sendGet == 'send') && regex({ 'simple': true, 'pattern': arrUrl[2], 'text': inf.url })) {
                        const platform = inf.platform ? inf.platform : 'EWOQ'
                        const retEWOQ = EWOQ({ 'platform': platform, 'url': `${platform}/GetTemplate_[1-SEND]`, 'body': inf.body })
                    }

                    // #### EWOQ | /GetTemplate_[2-GET]
                    if ((inf.sendGet == 'get') && regex({ 'simple': true, 'pattern': arrUrl[2], 'text': inf.url })) {
                        const platform = inf.platform ? inf.platform : 'EWOQ'
                        const retEWOQ = EWOQ({ 'platform': platform, 'url': `${platform}/GetTemplate_[2-GET]`, 'body': inf.body })
                    }

                    // #### EWOQ | /GetNewTasks
                    if ((inf.sendGet == 'get') && regex({ 'simple': true, 'pattern': arrUrl[3], 'text': inf.url })) {
                        const platform = inf.platform ? inf.platform : 'EWOQ'
                        const retEWOQ = EWOQ({ 'platform': platform, 'url': `${platform}/GetNewTasks`, 'body': inf.body })
                    }

                    // #### EWOQ | /RecordTaskRenderingLatency [task 100% loaded] 
                    if ((inf.sendGet == 'send') && regex({ 'simple': true, 'pattern': arrUrl[4], 'text': inf.url })) {
                        const platform = inf.platform ? inf.platform : 'EWOQ'
                        const retEWOQ = EWOQ({ 'platform': platform, 'url': `${platform}/RecordTaskRenderingLatency`, 'body': inf.body })
                    }

                    // #### EWOQ | /SubmitFeedback
                    if ((inf.sendGet == 'send') && regex({ 'simple': true, 'pattern': arrUrl[5], 'text': inf.url })) {
                        const platform = inf.platform ? inf.platform : 'EWOQ'
                        const retEWOQ = EWOQ({ 'platform': platform, 'url': `${platform}/SubmitFeedback`, 'body': inf.body })
                    }

                    // #### TryRating | /home
                    if ((inf.sendGet == 'get') && regex({ 'simple': true, 'pattern': arrUrl[6], 'text': inf.url })) {
                        const platform = inf.platform ? inf.platform : 'TryRating'
                        const retTryRating = TryRating({ 'platform': platform, 'url': `${platform}/home`, 'body': inf.body })
                    }

                    // #### TryRating | /survey
                    if ((inf.sendGet == 'get') && regex({ 'simple': true, 'pattern': arrUrl[7], 'text': inf.url })) {
                        const platform = inf.platform ? inf.platform : 'TryRating'
                        const retTryRating = TryRating({ 'platform': platform, 'url': `${platform}/survey`, 'body': inf.body })
                    }

                    // #### TryRating | /client_log [submit]
                    if ((inf.sendGet == 'send') && regex({ 'simple': true, 'pattern': arrUrl[8], 'text': inf.url })) {
                        const platform = inf.platform ? inf.platform : 'TryRating'
                        const retTryRating = TryRating({ 'platform': platform, 'url': `${platform}/client_log`, 'body': inf.body })
                    }

                    // ######################################################################
                    if (!ret.complete) { console.log('SEND/GET CANCELADA') } else if ((ret.res) && (ret.res.body || ret.res.headers)) { console.log('SEND/GET ALTERADA') }
                } else { console.log('OUTRO URL |', inf.url) }
            } catch (e) { const m = await regexE({ 'e': e }); console.log(m.res) }; return ret
        }


        // *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-* TESTES *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*

        var platform = 'EWOQ_teste' // ################################ EWOQ
        // #### EWOQ | /home
        infFile = { 'action': 'read', 'path': 'D:/ARQUIVOS/PROJETOS/Sniffer_Python/log/z_teste/EWOQ/#_SEND-GET_#/1-GET_##_VAZIO_##.txt' }
        retFile = await file(infFile);
        await sendGet({ 'platform': `${platform}`, 'sendGet': 'get', 'url': arrUrl[1], 'body': retFile.res })

        await new Promise(resolve => { setTimeout(resolve, 2000) })

        // #### EWOQ | /GetNewTasks
        infFile = { 'action': 'read', 'path': 'D:/ARQUIVOS/PROJETOS/Sniffer_Python/log/z_teste/EWOQ/#_SEND-GET_#/4-GET_HonestAds.txt' }
        retFile = await file(infFile);
        await sendGet({ 'platform': `${platform}`, 'sendGet': 'get', 'url': arrUrl[3], 'body': retFile.res })

        await new Promise(resolve => { setTimeout(resolve, 2000) })

        // #### EWOQ | /GetTemplate_[1-SEND]
        infFile = { 'action': 'read', 'path': 'D:/ARQUIVOS/PROJETOS/Sniffer_Python/log/z_teste/EWOQ/#_SEND-GET_#/2-SEND_template_HonestAds.txt' }
        retFile = await file(infFile);
        await sendGet({ 'platform': `${platform}`, 'sendGet': 'send', 'url': arrUrl[2], 'body': retFile.res })

        await new Promise(resolve => { setTimeout(resolve, 2000) })

        // #### EWOQ | /GetTemplate_[2-GET]
        infFile = { 'action': 'read', 'path': 'D:/ARQUIVOS/PROJETOS/Sniffer_Python/log/z_teste/EWOQ/#_SEND-GET_#/3-GET_template_HonestAds.txt' }
        retFile = await file(infFile);
        await sendGet({ 'platform': `${platform}`, 'sendGet': 'get', 'url': arrUrl[2], 'body': retFile.res })

        await new Promise(resolve => { setTimeout(resolve, 2000) })

        // #### EWOQ | /GetNewTasks
        infFile = { 'action': 'read', 'path': 'D:/ARQUIVOS/PROJETOS/Sniffer_Python/log/z_teste/EWOQ/#_SEND-GET_#/4-GET_HonestAds_2.txt' }
        retFile = await file(infFile);
        await sendGet({ 'platform': `${platform}`, 'sendGet': 'get', 'url': arrUrl[3], 'body': retFile.res })

        await new Promise(resolve => { setTimeout(resolve, 2000) })

        // #### EWOQ | /RecordTaskRenderingLatency [task 100% loaded] 
        infFile = { 'action': 'read', 'path': 'D:/ARQUIVOS/PROJETOS/Sniffer_Python/log/z_teste/EWOQ/#_SEND-GET_#/5-SEND_RecordTaskRendering.txt' }
        retFile = await file(infFile);
        await sendGet({ 'platform': `${platform}`, 'sendGet': 'send', 'url': arrUrl[4], 'body': retFile.res })

        await new Promise(resolve => { setTimeout(resolve, 2000) })

        // #### EWOQ | /SubmitFeedback
        infFile = { 'action': 'read', 'path': 'D:/ARQUIVOS/PROJETOS/Sniffer_Python/log/z_teste/EWOQ/#_SEND-GET_#/6-SEND_HonestAds.txt' }
        retFile = await file(infFile);
        await sendGet({ 'platform': `${platform}`, 'sendGet': 'send', 'url': arrUrl[5], 'body': retFile.res })

        await new Promise(resolve => { setTimeout(resolve, 2000) })

        // #### EWOQ | /SubmitFeedback
        infFile = { 'action': 'read', 'path': 'D:/ARQUIVOS/PROJETOS/Sniffer_Python/log/z_teste/EWOQ/#_SEND-GET_#/6-SEND_HonestAds_2.txt' }
        retFile = await file(infFile);
        await sendGet({ 'platform': `${platform}`, 'sendGet': 'send', 'url': arrUrl[5], 'body': retFile.res })

        // await new Promise(resolve => { setTimeout(resolve, 5000) })

        // var platform = 'TryRating_teste' // ################################ TryRating
        // // #### TryRating | /home
        // infFile = { 'action': 'read', 'path': 'D:/ARQUIVOS/PROJETOS/Sniffer_Python/log/z_teste/TryRating/#_SEND-GET_#/1-GET_##_VAZIO_##.txt' }
        // retFile = await file(infFile);
        // await sendGet({ 'platform': `${platform}`, 'sendGet': 'get', 'url': arrUrl[6], 'body': retFile.res })
        // sendGet
        // await new Promise(resolve => { setTimeout(resolve, 2000) })

        // // #### TryRating | /survey
        // infFile = { 'action': 'read', 'path': 'D:/ARQUIVOS/PROJETOS/Sniffer_Python/log/z_teste/TryRating/#_SEND-GET_#/2-GET_SearchTerms.txt' }
        // retFile = await file(infFile);
        // await sendGet({ 'platform': `${platform}`, 'sendGet': 'get', 'url': arrUrl[7], 'body': retFile.res })

        // await new Promise(resolve => { setTimeout(resolve, 2000) })

        // // #### TryRating | /client_log [submit]
        // infFile = { 'action': 'read', 'path': 'D:/ARQUIVOS/PROJETOS/Sniffer_Python/log/z_teste/TryRating/#_SEND-GET_#/3-SEND_SearchTerms.txt' }
        // retFile = await file(infFile);
        // await sendGet({ 'platform': `${platform}`, 'sendGet': 'send', 'url': arrUrl[8], 'body': retFile.res })






























        // -------------------------------------------------------------------------------------------------
        const sockReq = net.createServer((socket) => { // ########### REQUEST
            try {
                let g = ''; socket.on('data', async (chunk) => {
                    g += chunk.toString(); if (g.endsWith('#fim#')) {
                        g = Buffer.from(g.split("#fim#")[0], 'base64').toString('utf-8');
                        const d = JSON.parse(g); const r = await sendGet(d)
                        if ((d.sendGet == 'send') && (r.res.sendGet == 'send')) {
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
                        const d = JSON.parse(g); const r = await sendGet(d)
                        if ((d.sendGet == 'get') && (r.res.sendGet == 'get')) {
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





