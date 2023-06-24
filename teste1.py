from mitmproxy import http
from urllib.parse import urlparse
import json
import socket
import base64
from datetime import datetime
import io
import gzip
import brotli
import zlib

port = 3000

sockReq = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
sockRes = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

try:  # CONECTA AO JS
    sockReq.connect(('127.0.0.1', port))
    sockRes.connect(('127.0.0.1', (port+1)))
except Exception as e:
    print('ERRO AO SE CONECTAR NO SOCKET JS 1')


def request(flow: http.HTTPFlow) -> None:
    pass
    # if not flow.request.content:
    #     reqBody = 'undefined'
    # else:
    #     try:
    #         reqBody = flow.request.content.decode('utf-8')
    #     except UnicodeDecodeError:
    #         reqBody = 'undefined'
    #         print(f"ERR PY [1]") # ERRO utf-8
    # data_request = {
    #     'type':'req',
    #     'method': flow.request.method,
    #     'url': flow.request.url,
    #     'headers': dict(flow.request.headers),
    #     'body': reqBody
    # }
    # if not isinstance(data_request.get("body"), str):
    #      data_request["body"] ="undefined"
    # try:
    #      json_data = json.dumps(data_request)
    #      max_size = 1024 * 1024 # 1024KB
    #      for i in range(0, len(json_data), max_size):
    #          part=json_data[i:i+max_size]
    #          if i + len(part) >= len(json_data):
    #              part += '\n'
    #              last_part=True
    #          else:
    #             last_part=False
    #          sockReq.sendall(part.encode())
    #      dataReq = sockReq.recv(9024) # AGUARDA ATE QUE NO MAXIMO 1024KB SEJAM RECEBIDOS
    #      if dataReq:
    #          retRequest=None
    #          try:
    #              retRequest=json.loads(dataReq.decode())
    #              if retRequest.get('send', True):
    #                  if 'res' in retRequest:
    #                     new_request={
    #                         'method':retRequest.get('res', {}).get('method'),
    #                         'url':retRequest.get('res', {}).get('url'),
    #                         'headers':retRequest.get('res', {}).get('headers', {}),
    #                         'body':retRequest.get('res', {}).get('body')
    #                     }
    #                     flow.request.method=new_request['method']
    #                     flow.request.url=new_request['url']
    #                     flow.request.content=str.encode(new_request['body'])
    #                     for key in new_request['headers']:
    #                             flow.request.headers[key]=new_request['headers'][key]
    #                     print("##################### REQ ALTERADA #####################")
    #              else:
    #                   print("##################### REQ CANCELADA #####################")
    #                   flow.kill()
    #          except json.JSONDecodeError as e:
    #               print(f"ERR PY [2]") # ERRO JSON
    # except Exception as e:
    #      print(f'ERRO AO ENVIAR DADOS PARA O SOCKET JS 1')
    #      flow.kill()  # CANCELA A REQ


# def response(flow: http.HTTPFlow) -> None:
#     if not isinstance(flow.response.content, bytes):
#         resBody="undefined"
#     else:
#         try:
#             resBody=flow.response.content.decode("utf-8")
#         except UnicodeDecodeError as e:
#             resBody="undefined"
#             print(f"ERR PY [3]")
#     data_response={
#         "type":"req",
#         "status":flow.response.status_code,
#         "headers":dict(flow.response.headers),
#         "method":flow.request.method,
#         "url":flow.request.url,
#         "body":resBody
#     }
#     if not isinstance(data_response.get("body"), str):
#          data_response["body"] ="undefined"
#     json_data = json.dumps(data_response)
#     max_size = 1024 * 1024 #2KB
#     for i in range(0, len(json_data), max_size):
#              part=json_data[i:i+max_size]
#              if i + len(part) >= len(json_data):
#                  part += '\n'
#                  last_part=True
#              else:
#                 last_part=False
#              sockRes.sendall(part.encode())


