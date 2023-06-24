from mitmproxy import http
import json
import socket

port = 3000

def request(flow: http.HTTPFlow) -> None:
    try:
        body = flow.request.content.decode('utf-8')
    except UnicodeDecodeError:
        body = ''
        # print(f"ERR PY [1] - {flow.request.url}") # ERRO utf-8
    data_request = {
        'method': flow.request.method,
        'url': flow.request.url,
        'headers': dict(flow.request.headers),
        'body': body
    }
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
         try:
             s.connect(('127.0.0.1', port)) # CONECTA AO JS
         except Exception as e:
             print('ERRO AO SE CONECTAR NO SOCKET JS')
             flow.kill() # CANCELAR A REQUISICAO
             return
         s.sendall(json.dumps(data_request).encode()) # ENVIA OS DADOS
         dataReq = s.recv(9024) # AGUARDA ATE QUE NO MAXIMO 1024KB SEJAM RECEBIDOS
         if dataReq:
             retRequest = None             
             try:                 
                 retRequest = json.loads(dataReq.decode())
                 if retRequest.get('send', True):
                     if 'res' in retRequest:                         
                        new_request = {
                         'method': retRequest.get('res', {}).get('method'),
                         'url': retRequest.get('res', {}).get('url'),
                         'headers': retRequest.get('res', {}).get('headers', {}),
                         'body': retRequest.get('res', {}).get('body')
                     }
                        flow.request.method = new_request['method']
                        flow.request.url = new_request['url']                 
                        for key in new_request['headers']:
                            flow.request.headers[key] = new_request['headers'][key]
                        flow.request.content = str.encode(new_request['body'])
                        print('##################### REQ ALTERADA #####################')
                 else:
                      print('##################### REQ CANCELADA #####################')
                      flow.kill()
             except json.JSONDecodeError as e:
                  print(f"ERR PY [2] - {flow.request.url}") # ERRO JSON
                 
def response(flow: http.HTTPFlow) -> None:
     pass

print("MITMPROXY PORTA:", port)