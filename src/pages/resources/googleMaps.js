/* eslint-disable no-undef */

async function googleMaps(inf = {}) {
    let ret = { 'ret': false, };
    try {
        let { texto, } = inf;

        let match, pass, propNam, propDes, mode, end = { 'poi': null, 'categoria': null, 'logradouroTipo': null, 'logradouro': null, 'numero': null, 'bairro': null, 'municipio': null, 'estado': null, 'cep': null, };

        if (texto.includes(`maps.app.goo.gl`)) {
            let retApi = await api({
                method: 'POST', url: urlServer, maxConnect: 7, headers: { mode: 'raw', }, body: JSON.stringify({ fun: [{ securityPass, retInf: true, name: 'api', par: { method: 'GET', url: texto, maxConnect: 7, }, },], }),
            }); if (!retApi.ret) { ret['msg'] = `ADDRESS PARSE GOOGLE MAPS: ERRO | ${retApi.ret}`; alertConsole(`${ret.msg}`); return ret; }
            retApi = JSON.parse(retApi.res.body).res.body; retApi = retApi.replace(`name="Description">  <meta content='`, `name="Description">  <meta content="`).replace(`' itemprop="name"`, `" itemprop="name"`);
            propNam = regex({ 'pattern': `name="Description">  <meta content="(.*?)" itemprop="name"`, 'text': retApi.replace(/\\n/g, ''), }).res['1']; texto = propNam;
            propDes = regex({ 'pattern': `itemprop="description"> <meta content="(.*?)" property="og:description"`, 'text': retApi.replace(/\\n/g, ''), }).res['1']; end.categoria = propDes.split(' · ')[1] || null;
        }

        // CORRIGIR DE 'R. Josephina Galafassi Venturini - Cascavel · Cascavel, XX, 85818-158' → 'R. Josephina Galafassi Venturini - Cascavel · Cascavel - XX, 85818-158';
        texto = texto.replace(/, ([A-Z]{2}), /, ' - $1, '); texto = texto.replace(/, ([A-Z]{2})$/, ' - $1');

        // CORRIGIR DE 'Rua Dona Anunciada 142, Graças · Graças, Recife - PE, 50050-290' → 'Rua Dona Anunciada, 142 - Graças · Rua Dona Anunciada, 142 - Graças, Recife - PE, 50050-290' [PADRÃO 1]
        let m = texto.match(/^(.+?)\s+(\d+),\s+([^·]+) · [^,]+,\s+([^ -]+)\s*-\s*([A-Z]{2}),\s*(\d{5}-\d{3})$/); if (m) {
            let [, logradouro, numero, bairro, municipio, estado, cep,] = m; texto = `${logradouro}, ${numero} - ${bairro} · ${logradouro}, ${numero} - ${bairro}, ${municipio} - ${estado}, ${cep}`;
        }

        // SUBSTITUIR ABREVIAÇÕES | IDENTIFICAR TIPO DE LOGRADOURO
        function substituirPadronizado(texto, sub) {
            for (let grupo in sub) {
                for (let item of sub[grupo]) {
                    for (let abr of item.arr) {
                        let t = abr.replace(/[*.+?^${}()|[\]\\]/g, '\\$&').trim(), p = new RegExp(`(^|\\s)${t}(?=\\s|$)`, 'gi'); texto = texto.replace(p, (m, p1) => { return p1 + item.found; });
                    }
                }
            } return texto;
        } function logradouroType(t) { let l = t.trim(); for (let f of substituicoesLogradourosTipo) { if (l.startsWith(f + ' ') || l === f) { end['logradouroTipo'] = f; return t.slice(f.length).trim(); } } return t; }

        // PADRÕES DE TIPOS E LOGRADOUROS 
        let substituicoes = {
            logradourosTipo, 'logradourosBairrosMunicipios': [
                { 'found': 'Senador', 'arr': ['senador ', 'sen. ',], }, { 'found': 'Senadora', 'arr': ['senadora ',], }, { 'found': 'Deputado', 'arr': ['deputado ', 'dep. ',], },
                { 'found': 'Professor', 'arr': ['professor ', 'prof. ',], }, { 'found': 'Professora', 'arr': ['professora ',], }, { 'found': 'Doutor', 'arr': ['doutor ', 'dr. ',], },
                { 'found': 'Doutora', 'arr': ['doutora ', 'dra. ',], }, { 'found': 'Padre', 'arr': ['padre ',], }, { 'found': 'Bispo', 'arr': ['bispo ',], }, { 'found': 'Coronel', 'arr': ['coronel ', 'cel. ',], },
                { 'found': 'Major', 'arr': ['major ', 'maj. ',], }, { 'found': 'Tenente', 'arr': ['tenente ', 'ten. ',], }, { 'found': 'Capitão', 'arr': ['capitão ', 'cap. ',], },
                { 'found': 'General', 'arr': ['general ', 'gen. ',], }, { 'found': 'Marechal', 'arr': ['marechal ', 'mar. ',], }, { 'found': 'Almirante', 'arr': ['almirante ', 'alm. ',], },
                { 'found': 'Vereador', 'arr': ['vereador ', 'ver. ',], }, { 'found': 'Prefeito', 'arr': ['prefeito ', 'pref. ',], }, { 'found': 'Engenheiro', 'arr': ['engenheiro ', 'eng. ',], },
                { 'found': 'Médico', 'arr': ['médico ', 'med. ',], }, { 'found': 'Senhor', 'arr': ['senhor ', 'sr. ',], }, { 'found': 'Senhora', 'arr': ['senhora ', 'sra. ',], },
                { 'found': 'São', 'arr': ['são ', 's. ',], }, { 'found': 'Santa', 'arr': ['santa ',], }, { 'found': 'Deputada', 'arr': ['deputada ',], },
            ],
        }; let substituicoesLogradourosTipo = substituicoes.logradourosTipo.map(item => item.found); texto = substituirPadronizado(texto, substituicoes); /* FAZER SUBSTITUIÇÕES */ // console.log(texto);

        // PADRÃO 1 → 'LOGRADOURO, NUMERO - BAIRRO · LOGRADOURO (DUPLICADO), NUMERO (DUPLICADO) - BAIRRO (DUPLICADO), MUNICIPIO - ESTADO, CEP'
        if (!pass) {
            match = texto.match(/^(.+?), (.+?) - (.+?) · .+?, .+?, (.+?) - ([A-Z]{2}), (\d{5}-\d{3})$/); if (match) {
                end['logradouro'] = logradouroType(match[1].trim()); end['numero'] = match[2].trim(); end['bairro'] = match[3].trim(); end['municipio'] = match[4].trim();
                end['estado'] = match[5].trim(); end['cep'] = match[6].trim(); pass = true; mode = 1;
            }
        }

        // PADRÃO 2 → 'CEP · LOGRADOURO - BAIRRO, MUNICIPIO - ESTADO'
        if (!pass) {
            match = texto.match(/^(\d{5}-\d{3}) · (.+?) - ([^,]+), ([^-]+) - ([A-Z]{2})$/); if (match) {
                end['logradouro'] = logradouroType(match[2].trim()); end['bairro'] = match[3].trim(); end['municipio'] = match[4].trim(); end['estado'] = match[5].trim(); end['cep'] = match[1].trim();
                pass = true; mode = 2;
            }
        }

        // PADRÃO 3 → 'POI · LOGRADOURO, NUMERO - BAIRRO, MUNICIPIO - ESTADO, CEP'
        if (!pass) {
            match = texto.match(/^(.+?) · (.+?), ([^,]+?) - (.+?), (.+?) - ([A-Z]{2}), (\d{5}-\d{3})$/); if (match) {
                end['poi'] = match[1].trim(); end['logradouro'] = logradouroType(match[2].trim()); end['numero'] = match[3].trim(); end['bairro'] = match[4].trim();
                end['municipio'] = match[5].trim(); end['estado'] = match[6].trim(); end['cep'] = match[7].trim(); pass = true; mode = 3;
            }
        }

        // MODEO 4 → 'POI · LOGRADOURO - BAIRRO, MUNICIPIO - ESTADO, CEP'
        if (!pass) {
            match = texto.match(/^(.+?) · (.+?) - (.+?), (.+?) - ([A-Z]{2}), (\d{5}-\d{3})$/); if (match) {
                end['poi'] = match[1].trim(); end['logradouro'] = logradouroType(match[2].trim()); end['bairro'] = match[3].trim(); end['municipio'] = match[4].trim();
                end['estado'] = match[5].trim(); end['cep'] = match[6].trim(); pass = true; mode = 4;
            }
        }

        // MODEO 5 → 'LOGRADOURO - BAIRRO · BAIRRO (DUPLICADO), MUNICIPIO - ESTADO, CEP'
        if (!pass) {
            match = texto.match(/^(.+?) - .+? · (.+?), (.+?) - ([A-Z]{2}), (\d{5}-\d{3})$/); if (match) {
                end['logradouro'] = logradouroType(match[1].trim()); end['bairro'] = match[2].trim(); end['municipio'] = match[3].trim(); end['estado'] = match[4].trim(); end['cep'] = match[5].trim();
                pass = true; mode = 5;
            }
        }

        // PADRÃO 6 → 'BAIRRO · BAIRRO (DUPLICADO), MUNICIPIO - ESTADO, CEP'
        if (!pass) {
            match = texto.match(/^(.+?) · .+?, (.+?) - ([A-Z]{2}), (\d{5}-\d{3})$/); if (match) {
                end['bairro'] = match[1].trim(); end['municipio'] = match[2].trim(); end['estado'] = match[3].trim(); end['cep'] = match[4].trim(); pass = true; mode = 6;
            }
        }

        // PADRÃO 7 → 'LOGRADOURO - MUNICIPIO · MUNICIPIO (DUPLICADO) - ESTADO, CEP'
        if (!pass) {
            match = texto.match(/^(.+?) - (.+?) · (.+?) - ([A-Z]{2}), (\d{5}-\d{3})$/); if (match) {
                end['logradouro'] = match[1].trim(); end['municipio'] = match[2].trim(); end['estado'] = match[4].trim(); end['cep'] = match[5].trim(); pass = true; mode = 7;
            }
        }

        // PADRÃO 8 → 'BAIRRO · MUNICIPIO - ESTADO, CEP'
        if (!pass) {
            match = texto.match(/^([^·-]+?) · (.+?) - ([A-Z]{2}), (\d{5}-\d{3})$/); if (match) {
                end['bairro'] = match[1].trim(); end['municipio'] = match[2].trim(); end['estado'] = match[3].trim(); end['cep'] = match[4].trim(); pass = true; mode = 8;
            }
        }

        // PADRÃO 9 → 'LOGRADOURO · MUNICIPIO - ESTADO' / 'BAIRRO · MUNICIPIO - ESTADO'
        if (!pass) {
            match = texto.match(/^(.+?) · (.+?) - ([A-Z]{2})$/); if (match) {
                let f = match[1].trim(), municipio = match[2].trim(), estado = match[3].trim(); if (substituicoesLogradourosTipo.some(p => f.startsWith(p + ' '))) { end['logradouro'] = logradouroType(f); }
                else { end['bairro'] = f; } end['municipio'] = municipio; end['estado'] = estado; pass = true; mode = 9;
            }
        }

        if (!pass) {
            console.log(texto);
            ret['msg'] = `ADDRESS PARSE GOOGLE MAPS: ERRO | NENHUM PADRÃO ENCONTRADO`;
        } else {
            end['mode'] = mode;
            ret['ret'] = true;
            ret['msg'] = `ADDRESS PARSE GOOGLE MAPS: OK`;
            ret['res'] = end;
        }

    } catch (catchErr) {
        alertConsole(`ADDRESS PARSE GOOGLE MAPS: ERRO\n${catchErr}`); ret['msg'] = catchErr; ret['ret'] = false; delete ret['res'];
    }

    return { ...({ 'ret': ret.ret, }), ...(ret.msg && { 'msg': ret.msg, }), ...(ret.hasOwnProperty('res') && { 'res': ret.res, }), };
}

