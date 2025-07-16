globalThis['currentFile'] = function () { return new Error().stack.match(/([^ \n])*([a-z]*:\/\/\/?)*?[a-z0-9\/\\]*\.js/ig)?.[0].replace(/[()]/g, ''); }; globalThis['sP'] = currentFile(); let startup = new Date();
await import('./resources/@export.js'); let e = sP, ee = e; let libs = { 'net': {}, };

async function serverRun(inf = {}) {
    let ret = { 'ret': false, }; e = inf && inf.e ? inf.e : e;
    try {
        /* IMPORTAR BIBLIOTECA [NODE] */ libs['net']['net'] = 1; libs = await importLibs(libs, 'serverRun [Sniffer_Python]');

        await logConsole({ e, ee, 'txt': `**************** SERVER **************** [${startupTime(startup, new Date())}]`, });

        let rCS = await configStorage({ e, action: 'get', key: 'sniffer', }); if (!rCS.ret) { logConsole({ e, ee, txt: rCS.msg, }); return rCS; } else { rCS = rCS.res; }
        globalThis['platforms'] = rCS.platforms; globalThis['des'] = `${gW.devGet[1].split('roo=')[0]}roo=${gW.devMy}-CHROME-${gW.devices[0][2][3]}`; globalThis['portStopwatch'] = rCS.portStopwatch;

        async function pacFileCreate(arrUrl) { // REQ/RES → 'https://www.example.com/some/path' | url → 'https://www.example.com/' | host → 'www.example.com' *** (OBS: o url completo NÃO aparece!!!)
            let a = new Set(arrUrl.filter(u => u.length > 7).map(u => u.replace(/^https?:\/\//, '')).map(u => u.split('/')[0])), rF, res = 'function FindProxyForURL(url, host) {\n';
            res += '    var proxyUrls = [\n'; res += Array.from(a).map(u => { if (u.startsWith('*')) { u = u.slice(1); } if (u.endsWith('*')) { u = u.slice(0, -1); } return `        "*${u}*"`; }).join(',\n');
            res += '\n    ];\n'; res += `    return proxyUrls.some(function(currentUrl) { return shExpMatch(url, currentUrl); }) ? "PROXY 127.0.0.1:${rCS.portMitm}" : "DIRECT";\n`; res += '}\n';
            rF = await file({ e, 'action': 'write', 'path': `${fileProjetos}/${gW.project}/src/scripts/BAT/proxy.pac`, 'content': res, }); if (!rF.ret) { logConsole({ e, ee, 'txt': `ERRO AO ESCREVER ARQUIVO pac`, }); }
        } let arrUrl = rCS.arrUrl; pacFileCreate(Object.values(arrUrl).filter(v => v).flat().filter(v => v.length > 7)); // NÃO POR COMO 'await' PARA ACELERAR O CÓDIGO

        async function wait() { // [1 SEGUNDO APÓS INICIAR] BADGE (USUARIO_3): RESETAR | PAC FILE
            await new Promise(r => { setTimeout(r, 250); }); client({ e, }); /* CLIENT (NÃO POR COMO 'await'!!!) [MANTER NO FINAL] */ await new Promise(r => { setTimeout(r, 500); });
            messageSend({ destination: des, message: { fun: [{ securityPass: gW.securityPass, name: 'chromeActions', par: { e, action: 'badge', text: '', }, },], }, }); await new Promise(r => { setTimeout(r, 150); });
        } function rReqRes(text, getSend, getSendOk, pattern) { return (regex({ 'simple': true, pattern, text, }) && getSend === getSendOk); } await wait();

        async function funGetSend(inf = {}) {
            let ret = { 'complete': true, res: {}, };
            try {
                let { getSend, url, body, teste = '', /* method, host,*/ } = inf; ret['res']['getSend'] = getSend; let platform = '';
                /* ###################################################################### */

                // #### NTFY | /home
                if (url.includes('ntfy.sh') && rReqRes(url, getSend, 'send', arrUrl['NFTY'][0])) { ret['res']['body'] = body.replace(/CASA/g, 'AAAAAAAA'); }

                // #### EWOQ
                if (url.includes('ewoqAAA')) {
                    platform = ['EWOQ', 'ewoq',]; if (rReqRes(url, getSend, 'get', arrUrl[platform[0]][0])) { /* [1] → INÍCIO */ platform = [...platform, `/home`,]; }
                    else if (rReqRes(url, getSend, 'get', arrUrl[platform[0]][1])) { /* [2] → RECEBE A TASK */ platform = [...platform, `/GetNewTasks`,]; }
                    else if (rReqRes(url, getSend, 'send', arrUrl[platform[0]][2])) { /* [3] → SOLICITA O TEMPLATE */ platform = [...platform, `/GetTemplate___[1-SEND]___`,]; }
                    else if (rReqRes(url, getSend, 'get', arrUrl[platform[0]][2])) { /* [4] → RECEBE O TEMPLATE */ platform = [...platform, `/GetTemplate___[2-GET]___`,]; }
                    else if (rReqRes(url, getSend, 'send', arrUrl[platform[0]][3])) { /* [5] → TASK 100% CARREGADA */ platform = [...platform, `/RecordTaskRenderingLatency___[TASK_100%_LOADED]___`,]; }
                    else if (rReqRes(url, getSend, 'send', arrUrl[platform[0]][4])) { /* [6] → ENVIA A RESPOSTA DA TASK */ platform = [...platform, `/SubmitFeedback`,]; }
                }

                // #### TryRating
                if (url.includes('tryrating')) {
                    platform = ['TryRating', 'tryRating',]; if (rReqRes(url, getSend, 'get', arrUrl[platform[0]][0])) { /* [1] → INÍCIO */ platform = [...platform, `/home`,]; }
                    else if (rReqRes(url, getSend, 'get', arrUrl[platform[0]][1])) { /* [2] → RECEBE A TASK */ platform = [...platform, `/survey`,]; }
                    else if (rReqRes(url, getSend, 'send', arrUrl[platform[0]][2])) { /* [3] → ENVIA A RESPOSTA DA TASK */ platform = [...platform, `/client_log`,]; }
                }

                // #### Scilliance
                if (url.includes('amazonaws') || url.includes('scilliance')) {
                    platform = ['Scilliance', 'scilliance',]; if (rReqRes(url, getSend, 'get', arrUrl[platform[0]][0])) { /* [1] → INÍCIO (RECEBE O TEMPLATE) */ platform = [...platform, `/ds/config`,]; }
                    else if (rReqRes(url, getSend, 'get', arrUrl[platform[0]][1])) { /* [2] → RECEBE A TASK */ platform = [...platform, `/ds/items`,]; }
                    else if (rReqRes(url, getSend, 'get', arrUrl[platform[0]][2])) {/* [3] → RECEBE O ÁUDIO */ platform = [...platform, `/soundwave`,]; }
                    else if (rReqRes(url, getSend, 'send', arrUrl[platform[0]][3])) { /* [4] → ENVIA A RESPOSTA DA TASK */ platform = [...platform, `/results`,]; }
                    else if (rReqRes(url, getSend, 'send', arrUrl[platform[0]][4])) { /* [5] → ENVIA O LOG */ platform = [...platform, `/___log___`,]; }
                }

                if (platform) { platform = [`${platform[0]}${teste}`, platform[1], platform[2],]; globalThis[platform[1]]({ 'platform': `${platform[0]}`, body, 'target': `${platform[2]}`, url, }); }
                // ######################################################################
                if (!ret.complete) { logConsole({ e, ee, 'txt': `REQ/RES CANCELADA`, }); } else if (ret.res && (ret.res.body || ret.res.headers)) { logConsole({ e, ee, 'txt': `REQ/RES ALTERADA`, }); }
            } catch (catchErr) { let retRegexE = await regexE({ inf, 'e': catchErr, }); ret['msg'] = retRegexE.res; ret['ret'] = false; delete ret['res']; }
            return { ...({ 'ret': ret.ret, }), ...(ret.msg && { 'msg': ret.msg, }), ...(ret.res && { 'res': ret.res, }), };
        }
        // *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-* TESTES *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*

        let hitApps = [ // [hitAppType] → blindNao respNao respSim respSim_CLOSED_DNE 
            // { 'platform': 'EWOQ', 'hitAppType': 'blindNao', 'hitApp': 'YouTube_Video_Inappropriateness_Evaluation', }, // YouTube_Video_Inappropriateness_Evaluation / AlpacaBrandSafetyBrandDelicate
            // { 'platform': 'TryRating', 'hitAppType': 'respSim', 'hitApp': 'POIEvaluation', }, // Search20 SearchAdsRelevance POIEvaluation
            // { 'platform': 'Scilliance', 'hitAppType': 'blindNao', 'hitApp': 'RefertoSpeakerTurnTranscriptionGL', }, // RefertoSpeakerTurnTranscriptionGL
        ];
        let platformOption = {
            'EWOQ': [
                { 'url': 0, 'getSend': 'get', 'file': '1-GET_##_VAZIO_##.txt', }, // [1] → INÍCIO
                { 'url': 1, 'getSend': 'get', 'file': '2-GET_TASK_1-${hitAppType}.txt', }, // [2] → RECEBE A TASK
                { 'url': 2, 'getSend': 'send', 'file': '3-SEND_TEMPLATE-${hitAppType}.txt', }, // [3] → SOLICITA O TEMPLATE
                { 'url': 2, 'getSend': 'get', 'file': '4-GET_TEMPLATE-${hitAppType}.txt', }, // [4] → RECEBE O TEMPLATE
                { 'url': 1, 'getSend': 'get', 'file': '2-GET_TASK_2-${hitAppType}.txt', }, // [2] → RECEBE A TASK
                { 'url': 3, 'getSend': 'send', 'file': '5-SEND_TASK_1_100_LOADED-${hitAppType}.txt', }, // [5] → TASK 100% CARREGADA
                { 'url': 4, 'getSend': 'send', 'file': '6-SEND_TASK_1-${hitAppType}.txt', }, // [6] → ENVIA A RESPOSTA DA TASK

                { 'url': 3, 'getSend': 'send', 'file': '5-SEND_TASK_2_100_LOADED-${hitAppType}.txt', }, // [5] → TASK 100% CARREGADA
                { 'url': 4, 'getSend': 'send', 'file': '6-SEND_TASK_2-${hitAppType}.txt', }, // [6] → ENVIA A RESPOSTA DA TASK
            ],
            'TryRating': [
                { 'url': 0, 'getSend': 'get', 'file': '1-GET_##_VAZIO_##.txt', }, // [1] → INÍCIO
                { 'url': 1, 'getSend': 'get', 'file': '2-GET_TASK-${hitAppType}.txt', }, // [2] → RECEBE A TASK
                { 'url': 2, 'getSend': 'send', 'file': '3-SEND_TASK-${hitAppType}.txt', }, // [4] → ENVIA A RESPOSTA DA TASK
            ],
            'Scilliance': [
                { 'url': 0, 'getSend': 'get', 'file': '1-GET_TEMPLATE-${hitAppType}.txt', }, // [1] → INÍCIO (RECEBE O TEMPLATE)
                { 'url': 1, 'getSend': 'get', 'file': '2-GET_TASK-${hitAppType}.txt', }, // [2] → RECEBE A TASK
                { 'url': 2, 'getSend': 'get', 'file': '3-GET_AUDIO-${hitAppType}.wav', }, // [3] → RECEBE A ÁUDIO
                { 'url': 3, 'getSend': 'send', 'file': '4-SEND_TASK-${hitAppType}.txt', }, // [4] → ENVIA A RESPOSTA DA TASK
                { 'url': 4, 'getSend': 'send', 'file': '5-SEND_LOG-${hitAppType}.txt', }, // [5] → ENVIA O LOG
            ],
        };
        if (hitApps.length === 0) { correiosServer(); /* SERVIDOR CORREIOS */ } for (let [index, v,] of hitApps.entries()) {
            let p, l = v.platform, t = '_teste'; l = [l, `${l}${t}`,]; p = `${fileProjetos}/${gW.project}/logs/Plataformas/z${t}/${l[0]}/${v.hitApp}`; for (let [index, v1,] of platformOption[l[0]].entries()) {
                let r, f = { e, 'action': 'read', 'path': `${p}/${v1.file.replace('${hitAppType}', v.hitAppType)}`, }; r = await file(f); if (!r.ret) { console.log('ARQUIVO NÃO ENCONTRADO', f.path); break; }
                await funGetSend({ 'getSend': v1.getSend, 'url': arrUrl[l[0]][v1.url], 'body': r.res, 'teste': t, }); await new Promise(r => { setTimeout(r, 2000); });
            }
        }

        // *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-* ERROS SERVIDOR (ERROS QUE NÃO SEJAM DO DESLIGAMENTO DO SNIFFER) *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
        async function serverErr(r) { let e = r.toString(); if (e.includes('EADDRINUSE') || !e.includes('ECONNRESET')) { await regexE({ inf, e: r, }); process.exit(1); } } let bS = rCS.bufferSocket, pS = rCS.portSocket;
        let serverSocketReq = _net.createServer((socket) => { // ########### REQ [SEND]
            let g = ''; socket.on('data', async (chunk) => {
                g += chunk.toString(); if (g.endsWith('#fim#')) {
                    g = Buffer.from(g.split('#fim#')[0], 'base64').toString('utf-8'); let d = JSON.parse(g); /* NOVO */ if (d.body) { d.body = Buffer.from(d.body, 'base64'); }  /* --- */
                    let r = await funGetSend(d); if ((d.getSend === 'send') && (r.res.getSend === 'send')) {
                    /* NOVO */ if (r.res.body && Buffer.isBuffer(r.res.body)) { r.res.body = r.res.body.toString('base64'); }  /* ---- */
                        let b = Buffer.from(JSON.stringify(r)).toString('base64'); for (let i = 0; i < b.length; i += bS) { let p = b.slice(i, i + bS); socket.write(p); } socket.write('#fim#'); // CARACTERE DE FIM 
                    } g = ''; // LIMPAR BUFFER
                }
            });
        }); let serverSocketRes = _net.createServer((socket) => { // ########### RES [GET]
            let g = ''; socket.on('data', async (chunk) => {
                g += chunk.toString(); if (g.endsWith('#fim#')) {
                    g = Buffer.from(g.split('#fim#')[0], 'base64').toString('utf-8'); let d = JSON.parse(g); /* NOVO */ if (d.body) { d.body = Buffer.from(d.body, 'base64'); } /* --- */
                    let r = await funGetSend(d); if ((d.getSend === 'get') && (r.res.getSend === 'get')) {
                        /* NOVO */ if (r.res.body && Buffer.isBuffer(r.res.body)) { r.res.body = r.res.body.toString('base64'); } /* ---- */
                        let b = Buffer.from(JSON.stringify(r)).toString('base64'); for (let i = 0; i < b.length; i += bS) { let part = b.slice(i, i + bS); socket.write(part); } socket.write('#fim#'); // CARACTERE DE FIM 
                    } g = ''; // LIMPAR BUFFER
                }
            }); // INICIAR SERVIDORES SOCKET (REQ [SEND] | RES [GET])
        }); serverSocketReq.listen((pS), () => { serverSocketRes.listen((pS + 1), () => { }).on('error', (err) => { serverErr(err); }); }).on('error', async (err) => { serverErr(err); });
        // -------------------------------------------------------------------------------------------------
    } catch (catchErr) {
        let retRegexE = await regexE({ inf, 'e': catchErr, }); ret['msg'] = retRegexE.res; ret['ret'] = false; delete ret['res'];
    }
}
// TODAS AS FUNÇÕES PRIMÁRIAS DO 'server.js' / 'serverC6.js' / 'serverJsf.js' DEVEM SE CHAMAR 'serverRun'!!!
serverRun();


