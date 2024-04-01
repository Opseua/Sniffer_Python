"""IGNORE"""

# pylint: disable=C0103
# pylint: disable=C0301
# pylint: disable=W0621
# pylint: disable=R1732
# pylint: disable=R1702
# pylint: disable=R0914
# pylint: disable=R0915
# pylint: disable=R0912

# 'start.py' e 'sniffer.py'
from urllib.parse import urlparse
import json
import os
import time
import re
import datetime
import locale

# 'sniffer.py'
import base64
import socket
import io
import gzip
import zlib
import subprocess
import brotli
from mitmproxy import http


# LETRA DO TERMINAL
letter = os.path.dirname(os.path.realpath(__file__))[0]
# FORMATAR DATA E HORA NO PADRÃO BRASILEIRO
locale.setlocale(locale.LC_TIME, "pt_BR")

script_dir = os.path.dirname(os.path.abspath(__file__))
full_path = os.path.abspath(os.path.join(script_dir, ""))
full_pathJson = os.path.abspath(
    os.path.join(script_dir, "../../../Chrome_ExtensionOld/src/config.json")
)
config = ""
with open(full_pathJson, "r", encoding="utf-8") as file:
    config = json.load(file)
portSocket = config["sniffer"]["portSocket"]
bufferSocket = config["sniffer"]["bufferSocket"]
bufferSocket = bufferSocket * 1000
arrUrl = config["sniffer"]["arrUrl"]


def console(*args):
    """IGNORE"""
    msg = " ".join(str(arg) for arg in args)
    print(msg)
    if (console.counter + 1) % 100 == 0:
        os.system("cls" if os.name == "nt" else "clear")
        print("CONSOLE LIMPO!\n")
    console.counter += 1


console.counter = 0


def rgxMat(a, b):
    """IGNORE"""
    c = re.escape(b).replace(r"\*", ".*")
    return re.match(f"^{c}$", a) is not None


sockReq = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
sockRes = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

try:
    sockReq.connect(("127.0.0.1", (portSocket)))
    sockRes.connect(("127.0.0.1", (portSocket + 1)))
    send_data = b""
except ImportError as exceptErr:
    err = '"ALERTA: PYTHON sniffer.py" "ERRO AO SE CONECTAR NO SOCKET JS 1"'
    console(err)
    subprocess.Popen(f'"{letter}:/ARQUIVOS/WINDOWS/BAT/notify-send.exe" {err}')

    # DATA E HORA ATUAL
    current_datetime = datetime.datetime.now()
    current_datetimeMon = f"MES_{current_datetime.strftime('%m')}_{current_datetime.strftime('%b').upper()}"
    current_datetimeDay = f"DIA_{current_datetime.strftime('%d')}"
    current_datetimeHou = f"{current_datetime.strftime('%H')}"
    current_datetimeMin = f"{current_datetime.strftime('%M')}"
    current_datetimeSec = f"{current_datetime.strftime('%S')}"
    current_datetimeMil = f"{current_datetime.microsecond // 1000:03d}"
    file_name = f"log/Python/{current_datetimeMon}/{current_datetimeDay}_err.txt"
    os.makedirs(os.path.dirname(file_name), exist_ok=True)
    # SALVAR ERRO NO TXT
    err = f"{current_datetimeHou}.{current_datetimeMin}.{current_datetimeSec}.{current_datetimeMil}\n{err}\n{str(exceptErr)}\n\n"
    with open(file_name, "a", encoding="utf-8") as file:
        file.write(err)