globalThis['googleMaps'] = googleMaps;


// let texto;

// // → 'LOGRADOURO - BAIRRO · BAIRRO (DUPLICADO), MUNICIPIO - ESTADO, CEP' [✅]
// texto = 'R. Traipu - Ricardo de Albuquerque · Ricardo de Albuquerque, Rio de Janeiro - RJ, 21665-084'; console.log((await googleMaps({ texto, })).res);
// texto = 'https://maps.app.goo.gl/fVNCmbuAe5Z1tuZS7'; console.log((await googleMaps({ texto, })).res);

// // → 'POI · LOGRADOURO, NUMERO - BAIRRO, MUNICIPIO - ESTADO, CEP' [✅]
// texto = 'Encontro Mineiro · R. Bento Branco de Andrade Filho, 111 - Jardim Dom Bosco, São Paulo - SP, 04757-010'; console.log((await googleMaps({ texto, })).res);
// texto = 'https://maps.app.goo.gl/ytH2EbJQ3Gwp8qYm9'; console.log((await googleMaps({ texto, })).res);

// // → 'POI · LOGRADOURO, NUMERO - BAIRRO, MUNICIPIO - ESTADO, CEP' [✅]
// texto = 'Auto Escola Campeão · R. Ademar de Barros, Qd 01 Lt 07 - Jardim de Todos Os Santos, Sen. Canedo - GO, 75250-000'; console.log((await googleMaps({ texto, })).res);
// texto = 'https://maps.app.goo.gl/GSnKX2EF8VaYYFMPA'; console.log((await googleMaps({ texto, })).res);

