import net from 'net'

// Cria servidor TCP que aguarda conexões na porta 8888
const server = net.createServer((socket) => {
    let getSockRes = '';
    socket.on('data', (chunk) => {
        getSockRes += chunk.toString();
        if (getSockRes.endsWith('#fim#')) {
            getSockRes = getSockRes.split("#fim#")[0];
            console.log(getSockRes);


            const sendSockRes = 'b'.repeat(100);
            const sendB64Res = Buffer.from(sendSockRes).toString('base64');
            console.log(sendB64Res);
            const buffer = 500;
            for (let i = 0; i < sendB64Res.length; i += buffer) {
                const part = sendB64Res.slice(i, i + buffer);
                socket.write(part);
            }
            socket.write('#fim#');




            getSockRes = '';
        }
    });
});

server.listen(8888, () => {
    console.log('Servidor ouvindo na porta 8888...');
});