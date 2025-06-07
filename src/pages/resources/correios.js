/* eslint-disable no-undef */

let retApi, retConfigStorage, retA, host, expire = 0, cartaoPostagem, authorization, token;
function normalizar(str) { if (!str) { return ''; } return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase(); }
async function correios(inf = {}) {
    let ret = { 'ret': false, };
    try {
        let { search = 'aaa', } = inf;

        let retDH, timeNow = Math.floor(Date.now() / 1000), res = [], api1 = [];

        // GERAR TOKEN (SE NECESSÁRIO)
        if (expire < timeNow) {
            // CONFIG: LER
            retApi = await api({
                'method': 'POST', 'url': urlServer, 'maxConnect': 5, 'headers': { raw: true, }, 'body': {
                    'fun': [
                        { securityPass, 'retInf': true, 'name': 'configStorage', 'par': { 'action': 'get', 'key': 'correios', }, },
                    ],
                },
            }); if (!retApi.ret) { ret['msg'] = `CORREIOS [(api) configStorage GET]: ERRO | ${retApi.ret}`; alertConsole(`${ret.msg}`); return ret; } retApi = JSON.parse(retApi.res.body);

            // CONFIG: DEFINIR INFORMAÇÕES
            retConfigStorage = retApi; if (!retConfigStorage.ret) { return retConfigStorage; } ({ host, expire, cartaoPostagem, authorization, token, } = retConfigStorage.res); logConsole({ 'txt': `PEGANDO EXPIRAÇÃO`, });

            if (expire < timeNow) {
                // GERAR NOVO TOKEN
                retApi = await api({
                    'method': 'POST', 'url': urlServer, 'maxConnect': 5, 'headers': { raw: true, }, 'body': {
                        'fun': [{
                            securityPass, 'retInf': true, 'name': 'api', 'par': {
                                'method': 'POST', 'object': true, 'url': `https://api.${host}/token/v1/autentica/cartaopostagem`, 'headers': { 'Authorization': authorization, 'Content-Type': 'application/json', },
                                'body': { 'numero': cartaoPostagem, },
                            },
                        },],
                    },
                }); if (!retApi.ret) { ret['msg'] = `CORREIOS [(api) GERAR NOVO TOKEN]: ERRO | ${retApi.ret}`; alertConsole(`${ret.msg}`); return ret; } retApi = JSON.parse(retApi.res.body);

                // DEFINIR TIMESTAMP
                if (!retApi.ret || retApi.res.code !== 201) { return retApi; } retApi = retApi.res.body; retDH = dateHour(retApi.expiraEm); if (!retDH.ret) { return retDH; }
                expire = Number(retDH.res.tim); token = `Bearer ${retApi.token}`;

                // CONFIG: SALVAR
                retApi = await api({
                    'method': 'POST', 'url': urlServer, 'maxConnect': 5, 'headers': { raw: true, }, 'body': {
                        'fun': [
                            { securityPass, 'retInf': true, 'name': 'configStorage', 'par': { 'action': 'set', 'key': 'correios', 'value': { host, expire, cartaoPostagem, authorization, token, }, }, },
                        ],
                    },
                }); if (!retApi.ret) { ret['msg'] = `CORREIOS [(api) configStorage SET]: ERRO | ${retApi.ret}`; alertConsole(`${ret.msg}`); return ret; }
                logConsole({ 'txt': `TOKEN VÁLIDO: NÃO`, });
            } else {
                logConsole({ 'txt': `TOKEN VÁLIDO: SIM`, });
            }
        }

        search = normalizar(search.trim());
        if (/^\d{5}-?\d{3}$/.test(search)) {
            // DEFINIR CERP
            api1 = [{ 'CEP': search, },];
        } else {
            // CONSULTAR ENDEREÇO
            retApi = await api({
                'method': 'POST', 'url': urlServer, 'maxConnect': 5, 'headers': { raw: true, }, 'body': {
                    'fun': [{
                        securityPass, 'retInf': true, 'name': 'api', 'par': {
                            'method': 'GET', 'object': true, 'url': `https://webservice.${host}/DNECWService/rest/personalizada/listar?q=${search}`,
                            'body': { 'numero': cartaoPostagem, },
                        },
                    },],
                },
            }); if (!retApi.ret) { ret['msg'] = `CORREIOS [(api) CONSULTA 1]: ERRO | ${retApi.ret}`; alertConsole(`${ret.msg}`); return ret; } retApi = JSON.parse(retApi.res.body);
            if (!retApi.ret || retApi.res.code !== 200) { return retApi; } api1 = retApi.res.body.ceps || [];
        }

        // CONSULTAR ENDEREÇO (PELO CEP)
        for (let [index, value,] of api1.entries()) {
            let { CEP: cep, } = value;
            // CONSULTAR ENDEREÇO (PELO CEP) [PELO ÚLTIMO RESULTADO]
            retA = await api({
                'method': 'POST', 'url': urlServer, 'maxConnect': 5, 'headers': { raw: true, }, 'body': {
                    'fun': [{
                        securityPass, 'retInf': true, 'name': 'api', 'par': {
                            'method': 'GET', 'object': true, 'url': `https://api.${host}/cep/v2/enderecos/${cep}`,
                            'headers': { 'Authorization': token, },
                        },
                    },],
                },
            }); if (!retA.ret) { ret['msg'] = `CORREIOS [(api) CONSULTA 2]: ERRO | ${retA.ret}`; alertConsole(`${ret.msg}`); return ret; } retA = JSON.parse(retA.res.body);
            if (!retA.ret || retA.res.code !== 200) { return retA; } let { tipoLogradouro, nomeLogradouro, complemento, bairro, localidade, uf, } = retA.res.body; cep = retA.res.body.cep;
            res.push({ tipoLogradouro, nomeLogradouro, 'complemento': complemento || null, bairro, localidade, uf, cep, });
        }

        ret['ret'] = true;
        ret['msg'] = `CORREIOS: OK`;
        ret['res'] = res;

    } catch (catchErr) {
        alertConsole(`CORREIOS: ERRO\n${catchErr}`); ret['msg'] = catchErr; ret['ret'] = false; delete ret['res'];
    }

    return { ...({ 'ret': ret.ret, }), ...(ret.msg && { 'msg': ret.msg, }), ...(ret.res && { 'res': ret.res, }), };
}

globalThis['correios'] = correios;