// // → 'POI · LOGRADOURO - BAIRRO, MUNICIPIO - ESTADO, CEP' [✅]
// texto = 'Mercado Compre Mais · R. Maria Silva - Campo Grande, Rio de Janeiro - RJ, 23013-440'; console.log((await googleMaps({ texto, })).res);

// // → 'LOGRADOURO - MUNICIPIO · MUNICIPIO (DUPLICADO) - ESTADO, CEP' [✅]
// texto = 'Rua Josephina Galafassi Venturini - Cascavel · Cascavel - PR, 85818-158'; console.log((await googleMaps({ texto, })).res);
// texto = 'https://maps.app.goo.gl/7wG9HgyUFF5ws8rbA'; console.log((await googleMaps({ texto, })).res);

// // → 'BAIRRO · MUNICIPIO - ESTADO, CEP' [✅]
// texto = 'Jardim Nova Independencia I · Sarandi - PR, 87114-665'; console.log((await googleMaps({ texto, })).res);
// texto = 'https://maps.app.goo.gl/U1vEE52LUZ42PmG46'; console.log((await googleMaps({ texto, })).res);

// // → 'LOGRADOURO · MUNICIPIO - ESTADO' [✅]
// texto = 'Estr. dos Três Rios · Rio de Janeiro - RJ'; console.log((await googleMaps({ texto, })).res);
// texto = 'https://maps.app.goo.gl/DpY6RxAUTC5Vvm4c9'; console.log((await googleMaps({ texto, })).res);

