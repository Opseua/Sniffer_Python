const { addListener, globalObject } = await import('../Chrome_Extension/src/resources/globalObject.js');
await import('../Microsoft_Graph_API/src/services/excel/updateRange.js')
const { api } = await import('../Chrome_Extension/src/resources/api.js');
const { dateHour } = await import('../Chrome_Extension/src/resources/dateHour.js');
const { fileWrite } = await import('../Chrome_Extension/src/resources/fileWrite.js');

await import('../Chrome_Extension/src/clearConsole.js');
import net from 'net'; const port = 3000;
import { exec } from 'child_process'
console.clear();

console.log('SERVER JS RODANDO', '\n');
const sockPri = net.createServer();
sockPri.on('connection', (socket) => { socket.write(JSON.stringify(sendPri)) }); sockPri.listen(port, () => { });

import { fileInf } from '../Chrome_Extension/src/resources/fileInf.js';
const retFileInf = await fileInf(new URL(import.meta.url).pathname);
const command = `D:/ARQUIVOS/WINDOWS/PORTABLE_Python/python-3.11.1.amd64/python.exe ${retFileInf.res.pathCurrent2}/start.py`
exec(command, (err, stdout, stderr) => { if (err) { console.error(err); return; } console.log(stdout); });

const sendPri = {
    'buffer': 1024,
    'arrUrl': [
        'http://18.119.140.20*', 'https://ntfy.sh/', 'https://jsonformatter.org/json-parser',
        'https://rating.ewoq.google.com/u/0/rpc/rating/AssignmentAcquisitionService/GetNewTasks',
        'https://rating.ewoq.google.com/u/0/rpc/rating/SafeTemplateService/GetTemplate'
    ]
};

// -#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#

