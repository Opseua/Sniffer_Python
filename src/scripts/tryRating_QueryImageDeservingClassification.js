async function TryRating_QueryImageDeservingClassification(inf) {
    let ret = { 'ret': false }; try {
        let infNotification, retNotification, retSniffer, retFile
        if (inf.snifferChrome) {
            let gOEve = async (i) => {
                if (i.inf.sniffer === 2) { gORem(gOEve); chrome.browserAction.setBadgeText({ text: '' }); ret = { 'ret': false }; return ret }
            }; gOAdd(gOEve);
        };
        if (inf.logFile) { retFile = await file({ 'action': 'read', 'path': inf.logFile }); retSniffer = retFile.res }
        else if (inf.body) { retSniffer = inf.body }
        else { retSniffer = inf.sniffer };
        retSniffer = JSON.parse(retSniffer)
        let query = retSniffer.tasks[0].taskData.query;
        await clipboard({ 'value': query })
        if (retSniffer.targetLocalIds.length == 1) {
            infNotification = {
                'duration': 4, 'icon': './src/media/notification_3.png', 'retInf': false,
                'title': `BLIND`, 'text': `${query}`
            };
            retNotification = await notification(infNotification)
        } else {
            infNotification = {
                'duration': 2, 'icon': './src/media/notification_1.png', 'retInf': false,
                'title': `NÃO BLIND`, 'text': `${query}`
            }; // retNotification = await notification(infNotification)
        };
        let infChatGpt = {
            'provider': 'ora.ai',
            'input': `Eu preciso identificar se uma consulta que foi feita no Google faz sentido ou não. Com base nos dados que você tem da internet até 2021, só me responda '####SIM####' se fizer sentido ou '####NAO####' caso não faça sentido. A consulta é a seguinte: \n\n '${query}'`
        };
        let retChatGpt = await chatGpt(infChatGpt);
        if (!retChatGpt.ret) {
            infNotification = {
                'duration': 3, 'icon': './src/media/notification_3.png', 'retInf': false,
                'title': `ERRO PESQUISA NO CHATGPT`, 'text': `'ret' → false`
            };
            retNotification = await notification(infNotification)
        } else if (!retChatGpt.res.includes('####SIM####') && !retChatGpt.res.includes('####NAO####')) {
            infNotification = {
                'duration': 3, 'icon': './src/media/notification_3.png', 'retInf': false,
                'title': `ERRO CHATGPT`, 'text': `Resposta diferente de 'SIM' ou 'NAO'`
            };
            retNotification = await notification(infNotification);
            console.log(`\n\n@@@\n${retChatGpt.res}\n@@@\n\n`)
        } else if (retChatGpt.res.includes('####NAO####')) {
            infNotification = {
                'duration': 3, 'icon': './src/media/notification_3.png', 'retInf': false,
                'title': query, 'text': `🔵 GIBBERISH`
            };
            retNotification = await notification(infNotification)
            let radio = { "other": "TryRating_QueryImageDeservingClassification", "inf": [2], "res": "🔵 GIBBERISH", "query": query }
            await wsSend(devChrome, radio)
        } else {
            await wsSend(devBlueStacks, { "name": "google", "par": { "search": query } })
            console.log('buscar no Google')
        };
        ret['msg'] = `TRYRATING [QueryImageDeservingClassification]: OK`;
        ret['ret'] = true;
    } catch (e) {
        let m = await regexE({ 'e': e });
        ret['msg'] = m.res
    };
    return {
        ...(ret.ret && { ret: ret.ret }),
        ...(ret.msg && { msg: ret.msg }),
        ...(ret.res && { res: ret.res }),
    };
}

if (typeof window !== 'undefined') { // CHROME
    window['TryRating_QueryImageDeservingClassification'] = TryRating_QueryImageDeservingClassification;
} else { // NODEJS
    global['TryRating_QueryImageDeservingClassification'] = TryRating_QueryImageDeservingClassification;
}