from mitmproxy import http
from urllib.parse import urlparse
import json
import socket
import base64
from datetime import datetime
port = 3000

sockReq = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
sockRes = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
try:
    sockReq.connect(('127.0.0.1', port)) # CONECTA AO JS
    sockRes.connect(('127.0.0.1', (port+1))) # CONECTA AO JS
except Exception as e:
    print('ERRO AO SE CONECTAR NO SOCKET JS')


def request(flow: http.HTTPFlow) -> None:
    if not flow.request.content:
        reqBody = 'undefined'
    else:
        try:
            reqBody = flow.request.content.decode('utf-8')
        except UnicodeDecodeError:
            reqBody = 'undefined'
            print(f"ERR PY [1]") # ERRO utf-8
    data_request = {
        'type':'req',
        'method': flow.request.method,
        'url': flow.request.url,
        'headers': dict(flow.request.headers),
        'body': reqBody
    }
    
    if not isinstance(data_request.get("body"), str):
         data_request["body"] ="undefined"

    try:
         sockReq.sendall(json.dumps(data_request).encode()) # ENVIA OS DADOS PARA O SERVIDOR SOCKET JS
         dataReq = sockReq.recv(1024) # AGUARDA ATE QUE NO MAXIMO 1024KB SEJAM RECEBIDOS DO SERVIDOR SOCKET JS
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
                  print(f"ERR PY [2]") # ERRO JSON
    except Exception as e:
         print(f'ERRO AO ENVIAR DADOS PARA O SOCKET JS 1')
         flow.kill()  # Cancela a requisição







def response(flow: http.HTTPFlow) -> None:
    if len(flow.response.content) == 0:
        resBody = 'undefined'
    else:
        try:
            resBody = flow.response.content.decode('utf-8')
        except UnicodeDecodeError as e:
            print(f"ERR PY [3]") # ERRO utf-8
            return

    data_response = {
        'type':'res',
        'status': flow.response.status_code,
        'headers': dict(flow.response.headers),
        'method':flow.request.method,
        'url':flow.request.url,
      	'body':resBody     
    }
   
    if not isinstance(data_response.get("body"), str):
          data_response["body"] ="undefined"
        
    try:
         sockRes.sendall(json.dumps(data_response).encode()) # ENVIA OS DADOS PARA O SERVIDOR SOCKET JS
    except Exception as e:
         print(f'ERRO AO ENVIAR DADOS PARA O SOCKET JS 2')

             
print("MITMPROXY PORTA:", port)




