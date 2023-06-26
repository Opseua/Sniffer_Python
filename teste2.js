await import('./clearConsole.js');
import { Console } from 'console';
import net from 'net'; const port = 3000;
console.log('\n', 'SERVER JS RODANDO\n');
const serverPri = net.createServer();
serverPri.on('connection', (socket) => { socket.write(JSON.stringify(sendPri)) }); serverPri.listen(port, () => { });

const sendPri = {
    'buffer': 1024,
    'host': [
        '18.119.140.20',
    ],
    'url': [
        'https://jsonformatter.org/json-parser',
    ]
};


// ################################################## REQUEST
// const serverReq = net1.createServer((socket1) => {
//     socket1.on('error', (err) => { console.error(`ERRO REQ: ${err}`); socket1.destroy(); return });

//     socket1.on('data', async (data) => {
//         let ret = { 'send': true } // 'send': se deve enviar ou nao a req
//         const req = JSON.parse(data.toString());
//         // req.url = 'http://18.119.140.20:8888/post'; // ALTERAR url
//         // req.method = 'POST'; // ALTERAR metodo
//         // req.headers['Teste'] = 'Valor3333'; // ALTERAR header (add)
//         // delete req.headers['User-Agent']; // ALTERAR header (remove)
//         // req.body = req.body.replace(/CASA/g, 'AAAAAAAA'); // ALTERAR body
//         // ret['res'] = req; // ATUALIZAR A REQUISICAO

//         if ((req.type == 'req') && (req.url == 'https://ntfy.sh/') && (req.method == 'PUT')) {
//             req.body = req.body.replace(/CASA/g, 'AAAAAAAA');
//             ret['res'] = req;
//             // ret['send'] = false;
//             console.log(`MODIFICADO | ${req.method} ${req.url}\n${req.body}`);
//         }

//         if ((req.type == 'req') && (req.url == 'http://18.119.140.20:8888/get/OLA')) {
//             req.url = 'http://18.119.140.20:8888/get/OLAaaaaa'; // ALTERAR url
//             //req.method = 'POST'; // ALTERAR metodo
//             delete req.headers['User-Agent']; // ALTERAR header (add)
//             req.headers['Teste'] = 'Valor3333'; // ALTERAR header (remove)
//             //req.body = 'ola'; // ALTERAR body

//             ret['res'] = req;
//             console.log(req)
//             // console.log(`MODIFICADO | ${req.method} ${req.url}\n${JSON.stringify(req.headers)}`);
//         }


//         socket1.write(JSON.stringify(ret));
//     });
// });

// serverReq.on('listening', () => {
//     console.log("AGUARDANDO PYTHON");
// });
// serverReq.listen(port, '127.0.0.1');






// const serverReq = net.createServer((socket) => {
//     let dReq = '';
//     socket.on('data', async (data) => {
//         const d = data.toString(); if (d.endsWith('\n')) { dReq += d.slice(0, -1); } else { dReq += d; }
//         const ret = { 'send': true } // 'send': se deve enviar ou nao a req
//         const req = JSON.parse(d);
//         // ###########################################

//         const msg = { 'caracteres': dReq.length, 'bytes': Buffer.byteLength(dReq) }
//         //console.log('REQ', msg);
//         if ((req.type == 'req') && (req.url == 'https://ntfy.sh/') && (req.method == 'PUT')) {
//             req.body = req.body.replace(/JSON Full Form/g, 'AAAAAAAA');
//             ret['res'] = req;
//             //ret['send'] = false;
//             console.log(`MODIFICADO | ${req.method} ${req.url}\n${req.body}`);
//         }
//         console.log('js')

//         // ###########################################
//         dReq = '';
//         socket.write(JSON.stringify(ret));
//     });
// });
// serverReq.listen((port + 1), () => {
//     console.log('SERVIDOR SOCKET RODANDO');
// });









// ANTIGO
// const serverRes = net.createServer((socket) => {
//     let buffer = Buffer.alloc(0);
//     socket.on('data', async (chunk) => {
//         console.log('ok')
//         buffer = Buffer.concat([buffer, chunk]);
//         while (true) { // Loop infinito para processar todas as partes disponíveis
//             const partEndIndex = buffer.indexOf('\n'); // Procura pelo caractere que indica o fim da parte
//             if (partEndIndex < 0) { // Se não houver nenhum caractere '\n'
//                 break;
//             }
//             const dataBuffer = buffer.slice(0, partEndIndex); // Extrai os dados até o caractere '\n'
//             const dataStrBase64 = dataBuffer.toString();
//             console.log(`Recebendo ${dataStrBase64.length} bytes...`);
//             let jsonData;
//             try {
//                 jsonData = JSON.parse(Buffer.from(dataStrBase64, 'base64').toString());
//             } catch (e) {
//                 console.error("Erro ao parsear JSON", e);
//                 throw new Error("Erro ao processar mensagem");
//             }
//             console.log(`Parte ${i++}:`, jsonData);
//             if (partEndIndex === buffer.length - 1) {
//                 console.log("Mensagem completa!");
//                 break;
//             }
//             buffer = buffer.slice(partEndIndex + 1); // Remove a parte do início do buffer
//         }
//     });
















