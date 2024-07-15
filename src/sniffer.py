"""IGNORE"""

# pylint: disable=C0103
# pylint: disable=C0301
# pylint: disable=W0621
# pylint: disable=W0718
# pylint: disable=R1732
# pylint: disable=R1702
# pylint: disable=R0914
# pylint: disable=R0915
# pylint: disable=R0912
# pylint: disable=W0602
# pylint: disable=W0603
# pylint: disable=C0115
# pylint: disable=R1710

# BIBLIOTECAS: NATIVAS
from urllib.parse import urlparse
import json
import os
import subprocess
import time
import re
import datetime
import locale
import base64
import socket
import io
import gzip
import zlib
import asyncio

# BIBLIOTECAS: NECESSÁRIO INSTALAR → pip install brotli mitmproxy
import brotli
from mitmproxy import http
from mitmproxy.options import Options
from mitmproxy.tools.dump import DumpMaster

# VARIÁVEIS
letter = os.path.dirname(os.path.realpath(__file__))[0]
bufferSocket = None  # fun → MITMPROXY REQ/RES
sockReq = None  # fun → MITMPROXY REQ/RES
sockRes = None  # fun → MITMPROXY REQ/RES
arrUrl = None  # fun → MITMPROXY REQ/RES
background_2 = f"{letter}:/ARQUIVOS/WINDOWS/BAT/RUN_PORTABLE/2_BACKGROUND.exe"
batProxy = f"{letter}:/ARQUIVOS/PROJETOS/Sniffer_Python/src/scripts/BAT/PROXY_PROCESS_KILL_BADGE_NOTIFICATION.bat"
fileChrome_Extension = os.getenv("fileChrome_Extension").replace(r"\\", "/")


# CONSOLE
def console(*args):
    """IGNORE"""
    print("PYTHON → " + " ".join(str(arg) for arg in args))
    if (console.counter + 1) % 100 == 0:
        os.system("cls")
        print("PYTHON → CONSOLE LIMPO!\n")
    console.counter += 1


console.counter = 0


# REGISTRAR ERROS
def errAll(exceptErr):
    """IGNORE"""
    dateNow = datetime.datetime.now()
    dateNowMon = f"MES_{dateNow.strftime('%m')}_{dateNow.strftime('%b').upper()}"
    dateNowDay = f"DIA_{dateNow.strftime('%d')}"
    dateNowHou = f"{dateNow.strftime('%H')}"
    dateNowMin = f"{dateNow.strftime('%M')}"
    dateNowSec = f"{dateNow.strftime('%S')}"
    dateNowMil = f"{dateNow.microsecond // 1000:03d}"
    fileName = f"log/Python/{dateNowMon}/{dateNowDay}/{dateNowHou}.{dateNowMin}.{dateNowSec}.{dateNowMil}_err.txt"
    os.makedirs(os.path.dirname(fileName), exist_ok=True)
    err = f"{str(exceptErr)}\n\n"
    with open(fileName, "a", encoding="utf-8") as file:
        file.write(err)


# NOTIFICAÇÃO WINDOWS
def notifyAndConsole(message):
    """IGNORE"""
    console(message)
    # PROXY: DESATIVAR | ENCERRAR PROCESSOS
    subprocess.Popen(
        f'{background_2} "{batProxy} PROCESS_KILL_ALL+PROXY_OFF+BADGE_NOTIFICATION_OFF & {letter}:/ARQUIVOS/WINDOWS/BAT/notify-send.exe #1#PYTHON: ERRO#1# #1#{message}#1#"'
    )
    # ENCERRAR SCRIPT
    os._exit(1)


