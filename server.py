import subprocess
from mitmproxy import http, ctx
import argparse
import fnmatch
import json


# Definir os URLs que devem ser interceptados
urls_interceptadas = [
    "https://ntfy.sh/",
    "https://rating.ewoq.google.com/u/0/rpc/rating/AssignmentAcquisitionService/GetNewTasks",
    "*.alguma.com/*"
]

def escreverEmArquivo(texto, caminho_arquivo, modo):
    with open(caminho_arquivo, modo, encoding='utf-8') as arquivo:
        arquivo.write(texto)

def request(flow: http.HTTPFlow) -> None:
    # Verificar se a URL do request corresponde a algum dos URLs especificados
    for url in urls_interceptadas:
        if fnmatch.fnmatch(flow.request.url, url):
            # Converter os headers para o formato JSON
            headers_json = {name: value for name, value in flow.request.headers.items()}
            headers_str = json.dumps(headers_json)

            # Substituir "CASA" por "AAAAAA" no corpo do request
            if flow.request.method != "GET" and flow.request.content:
                # Decodificar o corpo da requisição
                body = flow.request.get_text()

                # Substituir "CASA" por "AAAAAA"
                modified_body = body.replace("CASA", "AAAAAA")

                # Atualizar o corpo da requisição
                flow.request.set_text(modified_body)

                # Registrar a substituição
                ctx.log.info("Palavra 'CASA' substituída por 'AAAAAA' na requisição.")

            # LOG REQUEST
            texto = "############ REQUEST ############\n"
            texto += "URL: " + flow.request.url + "\n"
            texto += "METODO: " + flow.request.method + "\n"
            texto += "HEADERS: " + headers_str + "\n"
            texto += "BODY: " + flow.request.get_text() + "\n\n"
            escreverEmArquivo(texto, "LOG.txt", "a")
            break

def response(flow: http.HTTPFlow) -> None:
    # Verificar se a URL do response corresponde a algum dos URLs especificados
    for url in urls_interceptadas:
        if fnmatch.fnmatch(flow.request.url, url):
            # Converter os headers para o formato JSON
            headers_json = {name: value for name, value in flow.response.headers.items()}
            headers_str = json.dumps(headers_json)

            # Verificar se a resposta possui um corpo
            if flow.response.content:
                # Decodificar o corpo da resposta
                body = flow.response.get_text()

                # Verificar se o corpo tem mais de um caractere
                if len(body) > 1:
                    # LOG RESPONSE
                    texto = "############ RESPONSE ############\n"
                    texto += "URL: " + flow.request.url + "\n"
                    texto += "METODO: " + flow.request.method + "\n"
                    texto += "HEADERS: " + headers_str + "\n"
                    texto += "BODY: " + body + "\n\n"
                    escreverEmArquivo(texto, "LOG.txt", "a")
            break

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
