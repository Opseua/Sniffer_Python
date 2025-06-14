// GET http://localhost:3000/buscaAqui?termos=BARREIROS;RAMOS;RIO

let e = currentFile(), ee = e; let libs = { 'http': {}, 'url': {}, 'readline': {}, };
async function correiosServer(inf = {}) {
    let ret = { 'ret': false, }; e = inf && inf.e ? inf.e : e;
    try {
        /* IMPORTAR BIBLIOTECA [NODE] */
        libs['http']['createServer'] = 1; libs['url']['parse'] = 1; libs['readline']['createInterface'] = 1; libs = await importLibs(libs, 'serverRun [Sniffer_Python]'); let { promises, createReadStream, } = _fs;

        let arruamento = 'D:/ARRUAMENTO'; function normalizar(texto) { return texto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^\w\s]/g, '').trim(); }
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
                let conteudo = await promises.readFile(`${dir}/CORREIOS/LOG_LOCALIDADE.TXT`, 'latin1'), linhas = conteudo.split(/\r?\n/); for (let linha of linhas) {
                    if (linha.includes('@')) { let partes = linha.split('@'), codigo = partes[0], nome = partes[2]; municipios[codigo] = nome; }
                } await promises.writeFile(`${dir}/BANCO_DE_DADOS/municipios.json`, JSON.stringify(municipios), 'latin1'); logConsole({ e, ee, 'txt': `${Object.keys(municipios).length} → municipios`, });
            } await bancoDeDadosMunicipios(arruamento);

            // → BAIRROS
            let bairros = {}; async function bancoDeDadosBairro(dir) {
                let conteudo = await promises.readFile(`${dir}/CORREIOS/LOG_BAIRRO.TXT`, 'latin1'), linhas = conteudo.split(/\r?\n/); for (let linha of linhas) {
                    if (linha.includes('@')) { let partes = linha.split('@'), codigo = partes[0], nome = partes[3]; bairros[codigo] = nome; }
                } await promises.writeFile(`${dir}/BANCO_DE_DADOS/bairros.json`, JSON.stringify(bairros), 'latin1'); logConsole({ e, ee, 'txt': `${Object.keys(bairros).length} → bairros`, });
            } await bancoDeDadosBairro(arruamento);

            // → LOGRADOUTO TIPO | LOGRADOUROS | COMPLEMENTOS
            let logradouroTiposOk = { 'qtd': 0, 'temp': {}, 'obj': {}, }; let logradourosOk = { 'qtd': 0, 'temp': {}, 'obj': {}, 'txt': 'logradouroTipo|logradouro|complemento|bairro|municipio\n', };
            let bairrosOk = { 'qtd': 0, 'temp': {}, 'obj': {}, }; let complementosOk = { 'qtd': 0, 'temp': {}, 'obj': {}, }; let municipiosOk = { 'qtd': 0, 'temp': {}, 'obj': {}, }; let qtd = 0;
            let arquivosLogradouro = (await promises.readdir(`${dir}/CORREIOS`)).filter(nome => nome.startsWith('LOG_LOGRADOURO_') && nome.endsWith('.TXT')); for (let nome of arquivosLogradouro) {
                let caminho = `${dir}/CORREIOS/${nome}`, conteudo = await promises.readFile(caminho, 'latin1'), linhas = conteudo.split(/\r?\n/); for (let linha of linhas) {
                    if (!linha.includes('@')) { continue; } let partes = linha.split('@'); let estado = partes[1] || ''; let municipioCod = partes[2] || ''; let bairroCod = partes[3] || '';
                    let logradouro = partes[5] || ''; let complemento = partes[6] || ''; let cep = partes[7] || ''; let logradouroTipo = partes[8] || ''; qtd++;

                    // LOGRADOURO TIPO
                    let codLogradouroTipo = 0; if (!logradouroTiposOk.temp[logradouroTipo]) {
                        logradouroTiposOk.qtd++; logradouroTiposOk.temp[logradouroTipo] = logradouroTiposOk.qtd; logradouroTiposOk.obj[logradouroTiposOk.qtd] = logradouroTipo; codLogradouroTipo = logradouroTiposOk.qtd;
                    } else { codLogradouroTipo = logradouroTiposOk.temp[logradouroTipo]; }

                    // LOGRADOURO
                    let codLogradouro = 0; if (!logradourosOk.temp[logradouro]) {
                        logradourosOk.qtd++; logradourosOk.temp[logradouro] = logradourosOk.qtd; logradourosOk.obj[logradourosOk.qtd] = logradouro; codLogradouro = logradourosOk.qtd;
                    } else { codLogradouro = logradourosOk.temp[logradouro]; }

                    // COMPLEMENTO
                    let codComplemento = 0; if (!complementosOk.temp[complemento]) {
                        complementosOk.qtd++; complementosOk.temp[complemento] = complementosOk.qtd; complementosOk.obj[complementosOk.qtd] = complemento; codComplemento = complementosOk.qtd;
                    } else { codComplemento = complementosOk.temp[complemento]; }

                    // BAIRRO
                    let codBairro = 0; let bairro = bairros[bairroCod]; if (!bairrosOk.temp[bairro]) {
                        bairrosOk.qtd++; bairrosOk.temp[bairro] = bairrosOk.qtd; bairrosOk.obj[bairrosOk.qtd] = bairro; codBairro = bairrosOk.qtd;
                    } else { codBairro = bairrosOk.temp[bairro]; }

                    // MUNICIPIO
                    let codMunicio = 0; let municipio = municipios[municipioCod]; if (!municipiosOk.temp[municipio]) {
                        municipiosOk.qtd++; municipiosOk.temp[municipio] = municipiosOk.qtd; municipiosOk.obj[municipiosOk.qtd] = municipio; codMunicio = municipiosOk.qtd;
                    } else { codMunicio = municipiosOk.temp[municipio]; }

                    let id = `${codLogradouroTipo}|${codLogradouro}|${codComplemento}|${codBairro}|${codMunicio}`;
                    logradourosOk.txt = `${logradourosOk.txt}#${id}# ${normalizar(`${logradouroTipo} ${logradouro} ${bairro} ${municipio} ${estado} ${cep}`)} \n`;
                }
            }
            console.log('\n'); await promises.writeFile(`${dir}/BANCO_DE_DADOS/logradouroTipos.json`, JSON.stringify(logradouroTiposOk.obj), 'latin1');
            logConsole({ e, ee, 'txt': `${Object.keys(logradouroTiposOk.obj).length} → logradouroTipos`, });
            await promises.writeFile(`${dir}/BANCO_DE_DADOS/logradouros.json`, JSON.stringify(logradourosOk.obj), 'latin1'); logConsole({ e, ee, 'txt': `${Object.keys(logradourosOk.obj).length} → logradouros`, });
            await promises.writeFile(`${dir}/BANCO_DE_DADOS/complementos.json`, JSON.stringify(complementosOk.obj), 'latin1'); logConsole({ e, ee, 'txt': `${Object.keys(complementosOk.obj).length} → complementos`, });
            await promises.writeFile(`${dir}/BANCO_DE_DADOS/bairros.json`, JSON.stringify(bairrosOk.obj), 'latin1'); logConsole({ e, ee, 'txt': `${Object.keys(bairrosOk.obj).length} → bairros OK`, });
            await promises.writeFile(`${dir}/BANCO_DE_DADOS/municipios.json`, JSON.stringify(municipiosOk.obj), 'latin1'); logConsole({ e, ee, 'txt': `${Object.keys(municipiosOk.obj).length} → municipios OK`, });
            await promises.writeFile(`${dir}/BANCO_DE_DADOS/index.txt`, logradourosOk.txt, 'latin1'); logConsole({ e, ee, 'txt': `${qtd} → enderecos`, });
            logradouroTiposOk = {}; logradourosOk = {}; complementosOk = {}; bairrosOk = {}; bairros = {}; municipiosOk = {}; municipios = {};
        } // await criarBancoDeDados(arruamento);

        // --------------------------------------------------------------------------------------------------------------------------------------------------------------------

        function buscarLinhasOtimo(o, l, t) {
            t = t.map(t => t.toLowerCase()); let r = []; for (let i = 0; i < o.length && r.length < 100; i++) { let w = l[i]; if (t.every(t => w.includes(t))) { r.push(o[i]); } } return r;
        } async function carregarArquivoEmMemoriaLower(caminhoArquivo) {
            let linhas = [], linhasLower = [], readStream = createReadStream(caminhoArquivo, { encoding: 'latin1', }), rl = _createInterface({ input: readStream, crlfDelay: Infinity, });
            for await (let linha of rl) { linhas.push(linha); linhasLower.push(linha.toLowerCase()); } return { linhas, linhasLower, };
        }

        async function iniciarServidor() {
            let inicio = Date.now(); let dir = `${arruamento}/BANCO_DE_DADOS`; logConsole({ e, ee, 'txt': `CARREGANDO BANCO DE DADOS...`, });
            let logradouroTipos = JSON.parse(await promises.readFile(`${dir}/logradouroTipos.json`, 'latin1')); let logradouros = JSON.parse(await promises.readFile(`${dir}/logradouros.json`, 'latin1'));
            let complementos = JSON.parse(await promises.readFile(`${dir}/complementos.json`, 'latin1')); let bairros = JSON.parse(await promises.readFile(`${dir}/bairros.json`, 'latin1'));
            let municipios = JSON.parse(await promises.readFile(`${dir}/municipios.json`, 'latin1')); let index = { logradouroTipos, logradouros, complementos, bairros, municipios, };
            let { linhas, linhasLower, } = await carregarArquivoEmMemoriaLower(`${dir}/index.txt`); logConsole({ e, ee, 'txt': `BANCO DE DADOS CARREGADO ${(Date.now() - inicio) / 1000} segundos`, });

            let server = _createServer((req, res) => {
                let reqUrl = _parse(req.url, true); function resEnd(d) { res.writeHead(200, { 'Content-Type': 'application/json', }).end(JSON.stringify(d)); } if (reqUrl.pathname === '/buscaAqui' && req.method === 'GET') {
                    let termosRaw = reqUrl.query.termos; if (!termosRaw) { resEnd({ 'ret': false, 'msg': `CORREIOS SERVER: ERRO | INFORMAR O 'termos'`, }); return; }

                    let termos = []; if (Array.isArray(termosRaw)) { termos = termosRaw.flatMap(t => t.split(';').map(x => x.trim()).filter(x => x)); }
                    else { termos = termosRaw.split(';').map(x => x.trim()).filter(x => x); } termos = Array.from(new Set(termos));
                    let numero = false; for (let i = 0; i < termos.length; i++) { let v = termos[i].trim(); if (/^\d+$/.test(v) && v.length !== 8) { numero = Number(v); termos.splice(i, 1); break; } }

                    let resultados = []; for (let [idx, v,] of buscarLinhasOtimo(linhas, linhasLower, termos).entries()) {
                        let [codLogradouroTipo, codLogradouro, codComplemento, codBairro, codMunicio,] = v.match(/#(.*?)#/)[1].split('|'), m = v.match(/( [a-z]{2}) (\d{8}) $/i), estado = m[1].toUpperCase(), cep = m[2];
                        let complemento = index.complementos[codComplemento] || ''; let retCom = analisarComplemento(complemento);

                        if (!numero || (numero >= retCom.numInicial && numero <= retCom.numFinal && (retCom.lado === 'A' || retCom.lado === 'I' && numero % 2 || retCom.lado === 'P' && numero % 2 === 0))) {
                            resultados.push({
                                'logradouroTipo': index.logradouroTipos[codLogradouroTipo], 'logradouro': index.logradouros[codLogradouro], complemento,
                                'bairro': index.bairros[codBairro], 'municipio': index.municipios[codMunicio], estado, cep, ...analisarComplemento(complemento),
                            });
                        }

                    }
                    resEnd({ 'ret': true, 'msg': `CORREIOS SERVER: OK`, 'res': resultados, }); return;
                }
                resEnd({ 'ret': false, 'msg': `CORREIOS SERVER: ERRO | ROTA INVÁLIDA`, });
            });
            let port = 7777; server.listen(port, () => { logConsole({ e, ee, 'txt': `SERVIDOR CORREIOS RODANDO http://localhost:${port}`, }); });
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


