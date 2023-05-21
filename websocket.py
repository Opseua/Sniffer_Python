import asyncio
import websockets

# Lista para armazenar todas as conexões ativas
conexoes = set()

# Função que será chamada sempre que uma nova conexão for estabelecida
async def handler(websocket, path):
    # Adicionar a nova conexão à lista de conexões
    conexoes.add(websocket)

    # Exibir mensagem de conexão bem-sucedida
    print("NOVA CONEXAO!")

    try:
        while True:
            mensagem = await websocket.recv()
            print("→ " + mensagem)

            # Enviar a mensagem para todos os clientes conectados
            await enviar_para_todos(mensagem)
    except websockets.exceptions.ConnectionClosed:
        print("CONEXAO ENCERRADA!")

        # Remover a conexão da lista de conexões quando ela for fechada
        conexoes.remove(websocket)

# Função para enviar uma mensagem para todos os clientes conectados
async def enviar_para_todos(mensagem):
    if conexoes:
        await asyncio.gather(*[conexao.send(mensagem) for conexao in conexoes])

# Função principal para iniciar o servidor WebSocket
async def main():
    servidor = await websockets.serve(handler, 'localhost', 8887)

    print("RODANDO NA PORTA: 8887")

    # Enviar uma mensagem de teste após 5 segundos
    await asyncio.sleep(20)
    await enviar_para_todos("Mensagem de teste")

    await servidor.wait_closed()

# Execução principal
asyncio.run(main())
