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
import os


def console(*args):
    msg = ' '.join(str(arg) for arg in args)
    print(msg)
    if (console.counter + 1) % 100 == 0:
        os.system('cls' if os.name == 'nt' else 'clear')
        print('CONSOLE LIMPO!')
    console.counter += 1


console.counter = 0

port = 3000
sockPri = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
sockReq = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
sockRes = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

try:
    sockPri.connect(('127.0.0.1', port))
    # sockReq.connect(('127.0.0.1', (port+1)))
    sockRes.connect(('127.0.0.1', (port+2)))
    send_data = b''
    sockPri.sendall(send_data)
    dataPri = sockPri.recv(1024).decode('utf-8')
    sockPri.close()
except Exception as e:
    console('ERRO AO SE CONECTAR NO SOCKET JS 1')
infPri = json.loads(dataPri)
arrHost = infPri['host']
arrUrl = infPri['url']
buffer = infPri['buffer']

def request(flow: http.HTTPFlow) -> None:
    pass
    # if not flow.request.content:
    #     reqBody = 'undefined'
    # else:
    #     try:
    #         reqBody = flow.request.content.decode('utf-8')
    #     except UnicodeDecodeError:
    #         reqBody = 'undefined'
    #         console(f"ERR PY [1]") # ERRO utf-8
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
    #                     console("##################### REQ ALTERADA #####################")
    #              else:
    #                   console("##################### REQ CANCELADA #####################")
    #                   flow.kill()
    #          except json.JSONDecodeError as e:
    #               console(f"ERR PY [2]") # ERRO JSON
    # except Exception as e:
    #      console(f'ERRO AO ENVIAR DADOS PARA O SOCKET JS 1')
    #      flow.kill()  # CANCELA A REQ


# def response(flow: http.HTTPFlow) -> None:
#     if not isinstance(flow.response.content, bytes):
#         resBody="undefined"
#     else:
#         try:
#             resBody=flow.response.content.decode("utf-8")
#         except UnicodeDecodeError as e:
#             resBody="undefined"
#             console(f"ERR PY [3]")
#     objRes={
#         "type":"req",
#         "status":flow.response.status_code,
#         "headers":dict(flow.response.headers),
#         "method":flow.request.method,
#         "url":flow.request.url,
#         "body":resBody
#     }
#     if not isinstance(objRes.get("body"), str):
#          objRes["body"] ="undefined"
#     json_data = json.dumps(objRes)
#     max_size = 1024 * 1024 #2KB
#     for i in range(0, len(json_data), max_size):
#              part=json_data[i:i+max_size]
#              if i + len(part) >= len(json_data):
#                  part += '\n'
#                  last_part=True
#              else:
#                 last_part=False
#              sockRes.sendall(part.encode())


# def response(flow: http.HTTPFlow) -> None:
#     if not flow.response.content:
#         resBody, typeOk, compress = 'NULL', 'utf-8', 'NULL'
#     else:
#         type1 = flow.response.headers.get("Content-Type")
#         if type1 and ";" in type1:
#             typeOk = type1.split("; ")[1].split("=")[1]
#         else:
#             typeOk = 'utf-8'

#         compress = flow.response.headers.get('content-encoding', '').lower()
#         content = flow.response.content

#         if 'gzip' in compress:
#             try:
#                 gzipped_content = io.BytesIO(content)
#                 decompressed_content = gzip.GzipFile(fileobj=gzipped_content).read()
#                 resBody = decompressed_content.decode(typeOk)
#             except:
#                 resBody = content.decode('utf-8', errors='ignore')
#         elif 'deflate' in compress:
#             try:
#                 decompressed_content = zlib.decompress(content, wbits=zlib.MAX_WBITS | 16)
#                 resBody = decompressed_content.decode(typeOk)
#             except:
#                 resBody = content.decode('utf-8', errors='ignore')
#         elif 'br' in compress:
#             try:
#                 decoded_data = brotli.decompress(content)
#                 resBody = decoded_data.decode(typeOk)
#             except:
#                 resBody = content.decode('utf-8', errors='ignore')
#         else:
#             compress = 'NULL'
#             try:
#                 resBody = content.decode(typeOk, errors='ignore')
#             except:
#                 resBody = content.decode('utf-8', errors='ignore')

#     objRes = {
#         'reqRes': 'res',
#         'method': flow.request.method,
#         'host': urlparse(flow.request.url).hostname,
#         'url': flow.request.url,
#         'headers': dict(flow.response.headers),
#         'body': resBody,
#         'compress': compress,
#         'type': typeOk,
#         'status': flow.response.status_code
#     }

#     if objRes['host'] != '18.119.140.20' and objRes['host'] != 'jsonformatter.org':
#         console('ANTES→ compress:', objRes['compress'], '| status:', objRes['status'], '| type:', objRes['type'], '|', objRes['host'])

#     try:
#         jsonRes = json.dumps(objRes)
#         maxRes = 1024 * 1024  # 1024KB
#         partsRes = [jsonRes[i:i + maxRes] for i in range(0, len(jsonRes), maxRes)]

#         for partRes in partsRes:
#             if partsRes[-1] == partRes:
#                 partRes += '\n'
#                 lastRes = True
#             else:
#                 lastRes = False
#             sockRes.sendall(partRes.encode())

#         dataRes = sockRes.recv(1024)

#         if dataRes:
#             retRes = None
#             try:
#                 retRes = json.loads(dataRes.decode())

