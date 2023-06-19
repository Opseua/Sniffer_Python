const net = require('net');
const port = 3000;

const server = net.createServer((socket) => {
    socket.on('error', (err) => { console.error(`Erro na conexão: ${err}`); socket.destroy(); return });

    socket.on('data', async (data) => {
        let ret = { 'send': true } // 'send': se deve enviar ou nao a req
        const req = JSON.parse(data.toString());
        // req.url = 'http://18.119.140.20:8888/post'; // ALTERAR url
        // req.method = 'POST'; // ALTERAR metodo
        // req.headers['Teste'] = 'Valor3333'; // ALTERAR header (add)
        // delete req.headers['User-Agent']; // ALTERAR header (remove)
        // req.body = req.body.replace(/CASA/g, 'AAAAAAAA'); // ALTERAR body
        // ret['res'] = req; // ATUALIZAR A REQUISICAO

        if ((req.url == 'https://ntfy.sh/') && (req.method == 'PUT')) {
            req.body = req.body.replace(/CASA/g, 'AAAAAAAA');
            ret['res'] = req;
            // ret['send'] = false;
            console.log(`MODIFICADO | ${req.method} ${req.url}\n${req.body}`);
        }

        if ((req.url == 'http://18.119.140.20:8888/get/OLA')) {
            req.url = 'http://18.119.140.20:8888/get/OLAaaaaa'; // ALTERAR url
            //req.method = 'POST'; // ALTERAR metodo
            delete req.headers['User-Agent']; // ALTERAR header (add)
            req.headers['Teste'] = 'Valor3333'; // ALTERAR header (remove)
            //req.body = 'ola'; // ALTERAR body

            ret['res'] = req;
            console.log(req)
            // console.log(`MODIFICADO | ${req.method} ${req.url}\n${JSON.stringify(req.headers)}`);
        }

        
        socket.write(JSON.stringify(ret));
    });
});

server.on('listening', () => {
    console.log("AGUARDANDO PYTHON");
});
server.listen(port, '127.0.0.1');