def request(flow: http.HTTPFlow) -> None:  # ################ REQUEST
    """Function printing python version."""
    regex = next((m for m in arrUrl if rgxMat(flow.request.url, m)), None)
    if regex is not None:
        objReq = None
        if not flow.request.content:
            reqBody, typeOk, compress = "NULL", "utf-8", "NULL"
        else:
            type1 = flow.request.headers.get("Content-Type")
            if type1 and ";" in type1:
                try:
                    typeOk = type1.split("; ")[1].split("=")[1]
                except ImportError:
                    typeOk = "utf-8"
            else:
                typeOk = "utf-8"
            compress = flow.request.headers.get("content-encoding", "").lower()
            if "gzip" in compress:
                try:
                    gzipped_content = io.BytesIO(flow.request.content)
                    decompressed_content = gzip.GzipFile(fileobj=gzipped_content).read()
                    reqBody = decompressed_content.decode(typeOk)
                except ImportError:
                    reqBody = flow.request.content.decode("utf-8", errors="ignore")
            elif "deflate" in compress:
                try:
                    decompressed_content = zlib.decompress(
                        flow.request.content, wbits=zlib.MAX_WBITS | 16
                    )
                    reqBody = decompressed_content.decode(typeOk)
                except ImportError:
                    reqBody = flow.request.content.decode("utf-8", errors="ignore")
            elif "br" in compress:
                try:
                    decoded_data = brotli.decompress(flow.request.content)
                    reqBody = decoded_data.decode(typeOk)
                except ImportError:
                    reqBody = flow.request.content.decode("utf-8", errors="ignore")
            else:
                compress = "NULL"
                try:
                    reqBody = flow.request.content.decode(typeOk, errors="ignore")
                except ImportError:
                    reqBody = flow.request.content.decode("utf-8", errors="ignore")
        objReq = {
            "sendGet": "send",
            "method": flow.request.method,
            "host": urlparse(flow.request.url).hostname,
            "url": flow.request.url,
            "headers": dict(flow.request.headers),
            "body": reqBody,
            "compress": compress,
            "type": typeOk,
        }
        # SOCKET REQUISICAO [SEND]
        try:
            sendSockReq = json.dumps(objReq)
            sendB64Req = base64.b64encode(sendSockReq.encode("utf-8"))
            for i in range(0, len(sendB64Req), bufferSocket):
                part = sendB64Req[i : i + bufferSocket]
                sockReq.send(part)
            sockReq.send("#fim#".encode("utf-8"))
            # console('SOCKET REQUISICAO [SEND]: OK')
        except ImportError as exceptErr:
            err = '"ALERTA: PYTHON sniffer.py" "SOCKET REQUISICAO [SEND]: ERRO"'
            console(err)
            subprocess.Popen(f'"{letter}:/ARQUIVOS/WINDOWS/BAT/notify-send.exe" {err}')

            # DATA E HORA ATUAL
            current_datetime = datetime.datetime.now()
            current_datetimeMon = f"MES_{current_datetime.strftime('%m')}_{current_datetime.strftime('%b').upper()}"
            current_datetimeDay = f"DIA_{current_datetime.strftime('%d')}"
            current_datetimeHou = f"{current_datetime.strftime('%H')}"
            current_datetimeMin = f"{current_datetime.strftime('%M')}"
            current_datetimeSec = f"{current_datetime.strftime('%S')}"
            current_datetimeMil = f"{current_datetime.microsecond // 1000:03d}"
            file_name = (
                f"log/Python/{current_datetimeMon}/{current_datetimeDay}_err.txt"
            )
            os.makedirs(os.path.dirname(file_name), exist_ok=True)
            # SALVAR ERRO NO TXT
            err = f"{current_datetimeHou}.{current_datetimeMin}.{current_datetimeSec}.{current_datetimeMil}\n{err}\n{str(exceptErr)}\n\n"
            with open(file_name, "a", encoding="utf-8") as file:
                file.write(err)
            raise
        # SOCKET REQUISICAO [GET]
        try:
            getSockReq = ""
            while True:
                chunk = sockReq.recv(bufferSocket)
                getSockReq += chunk.decode()
                if "#fim#" in getSockReq:
                    getSockReq = getSockReq.split("#fim#")[0].rstrip()
                    break
            # console('SOCKET RESPONSE [GET]: OK')
            dataReq = json.loads(base64.b64decode(getSockReq).decode("utf-8"))
            if dataReq:
                retReq = None
                try:
                    retReq = dataReq
                    if retReq.get("complete", True):
                        if len(retReq["res"]) > 1:
                            newReq = {
                                # EDITAVEL: NAO
                                "sendGet": retReq.get("res", {}).get("sendGet"),
                                "method": retReq.get("res", {}).get("method"),
                                "host": retReq.get("res", {}).get("host"),
                                "url": retReq.get("res", {}).get("url"),
                                # EDITAVEL: SIM
                                "headers": retReq.get("res", {}).get("headers"),
                                "body": retReq.get("res", {}).get("body"),
                                # EDITAVEL: SIM (pelo header)
                                "compress": retReq.get("res", {}).get("compress"),
                                "type": retReq.get("res", {}).get("type"),
                            }
                            if newReq["headers"]:
                                for key in newReq["headers"]:
                                    flow.request.headers[key] = newReq["headers"][key]
                            if newReq["body"]:
                                flow.request.content = str.encode(newReq["body"])
                            console("REQ ALTERADA")
                    else:
                        console("REQ CANCELADA")
                        flow.kill()
                except ImportError as exceptErr:
                    err = '"ALERTA: PYTHON sniffer.py" "ALTERAR/CANCELAR REQ: ERRO"'
                    console(err)
                    subprocess.Popen(
                        f'"{letter}:/ARQUIVOS/WINDOWS/BAT/notify-send.exe" {err}'
                    )

                    # DATA E HORA ATUAL
                    current_datetime = datetime.datetime.now()
                    current_datetimeMon = f"MES_{current_datetime.strftime('%m')}_{current_datetime.strftime('%b').upper()}"
                    current_datetimeDay = f"DIA_{current_datetime.strftime('%d')}"
                    current_datetimeHou = f"{current_datetime.strftime('%H')}"
                    current_datetimeMin = f"{current_datetime.strftime('%M')}"
                    current_datetimeSec = f"{current_datetime.strftime('%S')}"
                    current_datetimeMil = f"{current_datetime.microsecond // 1000:03d}"
                    file_name = f"log/Python/{current_datetimeMon}/{current_datetimeDay}_err.txt"
                    os.makedirs(os.path.dirname(file_name), exist_ok=True)
                    # SALVAR ERRO NO TXT
                    err = f"{current_datetimeHou}.{current_datetimeMin}.{current_datetimeSec}.{current_datetimeMil}\n{err}\n{str(exceptErr)}\n\n"
                    with open(file_name, "a", encoding="utf-8") as file:
                        file.write(err)
                    flow.kill()
                    raise
        except ImportError as exceptErr:
            err = '"ALERTA: PYTHON sniffer.py" "SOCKET REQ [GET]: ERRO"'
            console(err)
            subprocess.Popen(f'"{letter}:/ARQUIVOS/WINDOWS/BAT/notify-send.exe" {err}')

            # DATA E HORA ATUAL
            current_datetime = datetime.datetime.now()
            current_datetimeMon = f"MES_{current_datetime.strftime('%m')}_{current_datetime.strftime('%b').upper()}"
            current_datetimeDay = f"DIA_{current_datetime.strftime('%d')}"
            current_datetimeHou = f"{current_datetime.strftime('%H')}"
            current_datetimeMin = f"{current_datetime.strftime('%M')}"
            current_datetimeSec = f"{current_datetime.strftime('%S')}"
            current_datetimeMil = f"{current_datetime.microsecond // 1000:03d}"
            file_name = (
                f"log/Python/{current_datetimeMon}/{current_datetimeDay}_err.txt"
            )
            os.makedirs(os.path.dirname(file_name), exist_ok=True)
            # SALVAR ERRO NO TXT
            err = f"{current_datetimeHou}.{current_datetimeMin}.{current_datetimeSec}.{current_datetimeMil}\n{err}\n{str(exceptErr)}\n\n"
            with open(file_name, "a", encoding="utf-8") as file:
                file.write(err)
            flow.kill()
            raise
    else:
        # console('OUTRO URL REQ |', urlparse(flow.request.url).hostname)
        pass