// // → 'BAIRRO · MUNICIPIO - ESTADO' [✅]
// texto = 'Campo Grande · Rio de Janeiro - RJ'; console.log((await googleMaps({ texto, })).res);
// texto = 'https://maps.app.goo.gl/rgiGtEGKLJg3Rmgc8'; console.log((await googleMaps({ texto, })).res);

// // → 'CEP · LOGRADOURO - BAIRRO, MUNICIPIO - ESTADO' [✅]
// texto = '23013-440 · R. Ten. Agenor Brito - Sen. Vasconcelos, Rio de Janeiro - RJ'; console.log((await googleMaps({ texto, })).res);
// texto = 'https://maps.app.goo.gl/XsotUSFLKG5u5VGYA'; console.log((await googleMaps({ texto, })).res);

// // → 'LOGRADOURO, NUMERO - BAIRRO · LOGRADOURO (DUPLICADO), NUMERO (DUPLICADO) - BAIRRO (DUPLICADO), MUNICIPIO - ESTADO, CEP' [✅]
// texto = 'R. Artur Rios, 99-7 - Sen. Vasconcelos · R. Artur Rios, 99-7 - Sen. Vasconcelos, Rio de Janeiro - RJ, 23013-470'; console.log((await googleMaps({ texto, })).res);
// texto = 'https://maps.app.goo.gl/gDKd2PJDRotJnCm79'; console.log((await googleMaps({ texto, })).res);

// // → 'BAIRRO · BAIRRO (DUPLICADO), MUNICIPIO - ESTADO, CEP' [✅]
// texto = 'Senador Vasconcelos · Sen. Vasconcelos, Rio de Janeiro - RJ, 23013-470'; console.log((await googleMaps({ texto, })).res);
// texto = 'https://maps.app.goo.gl/Nh3mnTqMPMhn16B78'; console.log((await googleMaps({ texto, })).res);


