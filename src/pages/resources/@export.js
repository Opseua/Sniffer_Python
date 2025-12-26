/* eslint-disable no-undef */

(async () => {
    // ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    globalThis['regexE'] = function () { }; globalThis['eng'] = true; globalThis['firstFileCall'] = new Error();

    // REMOVER ACENTOS | ENDEREÇO: TOKENIZAR ENDEREÇO | // ENDEREÇO: TIPO DE LOGRADOURO
    function normalizeString(str) { return str.normalize('NFD').replace(/[\u0300-\u036f]/g, ''); }
    globalThis['normalizeString'] = normalizeString;

    function addressTokenize(add) {
        let ceps = []; add = add.replace(/\d{5}-\d{3}|\d{8}|\d{4}-\d{3}|\d{7}/g, m => { let c = m.replace('-', ''); c = c.padStart(8, '0'); c = c.substring(0, 5) + '-' + c.substring(5); ceps.push(c); return '#CEP#'; });
        // add = add.replace(/\s*,\s*/g, '#SPLIT#').replace(/\s*-\s*/g, '#SPLIT#');
        add = add.replace(/\s*,\s*/g, '#SPLIT#').replace(/(\s+-|-+\s+)/g, '#SPLIT#'); let parts = add.split('#SPLIT#'); parts = parts.map(part => part.trim());
        for (let i = 0; i < parts.length; i++) { if (parts[i] === '#CEP#') { parts[i] = ceps.shift(); } } parts = parts.filter(part => /\w/.test(part)); let partsOk = [];
        for (let [index, v,] of parts.entries()) { if (/^\d.*\d$/.test(v) && !/\d{5}-\d{3}/.test(v)) { partsOk.push(v.replace(/\D+/g, '')); } else { partsOk.push(v); } } parts = partsOk; return parts;
    }
    globalThis['addressTokenize'] = addressTokenize;

    // ENDEREÇO: CRIAR OBJETO
    function addressParse(inf = {}) {
        let { address, } = inf; let retAddressTokenize = addressTokenize(address), addressObj = {}, found = '#LOG#', retAddressType = addressType({ 'address': retAddressTokenize.join('#JOIN#'), });
        retAddressType.address = retAddressType.address.split('#JOIN#'); retAddressTokenize = retAddressType.address; let processedAddresses = retAddressTokenize.reverse().filter(value => {
            if (!addressObj.logradouro && value.includes(found)) { addressObj['tipo'] = retAddressType.found; addressObj['logradouro'] = value.replace(found, ''); return false; }
            else if (value?.toLowerCase()?.includes('loja') && !addressObj.loja) { addressObj['loja'] = value; return false; }
            else if (value?.toLowerCase()?.includes('andar') && !addressObj.andar) { addressObj['andar'] = value; return false; }
            else if (/^\d+$/.test(value) && !addressObj.numero) { addressObj['numero'] = Number(value); return false; }
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
        let { objeto1, objeto2, } = inf; let chavesOk = { ...objeto1, }; delete chavesOk.pontucao; let chaves = Object.keys(chavesOk), pontucaoIndice = []; for (let [index, value,] of objeto2.entries()) {
            let pontucao = { 'indice': 999, 'pontuacao': 0, }; let obj = {}, pontuacaoOk = { 'tipo': 10, 'logradouro': 51, 'numero': 91 /*9*/, 'bairro': 10, 'municipio': 40, 'cep': 100, };
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
        let { pontucaoIndice, objeto2, } = inf; pontucaoIndice.sort((a, b) => b.pontuacao - a.pontuacao); let firstMax = pontucaoIndice[0].pontuacao, secondMax = null;
        for (let i = 1; i < pontucaoIndice.length; i++) { if (pontucaoIndice[i].pontuacao < firstMax) { secondMax = pontucaoIndice[i].pontuacao; break; } } if (secondMax === null) { secondMax = firstMax; }
        let resScore = pontucaoIndice.filter(item => item.pontuacao >= secondMax && item.pontuacao > 50).map(item => objeto2[item.indice]); return resScore.length === 0 ? objeto2 : resScore;
    }
    globalThis['scoreBest'] = scoreBest;

    // ENDEREÇO: LADO PAR OU IMPAR
    function sideStreet({ numero, obj, }) {
        if (!numero) { return []; } let num = parseInt(numero, 10), isPar = n => n % 2 === 0; return obj.filter(item => {
            let numInicial = parseInt(item.numInicial, 10), numFinal = parseInt(item.numFinal, 10); if (num < numInicial || num > numFinal) { return false; }
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

    // CHAMAR A FUNÇÃO AO PRESSIONAR O ENTER | INICIAR COM FOCUS NO INPUT | DEFINIR ÁREA DE TRANSFERÊNCIA
    function focus() { inputEle.focus(); } focus(); dc.addEventListener('visibilitychange', () => { if (!dc.hidden) { focus(); } });
    function clipboardSet(inf) { navigator.clipboard.writeText(inf).then(() => { }, (catchErr) => { alertConsole(`CLIPBOARD SET: ERRO`, catchErr); }); }
    globalThis['clipboardSet'] = clipboardSet; globalThis['focus'] = focus;

    let logradourosTipo = [
        { 'found': 'Aeroporto', 'arr': ['aeroporto ',], }, { 'found': 'Alameda', 'arr': ['alameda ', 'al. ',], }, { 'found': 'Área', 'arr': ['área ',], },
        { 'found': 'Chácara', 'arr': ['chácara ', 'chác. ', 'chác ',], }, { 'found': 'Colônia', 'arr': ['colônia ', 'col. ',], }, { 'found': 'Condomínio', 'arr': ['condomínio ', 'cond. ',], },
        { 'found': 'Conjunto', 'arr': ['conjunto ', 'cj. ',], }, { 'found': 'Distrito', 'arr': ['distrito ', 'distr. ', 'dist. ',], }, { 'found': 'Esplanada', 'arr': ['esplanada ',], },
        { 'found': 'Estação', 'arr': ['estação ',], }, { 'found': 'Estrada', 'arr': ['estrada ', 'estr. ', 'estr ',], }, { 'found': 'Fazenda', 'arr': ['fazenda ',], },
        { 'found': 'Jardim', 'arr': ['jardim ', 'jd. ', 'jd ',], }, { 'found': 'Ladeira', 'arr': ['ladeira ',], }, { 'found': 'Largo', 'arr': ['largo ',], },
        { 'found': 'Loteamento', 'arr': ['loteamento ', 'lot. ',], }, { 'found': 'Núcleo', 'arr': ['núcleo ', 'núc. ',], }, { 'found': 'Parque', 'arr': ['parque ', 'pq. ', 'pq ',], },
        { 'found': 'Praça', 'arr': ['praça ', 'pç. ', 'pça ', 'pça. ',], }, { 'found': 'Quadra', 'arr': ['quadra ', 'qd. ',], }, { 'found': 'Residencial', 'arr': ['residencial ', 'res. ',], },
        { 'found': 'Rodovia', 'arr': ['rodovia ', 'rod. ', 'rod ',], }, { 'found': 'Rua', 'arr': ['rua ', 'r. ',], }, { 'found': 'Setor', 'arr': ['setor ', 'st. ',], },
        { 'found': 'Sítio', 'arr': ['sítio ', 'sit. ',], }, { 'found': 'Travessa', 'arr': ['travessa ', 'tv. ', 'tv ',], }, { 'found': 'Via', 'arr': ['via ',], },
        { 'found': 'Viaduto', 'arr': ['viaduto ',], }, { 'found': 'Viela', 'arr': ['viela ',], }, { 'found': 'Vila', 'arr': ['vila ',], }, { 'found': 'Pátio', 'arr': ['pátio ',], },
        { 'found': 'Avenida', 'arr': ['avenida ', 'av. ', 'av ',], },
    ]; function addressType(inf = {}) {
        let { address, } = inf; address = address.trim(); let found = false;
        for (let obj of logradourosTipo) { for (let key of obj.arr) { if (address.toLowerCase().startsWith(key)) { address = address.substring(key.length).trim(); found = obj.found; break; } } if (found) { break; } }
        return { 'found': found || false, 'address': found ? `#LOG#${address}` : address, };
    }
    globalThis['logradourosTipo'] = logradourosTipo; globalThis['addressType'] = addressType;

    function cleanAddress({ text, ignoreReplace, }) {
        let escapedIgnore = ignoreReplace.map(char => { return char.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'); }).join('');
        let cleaned = text.replace(new RegExp(`[^A-Za-z0-9\\u00C0-\\u00FF${escapedIgnore}]`, 'g'), ','); return cleaned;
    }

    function inputPro(v) {
        v = `${inputGet() || ''}`; v = v.trim(); v = v.replace(/🔴|🔵/g, '🟢'); if (v.includes('🟢')) { v = v.split('🟢')[2].trim(); }
        // v = v.replace(/(\r\n|\n|\r|\t|-|–|_|\/)/gm, ', ').split(',').map(v => v.trim()).filter(v => v !== '').join(', ');
        if (!v.toLowerCase().startsWith('http')) {
            // v = v.replace(/(\r\n|\n|\r|\t|_|\/)/g, ', ');
            v = cleanAddress({ 'text': `${v}`, 'ignoreReplace': [' ', ',', '.', 'º', 'ª', '-', ':',], });

            // CORRIGIR CEP
            let ceps = ['xx.xxx-xxx', 'xxxxx-xxx', 'xx.xxx.xxx', 'xxxxx.xxx',];
            for (let p of ceps) { let r = p.replace(/x/g, '\\d').replace(/\./g, '\\.?').replace(/-/g, '-?'); v = v.replace(new RegExp(r, 'g'), m => m.replace(/\D/g, '')); }

            // CORRIGIR s,n/
            v = v.replace(/s,\s*n,/i, '');

            // CORRIGIR ESTADOS '(RJ)' / '[SP]' / '{BA}'
            let estados = [
                'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG',
                'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
            ]; let r = new RegExp(`[\\(\\[\\{]\\s*(${estados.join('|')})\\s*[\\)\\]\\}]`, 'gi');
            v = v.replace(r, ', $1,');

            v = v.replace(/(?<!\d)[\-‐–—―⁃﹘﹣－](?!\d)/g, ', ').split(',').map(v => v.trim()).filter(v => v !== '').join(', ');
            v = v.replace(/\b\d{5}-?\d{3}\b/g, (v) => { return '', ',' + v + ','; });
            v = v.replace(/\bcep:?(\b|)/gi, '');
            v = v.replace(/\s+,/g, ', ');
            v = v.replace(/^,|,$/g, '');
            v = v.replace(/,,/g, ',');
            v = v.replace(/  /g, ' ');
        } inputText = v; inputSet(v);
    }
    globalThis['inputPro'] = inputPro;

    function inputGet() { return inputEle.value.trim(); } function inputSet(v) { inputEle.value = v; } inputEle.addEventListener('paste', function () { setTimeout(function () { inputPro(); }, 0); });
    globalThis['inputGet'] = inputGet; globalThis['inputSet'] = inputSet;

    inputEle.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); getAddress(); } });


    // ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
})();
