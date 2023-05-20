# COMANDO: python server.py --port 8888

import subprocess
from mitmproxy import http, ctx
import argparse

def request(flow: http.HTTPFlow) -> None:
    # Verificar se a requisição possui um corpo
    if flow.request.method != "GET" and flow.request.content:
        # Decodificar o corpo da requisição
        body = flow.request.get_text()
        
        # Verificar se a palavra "CASA" está presente no corpo
        if "CASA" in body:
            # Substituir "CASA" por "AAAAAA"
            modified_body = body.replace("CASA", "AAAAAA")
            
            # Atualizar o corpo da requisição
            flow.request.set_text(modified_body)
            
            # Registrar a substituição
            ctx.log.info("Palavra 'CASA' substituída por 'AAAAAA' na requisição.")
            
def response(flow: http.HTTPFlow) -> None:
    # Log da resposta recebida do servidor
    ctx.log.info("Resposta recebida: %s" % flow.response.status_code)

def main(port):
    # Chamar o script enableProxy.py passando o número da porta como argumento
    subprocess.call(["python", "enableProxy.py", str(port)])

    # Iniciar o servidor mitmproxy e registrar os callbacks
    addons = [
        request,
        response,
    ]

    # Exibir o número da porta no console
    print("Número da porta:", port)
    print("Pressione Ctrl+C para sair.")

    # Iniciar o servidor mitmproxy com a porta especificada
    from mitmproxy.tools.main import mitmdump
    mitmdump(['-p', str(port), '-s', __file__])

if __name__ == '__main__':
    # Configurar o parser de argumentos
    parser = argparse.ArgumentParser()
    parser.add_argument('-p', '--port', type=int, default=8881, help='Número da porta do mitmproxy')
    args = parser.parse_args()

    # Executar o servidor mitmproxy
    main(args.port)
