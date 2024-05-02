let e = import.meta.url, ee = e;
async function tryRating_Search20(inf) {
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
        if (!('testQuestionInformation' in retSniffer.tasks[0].taskData)) {
            infNotification = {
                'duration': 2, 'icon': './src/scripts/media/notification_3.png', 'retInf': false,
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
                try { resultado = index + 1 } catch (catchErr) { };
                try { nome = v.value.name } catch (catchErr) { };
                try { endereco = v.value.address[0] } catch (catchErr) { };
                try { fechado = testQuestionInformation['Closed-DNE'][idTask].closed_dne.value ? 'SIM' : 'NAO' } catch (catchErr) { };
                try { relevance = testQuestionInformation.Relevance[idTask].Relevance[0].label } catch (catchErr) { };
                try { nameAccurracy = testQuestionInformation.Data[idTask].Name[0].value } catch (catchErr) { };
                try { addressAccurracy = testQuestionInformation.Data[idTask].Address[0].value } catch (catchErr) { };
                try { pinAccurracy = testQuestionInformation.Data[idTask].Pin[0].value } catch (catchErr) { };
                try { comentario = resultList[index].comments } catch (catchErr) { };
                if (comentario) {
                    if (not) {
                        not = false
                        infNotification =
                        {
                            'duration': 3, 'icon': './src/scripts/media/icon_4.png', 'retInf': false,
                            'title': `AGUARDE...`,
                            'text': `Traduzindo e alterando o comentário`,
                        };
                        retNotification = await notification(infNotification)
                    }

                    let infTranslate1 = { 'source': 'auto', 'target': 'pt', 'text': comentario };
                    let retTranslate1 = await translate(infTranslate1);
                    comentario1 = retTranslate1.res

                    let infChatGpt = { 'provider': 'open.ai', 'input': `REWRITE THIS SENTENCE WITH OTHER WORDS, KEEPING THE SAME MEANING:\n\n ${comentario}` }
                    let retChatGpt = await chat(infChatGpt)
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
                'duration': 2, 'icon': './src/scripts/media/notification_1.png', 'retInf': false,
                'title': `CONCLUÍDO: na área de transferência`,
                'text': `${JSON.stringify(res, null, 2)}`,
            };
            retNotification = await notification(infNotification)

            await clipboard({ 'value': res })
        }
        ret['msg'] = `TRYRATING [Search20]: OK`;
        ret['ret'] = true;

    } catch (catchErr) {
        let retRegexE = await regexE({ 'inf': inf, 'e': catchErr, });
        ret['msg'] = retRegexE.res
    };
    return {
        ...({ ret: ret.ret }),
        ...(ret.msg && { msg: ret.msg }),
        ...(ret.res && { res: ret.res }),
    };
}

if (eng) { // CHROME
    window['tryRating_Search20'] = tryRating_Search20;
} else { // NODEJS
    global['tryRating_Search20'] = tryRating_Search20;
}