try:
    # REGEX DE URL
    def rgxMat(a, b):
        """IGNORE"""
        c = re.escape(b).replace(r"\*", ".*")
        return re.match(f"^{c}$", a) is not None

    # CONEXÃO DO SOCKET
    def tryConnectSocket(sock, port):
        """IGNORE"""
        attempts, maxAttempts = 0, 6
        while attempts < maxAttempts:
            try:
                sock.connect(("127.0.0.1", port))
                return sock
            except Exception:
                attempts += 1
                console(f"SOCKET: TENTATIVA [{attempts}/{maxAttempts}]")
                if attempts >= maxAttempts:
                    notifyAndConsole("SOCKET: ERRO | MÁXIMO DE TENTATIVAS")
                time.sleep(0.5)

    # SERVER
    async def run():
        """IGNORE"""
        global bufferSocket, sockReq, sockRes, arrUrl
        os.system("cls")
        # LER O CONFIG E DEFINIR AS VARIÁVEIS
        locale.setlocale(locale.LC_TIME, "pt_BR")
        fullPathJson = os.path.abspath(f"{fileChrome_Extension}/src/config.json")
        config = ""
        with open(fullPathJson, "r", encoding="utf-8") as file:
            config = json.load(file)
        portSocket = config["sniffer"]["portSocket"]
        portMitm = 8088
        bufferSocket = config["sniffer"]["bufferSocket"] * 1000
        arrUrl = config["sniffer"]["arrUrl"]
        # TENTAR SE CONECTAR AO SOCKET
        tryConnectSocketReq = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        tryConnectSocketRes = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sockReq = tryConnectSocket(tryConnectSocketReq, portSocket)
        sockRes = tryConnectSocket(tryConnectSocketRes, portSocket + 1)
        # MITMPROXY: INICIAR
        options = Options(
            listen_host="127.0.0.1",
            listen_port=portMitm,
            # MANTER APENAS O HOST
            allow_hosts=[urlparse(url).netloc for url in arrUrl],
            ssl_insecure=True,
        )
        m = DumpMaster(options, with_termlog=False, with_dumper=False)
        m.addons.add(*addons)
        try:
            console(f"MITMPROXY RODANDO NA PORTA {portMitm}")
            # PROXY: ATIVAR | ABRIR STOPWATCH
            subprocess.Popen(
                f"{background_2} {batProxy} PROXY_ON+BADGE_NOTIFICATION_ON"
            )
            await m.run()
        except KeyboardInterrupt:
            m.shutdown()

    # MITMPROXY: REQ
    class URLLogger:
        def request(self, flow: http.HTTPFlow) -> None:
            """IGNORE"""
            global bufferSocket, sockReq, arrUrl
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
                        except Exception:
                            typeOk = "utf-8"
                    else:
                        typeOk = "utf-8"
                    compress = flow.request.headers.get("content-encoding", "").lower()
                    if "gzip" in compress:
                        try:
                            gzippedContent = io.BytesIO(flow.request.content)
                            decompressedContent = gzip.GzipFile(
                                fileobj=gzippedContent
                            ).read()
                            reqBody = decompressedContent.decode(typeOk)
                        except Exception:
                            reqBody = flow.request.content.decode(
                                "utf-8", errors="ignore"
                            )
                    elif "deflate" in compress:
                        try:
                            decompressedContent = zlib.decompress(
                                flow.request.content, wbits=zlib.MAX_WBITS | 16
                            )
                            reqBody = decompressedContent.decode(typeOk)
                        except Exception:
                            reqBody = flow.request.content.decode(
                                "utf-8", errors="ignore"
                            )
                    elif "br" in compress:
                        try:
                            decodedData = brotli.decompress(flow.request.content)
                            reqBody = decodedData.decode(typeOk)
                        except Exception:
                            reqBody = flow.request.content.decode(
                                "utf-8", errors="ignore"
                            )
                    else:
                        compress = "NULL"
                        try:
                            reqBody = flow.request.content.decode(
                                typeOk, errors="ignore"
                            )
                        except Exception:
                            reqBody = flow.request.content.decode(
                                "utf-8", errors="ignore"
                            )
                objReq = {
                    "reqRes": "req",
                    "method": flow.request.method,
                    "host": urlparse(flow.request.url).hostname,
                    "url": flow.request.url,
                    "headers": dict(flow.request.headers),
                    "body": reqBody,
                    "compress": compress,
                    "type": typeOk,
                }
                # SOCKET REQ [SEND]
                try:
                    sendSockReq = json.dumps(objReq)
                    sendB64Req = base64.b64encode(sendSockReq.encode("utf-8"))
                    for i in range(0, len(sendB64Req), bufferSocket):
                        part = sendB64Req[i : i + bufferSocket]
                        sockReq.send(part)
                    sockReq.send("#fim#".encode("utf-8"))
                    # console('SOCKET REQUISICAO [SEND]: OK')
                except Exception as exceptErr:
                    errAll(exceptErr)
                    notifyAndConsole("Socket REQ [SEND]")
                    raise

                # SOCKET REQ [GET]
                try:
                    getSockReq = ""
                    while True:
                        chunk = sockReq.recv(bufferSocket)
                        getSockReq += chunk.decode()
                        if "#fim#" in getSockReq:
                            getSockReq = getSockReq.split("#fim#")[0].rstrip()
                            break
                    # console('SOCKET REQ [GET]: OK')
                    dataReq = json.loads(base64.b64decode(getSockReq).decode("utf-8"))
                    if dataReq:
                        retReq = None
                        try:
                            retReq = dataReq
                            if retReq.get("complete", True):
                                if len(retReq["res"]) > 1:
                                    newReq = {
                                        # EDITAVEL: NAO
                                        "reqRes": retReq.get("res", {}).get("reqRes"),
                                        "method": retReq.get("res", {}).get("method"),
                                        "host": retReq.get("res", {}).get("host"),
                                        "url": retReq.get("res", {}).get("url"),
                                        # EDITAVEL: SIM
                                        "headers": retReq.get("res", {}).get("headers"),
                                        "body": retReq.get("res", {}).get("body"),
                                        # EDITAVEL: SIM (pelo header)
                                        "compress": retReq.get("res", {}).get(
                                            "compress"
                                        ),
                                        "type": retReq.get("res", {}).get("type"),
                                    }
                                    if newReq["headers"]:
                                        for key in newReq["headers"]:
                                            flow.request.headers[key] = newReq[
                                                "headers"
                                            ][key]
                                    if newReq["body"]:
                                        flow.request.content = str.encode(
                                            newReq["body"]
                                        )
                                    console("REQ ALTERADA")
                            else:
                                console("REQ CANCELADA")
                                flow.kill()
                        except Exception as exceptErr:
                            errAll(exceptErr)
                            notifyAndConsole("Alterar/cancelar requisição")
                            flow.kill()
                            raise
                except Exception as exceptErr:
                    errAll(exceptErr)
                    notifyAndConsole("Socket REQ [GET]")
                    flow.kill()
                    raise
            else:
                # console('OUTRO URL REQ |', urlparse(flow.request.url).hostname)
                pass

        # MITMPROXY: RES
        def response(self, flow: http.HTTPFlow) -> None:
            """IGNORE"""
            global bufferSocket, sockRes, arrUrl
            regex = next((m for m in arrUrl if rgxMat(flow.request.url, m)), None)
            if regex is not None:
                # DISABILITAR CACHE
                flow.response.headers["Cache-Control"] = "no-store, max-age=0"
                objRes = None
                if not flow.response.content:
                    resBody, typeOk, compress = "NULL", "utf-8", "NULL"
                else:
                    type1 = flow.response.headers.get("Content-Type")
                    if type1 and ";" in type1:
                        try:
                            typeOk = type1.split("; ")[1].split("=")[1]
                        except Exception:
                            typeOk = "utf-8"
                    else:
                        typeOk = "utf-8"
                    compress = flow.response.headers.get("content-encoding", "").lower()
                    if "gzip" in compress:
                        try:
                            gzippedContent = io.BytesIO(flow.response.content)
                            decompressedContent = gzip.GzipFile(
                                fileobj=gzippedContent
                            ).read()
                            resBody = decompressedContent.decode(typeOk)
                        except Exception:
                            resBody = flow.response.content.decode(
                                "utf-8", errors="ignore"
                            )
                    elif "deflate" in compress:
                        try:
                            decompressedContent = zlib.decompress(
                                flow.response.content, wbits=zlib.MAX_WBITS | 16
                            )
                            resBody = decompressedContent.decode(typeOk)
                        except Exception:
                            resBody = flow.response.content.decode(
                                "utf-8", errors="ignore"
                            )
                    elif "br" in compress:
                        try:
                            decodedData = brotli.decompress(flow.response.content)
                            resBody = decodedData.decode(typeOk)
                        except Exception:
                            resBody = flow.response.content.decode(
                                "utf-8", errors="ignore"
                            )
                    else:
                        compress = "NULL"
                        try:
                            resBody = flow.response.content.decode(
                                typeOk, errors="ignore"
                            )
                        except Exception:
                            resBody = flow.response.content.decode(
                                "utf-8", errors="ignore"
                            )
                objRes = {
                    "reqRes": "res",
                    "method": flow.request.method,
                    "host": urlparse(flow.request.url).hostname,
                    "url": flow.request.url,
                    "headers": dict(flow.response.headers),
                    "body": resBody,
                    "compress": compress,
                    "type": typeOk,
                    "status": flow.response.status_code,
                }
                # SOCKET RES [SEND]
                try:
                    sendSockRes = json.dumps(objRes)
                    sendB64Res = base64.b64encode(sendSockRes.encode("utf-8"))
                    for i in range(0, len(sendB64Res), bufferSocket):
                        part = sendB64Res[i : i + bufferSocket]
                        sockRes.send(part)
                    sockRes.send("#fim#".encode("utf-8"))
                    # console('SOCKET RES [SEND]: OK')
                except Exception as exceptErr:
                    errAll(exceptErr)
                    notifyAndConsole("Socket RES [SEND]")
                    raise
                # SOCKET RES [GET]
                try:
                    getSockRes = ""
                    while True:
                        chunk = sockRes.recv(bufferSocket)
                        getSockRes += chunk.decode()
                        if "#fim#" in getSockRes:
                            getSockRes = getSockRes.split("#fim#")[0].rstrip()
                            break
                    # console('SOCKET RES [GET]: OK')
                    dataRes = json.loads(base64.b64decode(getSockRes).decode("utf-8"))
                    if dataRes:
                        retRes = None
                        try:
                            retRes = dataRes
                            if retRes.get("complete", True):
                                if len(retRes["res"]) > 1:
                                    newRes = {
                                        # EDITAVEL: NAO
                                        "reqRes": retRes.get("res", {}).get("reqRes"),
                                        "method": retRes.get("res", {}).get("method"),
                                        "host": retRes.get("res", {}).get("host"),
                                        "url": retRes.get("res", {}).get("url"),
                                        # EDITAVEL: SIM
                                        "headers": retRes.get("res", {}).get("headers"),
                                        "body": retRes.get("res", {}).get("body"),
                                        "status": retRes.get("res", {}).get("status"),
                                        # EDITAVEL: SIM (pelo header)
                                        "compress": retRes.get("res", {}).get(
                                            "compress"
                                        ),
                                        "type": retRes.get("res", {}).get("type"),
                                    }
                                    if newRes["headers"]:
                                        for key in newRes["headers"]:
                                            flow.response.headers[key] = newRes[
                                                "headers"
                                            ][key]
                                    if newRes["body"]:
                                        flow.response.content = str.encode(
                                            newRes["body"]
                                        )
                                    if newRes["status"]:
                                        flow.response.status_code = newRes["status"]
                                    console("RES ALTERADO")
                            else:
                                console("RES CANCELADO")
                                flow.kill()
                        except Exception as exceptErr:
                            errAll(exceptErr)
                            notifyAndConsole("ALTERAR/CANCELAR RES: ERRO")
                            flow.kill()
                            raise
                except Exception as exceptErr:
                    errAll(exceptErr)
                    notifyAndConsole("Socket RES [GET]")
                    flow.kill()
                    raise
            else:
                # console('OUTRO URL RES |', urlparse(flow.request.url).hostname)
                pass

    # **************************************************************************************************

    addons = [URLLogger()]

    # INICIAR SCRIPT
    if __name__ == "__main__":
        asyncio.run(run())

# CHECAR ERROS
except Exception as exceptErr:
    errAll(exceptErr)
    notifyAndConsole("CÓDIGO INTEIRO")
    os._exit(1)
