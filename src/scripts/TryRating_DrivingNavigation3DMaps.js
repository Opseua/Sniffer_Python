
async function TryRating_DrivingNavigation3DMaps(inf) {
    let ret = { 'ret': false }; try {
        let infNotification, retNotification, retSniffer, retFile
        if (inf.snifferChrome) {
            let gOEve = async (i) => {
                if (i.inf.sniffer === 2) {
                    gORem(gOEve); chrome.browserAction.setBadgeText({ text: '' }); ret = { 'ret': false };
                    return {
                        ...({ ret: ret.ret }),
                        ...(ret.msg && { msg: ret.msg }),
                        ...(ret.res && { res: ret.res }),
                    };
                }
            }; gOAdd(gOEve);
        }
        if (inf.logFile) { retFile = await file({ 'action': 'read', 'path': inf.logFile }); retSniffer = retFile.res }
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
            let resultList = [retSniffer.tasks[0].taskData]
            let testQuestionInformation = retSniffer.tasks[0].taskData.testQuestionInformation.answer.serializedAnswer;
            let res = await Promise.all(resultList.map(async (value, index) => {
                let resultado = requestId, comentario = null

                return {
                    '1_RESULTADO': retSniffer.resultado,
                    '2_RESPOSTA': testQuestionInformation.loop,
                };
            }));

            infNotification = {
                'duration': 2, 'icon': './src/media/notification_1.png', 'retInf': false,
                'title': `CONCLUÍDO: na área de transferência`,
                'text': `${JSON.stringify(res, null, 2)}`,
            };
            retNotification = await notification(infNotification)

            await clipboard({ 'value': res })
        }
        ret['msg'] = `TRYRATING [DrivingNavigation3DMaps]: OK`;
        ret['ret'] = true;
    } catch (e) {
        let m = await regexE({ 'e': e });
        ret['msg'] = m.res
    };
    return {
        ...({ ret: ret.ret }),
        ...(ret.msg && { msg: ret.msg }),
        ...(ret.res && { res: ret.res }),
    };
}

if (eng) { // CHROME
    window['TryRating_DrivingNavigation3DMaps'] = TryRating_DrivingNavigation3DMaps;
} else { // NODEJS
    global['TryRating_DrivingNavigation3DMaps'] = TryRating_DrivingNavigation3DMaps;
}