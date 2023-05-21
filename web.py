import asyncio
import websockets

async def handle_client(websocket, path):
    # Lida com a conexão de um cliente
    # Aqui você pode adicionar a lógica personalizada para lidar com as mensagens recebidas

    while True:
        message = await websocket.recv()
        print(f"Recebido: {message}")

        # Aqui você pode adicionar a lógica personalizada para responder ao cliente

async def start_server():
    # Configura o servidor WebSocket
    server = await websockets.serve(handle_client, '0.0.0.0', 8000)

    # Imprime o endereço IP externo do PC
    external_ip = '177.58.50.137'  # Substitua pelo seu IP externo real
    print(f"Servidor WebSocket iniciado em ws://{external_ip}:8000")

    # Aguarda a finalização do servidor
    await server.wait_closed()

# Inicia o loop de eventos assíncrono
asyncio.get_event_loop().run_until_complete(start_server())
asyncio.get_event_loop().run_forever()
