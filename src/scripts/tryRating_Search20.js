let e = import.meta.url;
async function TryRating_Search20(inf) {
    let ret = { 'ret': false }; e = inf && inf.e ? inf.e : e;
    try {
        let infNotification, retNotification, retSniffer, retFile
        if (inf.snifferChrome) {
            let gOEve = async (i) => {
                if (i.inf.sniffer === 2) {
                    gORem(gOEve); chrome.browserAction.setBadgeText({ text: '' }); ret = { 'ret': false };
                    return ret
                }
            }; gOAdd(gOEve);
        }
        if (inf.logFile) { retFile = await file({ 'e': e, 'action': 'read', 'path': inf.logFile }); retSniffer = retFile.res }
        else if (inf.body) { retSniffer = inf.body }
        else { retSniffer = inf.sniffer };
        retSniffer = JSON.parse(retSniffer)
        if (!retSniffer.tasks[0].taskData.hasOwnProperty('testQuestionInformation')) {
            infNotification = {
                'duration': 2, 'icon': './src/media/notification_3.png', 'retInf': false,
                'title': `NÃO TEM A RESPOSTA`,
                'text': `Avaliar manualmente`,
            };
            retNotification = await notification(infNotification)
        }
        else {
            let resultList = retSniffer.tasks[0].taskData.resultSet.resultList;
            let testQuestionInformation = retSniffer.tasks[0].taskData.testQuestionInformation.answer.serializedAnswer;
            let not = true
            let res = await Promise.all(resultList.map(async (v, index) => {
                let idTask = [v.surveyKeys['193']];
                let resultado = null, nome = null, endereco = null, fechado = null, relevance = null, nameAccurracy = null, addressAccurracy = null, pinAccurracy = null, comentario = null
                let comentario1, comentario2
                try { resultado = index + 1 } catch (e) { };
                try { nome = v.value.name } catch (e) { };
                try { endereco = v.value.address[0] } catch (e) { };
                try { fechado = testQuestionInformation['Closed-DNE'][idTask].closed_dne.value ? 'SIM' : 'NAO' } catch (e) { };
                try { relevance = testQuestionInformation.Relevance[idTask].Relevance[0].label } catch (e) { };
                try { nameAccurracy = testQuestionInformation.Data[idTask].Name[0].value } catch (e) { };
                try { addressAccurracy = testQuestionInformation.Data[idTask].Address[0].value } catch (e) { };
                try { pinAccurracy = testQuestionInformation.Data[idTask].Pin[0].value } catch (e) { };
                try { comentario = resultList[index].comments } catch (e) { };
                if (comentario) {
                    if (not) {
                        not = false
                        infNotification =
                        {
                            'duration': 3, 'icon': './src/media/icon_4.png', 'retInf': false,
                            'title': `AGUARDE...`,
                            'text': `Traduzindo e alterando o comentário`,
                        };
                        retNotification = await notification(infNotification)
                    }

                    let infTranslate1 = { 'source': 'auto', 'target': 'pt', 'text': comentario };
                    let retTranslate1 = await translate(infTranslate1);
                    comentario1 = retTranslate1.res

                    // infTranslate2 = { 'source': 'auto', 'target': 'en', 'text': comentario };
                    // retTranslate2 = await translate(infTranslate2)
                    // comentario2 = retTranslate2.res

                    let infChatGpt = { 'provider': 'ora.ai', 'input': `REWRITE THIS SENTENCE WITH OTHER WORDS, KEEPING THE SAME MEANING:\n\n ${comentario}` }
                    let retChatGpt = await chatGpt(infChatGpt)
                    if (!retChatGpt.ret) {
                        return ret
                    };
                    comentario2 = retChatGpt.res.replace(/\n/g, ' ').replace(/\\"/g, "'");
                }

                return {
                    '1_RESULTADO': resultado,
                    '2_NOME': nome,
                    '3_ENDERECO': endereco,
                    '4_FECHADO': fechado,
                    '5_Relevance': relevance,
                    '6_Name_Accurracy': nameAccurracy,
                    '7_Address_Accurracy': addressAccurracy,
                    '8_Pin_Accurracy': pinAccurracy,
                    //'9_COMENTARIO': comentario,
                    'z': ['x'],
                    '10_COMENTARIO_pt': comentario1,
                    'x': ['x'],
                    '11_COMENTARIO_alterado': comentario2,
                };
            }));

            infNotification =
            {
                'duration': 2, 'icon': './src/media/notification_1.png', 'retInf': false,
                'title': `CONCLUÍDO: na área de transferência`,
                'text': `${JSON.stringify(res, null, 2)}`,
            };
            retNotification = await notification(infNotification)

            await clipboard({ 'value': res })
        }
        ret['msg'] = `TRYRATING [Search20]: OK`;
        ret['ret'] = true;

        // ### LOG FUN ###
        if (inf && inf.logFun) {
            let infFile = { 'e': e, 'action': 'write', 'functionLocal': false, 'logFun': new Error().stack, 'path': 'AUTO', }, retFile
            infFile['rewrite'] = false; infFile['text'] = { 'inf': inf, 'ret': ret }; retFile = await file(infFile);
        }
    } catch (e) {
        let retRegexE = await regexE({ 'inf': inf, 'e': e, 'catchGlobal': false });
        ret['msg'] = retRegexE.res
    };
    return {
        ...({ ret: ret.ret }),
        ...(ret.msg && { msg: ret.msg }),
        ...(ret.res && { res: ret.res }),
    };
}

if (eng) { // CHROME
    window['TryRating_Search20'] = TryRating_Search20;
} else { // NODEJS
    global['TryRating_Search20'] = TryRating_Search20;
}