//     // let buffer = Buffer.alloc(0);
//     // socket.on('data', async (chunk) => {
//     //     // buffer = Buffer.concat([buffer, chunk]);
//     //     // if (buffer.toString().endsWith('\n')) {
//     //     //     try {
//     //     //         const dataRes = JSON.parse(Buffer.from(buffer.slice(0, -1).toString(), 'base64').toString('utf-8'))
//     //     //         const ret = { 'send': true, res: {} };
//     //     //         // ################################### ↑↑↑ SOCKET: RECEBIDO ↑↑↑ ###################################

//     //     //         console.log(dataRes.method, '|', dataRes.host);
//     //     //         ret['res']['host'] = dataRes.host;
//     //     //         ret['res']['body'] = dataRes.body;



//     //     //         // ################################### ↓↓↓ SOCKET: ENVIADO ↓↓↓ ###################################
//     //     //         const jsonStr = Buffer.from(JSON.stringify(ret)).toString('base64');
//     //     //         const maxRes = 1024 * 10;
//     //     //         let sendRes;
//     //     //         const numParts = Math.ceil(jsonStr.length / maxRes);

//     //     //         for (let i = 0; i < numParts; i++) {
//     //     //             const start = i * maxRes;
//     //     //             const end = Math.min(start + maxRes, jsonStr.length);
//     //     //             const partJSON = jsonStr.substring(start, end);
//     //     //             console.log('TOTAL', numParts, '/', i + 1);
//     //     //             if (end >= jsonStr.length) {
//     //     //                 sendRes = `${partJSON}\n`;
//     //     //             } else {
//     //     //                 sendRes = `${partJSON}`;
//     //     //             }
//     //     //         }
//     //     //         socket.write(Buffer.from(sendRes));
//     //     //         console.log('TOTAL', numParts, 'PARTE(s) ENVIADA(s)')
//     //     //     } catch (e) { console.error(e); } finally { buffer = Buffer.alloc(0); }
//     //     // }

//     //     // buffer = Buffer.concat([buffer, chunk]);
//     //     // if (buffer.toString().endsWith('\n')) {
//     //     //     const dataRes = JSON.parse(buffer.slice(0, -1).toString())
//     //     //     const ret = { 'send': true, res: {} };
//     //     //     console.log(dataRes)

//     //     //     if ((dataRes.reqRes == 'res') && (dataRes.host == '18.119.140.20') || (dataRes.url == 'https://jsonformatter.org/json-parser')) {
//     //     //         ret['res']['body'] = dataRes.body.toString().replace(/JSON Full Form/g, 'AAAAAAAA');
//     //     //         // const teste = dataRes.body.toString()
//     //     //         // const nova = teste.replace(/JSON Full Form/g, 'AAAAAAAA');
//     //     //         // ret['res']['body'] = nova
//     //     //         //ret['res']['headers'] = dataRes.headers;
//     //     //         ret['res']['host'] = dataRes.host;
//     //     //         //ret['res']['status'] = dataRes.status;
//     //     //         //console.log(`MODIFICADO | ${req.method} ${req.url}\n${req.body}`);
//     //     //     }
//     //     //     //console.log(ret)
//     //     //     //console.log(JSON.stringify(ret).length, dataRes.host)

//     //     //     //buffer = Buffer.alloc(0); // LIMPAR O BUFFER
//     //     //     //socket.write(Buffer.from(JSON.stringify(ret)));



//     //     // }


//     // });
// });
// serverRes.listen((port + 2), () => { });







const server = net.createServer((socket) => {
    let getSockRes = '';
    socket.on('data', async (chunk) => {
        getSockRes += chunk.toString();
        if (getSockRes.endsWith('#fim#')) {
            getSockRes = Buffer.from(getSockRes.split("#fim#")[0], 'base64').toString('utf-8');
            const dataRes = JSON.parse(getSockRes); const ret = { 'send': true, res: {} };
            // ##############################################
            ret['res']['body'] = dataRes.body.replace(/JSON Full Form/g, 'AAAAAAAA');


            const sendB64Res = Buffer.from(JSON.stringify(ret)).toString('base64');
            for (let i = 0; i < sendB64Res.length; i += sendPri.buffer) {
                const part = sendB64Res.slice(i, i + sendPri.buffer);
                socket.write(part);
            }
            socket.write('#fim#');



            // LIMPAR O BUFFER GET
            getSockRes = '';
        }
    });
});
server.listen((port + 2), () => { });



















