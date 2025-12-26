let e = currentFile(new Error()), ee = e;
async function taskInfReduceTryRating(inf = {}) {
    let ret = { 'ret': false, }; e = inf.e || e;
    try {
        let { obj = {}, order = [], keys = [], ignoreDuplicateKeys, ignoreTranslate = true, ignoreBreakLine = false, } = inf;

        let normalize = function (v) { return String(v).toLowerCase(); };

        let extract = function (arr) {
            if (!Array.isArray(arr)) { return null; }
            let main = {}; let add = {};
            let dedupe = function (source, parentKey) {
                let seen = {}; let out = {};
                for (let k of keys) {
                    if (source[k] === undefined) { continue; }
                    if (parentKey && normalize(source[k]) === normalize(parentKey)) {
                        continue;
                    }
                    let val = source[k]; let norm = ignoreDuplicateKeys ? normalize(val) : null;
                    if (!ignoreDuplicateKeys || !seen[norm]) {
                        out[k] = val;
                        if (ignoreDuplicateKeys) {
                            seen[norm] = true;
                        }
                    }
                }
                return out;
            };
            for (let o of arr) {
                if (!o || typeof o !== 'object') { continue; }
                for (let k in o) {
                    let lvl1 = o[k];
                    if (!lvl1 || typeof lvl1 !== 'object') { continue; }
                    for (let f in lvl1) {
                        let v = lvl1[f];
                        if (Array.isArray(v) && v[0]) {
                            let tmp = {};
                            for (let key of keys) {
                                if (v[0][key] !== undefined) {
                                    tmp[key] = v[0][key];
                                }
                            }
                            Object.assign(main, dedupe(tmp, null));
                        }
                        if (v?.label && v.value === true) {
                            let tmp = {};
                            for (let key of keys) {
                                if (v[key] !== undefined) {
                                    tmp[key] = v[key];
                                }
                            }
                            let cleaned = dedupe(tmp, v.label);
                            if (Object.keys(cleaned).length) {
                                add[v.label] = cleaned;
                            }
                        }
                    }
                }
            }
            if (!Object.keys(main).length) { return null; }
            if (Object.keys(add).length) {
                main.___add = add;
            }
            return main;
        };

        let out = {};
        function splitLines({ string, }) {
            if (!string || !/[\r\n]/.test(string)) { return string; } let out = {}; string.split(/\r?\n|\r/).forEach((l, i) => { out[`_${String(i + 1).padStart(2, '0')}`] = l.trim(); }); return out;
        }

        for (let root in obj) {
            let src = obj[root]; let dst = {};
            if (src['0']) {
                dst['0'] = { ...src['0'], };

                async function handleText(key) {
                    let text = src['0'][key]; if (!text) { return; } if (!ignoreTranslate) { text = (await googleTranslate({ e, 'source': 'en', 'target': 'pt', 'text': `${text}`, })).res || text; }
                    dst['0'][key] = ignoreBreakLine ? text : splitLines({ 'string': `${text}`, });
                }
                await handleText('___text'); await handleText('___comment');
            }
            for (let k of order) {
                if (!src[k]) { continue; } let v = extract(src[k]); if (v) { dst[k] = v; }
            }
            for (let k in src) {
                if (k === '0') { continue; } if (order.includes(k)) { continue; } let v = extract(src[k]); if (v) { dst[k] = v; }
            }
            out[root] = dst;
        }

        ret['ret'] = true;
        ret['msg'] = 'TASK INF REDUCE TRYRATING: OK';
        ret['res'] = out;

    } catch (catchErr) {
        let retRegexE = await regexE({ inf, 'e': catchErr, }); ret['msg'] = retRegexE.res; ret['ret'] = false; delete ret['res'];
    }

    return { ...({ 'ret': ret.ret, }), ...(ret.msg && { 'msg': ret.msg, }), ...(ret.hasOwnProperty('res') && { 'res': ret.res, }), };
}

// CHROME | NODE
globalThis['taskInfReduceTryRating'] = taskInfReduceTryRating;