def response(flow: http.HTTPFlow) -> None:
    content = None
    if not flow.response.content:
        resBody, typeOk, compress = 'null', 'utf-8', 'null'
    else:
        type1 = flow.response.headers.get("Content-Type")
        if type1 and ";" in type1:
            typeOk = type1.split("; ")[1].split("=")[1]
        else:
            typeOk = 'utf-8'
        compress = flow.response.headers.get('content-encoding', '').lower()
        if 'gzip' in compress:
            try:
                gzipped_content = io.BytesIO(flow.response.content)
                decompressed_content = gzip.GzipFile(
                    fileobj=gzipped_content).read()
                resBody = decompressed_content.decode(typeOk)
            except (UnicodeDecodeError, OSError, gzip.BadGzipFile):
                resBody = flow.response.content.decode(
                    'utf-8', errors='ignore')
        elif 'deflate' in compress:
            try:
                decompressed_content = zlib.decompress(
                    flow.response.content, wbits=zlib.MAX_WBITS | 16)
                resBody = decompressed_content.decode(typeOk)
            except Exception as e:
                resBody = flow.response.content.decode(
                    'utf-8', errors='ignore')
        elif 'br' in compress:
            try:
                decoded_data = brotli.decompress(flow.response.content)
                resBody = decoded_data.decode(typeOk)
            except Exception as e:
                resBody = flow.response.content.decode(
                    'utf-8', errors='ignore')
        else:
            compress = 'null'
            try:
                resBody = flow.response.content.decode(typeOk, errors='ignore')
            except Exception as e:
                resBody = flow.response.content.decode(
                    'utf-8', errors='ignore')

    data_response = {
        'type': 'res',
        'method': flow.request.method,
        'host': urlparse(flow.request.url).hostname,
        'url': flow.request.url,
        'headers': dict(flow.response.headers),
        'body': resBody,
        'compress': compress,
        'type': typeOk,
        'status': flow.response.status_code
    }

    if not data_response['host'] == '18.119.140.20':
        print('ANTES→', data_response['body'])
        print('ANTES→ compress:', data_response['compress'], 'status:',
              data_response['status'], 'type:', data_response['type'], '|', data_response['host'])

    try:
        jsonRes = json.dumps(data_response)
        maxRes = 1024 * 1024  # 1024KB
        for i in range(0, len(jsonRes), maxRes):
            partRes = jsonRes[i:i + maxRes]
            if i + len(partRes) >= len(jsonRes):
                partRes += '\n'
                lastRes = True
            else:
                lastRes = False
            sockRes.sendall(partRes.encode())
            dataRes = sockRes.recv(999999)
            if dataRes:
                retResponse = None
                try:
                    retResponse = json.loads(dataRes.decode())
                    if retResponse.get('send', True):
                        if len(retResponse['res']) > 0:
                            new_response = {
                                'type': retResponse.get('res', {}).get('type'),
                                'method': retResponse.get('res', {}).get('method'),
                                'host': retResponse.get('res', {}).get('host'),
                                'url': retResponse.get('res', {}).get('url'),
                                'headers': retResponse.get('res', {}).get('headers'),
                                'body': retResponse.get('res', {}).get('body'),
                                'status': retResponse.get('res', {}).get('status')
                            }
                            print('ok')
                            print('DEPOIS→', new_response.get('body'))

                            # if retResponse['host'] == '18.119.140.20':
                            #     print('ANTES→', retResponse['body'])
                            #     print('ANTES→', retResponse['status'], '|', retResponse['host'])
                        # new_response = {
                        #     "body": retResponse.get('res', {}).get('body'),
                        #     "status": retResponse.get('res', {}).get("status", data_response['status']),
                        #     "headers": retResponse.get('res', {}).get("headers", data_response['headers'])
                        # }
                        # # print('aaaa')

                        # flow.response.status_code = new_response['status']
                        # for key in new_response['headers']:
                        #     flow.response.headers[key] = new_response['headers'][key]
                        # if retResponse.get('body'):
                        #     flow.response.content = str.encode(
                        #         new_response['body'])
                        #     print(new_response['body'])
                        # print(
                        #     "##################### RES ALTERADA #####################")

                    else:
                        print(
                            "##################### RES CANCELADA #####################")
                        flow.kill()
                except json.JSONDecodeError as e:
                    print(f"ERR PY [2]")  # ERRO JSON

    except Exception as e:
        print(f'ERRO AO ENVIAR DADOS PARA O SOCKET JS 1')
        flow.kill()


print("MITMPROXY PORTA:", port)
