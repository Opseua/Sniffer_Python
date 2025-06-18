// GET http://localhost:3000/buscaAqui?termos=BARREIROS;RAMOS;RIO

let e = currentFile(), ee = e; let libs = { 'http': {}, 'url': {}, 'readline': {}, };
async function correiosServer(inf = {}) {
    let ret = { 'ret': false, }; e = inf && inf.e ? inf.e : e;
    try {
        /* IMPORTAR BIBLIOTECA [NODE] */
        libs['http']['createServer'] = 1; libs['url']['parse'] = 1; libs['readline']['createInterface'] = 1; libs = await importLibs(libs, 'serverRun [Sniffer_Python]'); let { promises, createReadStream, } = _fs;
        let arruamento = `${fileProjetos}/Sniffer_Python/logs/z_Arruamento`; function normalizar(texto) { return texto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^\w\s]/g, '').trim(); }
        function analisarComplemento(complemento) {
            let texto = complemento.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
            if (!(texto.startsWith(`- ate `) || texto.startsWith(`- de `) || texto.startsWith(`- lado `))) { return { lado: 'A', numInicial: '1', numFinal: '99999', }; }
            let lado = 'A'; if (texto.includes('- lado impar')) { lado = 'I'; } else if (texto.includes('- lado par')) { lado = 'P'; }
            if (texto.includes('- de ')) { texto = '- de ' + texto.split('- de ')[1]; } else if (texto.includes('- ate ')) { texto = '- ate ' + texto.split('- ate ')[1]; }
            let temAte = texto.includes('- ate '); let temFim = texto.includes(' ao fim'); let numeros = []; let faixa = texto.replace(/[^\d\-\/]/g, ' '); let compostos = faixa.match(/\b\d+\/\d+\b/g);
            if (compostos) { for (let c of compostos) { let [a, b,] = c.split('/').map(n => parseInt(n)); if (a > 0) { numeros.push(a); } if (b > 0) { numeros.push(b); } } }
            let isolados = faixa.match(/\b\d+\b/g); if (isolados) { for (let n of isolados) { let val = parseInt(n); if (val > 0) { numeros.push(val); } } } numeros = [...new Set(numeros),];
            let numInicial = null, numFinal = null; if (temFim) { if (numeros.length > 0) { numInicial = String(Math.min(...numeros)); } else { numInicial = (lado === 'P') ? '2' : '1'; } numFinal = '99999'; }
            else if (temAte) { if (numeros.length > 0) { numFinal = String(Math.max(...numeros)); } numInicial = (lado === 'P') ? '2' : '1'; }
            else if (numeros.length >= 2) { numInicial = String(Math.min(...numeros)); numFinal = String(Math.max(...numeros)); }
            else if (numeros.length === 1) { numInicial = String(numeros[0]); numFinal = String(numeros[0]); } else { numInicial = (lado === 'P') ? '2' : '1'; numFinal = '99999'; } return { lado, numInicial, numFinal, };
        }

        // --------------------------------------------------------------------------------------------------------------------------------------------------------------------

        // BANCO DE DADOS
        async function criarBancoDeDados(dir) {
            // → MUNICÍPIOS
            let municipios = {}; async function bancoDeDadosMunicipios(dir) {
                let conteudo = await promises.readFile(`${dir}/correios/LOG_LOCALIDADE.TXT`, 'latin1'), ls = conteudo.split(/\r?\n/);
                for (let l of ls) { if (l.includes('@')) { let p = l.split('@'), codigo = p[0], nome = p[2]; municipios[codigo] = nome; } } logConsole({ e, ee, 'txt': `${Object.keys(municipios).length} → municipios`, });
            } await bancoDeDadosMunicipios(arruamento);

            // → BAIRROS
            let bairros = {}; async function bancoDeDadosBairro(dir) {
                let conteudo = await promises.readFile(`${dir}/correios/LOG_BAIRRO.TXT`, 'latin1'), ls = conteudo.split(/\r?\n/);
                for (let l of ls) { if (l.includes('@')) { let p = l.split('@'), codigo = p[0], nome = p[3]; bairros[codigo] = nome; } } logConsole({ e, ee, 'txt': `${Object.keys(bairros).length} → bairros`, });
            } await bancoDeDadosBairro(arruamento);

            // → LOGRADOUTO TIPO | LOGRADOUROS | COMPLEMENTOS

            let bairrosOk = { 'qtd': 0, 'tem': {}, 'obj': {}, }, cab = `logradouroTipo|logradouro|complemento|bairro|municipio|estado|cep\n`, logradourosOk = { 'qtd': 0, 'tem': {}, 'obj': {}, 'txt': cab, 'estados': {}, };
            let logradouroTiposOk = { 'qtd': 0, 'tem': {}, 'obj': {}, }, complementosOk = { 'qtd': 0, 'tem': {}, 'obj': {}, }, municipiosOk = { 'qtd': 0, 'tem': {}, 'obj': {}, }, estados = {}, qtd = 0;
            let arquivosLogradouro = (await promises.readdir(`${dir}/correios`)).filter(nome => nome.startsWith('LOG_LOGRADOURO_') && nome.endsWith('.TXT')); for (let nome of arquivosLogradouro) {
                let caminho = `${dir}/correios/${nome}`, conteudo = await promises.readFile(caminho, 'latin1'), linhas = conteudo.split(/\r?\n/); for (let linha of linhas) {
                    if (!linha.includes('@')) { continue; } let partes = linha.split('@'); let estado = partes[1] || ''; let municipioCod = partes[2] || ''; let bairroCod = partes[3] || '';
                    let logradouro = partes[5] || ''; let complemento = partes[6] || ''; let cep = partes[7] || ''; let logradouroTipo = partes[8] || ''; qtd++;

                    // LOGRADOURO TIPO
                    let codLogradouroTipo = 0; if (!logradouroTiposOk.tem[logradouroTipo]) {
                        logradouroTiposOk.qtd++; logradouroTiposOk.tem[logradouroTipo] = logradouroTiposOk.qtd; logradouroTiposOk.obj[logradouroTiposOk.qtd] = logradouroTipo; codLogradouroTipo = logradouroTiposOk.qtd;
                    } else { codLogradouroTipo = logradouroTiposOk.tem[logradouroTipo]; }

                    // LOGRADOURO
                    let codLogradouro = 0; if (!logradourosOk.tem[logradouro]) {
                        logradourosOk.qtd++; logradourosOk.tem[logradouro] = logradourosOk.qtd; logradourosOk.obj[logradourosOk.qtd] = logradouro; codLogradouro = logradourosOk.qtd;
                    } else { codLogradouro = logradourosOk.tem[logradouro]; }

                    // COMPLEMENTO
                    let codComplemento = 0; if (!complementosOk.tem[complemento]) {
                        complementosOk.qtd++; complementosOk.tem[complemento] = complementosOk.qtd; complementosOk.obj[complementosOk.qtd] = complemento; codComplemento = complementosOk.qtd;
                    } else { codComplemento = complementosOk.tem[complemento]; }

                    // BAIRRO
                    let codBairro = 0; let bairro = bairros[bairroCod]; if (!bairrosOk.tem[bairro]) {
                        bairrosOk.qtd++; bairrosOk.tem[bairro] = bairrosOk.qtd; bairrosOk.obj[bairrosOk.qtd] = bairro; codBairro = bairrosOk.qtd;
                    } else { codBairro = bairrosOk.tem[bairro]; }

                    // MUNICIPIO
                    let codMunicio = 0; let municipio = municipios[municipioCod]; if (!municipiosOk.tem[municipio]) {
                        municipiosOk.qtd++; municipiosOk.tem[municipio] = municipiosOk.qtd; municipiosOk.obj[municipiosOk.qtd] = municipio; codMunicio = municipiosOk.qtd;
                    } else { codMunicio = municipiosOk.tem[municipio]; }

                    // ESTADO + MUNICIPIO (JSON)
                    if (!estados[estado]) { estados[estado] = new Set(); } estados[estado].add(municipio);

                    // ENDREÇO / ENDEREÇO (POR ESTADO)
                    let end = `#${codLogradouroTipo}|${codLogradouro}|${codComplemento}|${codBairro}|${codMunicio}# ${normalizar(`${logradouroTipo} ${logradouro} ${bairro} ${municipio} ${estado} ${cep}`)} \n`;
                    logradourosOk.txt = `${logradourosOk.txt}${end}`; if (!logradourosOk.estados[estado]) { logradourosOk.estados[estado] = cab; } logradourosOk.estados[estado] = `${logradourosOk.estados[estado]}${end}`;
                }
            } await logConsole({ e, ee, txt: `${qtd} → logradouros`, });

            async function dataSave(f, d, o, n, k, c) {
                if (o) { k = Object.keys(d).length; d = JSON.stringify(d); } await promises.writeFile(`${dir}/bancoDeDados/${f}`, d, c || 'latin1'); if (n) { await logConsole({ e, ee, txt: `${k} → ${n}`, }); }
            } await dataSave(`_logradouroTipos.json`, logradouroTiposOk.obj, true, `OK logradouroTipos`); await dataSave(`_logradouros.json`, logradourosOk.obj, true, `OK logradouros`);
            await dataSave(`_complementos.json`, complementosOk.obj, true, `OK complementos`); await dataSave(`_bairros.json`, bairrosOk.obj, true, `OK bairros`);
            await dataSave(`_municipios.json`, municipiosOk.obj, true, `OK municipios`); let obj = JSON.stringify(Object.fromEntries(Object.entries(estados).map(([u, s,]) => [u, Array.from(s),])));
            await dataSave(`estadosMunicipios.js`, `let estadosMunicipios = ${obj}; globalThis['estadosMunicipios'] = estadosMunicipios;`, false, `estados+municipios`, Object.keys(estados).length, 'utf8');
            for (let k in logradourosOk.estados) { await dataSave(`index_${k}.txt`, logradourosOk.estados[k], false); }
            logradouroTiposOk = {}; logradourosOk = {}; complementosOk = {}; bairrosOk = {}; bairros = {}; municipiosOk = {}; municipios = {}; estados = {};
        } // await criarBancoDeDados(arruamento);

        // --------------------------------------------------------------------------------------------------------------------------------------------------------------------

        async function carregarEnderecos(dir) {
            let arquivos = await promises.readdir(dir); let dados = {}; for (let arquivo of arquivos) {
                if (arquivo.startsWith('index_') && arquivo.endsWith('.txt') && arquivo.length === 12) {
                    let estado = arquivo.slice(6, 8); let caminhoArquivo = `${dir}/${arquivo}`; let lins = [], linsLow = []; let readStream = createReadStream(caminhoArquivo, { encoding: 'latin1', });
                    let rl = _createInterface({ input: readStream, crlfDelay: Infinity, }); for await (let linha of rl) { lins.push(linha); linsLow.push(linha.toLowerCase()); } dados[estado] = { lins, linsLow, };
                }
            } return dados;
        } function buscarLinhas(d, t, estados) {
            t = t.map(t => t.toLowerCase()); let r = []; for (let estado of estados) {
                let o = d[estado].lins; let l = d[estado].linsLow; for (let i = 0; i < o.length && r.length < 100; i++) { let w = l[i]; if (t.every(t => w.includes(t))) { r.push(o[i]); } } if (r.length >= 100) { break; }
            } return r;
        }

        async function iniciarServidor() {
            let s = Date.now(), dir = `${arruamento}/bancoDeDados`; logConsole({ e, ee, 'txt': `CARREGANDO DADOS...`, }); async function dataGet(f) { return JSON.parse(await promises.readFile(`${dir}/${f}`, 'latin1')); }
            let logradouroTipos = (await dataGet(`_logradouroTipos.json`)); let logradouros = (await dataGet(`_logradouros.json`)); let complementos = (await dataGet(`_complementos.json`));
            let bairros = (await dataGet(`_bairros.json`)); let municipios = (await dataGet(`_municipios.json`)); let index = { logradouroTipos, logradouros, complementos, bairros, municipios, };
            let retEstados = await carregarEnderecos(`${dir}`); logConsole({ e, ee, 'txt': `DADOS CARREGADO ${(Date.now() - s) / 1000} segundos`, }); let ceps = {
                'AC': { 'min': 69900000, 'max': 69999999, }, 'AL': { 'min': 57000000, 'max': 57999999, }, 'AM': { 'min': 69000000, 'max': 69899999, }, 'AP': { 'min': 68900000, 'max': 68999999, },
                'BA': { 'min': 40000000, 'max': 48999999, }, 'CE': { 'min': 60000000, 'max': 63999999, }, 'DF': { 'min': 70000000, 'max': 73699999, }, 'ES': { 'min': 29000000, 'max': 29999999, },
                'GO': { 'min': 72800000, 'max': 76799999, }, 'MA': { 'min': 65000000, 'max': 65999999, }, 'MG': { 'min': 30000000, 'max': 39999999, }, 'MS': { 'min': 79000000, 'max': 79999999, },
                'MT': { 'min': 78000000, 'max': 78899999, }, 'PA': { 'min': 66000000, 'max': 68899999, }, 'PB': { 'min': 58000000, 'max': 58999999, }, 'PE': { 'min': 50000000, 'max': 56999999, },
                'PI': { 'min': 64000000, 'max': 64999999, }, 'PR': { 'min': 80000000, 'max': 87999999, }, 'RJ': { 'min': 20000000, 'max': 28999999, }, 'RN': { 'min': 59000000, 'max': 59999999, },
                'RO': { 'min': 76800000, 'max': 76999999, }, 'RR': { 'min': 69300000, 'max': 69399999, }, 'RS': { 'min': 90000000, 'max': 99999999, }, 'SC': { 'min': 88000000, 'max': 89999999, },
                'SE': { 'min': 49000000, 'max': 49999999, }, 'SP': { 'min': 1000000, 'max': 19999999, }, 'TO': { 'min': 77000000, 'max': 77999999, },
            }; function estadosPorCep(cep) { for (let uf in ceps) { let c = ceps[uf]; if (cep >= c.min && cep <= c.max) { return uf; } } return false; }

            // 17031429

            let server = _createServer((req, res) => {
                let reqUrl = _parse(req.url, true); function resEnd(d) { res.writeHead(200, { 'Content-Type': 'application/json', }).end(JSON.stringify(d)); } if (reqUrl.pathname === '/buscaAqui' && req.method === 'GET') {
                    let termosRaw = reqUrl.query.termos; if (!termosRaw) { resEnd({ 'ret': false, 'msg': `CORREIOS SERVER: ERRO | INFORMAR O 'termos'`, }); return; }

                    let rE = new RegExp('^(' + Object.keys(ceps).join('|') + ')$', 'i'); let termos = []; if (Array.isArray(termosRaw)) { termos = termosRaw.flatMap(t => t.split(';').map(x => x.trim()).filter(x => x)); }
                    else { termos = termosRaw.split(';').map(x => x.trim()).filter(x => x); } termos = Array.from(new Set(termos)); let num, est, cep; for (let i = termos.length - 1; i >= 0; i--) {
                        let v = normalizar(termos[i]); termos[i] = v; if (/\d{7,8}/.test(v)) { cep = v.padStart(8, '0'); termos[i] = cep; cep = estadosPorCep(cep); }
                        if (/^\d+$/.test(v) && !(v.length > 6)) { num = Number(v); termos.splice(i, 1); } if (rE.test(v)) { est = v.toUpperCase(); termos.splice(i, 1); }
                    }

                    let resultados = [], arr = ((t => t.length ? t : Object.keys(ceps))([...new Set([est, cep,].filter(Boolean)),])); for (let [idx, v,] of buscarLinhas(retEstados, termos, arr).entries()) {
                        let [codLogradouroTipo, codLogradouro, codComplemento, codBairro, codMunicio,] = v.match(/#(.*?)#/)[1].split('|'), m = v.match(/( [a-z]{2}) (\d{7,8}) $/i), estado = m[1].toUpperCase(), cep = m[2];
                        let complemento = index.complementos[codComplemento] || ''; let retCom = analisarComplemento(complemento);

                        if (!num || (num >= retCom.numInicial && num <= retCom.numFinal && (retCom.lado === 'A' || retCom.lado === 'I' && num % 2 || retCom.lado === 'P' && num % 2 === 0))) {
                            resultados.push({
                                'logradouroTipo': index.logradouroTipos[codLogradouroTipo], 'logradouro': index.logradouros[codLogradouro], complemento,
                                'bairro': index.bairros[codBairro], 'municipio': index.municipios[codMunicio], 'estado': estado.trim(), cep, ...retCom,
                            });
                        }

                    } resEnd({ 'ret': true, 'msg': `CORREIOS SERVER: OK`, 'res': resultados, }); return;
                } resEnd({ 'ret': false, 'msg': `CORREIOS SERVER: ERRO | ROTA INVÁLIDA`, });
            }); let port = 7777; server.listen(port, () => { logConsole({ e, ee, 'txt': `SERVIDOR CORREIOS RODANDO http://localhost:${port}`, }); });
        } await iniciarServidor();

        ret['msg'] = `ADDRESS FIND: OK`;
        ret['ret'] = true;

    } catch (catchErr) {
        let retRegexE = await regexE({ inf, 'e': catchErr, }); ret['msg'] = retRegexE.res; ret['ret'] = false; delete ret['res'];
    }

    return { ...({ 'ret': ret.ret, }), ...(ret.msg && { 'msg': ret.msg, }), ...(ret.res && { 'res': ret.res, }), };
}

// CHROME | NODE
globalThis['correiosServer'] = correiosServer;


