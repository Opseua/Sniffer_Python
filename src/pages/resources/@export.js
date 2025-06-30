/* eslint-disable no-undef */

(async () => {
    // ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    globalThis['regexE'] = function () { }; globalThis['eng'] = true; globalThis['currentFile'] = function () { return new Error().stack.match(/([^ \n])*([a-z]*:\/\/\/?)*?[a-z0-9\/\\]*\.js/ig)?.[0].replace(/[()]/g, ''); };
    // let currentFileOk = currentFile().split('mes=')[1]; let project = window.location.href.split('PROJETOS/')[1].split('/')[0];

    // REMOVER ACENTOS | ENDEREÇO: TOKENIZAR ENDEREÇO | // ENDEREÇO: TIPO DE LOGRADOURO
    function normalizeString(str) { return str.normalize('NFD').replace(/[\u0300-\u036f]/g, ''); }
    globalThis['normalizeString'] = normalizeString;

    function addressTokenize(add) {
        let ceps = []; add = add.replace(/\d{5}-\d{3}|\d{8}|\d{4}-\d{3}|\d{7}/g, m => { let c = m.replace('-', ''); c = c.padStart(8, '0'); c = c.substring(0, 5) + '-' + c.substring(5); ceps.push(c); return '#CEP#'; });
        add = add.replace(/\s*,\s*/g, '#SPLIT#').replace(/\s*-\s*/g, '#SPLIT#'); let parts = add.split('#SPLIT#'); parts = parts.map(part => part.trim());
        for (let i = 0; i < parts.length; i++) { if (parts[i] === '#CEP#') { parts[i] = ceps.shift(); } } parts = parts.filter(part => /\w/.test(part)); let partsOk = [];
        for (let [index, v,] of parts.entries()) { if (/^\d.*\d$/.test(v) && !/\d{5}-\d{3}/.test(v)) { partsOk.push(v.replace(/\D+/g, '')); } else { partsOk.push(v); } } parts = partsOk; return parts;
    }
    globalThis['addressTokenize'] = addressTokenize;

    // ENDEREÇO: CRIAR OBJETO
    function addressParse(inf = {}) {
        let { address, } = inf; let retAddressTokenize = addressTokenize(address); let addressObj = {}; let found = '#LOG#'; let retAddressType = addressType({ 'address': retAddressTokenize.join('#JOIN#'), });
        retAddressType.address = retAddressType.address.split('#JOIN#'); retAddressTokenize = retAddressType.address; let processedAddresses = retAddressTokenize.reverse().filter(value => {
            if (!addressObj.logradouro && value.includes(found)) { addressObj['tipo'] = retAddressType.found; addressObj['logradouro'] = value.replace(found, ''); return false; }
            else if (value.toLowerCase().includes('loja') && !addressObj.loja) { addressObj['loja'] = value; return false; }
            else if (value.toLowerCase().includes('andar') && !addressObj.andar) { addressObj['andar'] = value; return false; }
            else if (/^\d+$/.test(value) && !addressObj.numero) { addressObj['numero'] = value; return false; }
            else if (addressObj.cep && addressObj.estado && addressObj.municipio && addressObj.logradouro && !(/^\d+$/.test(value)) && !addressObj.bairro) { addressObj['bairro'] = value; return false; }
            else if (addressObj.estado && !addressObj.municipio) { // MUNÍCIPIO
                let estadosMunicipiosNew = estadosMunicipios[addressObj.estado.toUpperCase()].map(normalizeString).map(nome => nome.toUpperCase());
                if (estadosMunicipiosNew.includes(normalizeString(value).toUpperCase())) { addressObj['municipio'] = value; return false; }
            } else if (/^[a-zA-Z]{2}$/.test(value) && estadosMunicipios[value.toUpperCase()] && !addressObj.estado) { addressObj['estado'] = value; return false; }
            else if ((/\d{5}-\d{3}/.test(value)) && !addressObj.cep) { addressObj['cep'] = value; return false; } return true; // LOGRADOURO | MUNÍCIPIO | ESTADO | BAIRRO
        }); if (processedAddresses.length > 0 && !addressObj.logradouro) { let index = processedAddresses.length - 1; addressObj['logradouro'] = processedAddresses[index]; processedAddresses.splice(index, 1); }
        if (processedAddresses.length > 0 && !addressObj.municipio) { let index = processedAddresses.length - 1; addressObj['municipio'] = processedAddresses[index]; processedAddresses.splice(index, 1); }
        if (processedAddresses.length > 0 && !addressObj.estado) { let index = processedAddresses.length - 1; addressObj['estado'] = processedAddresses[index]; processedAddresses.splice(index, 1); }
        if (processedAddresses.length > 0 && !addressObj.bairro) { let index = processedAddresses.length - 1; addressObj['bairro'] = processedAddresses[index]; processedAddresses.splice(index, 1); }
        retAddressTokenize = JSON.parse(JSON.stringify(retAddressTokenize.reverse()).replace(found, '')); if (retAddressType.found) { retAddressTokenize.unshift(retAddressType.found); } addressObj = {
            'tipo': addressObj.tipo, 'logradouro': addressObj.logradouro, 'numero': addressObj.numero, 'bairro': addressObj.bairro, 'municipio': addressObj.municipio,
            'estado': addressObj.estado, 'cep': addressObj.cep, 'loja': addressObj.loja, 'andar': addressObj.andar, 'arr': retAddressTokenize,
        }; return addressObj;
    }
    globalThis['addressParse'] = addressParse;

    // PONTUAÇÃO: DO RESULTADO
    function resultScore(inf = {}) {
        let { objeto1, objeto2, } = inf; let chavesOk = { ...objeto1, }; delete chavesOk.pontucao; let chaves = Object.keys(chavesOk); let pontucaoIndice = []; for (let [index, value,] of objeto2.entries()) {
            let pontucao = { 'indice': 999, 'pontuacao': 0, }; let obj = {}; let pontuacaoOk = { tipo: 10, logradouro: 51, numero: 91 /*9*/, bairro: 10, municipio: 40, cep: 100, };
            obj['tipo'] = value.logradouroTipo; obj['logradouro'] = value.logradouro; obj['numInicial'] = value.numInicial;
            obj['numFinal'] = value.numFinal; obj['bairro'] = value.bairro; obj['municipio'] = value.municipio; obj['estado'] = value.estado; obj['cep'] = value.cep; for (let [index1, value1,] of chaves.entries()) {
                let retPontucaoDaChave; pontucao['indice'] = index; if (value1 !== 'arr') {
                    let key1, key2; if (value1 !== 'numero') { // É STRING (CHECAR SE CONTÉM)
                        if (value1 === 'logradouro') {
                            if (objeto1.tipo && obj.tipo) { key1 = `${objeto1.tipo} ${objeto1.logradouro}`; key2 = `${obj.tipo} ${obj.logradouro}`; } else { key1 = `${objeto1.logradouro}`; key2 = `${obj.logradouro}`; }
                        } else { key1 = objeto1[value1]; key2 = obj[value1]; } retPontucaoDaChave = keyScore({ 'chaveA': key1, 'chaveB': key2, 'pontucao': pontuacaoOk[value1], });
                    } else { retPontucaoDaChave = keyScore({ 'chaveA': objeto1[value1], 'chaveB': obj['numInicial'], 'chaveC': obj['numFinal'], 'pontucao': pontuacaoOk[value1], }); }
                    pontucao.pontuacao += retPontucaoDaChave; pontucao[value1] = retPontucaoDaChave;
                }
            } pontucaoIndice.push(pontucao);
        } return pontucaoIndice;
    }
    globalThis['resultScore'] = resultScore;

    // PONTUAÇÃO: MELHORES RESULTADOS
    function scoreBest(inf = {}) {
        let { pontucaoIndice, objeto2, } = inf; pontucaoIndice.sort((a, b) => b.pontuacao - a.pontuacao); let firstMax = pontucaoIndice[0].pontuacao; let secondMax = null;
        for (let i = 1; i < pontucaoIndice.length; i++) { if (pontucaoIndice[i].pontuacao < firstMax) { secondMax = pontucaoIndice[i].pontuacao; break; } } if (secondMax === null) { secondMax = firstMax; }
        let resScore = pontucaoIndice.filter(item => item.pontuacao >= secondMax && item.pontuacao > 50).map(item => objeto2[item.indice]); return resScore.length === 0 ? objeto2 : resScore;
    }
    globalThis['scoreBest'] = scoreBest;

    // ENDEREÇO: LADO PAR OU IMPAR
    function sideStreet({ numero, obj, }) {
        if (!numero) { return []; } let num = parseInt(numero, 10); let isPar = n => n % 2 === 0; return obj.filter(item => {
            let numInicial = parseInt(item.numInicial, 10); let numFinal = parseInt(item.numFinal, 10); if (num < numInicial || num > numFinal) { return false; }
            if (!item.lado || item.lado === 'A') { return true; } else if (item.lado === 'P' && isPar(num)) { return true; } else if (item.lado === 'I' && !isPar(num)) { return true; } return false;
        });
    }
    globalThis['sideStreet'] = sideStreet;

    // PONTUAÇÃO: DO VALOR
    function keyScore(inf = {}) {
        let { chaveA, chaveB, chaveC, pontucao, } = inf; if (!chaveA || !chaveB || !pontucao) { return 0; } else if (!chaveC) {
            return chaveB.toLowerCase().replace(/(\d{5})-(\d{3})/, '$1$2').includes(chaveA.toLowerCase().replace(/(\d{5})-(\d{3})/, '$1$2')) ? pontucao : 0;
        } else { chaveA = Number(chaveA); chaveB = Number(chaveB); chaveC = Number(chaveC); return chaveA > (chaveB - 1) && chaveA < (chaveC + 1) ? pontucao : 0; }
    }
    globalThis['keyScore'] = keyScore;

    // CHAMAR A FUNÇÃO AO PRESSIONAR O ENTER | INICIAR COM FOCUS NO IMPUT | DEFINIR ÁREA DE TRANSFERÊNCIA
    function focus() { inputEle.focus(); } focus(); dc.addEventListener('visibilitychange', () => { if (!dc.hidden) { focus(); } });
    function clipboardSet(inf) { navigator.clipboard.writeText(inf).then(() => { }, (catchErr) => { alertConsole(`CLIPBOARD SET: ERRO`, catchErr); }); }
    globalThis['clipboardSet'] = clipboardSet; globalThis['focus'] = focus;

    function addressType(inf = {}) {
        let { address, } = inf; address = address.trim(); let found = false; let search = [
            { 'found': 'Rua', 'arr': ['rua ', 'r. ',], }, { 'found': 'Avenida', 'arr': ['avenida ', 'av. ', 'av ', ,], }, { 'found': 'Travessa', 'arr': ['TRAVESSA ', 'travessa ', 'tv. ', 'tv ',], },
            { 'found': 'Rodovia', 'arr': ['RODOVIA ', 'rodovia ', 'rod. ', 'rod ',], }, { 'found': 'Estrada', 'arr': ['estrada ', 'estr. ', 'estr ',], },
        ]; for (let obj of search) { for (let key of obj.arr) { if (address.toLowerCase().startsWith(key)) { address = address.substring(key.length).trim(); found = obj.found; break; } } if (found) { break; } }
        return { 'found': found || false, 'address': found ? `#LOG#${address}` : address, };
    }
    globalThis['addressType'] = addressType;

    function inputPro(v) {
        v = `${inputGet() || ''}`; v = v.replace(/🔴|🔵/g, '🟢'); if (v.includes('🟢')) { v = v.split('🟢')[2].trim(); }
        v = v.replace(/(\r\n|\n|\r|\t| - )/gm, ', ').split(',').map(v => v.trim()).filter(v => v !== '').join(', '); inputText = v; inputSet(v);
    }
    globalThis['inputPro'] = inputPro;

    function inputGet() { return inputEle.value.trim(); } function inputSet(v) { inputEle.value = v; } inputEle.addEventListener('paste', function () { setTimeout(function () { inputPro(); }, 0); });
    globalThis['inputGet'] = inputGet; globalThis['inputSet'] = inputSet;

    inputEle.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); getAddress(); } });


    // ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
})();
