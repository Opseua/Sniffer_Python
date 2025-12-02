let startup = new Date(); globalThis['firstFileCall'] = new Error(); await import('./resources/@export.js'); let e = firstFileCall, ee = e; let libs = { 'http': {}, };

async function serverRun(inf = {}) {
    let ret = { 'ret': false, }; e = inf.e || e;
    try {
        /* IMPORTAR BIBLIOTECA [NODE] */ libs['http']['http'] = 1; libs = await importLibs(libs, 'serverRun [Sniffer_Python]');

        await logConsole({ e, ee, 'txt': `**************** SERVER **************** [${startupTime(startup, new Date())}]`, });

        let rCS = await configStorage({ e, 'action': 'get', 'key': 'sniffer', }); if (!rCS.ret) { logConsole({ e, ee, 'txt': rCS.msg, }); return rCS; } else { rCS = rCS.res; }
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
        } function rReqRes(text, getSend, getSendOk, pattern) { return (regex({ 'simple': true, pattern, text, }) && getSend === getSendOk); } await wait(); function checkIsString(h) {
            h = h['content-type'] || ''; return (h.startsWith('text/') || h.includes('json') || h.includes('xml') || h.includes('javascript') || h.includes('x-www-form-urlencoded') || h.includes('graphql')) || h;
        } globalThis['targetAlert'] = function (pla, tar, typ) { logConsole({ e, ee, 'txt': `### ${pla} |${typ === true ? '' : ' (BUFFER 🛑)'} ${tar}`, }); };

        async function funGetSend(inf = {}) {
            let ret = { 'ret': false, }, res = { 'action': 2, }; // [action] → 0 CANCELAR | 1 CONTINUAR (ALTERAR: SIM) | 2 CONTINUAR (ALTERAR: NÃO)
            try { // let host = new URL(url).hostname; 
                let { getSend, /* method = '', */ url, headers, body, teste = '', } = inf; let platform = '', type = checkIsString(JSON.parse(headers.toLowerCase())); if (type === true) { body = body.toString('utf8'); }

                // #### NTFY | /home
                if (url.includes('ntfy.sh') && rReqRes(url, getSend, 'send', arrUrl['NFTY'][0])) {
                    res['body'] = body.replaceAll('CASA', 'AAAAAAAA');
                }

                // #### EWOQ
                if (url.includes('ewoq')) {
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

                /* ###### */ if (platform.length > 2) { platform = [`${platform[0]}${teste}`, platform[1], platform[2],]; globalThis[platform[1]]({ 'platform': platform[0], 'target': platform[2], body, type, }); }
                if (res.action !== 0 && (res.method || res.url || res.headers || res.body)) { res.action = 1; } ret['ret'] = true; ret['res'] = res;
            } catch (catchErr) { let retRegexE = await regexE({ inf, 'e': catchErr, }); ret['msg'] = retRegexE.res; ret['ret'] = false; delete ret['res']; }
            return { ...({ 'ret': ret.ret, }), ...(ret.msg && { 'msg': ret.msg, }), ...(ret.hasOwnProperty('res') && { 'res': ret.res, }), };
        } // *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-* TESTES *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*

        let hitApps = [ // [hitAppType] → blindNao blindNao[3] respNao respSim respSim_CLOSED_DNE 
            // { 'platform': 'EWOQ', 'hitAppType': 'blindNao', 'hitApp': 'YouTube_Video_Inappropriateness_Evaluation', }, // YouTube_Video_Inappropriateness_Evaluation / AlpacaBrandSafetyBrandDelicate
            // { 'platform': 'TryRating', 'hitAppType': 'respSim', 'hitApp': 'POIEvaluation', }, // Search20 SearchAdsRelevance POIEvaluation
        ]; let plaOpt = {
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
        }; let hX = [`{"content-type":"json"}`, `{"content-type":"OUTRO_TIPO"}`,]; if (hitApps.length === 0) { correiosServer(); /* SERVIDOR CORREIOS */ } for (let [index, v,] of hitApps.entries()) {
            let p, l = v.platform, t = '_teste'; l = [l, `${l}${t}`,]; p = `${fileProjetos}/${gW.project}/logs/Plataformas/z${t}/${l[0]}/${v.hitApp}`; for (let [index, v1,] of plaOpt[l[0]].entries()) {
                let f = { e, 'action': 'read', 'path': `${p}/${v1.file.replace('${hitAppType}', v.hitAppType)}`, 'encoding': false, }, r = await file(f); if (!r.ret) { console.log(r.msg); break; }
                await funGetSend({ 'getSend': v1.getSend, 'url': arrUrl[l[0]][v1.url], 'body': r.res, 'headers': !v1.midia ? hX[0] : hX[1], 'teste': t, }); await new Promise(r => { setTimeout(r, 2000); });
            } // *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-* ERROS SERVIDOR (ERROS QUE NÃO SEJAM DO DESLIGAMENTO DO SNIFFER) *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
        } async function serverErr(r) { let e = r.toString(); if (e.includes('EADDRINUSE') || !e.includes('ECONNRESET')) { await regexE({ inf, e: r, }); process.exit(1); } } let serSoc = _http.createServer((req, res) => {
            let buffers = []; req.on('data', chunk => { buffers.push(chunk); }); let { 'x-getsend': getSend, 'x-method': method, 'x-url': url, 'x-headers': headers, } = req.headers; req.on('end', async () => {
                let body = Buffer.concat(buffers), ret = await funGetSend({ getSend, method, url, headers, body, }), action = ret?.res?.action || 2; buffers = '';
                body = false; res.setHeader('Content-Type', 'application/octet-stream'); if (action === 0) { buffers = `CANCELADA`; } else if (action === 1) {
                    ret = ret.res; buffers = `ALTERADA`; if (ret.method) { /* [method] */ res.setHeader('x-method', ret.method); } if (ret.url) { /* [url] */ res.setHeader('x-url', ret.url); }
                    if (ret.headers) { /* [headers] */ res.setHeader('x-headers', JSON.stringify(ret.headers)); } if (ret.body) { /* [body] */ body = ret.body; }
                } res.setHeader('Transfer-Encoding', 'chunked'); res.setHeader('x-action', `${action}`); if (buffers) { logConsole({ e, ee, 'txt': `${getSend} ${buffers}`, }); }
                if (body) { body = Buffer.from(body, 'utf8'); let max = rCS.bufferSocket * 1024; for (let i = 0; i < body.length; i += max) { res.write(body.slice(i, i + max)); } } res.end();
            });
        }); serSoc.listen((rCS.portSocket), () => { }).on('error', async (err) => { serverErr(err); });
    } catch (catchErr) {
        let retRegexE = await regexE({ inf, 'e': catchErr, }); ret['msg'] = retRegexE.res; ret['ret'] = false; delete ret['res'];
    }
}
// TODAS AS FUNÇÕES PRIMÁRIAS DO 'server.js' / 'serverC6.js' / 'serverJsf.js' DEVEM SE CHAMAR 'serverRun'!!!
serverRun();


