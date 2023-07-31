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
import sys
import psutil
import time
import re


def console(*args):
    msg = ' '.join(str(arg) for arg in args)
    print(msg)
    if (console.counter + 1) % 100 == 0:
        os.system('cls' if os.name == 'nt' else 'clear')
        print('CONSOLE LIMPO!')
    console.counter += 1


console.counter = 0


def rgxMat(a, b):
    c = re.escape(b).replace(r'\*', '.*')
    return re.match(f"^{c}$", a) is not None


port = 3000
sockPri = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
sockReq = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
sockRes = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

try:
    sockPri.connect(('127.0.0.1', (port)))
    sockReq.connect(('127.0.0.1', (port+1)))
    sockRes.connect(('127.0.0.1', (port+2)))
    send_data = b''
    sockPri.sendall(send_data)
    dataPri = sockPri.recv(99999).decode('utf-8')
    sockPri.close()
except Exception as e:
    console('ERRO AO SE CONECTAR NO SOCKET JS 1')
infPri = json.loads(dataPri)
buffer = infPri['buffer']
arrUrl = infPri['arrUrl']


def request(flow: http.HTTPFlow) -> None:  # ################ REQUEST
    regex = next((m for m in arrUrl if rgxMat(flow.request.url, m)), None)
    if regex is not None:
        content = None
        objReq = None
        if not flow.request.content:
            reqBody, typeOk, compress = 'NULL', 'utf-8', 'NULL'
        else:
            type1 = flow.request.headers.get("Content-Type")
            if type1 and ";" in type1:
                try:
                    typeOk = type1.split("; ")[1].split("=")[1]
                except Exception as e:
                    typeOk = 'utf-8'
            else:
                typeOk = 'utf-8'
            compress = flow.request.headers.get(
                'content-encoding', '').lower()
            if 'gzip' in compress:
                try:
                    gzipped_content = io.BytesIO(flow.request.content)
                    decompressed_content = gzip.GzipFile(
                        fileobj=gzipped_content).read()
                    reqBody = decompressed_content.decode(typeOk)
                except Exception as e:
                    reqBody = flow.request.content.decode(
                        'utf-8', errors='ignore')
            elif 'deflate' in compress:
                try:
                    decompressed_content = zlib.decompress(
                        flow.request.content, wbits=zlib.MAX_WBITS | 16)
                    reqBody = decompressed_content.decode(typeOk)
                except Exception as e:
                    reqBody = flow.request.content.decode(
                        'utf-8', errors='ignore')
            elif 'br' in compress:
                try:
                    decoded_data = brotli.decompress(flow.request.content)
                    reqBody = decoded_data.decode(typeOk)
                except Exception as e:
                    reqBody = flow.request.content.decode(
                        'utf-8', errors='ignore')
            else:
                compress = 'NULL'
                try:
                    reqBody = flow.request.content.decode(
                        typeOk, errors='ignore')
                except Exception as e:
                    reqBody = flow.request.content.decode(
                        'utf-8', errors='ignore')
        objReq = {
            'reqRes': 'req',
            'method': flow.request.method,
            'host': urlparse(flow.request.url).hostname,
            'url': flow.request.url,
            'headers': dict(flow.request.headers),
            'body': reqBody,
            'compress': compress,
            'type': typeOk
        }
        # SOCKET REQUISICAO [SEND]
        try:
            sendSockReq = json.dumps(objReq)
            sendB64Req = base64.b64encode(sendSockReq.encode('utf-8'))
            for i in range(0, len(sendB64Req), buffer):
                part = sendB64Req[i:i+buffer]
                sent = sockReq.send(part)
            sockReq.send('#fim#'.encode('utf-8'))
            # console('SOCKET REQUISICAO [SEND]: OK')
        except Exception as e:
            console('SOCKET REQUISICAO [SEND]: ERRO', e)
            raise
        # SOCKET REQUISICAO [GET]
        try:
            getSockReq = ''
            while True:
                chunk = sockReq.recv(buffer)
                getSockReq += chunk.decode()
                if '#fim#' in getSockReq:
                    getSockReq = getSockReq.split('#fim#')[0].rstrip()
                    break
            # console('SOCKET RESPONSE [GET]: OK')
            dataReq = json.loads(base64.b64decode(
                getSockReq).decode('utf-8'))
            if dataReq:
                retReq = None
                try:
                    retReq = dataReq
                    if retReq.get('send', True):
                        if len(retReq['res']) > 1:
                            newReq = {
                                # EDITAVEL: NAO
                                'reqRes': retReq.get('res', {}).get('reqRes'),
                                'method': retReq.get('res', {}).get('method'),
                                'host': retReq.get('res', {}).get('host'),
                                'url': retReq.get('res', {}).get('url'),
                                # EDITAVEL: SIM
                                'headers': retReq.get('res', {}).get('headers'),
                                'body': retReq.get('res', {}).get('body'),
                                # EDITAVEL: SIM (pelo header)
                                'compress': retReq.get('res', {}).get('compress'),
                                'type': retReq.get('res', {}).get('type'),
                            }

                            if newReq['headers']:
                                for key in newReq['headers']:
                                    flow.request.headers[key] = newReq['headers'][key]

                            if newReq['body']:
                                flow.request.content = str.encode(
                                    newReq['body'])

                            console(
                                "########### REQ ALTERADA ###########")
                    else:
                        console(
                            "########### REQ CANCELADA ###########")
                        flow.kill()
                except Exception as e:
                    console('ALTERAR/CANCELAR REQ: ERRO', e)
                    flow.kill()
                    raise
        except Exception as e:
            console('SOCKET REQ [GET]: ERRO', e)
            flow.kill()
            raise
    else:
        # console('OUTRO URL REQ |', urlparse(flow.request.url).hostname)
        pass


