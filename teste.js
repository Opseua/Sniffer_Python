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
        }, 3000);
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