#                 if retRes.get('send', True):
#                     if len(retRes['res']) > 0:
#                         newRes = {
#                             'reqRes': retRes.get('res', {}).get('reqRes'),
#                             'method': retRes.get('res', {}).get('method'),
#                             'host': retRes.get('res', {}).get('host'),
#                             'url': retRes.get('res', {}).get('url'),
#                             'headers': retRes.get('res', {}).get('headers'),
#                             'body': retRes.get('res', {}).get('body'),
#                             'status': retRes.get('res', {}).get('status'),
#                             'compress': retRes.get('res', {}).get('compress'),
#                             'type': retRes.get('res', {}).get('type'),
#                         }

#                         console('DEPOIS→ compress:', newRes.get('compress'), '| status:', newRes['status'], '| type:', newRes['type'], '|', newRes['host'])

#                         if newRes['headers']:
#                             for key in newRes['headers']:
#                                 flow.response.headers[key] = newRes['headers'][key]

#                         if newRes['body']:
#                             flow.response.content = str.encode(newRes['body'])

#                         if newRes['status']:
#                             flow.response.status_code = newRes['status']

#                         console("########### RES ALTERADA ###########")
#                     else:
#                         console("########### RES CANCELADA ###########")
#                         flow.kill()
#             except:
#                 console(f"ERR PY [2]")  # ERRO JSON
#     except:
#         console(f'ERRO AO ENVIAR DADOS PARA O SOCKET JS 1')
#         flow.kill()


# os.system('cls' if os.name == 'nt' else 'clear')
# console("MITMPROXY PORTA:", port)


def response(flow: http.HTTPFlow) -> None:
    if urlparse(flow.request.url).hostname in arrHost or flow.request.url in arrUrl:
        content = None
        objRes = None
        if not flow.response.content:
            resBody, typeOk, compress = 'NULL', 'utf-8', 'NULL'
        else:
            type1 = flow.response.headers.get("Content-Type")
            if type1 and ";" in type1:
                try:
                    typeOk = type1.split("; ")[1].split("=")[1]
                except Exception as e:
                    typeOk = 'utf-8'
            else:
                typeOk = 'utf-8'
            compress = flow.response.headers.get(
                'content-encoding', '').lower()
            if 'gzip' in compress:
                try:
                    gzipped_content = io.BytesIO(flow.response.content)
                    decompressed_content = gzip.GzipFile(
                        fileobj=gzipped_content).read()
                    resBody = decompressed_content.decode(typeOk)
                except Exception as e:
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
                compress = 'NULL'
                try:
                    resBody = flow.response.content.decode(
                        typeOk, errors='ignore')
                except Exception as e:
                    resBody = flow.response.content.decode(
                        'utf-8', errors='ignore')
        objRes = {
            'reqRes': 'res',
            'method': flow.request.method,
            'host': urlparse(flow.request.url).hostname,
            'url': flow.request.url,
            'headers': dict(flow.response.headers),
            'body': resBody,
            'compress': compress,
            'type': typeOk,
            'status': flow.response.status_code
        }
        # SOCKET RES [SEND]
        try:
            sendSockRes = json.dumps(objRes)
            sendB64Res = base64.b64encode(sendSockRes.encode('utf-8'))
            for i in range(0, len(sendB64Res), buffer):
                part = sendB64Res[i:i+buffer]
                sent = sockRes.send(part)
            sockRes.send('#fim#'.encode('utf-8'))
            #console('SOCKET RES [SEND]: OK')
        except Exception as e:
            #console('SOCKET RES [SEND]: ERRO',e)
            pass
        # SOCKET RES [GET]
        try:
            getSockRes = ''
            while True:
                chunk = sockRes.recv(buffer)
                getSockRes += chunk.decode()
                if '#fim#' in getSockRes:
                    getSockRes = getSockRes.split('#fim#')[0].rstrip()
                    break
            #console('SOCKET RES [GET]: OK')
            dataRes = json.loads(base64.b64decode(getSockRes).decode('utf-8')) 
            if dataRes:
                retRes = None
                try:
                    retRes = dataRes
                    if retRes.get('send', True):
                        if len(retRes['res']) > 0:
                            newRes = {
                                # EDITAVEL: NAO
                                'reqRes': retRes.get('res', {}).get('reqRes'),
                                'method': retRes.get('res', {}).get('method'),
                                'host': retRes.get('res', {}).get('host'),
                                'url': retRes.get('res', {}).get('url'),
                                # EDITAVEL: SIM
                                'headers': retRes.get('res', {}).get('headers'),
                                'body': retRes.get('res', {}).get('body'),
                                'status': retRes.get('res', {}).get('status'),
                                # EDITAVEL: SIM (pelo header)
                                'compress': retRes.get('res', {}).get('compress'),
                                'type': retRes.get('res', {}).get('type'),
                            }

                            if newRes['headers']:
                                for key in newRes['headers']:
                                    flow.response.headers[key] = newRes['headers'][key]

                            if newRes['body']:
                                flow.response.content = str.encode(
                                    newRes['body'])

                            if newRes['status']:
                                flow.response.status_code = newRes['status']

                            console("########### RES ALTERADA ###########")
                    else:
                        console("########### RES CANCELADA ###########")
                        flow.kill()
                except Exception as e:
                    console('ALTERAR/CANCELAR REQUISICAO: ERRO',e)
                    flow.kill()
        except Exception as e:
            console('SOCKET RES [GET]: ERRO',e)
            flow.kill()
    else:
        # console('OUTRO HOST/URL |', urlparse(flow.request.url).hostname)
        pass


# os.system('cls' if os.name == 'nt' else 'clear')
console('\n','MITMPROXY PORTA:', port,'\n')
