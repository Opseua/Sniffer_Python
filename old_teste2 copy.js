import net from 'net';
const port = 3000;

const { addListener, globalObject } = await import('./globalObject.js');



// ################################################## REQUEST
const serverReq = net.createServer((socket1) => {
    socket1.on('error', (err) => { console.error(`ERRO REQ: ${err}`); socket1.destroy(); return });

    socket1.on('data', async (data) => {
        let ret = { 'send': true } // 'send': se deve enviar ou nao a req
        const req = JSON.parse(data.toString());
        // req.url = 'http://18.119.140.20:8888/post'; // ALTERAR url
        // req.method = 'POST'; // ALTERAR metodo
        // req.headers['Teste'] = 'Valor3333'; // ALTERAR header (add)
        // delete req.headers['User-Agent']; // ALTERAR header (remove)
        // req.body = req.body.replace(/CASA/g, 'AAAAAAAA'); // ALTERAR body
        // ret['res'] = req; // ATUALIZAR A REQUISICAO

        if ((req.type == 'req') && (req.url == 'https://ntfy.sh/') && (req.method == 'PUT')) {
            req.body = req.body.replace(/CASA/g, 'AAAAAAAA');
            ret['res'] = req;
            // ret['send'] = false;
            console.log(`MODIFICADO | ${req.method} ${req.url}\n${req.body}`);
        }

        if ((req.type == 'req') && (req.url == 'http://18.119.140.20:8888/get/OLA')) {
            req.url = 'http://18.119.140.20:8888/get/OLAaaaaa'; // ALTERAR url
            //req.method = 'POST'; // ALTERAR metodo
            delete req.headers['User-Agent']; // ALTERAR header (add)
            req.headers['Teste'] = 'Valor3333'; // ALTERAR header (remove)
            //req.body = 'ola'; // ALTERAR body

            ret['res'] = req;
            console.log(req)
            // console.log(`MODIFICADO | ${req.method} ${req.url}\n${JSON.stringify(req.headers)}`);
        }


        socket1.write(JSON.stringify(ret));
    });
});

serverReq.on('listening', () => {
    console.log("AGUARDANDO PYTHON");
});
serverReq.listen(port, '127.0.0.1');








// ################################################## RESPONSE
const serverRes = net.createServer((socket) => {
    //socket.on('error', (err) => { console.error(`ERRO RES: ${err}`); socket.destroy(); return });

    socket.on('data', (data) => {
        const res = data.toString()
        globalObject.inf = res;
        // const res = data.toString();
        // //console.log(res)
        // const now = new Date();
        // const timestamp = now.getTime();
        // const fileName = `z_${timestamp}.json`;
        // fs.writeFile(fileName, res, function (err) {
        //     if (err) {
        //         console.log(`Erro ao gravar arquivo: ${fileName}`);
        //     }
        // });


    });
});


serverRes.on('listening', () => {
});
serverRes.listen((port + 1), '127.0.0.1');

