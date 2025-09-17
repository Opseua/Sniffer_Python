globalThis['eng'] = (typeof globalThis.alert !== 'undefined'); // [true] CHROME | [false] NODE

// DEFINIR O 'devChildren' → [CHROME] EMAIL DO USUÁRIO | [NODE] PRIMEIRO ARQUIVO A SER EXECUTADO (NA MAIORIA DOS CASOS 'server')
let devC = new Error().stack.split('\n'); devC = devC[devC.length - 1]; let devChildren = devC.includes('.js:') ? devC.match(/\/([^/]+)\.[^/]+$/)[1] : false;
if (eng) { devChildren = await new Promise((resolve) => { chrome.identity.getProfileUserInfo(function (u) { resolve(u.email); }); }); }

// @functions
await import(`../../../${process.env.fileChrome_Extension.split('PROJETOS\\')[1]}/src/resources/@functions.js`);

// DEFINIR → LETTER | ROOT | FUNCTION | PROJECT | FILE | LINE
await getPath({ 'e': new Error(), devChildren, });

/* FUNÇÕES */ let project = gW.project;
globalThis['ewoq'] = (inf) => { return importFun({ 'engOk': (!eng), 'path': `./src/platforms/ewoq.js`, inf, project, }); };
globalThis['scilliance'] = (inf) => { return importFun({ 'engOk': (!eng), 'path': `./src/platforms/scilliance.js`, inf, project, }); };
globalThis['tryRating'] = (inf) => { return importFun({ 'engOk': (!eng), 'path': `./src/platforms/tryRating.js`, inf, project, }); };

// FUNÇÕES
globalThis['audioTranscribe'] = (inf) => { return importFun({ 'engOk': (!eng), 'path': `./src/resources/audioTranscribe.js`, inf, project, }); };
globalThis['taskInfTryRating'] = (inf) => { return importFun({ 'engOk': (!eng), 'path': `./src/resources/taskInfTryRating.js`, inf, project, }); };

// FUNÇÕES/SCRIPTS [PAGES]
globalThis['correiosServer'] = (inf) => { return importFun({ 'engOk': (!eng), 'path': `./src/pages/resources/correiosServer.js`, inf, project, }); };


