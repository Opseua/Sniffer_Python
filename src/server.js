function startupFun(b, c) { let a = c - b; let s = Math.floor(a / 1000); let m = a % 1000; let f = m.toString().padStart(3, '0'); return `${s}.${f}`; }; let startup = new Date();
await import('./resources/@export.js'); let e = import.meta.url, ee = e;

async function serverRun(inf = {}) {
    let ret = { 'ret': false, }; e = inf && inf.e ? inf.e : e;
    try {
        // IMPORTAR BIBLIOTECA [NODEJS]
        if (typeof _net === 'undefined') { await funLibrary({ 'lib': '_net', }); };

        logConsole({ e, ee, 'write': true, 'msg': `**************** SERVER **************** [${startupFun(startup, new Date())}]`, });

        let infConSto, retConSto; // cs = await csf([{}]); gO.inf = cs.res // ***** CS ***** GET
        infConSto = { e, 'action': 'get', 'key': 'sniffer', }; retConSto = await configStorage(infConSto);
        if (!retConSto.ret) { logConsole({ e, ee, 'write': true, 'msg': retConSto.msg, }); return retConSto; } else { retConSto = retConSto.res; }
        let portSocket = retConSto.portSocket, bufferSocket = retConSto.bufferSocket, arrUrl = retConSto.arrUrl; global['platforms'] = retConSto.platforms;
        let ori = `messageSendOrigin_${gW.devGet[1]}`; let des = `${gW.devGet[1].split('roo=')[0]}roo=${gW.devMy}-CHROME-${gW.devices[0][2][3]}`; global['ori'] = ori; global['des'] = des;

        async function pacFileCreate(arrUrl) {
            let baseUrls = new Set(arrUrl.filter(url => url.startsWith('http')).map(url => url.replace(/^https?:\/\//, '')).map(url => url.split('/')[0])); let retFile;
            let res = 'function FindProxyForURL(url, host) {\n'; res += '    var proxyUrls = [\n'; res += Array.from(baseUrls).map(baseUrl => `        "*${baseUrl}*"`).join(',\n');
            res += '\n    ];\n'; res += '    return proxyUrls.some(function(currentUrl) { return shExpMatch(url, currentUrl); }) ? "PROXY 127.0.0.1:8088" : "DIRECT";\n'; res += '}\n';
            retFile = await file({ e, 'action': 'write', 'rewrite': false, 'path': `!letter!:/${gW.root}/Sniffer_Python/src/scripts/BAT/proxy.pac`, 'text': res, });
            if (!retFile.ret) { logConsole({ e, ee, 'write': true, 'msg': `ERRO AO ESCREVER ARQUIVO pac`, }); }
        }; pacFileCreate(arrUrl); // NÃO POR COMO 'await' PARA ACELERAR O CÓDIGO

        // CLIENT (NÃO POR COMO 'await'!!!) [MANTER NO FINAL]  ||||  [1 SEGUNDO APÓS INICIAR] BADGE (USUARIO_3): RESETAR | PAC FILE
        client({ e, }); setTimeout(() => { listenerAcionar(ori, { destination: des, message: { fun: [{ securityPass: gW.securityPass, name: 'chromeActions', par: { e, action: 'badge', text: '', }, },], }, }); }, 1000);

        async function funGetSend(inf = {}) {
            let ret = { 'complete': true, res: {}, };
            try {
                let { getSend, url, body, platform, } = inf; ret['res']['getSend'] = getSend; let showLog = false; if (arrUrl.find(infRegex => regex({ 'simple': true, 'pattern': infRegex, 'text': url, }))) {
                    if (!platform) { platform = url.includes('ewoq') ? 'EWOQ' : url.includes('tryrating') ? 'TryRating' : 'NAO_IDENTIFICADO'; }; let urlCurrent;
                    // ######################################################################

                    // #### NTFY | /home
                    if ((getSend === 'send') && regex({ 'simple': true, 'pattern': arrUrl[0], 'text': url, })) { ret['res']['body'] = body.replace(/CASA/g, 'AAAAAAAA'); }

                    // #### EWOQ
                    if (platform.includes('EWOQ')) {
                        /* [1] → INÍCIO */; urlCurrent = `/home`; // INSPECIONAR → /(GetNewTasks|GetTemplate|RecordTaskRenderingLatency|SubmitFeedback)/
                        if ((getSend === 'get') && regex({ 'simple': true, 'pattern': arrUrl[1], 'text': url, })) { ewoq({ 'platform': platform, 'url': `${platform}${urlCurrent}`, 'body': body, }); }

                        /* [2] → RECEBE A TASK */; urlCurrent = `/GetNewTasks`;
                        if ((getSend === 'get') && regex({ 'simple': true, 'pattern': arrUrl[2], 'text': url, })) { ewoq({ 'platform': platform, 'url': `${platform}${urlCurrent}`, 'body': body, }); }

                        /* [3] → SOLICITA O TEMPLATE */; urlCurrent = `/GetTemplate_[1-SEND]`;
                        if ((getSend === 'send') && regex({ 'simple': true, 'pattern': arrUrl[3], 'text': url, })) { ewoq({ 'platform': platform, 'url': `${platform}${urlCurrent}`, 'body': body, }); }

                        /* [4] → RECEBE O TEMPLATE */; urlCurrent = `/GetTemplate_[2-GET]`;
                        if ((getSend === 'get') && regex({ 'simple': true, 'pattern': arrUrl[3], 'text': url, })) { ewoq({ 'platform': platform, 'url': `${platform}${urlCurrent}`, 'body': body, }); }

                        /* [5] → TASK 100% CARREGADA */; urlCurrent = `/RecordTaskRenderingLatency_[TASK_100%_LOADED]`;
                        if ((getSend === 'send') && regex({ 'simple': true, 'pattern': arrUrl[4], 'text': url, })) { ewoq({ 'platform': platform, 'url': `${platform}${urlCurrent}`, 'body': body, }); }

                        /* [6] → ENVIA A RESPOSTA DA TASK */; urlCurrent = `/SubmitFeedback`;
                        if ((getSend === 'send') && regex({ 'simple': true, 'pattern': arrUrl[5], 'text': url, })) { ewoq({ 'platform': platform, 'url': `${platform}${urlCurrent}`, 'body': body, }); }
                    }

                    // #### TryRating
                    if (platform.includes('TryRating')) {
                        /* [1] → INÍCIO */; urlCurrent = `/home`;
                        if ((getSend === 'get') && regex({ 'simple': true, 'pattern': arrUrl[6], 'text': url, })) { tryRating({ 'platform': platform, 'url': `${platform}${urlCurrent}`, 'body': body, }); }

                        /* [2] → RECEBE A TASK */; urlCurrent = `/survey`;
                        if ((getSend === 'get') && regex({ 'simple': true, 'pattern': arrUrl[7], 'text': url, })) { tryRating({ 'platform': platform, 'url': `${platform}${urlCurrent}`, 'body': body, }); }

                        /* [3] → ENVIA A RESPOSTA DA TASK */; urlCurrent = `/client_log`;
                        if ((getSend === 'send') && regex({ 'simple': true, 'pattern': arrUrl[8], 'text': url, })) { tryRating({ 'platform': platform, 'url': `${platform}${urlCurrent}`, 'body': body, }); }
                    }

                    // ######################################################################
                    if (!ret.complete) { showLog = 'REQ/RES CANCELADA'; } else if (ret.res && (ret.res.body || ret.res.headers)) { showLog = 'REQ/RES ALTERADA'; }
                } else { showLog = `OUTRO URL | ${url}`; }; if (showLog) { logConsole({ e, ee, 'write': true, 'msg': `JS → ${showLog}`, }); }
            } catch (catchErr) { let retRegexE = await regexE({ 'inf': inf, 'e': catchErr, }); ret['msg'] = retRegexE.res; ret['ret'] = false; delete ret['res']; };
            return { ...({ 'ret': ret.ret, }), ...(ret.msg && { 'msg': ret.msg, }), ...(ret.res && { 'res': ret.res, }), };
        }

        // *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-* TESTES *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*

        // let hitApps = [ // [platform] → COM OU SEM '_teste' | [hitAppType] → blindNao respNao respSim respSim_CLOSED_DNE 
        //     // { 'platform': 'EWOQ_teste', 'hitApp': 'YouTube_Video_Inappropriateness_Evaluation', 'hitAppType': 'blindNao' }, // [hitApp] → YouTube_Video_Inappropriateness_Evaluation
        //     { 'platform': 'TryRating_teste', 'hitApp': 'Search20', 'hitAppType': 'respSim_CLOSED_DNE', }, // [hitApp] → Search20 DrivingNavigation3DMaps
        // ];

        // let platformOption = {
        //     'EWOQ': [
        //         { 'url': arrUrl[1], 'getSend': 'get', 'file': '1-GET_##_VAZIO_##.txt', }, // [1] → INÍCIO
        //         { 'url': arrUrl[2], 'getSend': 'get', 'file': '2-GET_TASK_1-${hitAppType}.txt', }, // [2] → RECEBE A TASK
        //         { 'url': arrUrl[3], 'getSend': 'send', 'file': '3-SEND_TEMPLATE-${hitAppType}.txt', }, // [3] → SOLICITA O TEMPLATE
        //         { 'url': arrUrl[3], 'getSend': 'get', 'file': '4-GET_TEMPLATE-${hitAppType}.txt', }, // [4] → RECEBE O TEMPLATE
        //         { 'url': arrUrl[2], 'getSend': 'get', 'file': '2-GET_TASK_2-${hitAppType}.txt', }, // [2] → RECEBE A TASK
        //         { 'url': arrUrl[4], 'getSend': 'send', 'file': '5-SEND_TASK_1_100_LOADED-${hitAppType}.txt', }, // [5] → TASK 100% CARREGADA
        //         { 'url': arrUrl[5], 'getSend': 'send', 'file': '6-SEND_TASK_1-${hitAppType}.txt', }, // [6] → ENVIA A RESPOSTA DA TASK
        //         { 'url': arrUrl[4], 'getSend': 'send', 'file': '5-SEND_TASK_2_100_LOADED-${hitAppType}.txt', }, // [5] → TASK 100% CARREGADA
        //         { 'url': arrUrl[5], 'getSend': 'send', 'file': '6-SEND_TASK_2-${hitAppType}.txt', }, // [6] → ENVIA A RESPOSTA DA TASK
        //     ],
        //     'TryRating': [
        //         { 'url': arrUrl[6], 'getSend': 'get', 'file': '1-GET_##_VAZIO_##.txt', }, // [1] → INÍCIO
        //         { 'url': arrUrl[7], 'getSend': 'get', 'file': '2-GET_TASK-${hitAppType}.txt', }, // [2] → RECEBE A TASK
        //         { 'url': arrUrl[8], 'getSend': 'send', 'file': '3-SEND_TASK-${hitAppType}.txt', }, // [3] → ENVIA A RESPOSTA DA TASK
        //     ],
        // };

        // for (let [index, value,] of hitApps.entries()) {
        //     let platform = [value.platform.replace('_teste', ''),]; platform.push(`${platform[0]}_teste`);
        //     let infFile, retFile, pathLogPlataform = `${fileProjetos}/Sniffer_Python/log/Plataformas/z_teste/${platform[0]}/${value.hitApp}`; for (let [index, value1,] of platformOption[platform[0]].entries()) {
        //         infFile = { e, 'action': 'read', 'path': `${pathLogPlataform}/${value1.file.replace('${hitAppType}', value.hitAppType)}`, };
        //         retFile = await file(infFile); if (!retFile.ret) { console.log('ARQUIVO NÃO ENCONTRADO', infFile.path); break; }
        //         await funGetSend({ 'platform': platform[1], 'getSend': value1.getSend, 'url': value1.url, 'body': retFile.res, }); await new Promise(resolve => { setTimeout(resolve, 2000); });
        //     }
        // }

        // *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-* TESTES *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*

        // -------------------------------------------------------------------------------------------------
        // ERROS SERVIDOR (ERROS QUE NÃO SEJAM DO DESLIGAMENTO DO SNIFFER)
        async function serverErr(err) { let errString = err.toString(); if (errString.includes('EADDRINUSE') || !errString.includes('ECONNRESET')) { await regexE({ 'inf': inf, 'e': err, }); process.exit(1); } };
        let serverSocketReq = _net.createServer((socket) => { // ########### REQ [SEND]
            let g = ''; socket.on('data', async (chunk) => {
                g += chunk.toString(); if (g.endsWith('#fim#')) {
                    g = Buffer.from(g.split('#fim#')[0], 'base64').toString('utf-8'); let d = JSON.parse(g); let r = await funGetSend(d); if ((d.getSend === 'send') && (r.res.getSend === 'send')) {
                        let b = Buffer.from(JSON.stringify(r)).toString('base64'); for (let i = 0; i < b.length; i += bufferSocket) { let p = b.slice(i, i + bufferSocket); socket.write(p); }
                        socket.write('#fim#'); // ENVIAR CARACTERE DE FIM 
                    }; g = ''; // LIMPAR BUFFER
                }
            });
        }); let serverSocketRes = _net.createServer((socket) => { // ########### RES [GET]
            let g = ''; socket.on('data', async (chunk) => {
                g += chunk.toString(); if (g.endsWith('#fim#')) {
                    g = Buffer.from(g.split('#fim#')[0], 'base64').toString('utf-8'); let d = JSON.parse(g); let r = await funGetSend(d); if ((d.getSend === 'get') && (r.res.getSend === 'get')) {
                        let b = Buffer.from(JSON.stringify(r)).toString('base64'); for (let i = 0; i < b.length; i += bufferSocket) { let part = b.slice(i, i + bufferSocket); socket.write(part); };
                        socket.write('#fim#'); // ENVIAR CARACTERE DE FIM 
                    }; g = ''; // LIMPAR BUFFER
                }
            }); // INICIAR SERVIDORES SOCKET (REQ [SEND] | RES [GET])
        }); serverSocketReq.listen((portSocket), () => { serverSocketRes.listen((portSocket + 1), () => { }).on('error', (err) => { serverErr(err); }); }).on('error', async (err) => { serverErr(err); });
        // -------------------------------------------------------------------------------------------------
    } catch (catchErr) {
        let retRegexE = await regexE({ 'inf': inf, 'e': catchErr, }); ret['msg'] = retRegexE.res; ret['ret'] = false; delete ret['res'];
    }
}
// TODAS AS FUNÇÕES PRIMÁRIAS DO 'server.js' / 'serverC6.js' / 'serverJsf.js' DEVEM SE CHAMAR 'serverRun'!!!
serverRun();


