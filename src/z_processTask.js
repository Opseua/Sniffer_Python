globalThis['firstFileCall'] = new Error(); await import('./resources/@export.js'); let e = firstFileCall, ee = e;

// // ### 'list' Search20 (Task com julgamentos únicos [TASK ID: igual])
// // tasks[0].taskData.resultSet.resultList[1].value.name
// // tasks[0].taskData.resultSet.resultList[2].value.name
// // tasks[0].taskData.resultSet.resultList[1].value.name

// // ### 'task' SearchAdsRelevance (Task com julgamentos separados [TASK ID: diferente])
// // tasks[0].taskData.query
// // tasks[1].taskData.query
// // tasks[2].taskData.query

let pathTxt, body, infTaskInfTryRating, retTaskInfTryRating, pathKeep = [`D:/ARQUIVOS/PROJETOS/Sniffer_Python/logs/Plataformas/TryRating`, `D:/ARQUIVOS/PROJETOS/Sniffer_Python/logs/Plataformas/z_teste/TryRating`,];

// *** {OK}
pathTxt = `${pathKeep[1]}/AddressVerification/2-GET_TASK-blindNao.txt`; // blindNao
pathTxt = `${pathKeep[1]}/AddressVerification/2-GET_TASK-respSim.txt`; // respSim
pathTxt = `${pathKeep[1]}/AddressVerification/2-GET_TASK-respSim_[QUERY_ADDRESS_INVALID].txt`; // respSim [QUERY_ADDRESS_INVALID]
// *** {OK}
pathTxt = `${pathKeep[1]}/AFMConceptExplainEval2/2-GET_TASK-blindNao.txt`; // blindNao
// *** {OK}
pathTxt = `${pathKeep[1]}/AIGeneratedTextEvaluationPortuguese/2-GET_TASK-blindNao.txt`; // blindNao
// -------------------------------------------------------------------------------------------------------------------------------------------

// *** {OK}
pathTxt = `${pathKeep[1]}/Categorization/2-GET_TASK-blindNao.txt`; // blindNao
pathTxt = `${pathKeep[1]}/Categorization/2-GET_TASK-respSim.txt`; // respSim
// *** {OK}
pathTxt = `${pathKeep[1]}/TimeSensitiveEmailCategorizationPortugueseLanguage/2-GET_TASK-blindNao.txt`; // blindNao
pathTxt = `${pathKeep[1]}/TimeSensitiveEmailCategorizationPortugueseLanguage/2-GET_TASK-respSim.txt`; // respSim
// *** {OK}
// pathTxt = `${pathKeep[1]}/EmailCategorizationPortugueseLanguage/2-GET_TASK-blindNao.txt`; // blindNao
// *** {SALVAR COM O 2 JULGAMENTOS NO blindNao E respNao}
pathTxt = `${pathKeep[1]}/Search20/2-GET_TASK-blindNao[2].txt`; // blindNao
// pathTxt = `${pathKeep[1]}/Search20/2-GET_TASK-respSim_[1].txt`; // respSim [1]
// pathTxt = `${pathKeep[1]}/Search20/2-GET_TASK-respSim_[2].txt`; // respSim [2]
// pathTxt = `${pathKeep[1]}/Search20/2-GET_TASK-respSim_[2]_[CLOSED_DNE]`; // respSim [2] [CLOSED_DNE]
// pathTxt = `${pathKeep[1]}/Search20/2-GET_TASK-respNao`; // respNao
// *** {OK}
// pathTxt = `${pathKeep[1]}/SearchAdsRelevance/2-GET_TASK-blindNao.txt`; // blindNao
// *** {OK}
// pathTxt = `${pathKeep[1]}/Ratingoftransformedtext/2-GET_TASK-blindNao.txt`; // blindNao
// pathTxt = `${pathKeep[1]}/Ratingoftransformedtext/2-GET_TASK-respSim.txt`; // respSim
// *** {OK}
// pathTxt = `${pathKeep[1]}/SiriNamedEntities/2-GET_TASK-respSim.txt`; // respSim
// *** {OK}
// pathTxt = `${pathKeep[1]}/POIEvaluation/2-GET_TASK-respSim.txt`; // respSim
// pathTxt = `${pathKeep[1]}/POIEvaluation/2-GET_TASK-respNao.txt`; // respNao {POIEvaluationEN}
// *** {OK}
// pathTxt = `${pathKeep[1]}/POIwithCorrections2pins/2-GET_TASK-blindNao.txt`; // blindNao
// *** {OK}
// pathTxt = `${pathKeep[1]}/SearchAdsCloseVariants/2-GET_TASK-respSim.txt`; // respSim
// ***
// pathTxt = `${pathKeep[0]}/MES_06_JUN/DIA_01/11.53.16.879_GET_MainContentLabeling.txt`; // NÃO
// ***
// pathTxt = `${pathKeep[0]}/MES_08_AGO/DIA_07/15.15.05.949_GET_AssistantResponsePQA.txt`; // NÃO (POSSIVELMENTE BLIND+RESP)
// ***
// pathTxt = `${pathKeep[0]}/MES_06_JUN/DIA_05/OK/16.15.48.923_GET_AssistantResponseSelect.txt`; // NÃO
// ***
// pathTxt = `${pathKeep[0]}/MES_08_AGO/DIA_01/05.59.23.038_GET_audioqualityskill.txt`; // NÃO
// ***
// pathTxt = `${pathKeep[0]}/MES_07_JUL/DIA_19/OK/20.01.59.632_GET_BeachLocationEvaluation.txt`; // BLIND + RESP
// ***
// pathTxt = `${pathKeep[0]}/MES_07_JUL/DIA_26/OK/16.06.01.915_GET_CarCounter.txt`; // BLIND + RESP (RESPOSTA ESTÁ ERRADA)
// pathTxt = `${pathKeep[0]}/MES_07_JUL/DIA_26/OK/16.17.45.564_GET_CarCounter.txt`; // BLIND + RESP (RESPOSTA ESTÁ ERRADA)
// ***
// pathTxt = `${pathKeep[0]}/MES_07_JUL/DIA_19/OK/00.54.44.839_GET_DrivingNavigation3DMaps.txt`; // BLIND + RESP
// pathTxt = `${pathKeep[0]}/MES_07_JUL/DIA_19/OK/00.46.13.683_GET_DrivingNavigation3DMaps.txt`; // NÃO
// ***
// pathTxt = `${pathKeep[1]}/Artifactlevelingongeneratedimages/2-GET_TASK-blindSim.txt`; // 

// D:\ARQUIVOS\PROJETOS\Sniffer_Python\logs\Plataformas\z_teste\TryRating\Artifactlevelingongeneratedimages

// ***

// ###
body = await file({ 'action': 'read', 'path': pathTxt, }); body = JSON.parse(body.res); console.log('PROCESSANDO...');

// ******************************************
infTaskInfTryRating = { e, 'plataform': `TryRating`, 'reg': true, 'excludes': ['qtdTask', 'blindNumA', 'clipA', 'res',], 'includes': ['MES_', 'DIA_', 'Search20',], };
// infTaskInfTryRating = { e, 'body': body, 'reg': true, 'excludes': ['qtdTask', 'blindNum', 'clipA', 'resA'], };
retTaskInfTryRating = await taskInfTryRating(infTaskInfTryRating); clearRun(); console.log('ok'); // console.log(JSON.stringify(retTaskInfTryRating), '\n');

