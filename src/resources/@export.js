globalThis.eng = (typeof globalThis.alert !== 'undefined'); // [true] CHROME | [false] NODEJS

// DEFINIR O 'devChildren' → [CHROME] EMAIL DO USUÁRIO | [NODEJS] PRIMEIRO ARQUIVO A SER EXECUTADO (NA MAIORIA DOS CASOS 'server')
let devC = new Error().stack.split('\n'); devC = devC[devC.length - 1]; let devChildren = devC.includes('.js:') ? devC.match(/\/([^/]+)\.[^/]+$/)[1] : false;
if (eng) { devChildren = await new Promise((resolve) => { chrome.identity.getProfileUserInfo(function (u) { resolve(u.email); }); }); }

// @functions
await import(`../../../${process.env.fileChrome_Extension.split('PROJETOS\\')[1]}/src/resources/@functions.js`);

// DEFINIR → LETTER | ROOT | FUNCTION | PROJECT | FILE | LINE
await getPath({ 'e': new Error(), devChildren, });

// console.log(`${eng} | ${engName} | ${letter}\n${fileProjetos} | ${fileWindows}`); console.log('\n'); console.log('securityPass:', gW.securityPass);
// console.log('portWeb:', gW.portWeb, '|', 'serverWeb:', gW.serverWeb); console.log('portLoc:', gW.portLoc, '|', 'serverLoc:', gW.serverLoc);
// console.log(`devMaster: ${gW.devMaster}\ndevSlave: ${gW.devSlave}\ndevChildren: ${gW.devChildren}`); console.log(`devSend:\n${gW.devSend}`);
// console.log(`devGet:\n${gW.devGet[0]}\n${gW.devGet[1]}`); console.log('conf:', gW.conf); console.log('root:', gW.root); console.log('functions:', gW.functions); console.log('project:', gW.project);

/* FUNÇÕES DESSE PROJETO */ let project = gW.project;
globalThis['ewoq'] = (inf) => { return importFun({ 'importOk': (!eng), 'path': `./src/platforms/ewoq.js`, inf, project, }); };
globalThis['tryRating'] = (inf) => { return importFun({ 'importOk': (!eng), 'path': `./src/platforms/tryRating.js`, inf, project, }); };

// FUNÇÕES DESSE PROJETO
globalThis['taskInfTryRating'] = (inf) => { return importFun({ 'importOk': (!eng), 'path': `./src/resources/taskInfTryRating.js`, inf, project, }); };

// SCRIPTS DESSE PROJETO
globalThis['getResponseTryRating'] = (inf) => { return importFun({ 'importOk': (!eng), 'path': `./src/scripts/getResponseTryRating.js`, inf, project, }); };


