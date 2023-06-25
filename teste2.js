import net from 'net';

const port = 3000;

const { addListener, globalObject } = await import('./globalObject.js');



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






const serverReq = net.createServer((socket) => {
    let dReq = '';
    socket.on('data', async (data) => {
        const d = data.toString(); if (d.endsWith('\n')) { dReq += d.slice(0, -1); } else { dReq += d; }
        let ret = { 'send': true } // 'send': se deve enviar ou nao a req
        const req = JSON.parse(d);
        // ###########################################

        const msg = { 'caracteres': dReq.length, 'bytes': Buffer.byteLength(dReq) }
        //console.log('REQ', msg);
        if ((req.type == 'req') && (req.url == 'https://ntfy.sh/') && (req.method == 'PUT')) {
            req.body = req.body.replace(/CASA/g, 'AAAAAAAA');
            ret['res'] = req;
            //ret['send'] = false;
            console.log(`MODIFICADO | ${req.method} ${req.url}\n${req.body}`);
        }

        // ###########################################
        dReq = '';
        socket.write(JSON.stringify(ret));
    });
});
serverReq.listen((port), () => {
    console.log('SERVIDOR SOCKET RODANDO');
});










const serverRes = net.createServer((socket) => {
    let buffer = Buffer.alloc(0);
    socket.on('data', async (chunk) => {
        buffer = Buffer.concat([buffer, chunk]);
        if (buffer.toString().endsWith('\n')) {
            const dataRes = JSON.parse(buffer.slice(0, -1).toString())
            let ret = { 'send': true, res: {} };

            if ((dataRes.reqRes == 'res') && (dataRes.url == 'http://18.119.140.20:8888/get/OLA') || (dataRes.host == 'jsonformatter.org')) {
                ret['res']['body'] = dataRes.body.replace(/sucedida/g, 'AAAAAAAA');
                ret['res']['headers'] = dataRes.headers;
                ret['res']['host'] = dataRes.host;
                ret['res']['status'] = dataRes.status;
                ret['res']['compress'] = dataRes.compress;
                //ret['res']['type'] = dataRes.type;
                //console.log(ret)
                //console.log(JSON.stringify(ret))
                //console.log(`MODIFICADO | ${req.method} ${req.url}\n${req.body}`);
                console.log('RODANDO JS')
            }
            //console.log(JSON.stringify(ret).length, dataRes.host)
            //ret['res']['body'] = dataRes.body;
            //ret['res']['host'] = dataRes.host;

            buffer = Buffer.alloc(0); // LIMPAR O BUFFER
            socket.write(Buffer.from(JSON.stringify(ret)));
        }
    });
});
serverRes.listen((port + 1), () => { });
















// const serverRes = net.createServer((socket) => {
//     let receivedData = '';
//     socket.on('data', (data) => {
//         const dataString = data.toString();
//         if (dataString.endsWith('\n')) {
//             receivedData += dataString.slice(0, -1);
//             let ret = { 'send': true } // 'send': se deve enviar ou nao a req
//             const res = JSON.parse(receivedData);
//             const msg = { 'caracteres': receivedData.length, 'bytes': Buffer.byteLength(receivedData) }
//             //console.log('RES', msg);

//             if ((res.type == 'res') && (res.url == 'https://ntfy.sh/')) {
//                 res.body = res.body.replace(/CASA/g, 'AAAAAAAA');
//                 ret['res'] = res;
//                 console.log(`MODIFICADO | ${res.method} ${res.url}\n${res.body}`);
//             }

//             receivedData = '';
//         } else {
//             receivedData += dataString;
//         }
//     });
// });
// serverRes.listen((port + 1), () => {
//     //console.log('SERVIDOR SOCKET RODANDO');
// });