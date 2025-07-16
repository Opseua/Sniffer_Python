/* eslint-disable max-len */

// let infAudioTranscribe, retAudioTranscribe; 
// infAudioTranscribe = { e, 'path': `!fileProjetos!/Sniffer_Python/logs/Plataformas/z_teste/Scilliance/RefertoSpeakerTurnTranscriptionGL/audio.wav`, };
// retAudioTranscribe = await audioTranscribe(infAudioTranscribe); console.log(retAudioTranscribe);

let e = currentFile(), ee = e; let libs = { 'https': {}, 'zlib': {}, };
async function audioTranscribe(inf = {}) {
    let ret = { 'ret': false, }; e = inf && inf.e ? inf.e : e;
    try {
        /* IMPORTAR BIBLIOTECA [NODE] */ if (libs['zlib']) { libs['zlib']['zlib'] = 1; libs['https']['https'] = 1; libs = await importLibs(libs, 'audioTranscribe'); }

        let { path = `!fileProjetos!/Sniffer_Python/logs/Plataformas/z_teste/Scilliance/RefertoSpeakerTurnTranscriptionGL/audio.wav`, } = inf;

        path = replaceVars({ 'content': path, });

        let fileContent = _fs.readFileSync(path); let boundary = '----WebKitFormBoundary' + Date.now().toString(16); let data = [
            Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="uploaded_file"; filename="${path.split('/').reverse()[0]}"\r\nContent-Type: audio/wav\r\n\r\n`), fileContent,
            Buffer.from(`\r\n--${boundary}\r\nContent-Disposition: form-data; name="language"\r\n\r\npt\r\n--${boundary}--\r\n`),
        ]; let postData = Buffer.concat(data); let opt = {
            'hostname': 'ai-transcribe-api.appgeneration.com', 'path': '/api/v1/transcribe/runsync', 'method': 'POST', 'headers': {
                'User-Agent': 'okhttp/4.12.0', 'Accept-Encoding': 'gzip', 'Content-Type': 'multipart/form-data; boundary=' + boundary, 'Content-Length': postData.length,
                'authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo0Mzg1MTYsImlzcyI6ImFpLXRyYW5zY3JpYmUtYXBpIiwiZXhwIjoxNzUzMDI3MjkxLCJuYmYiOjE3NTI0MjI0OTEsImlhdCI6MTc1MjQyMjQ5MX0.r0yV0Kjp--ebGhYbfJGfdYu5w9qMWPFoIliw2UTITEs',
            },
        };

        let res = await new Promise((ok) => {
            console.log(`ENVIADO ÁUDIO...`);
            let req = _https.request(opt, (res) => {
                let chunks = []; res.on('data', (c) => chunks.push(c)); res.on('end', () => {
                    let buf = Buffer.concat(chunks); let parse = (src) => { try { let json = JSON.parse(src.toString()); ok({ 'ret': true, 'res': json, }); } catch (e) { ok({ 'ret': false, 'msg': e.message, }); } };
                    if (res.headers['content-encoding'] === 'gzip') { _zlib.gunzip(buf, (e, out) => { if (e) { ok({ 'ret': false, 'msg': e.message, }); } else { parse(out); } }); } else { parse(buf); }
                });
            }); req.on('error', (e) => ok({ 'ret': false, 'msg': e.message, })); req.write(postData); req.end();
        });

        if (!res.ret && res?.res?.transcription) {
            ret['msg'] = `AUDIO TRANSCRIBE: ERRO | ${res.msg}`;
        } else {
            ret['ret'] = true;
            ret['msg'] = `AUDIO TRANSCRIBE: OK`;
            ret['res'] = res.res.transcription.replace(/\n+/g, ' ').replace(/  +/g, '').trim();
        }

    } catch (catchErr) {
        let retRegexE = await regexE({ inf, 'e': catchErr, }); ret['msg'] = retRegexE.res; ret['ret'] = false; delete ret['res'];
    }

    return { ...({ 'ret': ret.ret, }), ...(ret.msg && { 'msg': ret.msg, }), ...(ret.res && { 'res': ret.res, }), };
}

// CHROME | NODE
globalThis['audioTranscribe'] = audioTranscribe;