async function reqRes(inf) {
    const ret = { 'send': true, res: {} }; ret['res']['reqRes'] = inf.reqRes;
    function rgxMat(a, b) {
        const c = b.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*');
        return new RegExp(`^${c}$`).test(a);
    }
    const regex = sendPri.arrUrl.find(m => rgxMat(inf.url, m));
    if (!!regex) {
        // ######################################################################

        if ((inf.reqRes == 'req') && (rgxMat(inf.url, 'https://ntfy.sh/'))) {
            ret['res']['body'] = inf.body.replace(/CASA/g, 'AAAAAAAA');
            //globalObject.inf = { 'alert': false, 'function': 'updateRange', 'res': ret.res.body };
            log(`############## REQ: ##############\n${ret.res.body}\n\n`)
        }

        if ((inf.reqRes == 'res') && rgxMat(inf.url, '*18.119.140.20*')) {
            let search = 'JSON Full Form';
            if (inf.body.includes(search)) {
                ret['res']['body'] = inf.body.replace(new RegExp(search, 'g'), 'AAAAAAAA');
                //globalObject.inf = { 'alert': false, 'function': 'updateRange', 'res': ret.res.body };
            }
        }

        if ((inf.reqRes == 'res') && rgxMat(inf.url, 'https://jsonformatter.org/json-parser')) {
            ret['res']['body'] = inf.body.replace(/JSON Full Form/g, 'AAAAAAAA');
        }


        if ((inf.reqRes == 'res') && rgxMat(inf.url, 'https://rating.ewoq.google.com/u/0/rpc/rating/SafeTemplateService/GetTemplate')) {
            const nameTask = inf.body.match(/raterVisibleName\\u003d\\"(.*?)\\\"\/\\u003e\\n  \\u003cinputTemplate/);
            let tsk; if (nameTask) { tsk = nameTask[1]; } else { tsk = 'NAO ENCONTRADO'; }
            log(` 🔵 REQ | ${inf.url}\n${tsk}\n\n`)
            ws2.send(tsk)

            // console.log(tsk)
            // const infApi = {
            //     url: `https://excel.officeapps.live.com/x/_vti_bin/EwaInternalWebService.json/SetRichTextCell?waccluster=BR2')`,
            //     method: 'PATCH',
            //     headers: {
            //         'content-type': 'application/json; charset=UTF-8',
            //         'x-accesstoken': `4waD5_iPRNjZKeSOl-6SgGrdCKUZpRcLtRBa2-QmK1Qjw-6QAG7upz7A9SHeVbZxkquZelMRb-XZ8m_rTklhiRoKRrOg8ezhfvoY1u7oZ1RuX-p9K09XsK-yMnCcVhLYRrRfE7KLNFlUgMhiFK0HDyjGNH8tDSTmj8DyionwB2LGH0E21SePCeGNaVkokHpJDhuQJvtXHUdJNo-XB2MWPewefmbjAgfHBNuHvn7wnPeB8jhHgCEyKQ_xhgWClzKuBfFyi6HVFzrpVHtRe3AnxDpCffoLbr_RiIQ44oYjPgRF4Gf4n5wGt2MVSMQgYXCKwsSdujTku5dAdhsuikRrppn7O7u027Zw8jRdNPVh79ypLIkgxC_ZHNufroXF7flcBcpECl_UU1v9iSuKY42NgaA-L3nl8-h8EMCEebuCMLPPrXQc7qD6JdQlMitEqmh_m-oZ0_c2G8CBtyXhXS7_SceXCYz6YGG0gUEIpwpRFYYOPRobNFMt1DZ1t5UNzInimpto04X_8mDM25pcgWkQewx7M90yaRMtvcejVkbyzyMlM`
            //     },
            //     body: `{"context":{"WorkbookMetadataParameter":{"WorkbookMetadataState":{"MetadataVersion":0,"ServerEventVersion":0}},"ClientRequestId":"89d9c7ba-d0be-4e8a-a897-5f385e41a244","InstantaneousType":1,"MakeInstantaneousChange":true,"SessionId":"15.CP1PEPF000032451.A108.1.U36.ffa16c33-76f0-41f5-94ca-f5c63057650014.5.pt-BR5.pt-BR16.e3f16b7a20292bbb1.S24.rpWzmEfvpE2yEnsuWGuWQg==16.16.0.16625.4230514.5.pt-BR5.pt-BR1.M1.N0.1.S","TransientEditSessionToken":"9qN4uMBZ6UqUU0TSEj9eLw==","PermissionFlags":786431,"Configurations":1573648,"CompleteResponseTimeout":0,"IsWindowHidden":false,"IsWindowVisible":true,"CollaborationParameter":{"CollaborationState":{"UserListVersion":9,"CollabStateId":25}},"MachineCluster":"BR2","AjaxOptions":0,"ReturnSheetProcessedData":false,"ActiveItemId":"Sheet18","ViewportStateChange":{"SheetViewportStateChanges":[{"SheetName":"YVIE","SelectedRanges":{"SheetName":"YVIE","NamedObjectName":"","Ranges":[{"FirstRow":86,"FirstColumn":0,"LastRow":86,"LastColumn":0}]},"ActiveCell":"A87"}]},"HasAnyNonOcsCoauthor":false,"MergeCount":{"Current":26,"Pending":26,"SuspensionStartTimestamp":null},"ClientRevisions":{"Min":25,"Max":25,"MaxFromBlockCache":25},"PaneType":1,"CellHtml":"","CellIfmt":0,"OriginalIfmt":0},"ewaControlId":"m_excelWebRenderer_ewaCtl_m_ewa","currentObject":"YVIE","isNamedItem":false,"revision":25,"activeCell":{"SheetName":"YVIE","NamedObjectName":"","FirstRow":85,"FirstColumn":0},"formattedText":{"Text":"${tsk}","Fonts":null,"TextRuns":null},"row":85,"column":0,"rowCount":1,"columnCount":30,"setCellRanges":{"SheetName":"YVIE","NamedObjectName":"","Ranges":[{"FirstRow":85,"FirstColumn":0,"LastRow":85,"LastColumn":0}]},"comboKey":0,"allowedSetCellModes":127,"renderingOptions":0,"richValueParameter":{"ParameterType":5},"colorScheme":null}`
            // };
            // const retApi = await api(infApi);
            // const res = JSON.parse(retApi.res);
            //globalObject.inf = { 'alert': false, 'function': 'updateRange', 'res': tsk }
        }

        if ((inf.reqRes == 'res') && rgxMat(inf.url, 'https://rating.ewoq.google.com/u/0/rpc/rating/AssignmentAcquisitionService/GetNewTasks')) {
            log(` 🟡 RES | ${inf.url}\n${inf.body}\n\n`)
            // let excelOnline = JSON.stringify(inf.body).replace(/"/g, '\\"')
            // const infApi = {
            //     url: `https://excel.officeapps.live.com/x/_vti_bin/EwaInternalWebService.json/SetRichTextCell?waccluster=BR2')`,
            //     method: 'PATCH',
            //     headers: {
            //         'content-type': 'application/json; charset=UTF-8',
            //         'x-accesstoken': `4waD5_iPRNjZKeSOl-6SgGrdCKUZpRcLtRBa2-QmK1Qjw-6QAG7upz7A9SHeVbZxkquZelMRb-XZ8m_rTklhiRoKRrOg8ezhfvoY1u7oZ1RuX-p9K09XsK-yMnCcVhLYRrRfE7KLNFlUgMhiFK0HDyjGNH8tDSTmj8DyionwB2LGH0E21SePCeGNaVkokHpJDhuQJvtXHUdJNo-XB2MWPewefmbjAgfHBNuHvn7wnPeB8jhHgCEyKQ_xhgWClzKuBfFyi6HVFzrpVHtRe3AnxDpCffoLbr_RiIQ44oYjPgRF4Gf4n5wGt2MVSMQgYXCKwsSdujTku5dAdhsuikRrppn7O7u027Zw8jRdNPVh79ypLIkgxC_ZHNufroXF7flcBcpECl_UU1v9iSuKY42NgaA-L3nl8-h8EMCEebuCMLPPrXQc7qD6JdQlMitEqmh_m-oZ0_c2G8CBtyXhXS7_SceXCYz6YGG0gUEIpwpRFYYOPRobNFMt1DZ1t5UNzInimpto04X_8mDM25pcgWkQewx7M90yaRMtvcejVkbyzyMlM`
            //     },
            //     body: `{"context":{"WorkbookMetadataParameter":{"WorkbookMetadataState":{"MetadataVersion":0,"ServerEventVersion":0}},"ClientRequestId":"89d9c7ba-d0be-4e8a-a897-5f385e41a244","InstantaneousType":1,"MakeInstantaneousChange":true,"SessionId":"15.CP1PEPF000032451.A108.1.U36.ffa16c33-76f0-41f5-94ca-f5c63057650014.5.pt-BR5.pt-BR16.e3f16b7a20292bbb1.S24.rpWzmEfvpE2yEnsuWGuWQg==16.16.0.16625.4230514.5.pt-BR5.pt-BR1.M1.N0.1.S","TransientEditSessionToken":"9qN4uMBZ6UqUU0TSEj9eLw==","PermissionFlags":786431,"Configurations":1573648,"CompleteResponseTimeout":0,"IsWindowHidden":false,"IsWindowVisible":true,"CollaborationParameter":{"CollaborationState":{"UserListVersion":9,"CollabStateId":25}},"MachineCluster":"BR2","AjaxOptions":0,"ReturnSheetProcessedData":false,"ActiveItemId":"Sheet18","ViewportStateChange":{"SheetViewportStateChanges":[{"SheetName":"YVIE","SelectedRanges":{"SheetName":"YVIE","NamedObjectName":"","Ranges":[{"FirstRow":86,"FirstColumn":0,"LastRow":86,"LastColumn":0}]},"ActiveCell":"A87"}]},"HasAnyNonOcsCoauthor":false,"MergeCount":{"Current":26,"Pending":26,"SuspensionStartTimestamp":null},"ClientRevisions":{"Min":25,"Max":25,"MaxFromBlockCache":25},"PaneType":1,"CellHtml":"","CellIfmt":0,"OriginalIfmt":0},"ewaControlId":"m_excelWebRenderer_ewaCtl_m_ewa","currentObject":"YVIE","isNamedItem":false,"revision":25,"activeCell":{"SheetName":"YVIE","NamedObjectName":"","FirstRow":85,"FirstColumn":0},"formattedText":{"Text":"${excelOnline}","Fonts":null,"TextRuns":null},"row":85,"column":0,"rowCount":1,"columnCount":30,"setCellRanges":{"SheetName":"YVIE","NamedObjectName":"","Ranges":[{"FirstRow":85,"FirstColumn":0,"LastRow":85,"LastColumn":0}]},"comboKey":0,"allowedSetCellModes":127,"renderingOptions":0,"richValueParameter":{"ParameterType":5},"colorScheme":null}`
            // };
            // const retApi = await api(infApi);
            // const res = JSON.parse(retApi.res);
            // globalObject.inf = { 'alert': false, 'function': 'updateRange', 'res': inf.body }
        }

        // ######################################################################
    } else { console.log('OUTRO URL |', inf.url) }

    return ret
}














// -------------------------------------------------------------------------------------------------

// ################################################## REQUEST
const sockReq = net.createServer((socket) => {
    let getSockReq = '';
    socket.on('data', async (chunk) => {
        getSockReq += chunk.toString();
        if (getSockReq.endsWith('#fim#')) {
            // SOCKET: RECEBIDO
            getSockReq = Buffer.from(getSockReq.split("#fim#")[0], 'base64').toString('utf-8');
            const dataReq = JSON.parse(getSockReq); const ret = { 'send': true, res: {} };
            // SOCKET: ENVIADO
            const retReqRes = await reqRes(dataReq)
            if ((dataReq.reqRes == 'req') && (retReqRes.res.reqRes == 'req')) {
                const sendB64Req = Buffer.from(JSON.stringify(retReqRes)).toString('base64');
                for (let i = 0; i < sendB64Req.length; i += sendPri.buffer) {
                    const part = sendB64Req.slice(i, i + sendPri.buffer);
                    socket.write(part);
                }; socket.write('#fim#');  // ENVIAR CARACTERE DE FIM 
            }; getSockReq = ''; // LIMPAR BUFFER
        }
    });
});
sockReq.listen((port + 1), () => { });

// ################################################## RESPONSE
const sockRes = net.createServer((socket) => {
    let getSockRes = '';
    socket.on('data', async (chunk) => {
        getSockRes += chunk.toString();
        if (getSockRes.endsWith('#fim#')) {
            // SOCKET: RECEBIDO
            getSockRes = Buffer.from(getSockRes.split("#fim#")[0], 'base64').toString('utf-8');
            const dataRes = JSON.parse(getSockRes); const ret = { 'send': true, res: {} };
            // SOCKET: ENVIADO
            const retReqRes = await reqRes(dataRes)
            if ((dataRes.reqRes == 'res') && (retReqRes.res.reqRes == 'res')) {
                const sendB64Res = Buffer.from(JSON.stringify(retReqRes)).toString('base64');
                for (let i = 0; i < sendB64Res.length; i += sendPri.buffer) {
                    const part = sendB64Res.slice(i, i + sendPri.buffer);
                    socket.write(part);
                }; socket.write('#fim#');  // ENVIAR CARACTERE DE FIM 
            }; getSockRes = ''; // LIMPAR BUFFER
        }
    });
});
sockRes.listen((port + 2), () => { });


// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@


async function websocket(inf) {
    const RetDH = dateHour()
    const infFileWrite = {
        'file': `LOG/[${RetDH.res.mon}-${RetDH.res.day}] [${RetDH.res.hou}-00_${RetDH.res.hou}-59]/arquivo.txt`,
        'rewrite': true, // 'true' adiciona no MESMO arquivo, 'false' cria outro em branco
        'text': `🟢 ${RetDH.res.hou}:${RetDH.res.min}:${RetDH.res.sec}:${RetDH.res.mil} |${inf}`
    }; fileWrite(infFileWrite);
}

async function log(inf) {
    const RetDH = dateHour()
    const infFileWrite = {
        'file': `LOG/[${RetDH.res.mon}-${RetDH.res.day}] [00-00_00-59]/arquivo.txt`,
        'rewrite': true, // 'true' adiciona no MESMO arquivo, 'false' cria outro em branco
        'text': `🟢 ${RetDH.res.hou}:${RetDH.res.min}:${RetDH.res.sec}:${RetDH.res.mil} |${inf}`
    }; fileWrite(infFileWrite);
}

let WebS;
if (typeof window === 'undefined') { // NODEJS
    const { default: WebSocket } = await import('isomorphic-ws');
    WebS = WebSocket;
} else { // CHROME
    WebS = window.WebSocket;
}
const portWS = 8888;
let ws2;
async function web2() {
    ws2 = new WebS(`ws://18.119.140.20:${portWS}`);
    ws2.addEventListener('open', async function (event) { // CONEXAO: ONLINE - WS2
        console.log(`BACKGROUND: CONEXAO ESTABELECIDA - WS2`)
        setTimeout(function () {
            ws2.send('Chrome: mensagem de teste');
        }, 6000);
    });
    ws2.addEventListener('message', async function (event) { // CONEXAO: NOVA MENSAGEM - WS2
        console.log('→ ' + event.data);
    });
    ws2.addEventListener('close', async function (event) { // CONEXAO: OFFLINE, TENTAR NOVAMENTE - WS2
        console.log(`BACKGROUND: RECONEXAO EM 10 SEGUNDOS - WS2`)
        setTimeout(web2, 10000);
    });
    ws2.addEventListener('error', async function (error) { // CONEXAO: ERRO - WS2
        console.error(`BACKGROUND: ERRO W2`);
    });
}
web2();