def response(flow: http.HTTPFlow) -> None:  # ################ RESPONSE
    """Function printing python version."""
    regex = next((m for m in arrUrl if rgxMat(flow.request.url, m)), None)
    if regex is not None:
        objRes = None
        if not flow.response.content:
            resBody, typeOk, compress = "NULL", "utf-8", "NULL"
        else:
            type1 = flow.response.headers.get("Content-Type")
            if type1 and ";" in type1:
                try:
                    typeOk = type1.split("; ")[1].split("=")[1]
                except ImportError:
                    typeOk = "utf-8"
            else:
                typeOk = "utf-8"
            compress = flow.response.headers.get("content-encoding", "").lower()
            if "gzip" in compress:
                try:
                    gzipped_content = io.BytesIO(flow.response.content)
                    decompressed_content = gzip.GzipFile(fileobj=gzipped_content).read()
                    resBody = decompressed_content.decode(typeOk)
                except ImportError:
                    resBody = flow.response.content.decode("utf-8", errors="ignore")
            elif "deflate" in compress:
                try:
                    decompressed_content = zlib.decompress(
                        flow.response.content, wbits=zlib.MAX_WBITS | 16
                    )
                    resBody = decompressed_content.decode(typeOk)
                except ImportError:
                    resBody = flow.response.content.decode("utf-8", errors="ignore")
            elif "br" in compress:
                try:
                    decoded_data = brotli.decompress(flow.response.content)
                    resBody = decoded_data.decode(typeOk)
                except ImportError:
                    resBody = flow.response.content.decode("utf-8", errors="ignore")
            else:
                compress = "NULL"
                try:
                    resBody = flow.response.content.decode(typeOk, errors="ignore")
                except ImportError:
                    resBody = flow.response.content.decode("utf-8", errors="ignore")
        objRes = {
            "sendGet": "get",
            "method": flow.request.method,
            "host": urlparse(flow.request.url).hostname,
            "url": flow.request.url,
            "headers": dict(flow.response.headers),
            "body": resBody,
            "compress": compress,
            "type": typeOk,
            "status": flow.response.status_code,
        }
        # SOCKET RESPONSE [SEND]
        try:
            sendSockRes = json.dumps(objRes)
            sendB64Res = base64.b64encode(sendSockRes.encode("utf-8"))
            for i in range(0, len(sendB64Res), bufferSocket):
                part = sendB64Res[i : i + bufferSocket]
                sockRes.send(part)
            sockRes.send("#fim#".encode("utf-8"))
            # console('SOCKET RESPONSE [SEND]: OK')
        except ImportError as exceptErr:
            err = '"ALERTA: PYTHON sniffer.py" "SOCKET RESPONSE [SEND]: ERRO"'
            console(err)
            subprocess.Popen(f'"{letter}:/ARQUIVOS/WINDOWS/BAT/notify-send.exe" {err}')

            # DATA E HORA ATUAL
            current_datetime = datetime.datetime.now()
            current_datetimeMon = f"MES_{current_datetime.strftime('%m')}_{current_datetime.strftime('%b').upper()}"
            current_datetimeDay = f"DIA_{current_datetime.strftime('%d')}"
            current_datetimeHou = f"{current_datetime.strftime('%H')}"
            current_datetimeMin = f"{current_datetime.strftime('%M')}"
            current_datetimeSec = f"{current_datetime.strftime('%S')}"
            current_datetimeMil = f"{current_datetime.microsecond // 1000:03d}"
            file_name = (
                f"log/Python/{current_datetimeMon}/{current_datetimeDay}_err.txt"
            )
            os.makedirs(os.path.dirname(file_name), exist_ok=True)
            # SALVAR ERRO NO TXT
            err = f"{current_datetimeHou}.{current_datetimeMin}.{current_datetimeSec}.{current_datetimeMil}\n{err}\n{str(exceptErr)}\n\n"
            with open(file_name, "a", encoding="utf-8") as file:
                file.write(err)
        # SOCKET RESPONSE [GET]
        try:
            getSockRes = ""
            while True:
                chunk = sockRes.recv(bufferSocket)
                getSockRes += chunk.decode()
                if "#fim#" in getSockRes:
                    getSockRes = getSockRes.split("#fim#")[0].rstrip()
                    break
            # console('SOCKET RESPONSE [GET]: OK')
            dataRes = json.loads(base64.b64decode(getSockRes).decode("utf-8"))
            if dataRes:
                retRes = None
                try:
                    retRes = dataRes
                    if retRes.get("complete", True):
                        if len(retRes["res"]) > 1:
                            newRes = {
                                # EDITAVEL: NAO
                                "sendGet": retRes.get("res", {}).get("sendGet"),
                                "method": retRes.get("res", {}).get("method"),
                                "host": retRes.get("res", {}).get("host"),
                                "url": retRes.get("res", {}).get("url"),
                                # EDITAVEL: SIM
                                "headers": retRes.get("res", {}).get("headers"),
                                "body": retRes.get("res", {}).get("body"),
                                "status": retRes.get("res", {}).get("status"),
                                # EDITAVEL: SIM (pelo header)
                                "compress": retRes.get("res", {}).get("compress"),
                                "type": retRes.get("res", {}).get("type"),
                            }
                            if newRes["headers"]:
                                for key in newRes["headers"]:
                                    flow.response.headers[key] = newRes["headers"][key]
                            if newRes["body"]:
                                flow.response.content = str.encode(newRes["body"])
                            if newRes["status"]:
                                flow.response.status_code = newRes["status"]
                            console("RES ALTERADO")
                    else:
                        console("RES CANCELADO")
                        flow.kill()
                except ImportError as exceptErr:
                    err = '"ALERTA: PYTHON sniffer.py" "ALTERAR/CANCELAR RES: ERRO"'
                    console(err)
                    subprocess.Popen(
                        f'"{letter}:/ARQUIVOS/WINDOWS/BAT/notify-send.exe" {err}'
                    )

                    # DATA E HORA ATUAL
                    current_datetime = datetime.datetime.now()
                    current_datetimeMon = f"MES_{current_datetime.strftime('%m')}_{current_datetime.strftime('%b').upper()}"
                    current_datetimeDay = f"DIA_{current_datetime.strftime('%d')}"
                    current_datetimeHou = f"{current_datetime.strftime('%H')}"
                    current_datetimeMin = f"{current_datetime.strftime('%M')}"
                    current_datetimeSec = f"{current_datetime.strftime('%S')}"
                    current_datetimeMil = f"{current_datetime.microsecond // 1000:03d}"
                    file_name = f"log/Python/{current_datetimeMon}/{current_datetimeDay}_err.txt"
                    os.makedirs(os.path.dirname(file_name), exist_ok=True)
                    # SALVAR ERRO NO TXT
                    err = f"{current_datetimeHou}.{current_datetimeMin}.{current_datetimeSec}.{current_datetimeMil}\n{err}\n{str(exceptErr)}\n\n"
                    with open(file_name, "a", encoding="utf-8") as file:
                        file.write(err)
                    flow.kill()
        except ImportError as exceptErr:
            err = '"ALERTA: PYTHON sniffer.py" "SOCKET RES [GET]: ERRO"'
            console(err)
            subprocess.Popen(f'"{letter}:/ARQUIVOS/WINDOWS/BAT/notify-send.exe" {err}')

            # DATA E HORA ATUAL
            current_datetime = datetime.datetime.now()
            current_datetimeMon = f"MES_{current_datetime.strftime('%m')}_{current_datetime.strftime('%b').upper()}"
            current_datetimeDay = f"DIA_{current_datetime.strftime('%d')}"
            current_datetimeHou = f"{current_datetime.strftime('%H')}"
            current_datetimeMin = f"{current_datetime.strftime('%M')}"
            current_datetimeSec = f"{current_datetime.strftime('%S')}"
            current_datetimeMil = f"{current_datetime.microsecond // 1000:03d}"
            file_name = (
                f"log/Python/{current_datetimeMon}/{current_datetimeDay}_err.txt"
            )
            os.makedirs(os.path.dirname(file_name), exist_ok=True)
            # SALVAR ERRO NO TXT
            err = f"{current_datetimeHou}.{current_datetimeMin}.{current_datetimeSec}.{current_datetimeMil}\n{err}\n{str(exceptErr)}\n\n"
            with open(file_name, "a", encoding="utf-8") as file:
                file.write(err)
            flow.kill()
    else:
        # console('OUTRO URL RES |', urlparse(flow.request.url).hostname)
        pass


# ##################################################
os.system("cls" if os.name == "nt" else "clear")
time.sleep(0.3)
console("MITMPROXY RODANDO\n")