def response(flow: http.HTTPFlow) -> None:  # ################ RESPONSE
    regex = next((m for m in arrUrl if regex(flow.request.url, m)), None)
    if regex is not None:
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
        # SOCKET RESPONSE [SEND]
        try:
            sendSockRes = json.dumps(objRes)
            sendB64Res = base64.b64encode(sendSockRes.encode('utf-8'))
            for i in range(0, len(sendB64Res), buffer):
                part = sendB64Res[i:i+buffer]
                sent = sockRes.send(part)
            sockRes.send('#fim#'.encode('utf-8'))
            # console('SOCKET RESPONSE [SEND]: OK')
        except Exception as e:
            console('SOCKET RESPONSE [SEND]: ERRO', e)
            pass
        # SOCKET RESPONSE [GET]
        try:
            getSockRes = ''
            while True:
                chunk = sockRes.recv(buffer)
                getSockRes += chunk.decode()
                if '#fim#' in getSockRes:
                    getSockRes = getSockRes.split('#fim#')[0].rstrip()
                    break
            # console('SOCKET RESPONSE [GET]: OK')
            dataRes = json.loads(base64.b64decode(
                getSockRes).decode('utf-8'))
            if dataRes:
                retRes = None
                try:
                    retRes = dataRes
                    if retRes.get('send', True):
                        if len(retRes['res']) > 1:
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
                            console(
                                "########### RES ALTERADO ###########")
                    else:
                        console("########### RES CANCELADO ###########")
                        flow.kill()
                except Exception as e:
                    console('ALTERAR/CANCELAR RES: ERRO', e)
                    flow.kill()
        except Exception as e:
            console('SOCKET RES [GET]: ERRO', e)
            flow.kill()
    else:
        # console('OUTRO URL RES |', urlparse(flow.request.url).hostname)
        pass


# ##################################################
os.system('cls' if os.name == 'nt' else 'clear')
time.sleep(0.3)
console('MITMPROXY RODANDO')
