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
# pylint: disable=W0622
# pylint: disable=C0410
# pylint: disable=C0114
# pylint: disable=C0116
# ERRO DE IMPORT EM OUTRA PASTA
# pylint: disable=E0401
# ERRO DE IMPORT ANTES DE USAR A VARIÁVEL
# pylint: disable=C0413
# pylint: disable=C0411
# ERRO DE IMPORT 'datetime'
# pylint: disable=E1101
# ERRO IGNORAR ERROS DO CTRL + C
# pylint: disable=W1514
# ERRO 'sig' e 'frame'
# pylint: disable=W0613

# BIBLIOTECAS: NATIVAS
from urllib.parse import urlparse
from datetime import datetime
import json, os, sys, time, re, locale, base64, socket, io, gzip, zlib

# LIMPAR CONSOLE (MANTER NO INÍCIO)
os.system("cls")

# IGNORAR ERROS DO CTRL + C
sys.stderr = open(os.devnull, "w")

# BIBLIOTECAS: NECESSÁRIO INSTALAR → pip install asyncio brotli mitmproxy
# BIBLIOTECAS: NECESSÁRIO DESINSTALAR (sem confirmação) → pip uninstall -y asyncio brotli mitmproxy
import asyncio
import brotli
from mitmproxy import http
from mitmproxy.options import Options
from mitmproxy.tools.dump import DumpMaster

# VARIÁVEIS
bufferSocket = None  # fun → MITMPROXY REQ/RES
sockReq = None  # fun → MITMPROXY REQ/RES
sockRes = None  # fun → MITMPROXY REQ/RES
arrUrl = None  # fun → MITMPROXY REQ/RES
# letter = os.getenv("letter")
fileChrome_Extension = os.getenv("fileChrome_Extension").replace(r"\\", "/")
fileProjetos = os.getenv("fileProjetos").replace(r"\\", "/")

# FORMATAR DATA E HORA NO PADRÃO BRASILEIRO
locale.setlocale(locale.LC_TIME, "pt_BR")


# LOGCONSOLE
def logConsole(inf):
    dateNow = datetime.now()
    dateNowMon = f"MES_{dateNow.strftime('%m')}_{dateNow.strftime('%b').upper()}"
    dateNowDay = f"DIA_{dateNow.strftime('%d')}"
    dateNowHou = f"{dateNow.strftime('%H')}"
    dateNowMin = f"{dateNow.strftime('%M')}"
    dateNowSec = f"{dateNow.strftime('%S')}"
    dateNowMil = f"{dateNow.microsecond // 1000:03d}"
    dateInFile = f"→ {dateNowHou}:{dateNowMin}:{dateNowSec}.{dateNowMil}\n{str(inf)}"
    fileName = (
        f"logs/Python/{dateNowMon}/{dateNowDay}/{dateNowHou}.00-{dateNowHou}.59_log.txt"
    )
    os.makedirs(os.path.dirname(fileName), exist_ok=True)
    err = f"{dateInFile}\n\n"
    with open(fileName, "a", encoding="utf-8") as file:
        file.write(err)


# CONSOLE
def console(*args):
    text = "".join(str(arg) for arg in args)
    print(text)
    logConsole(text)
    if (console.counter + 1) % 100 == 0:
        os.system("cls")
        print("CONSOLE LIMPO!\n")
    console.counter += 1


console.counter = 0


# REGISTRAR ERROS
def errAll(exceptErr):
    dateNow = datetime.now()
    dateNowMon = f"MES_{dateNow.strftime('%m')}_{dateNow.strftime('%b').upper()}"
    dateNowDay = f"DIA_{dateNow.strftime('%d')}"
    dateNowHou = f"{dateNow.strftime('%H')}"
    dateNowMin = f"{dateNow.strftime('%M')}"
    dateNowSec = f"{dateNow.strftime('%S')}"
    dateNowMil = f"{dateNow.microsecond // 1000:03d}"
    fileName = f"logs/Python/{dateNowMon}/{dateNowDay}/{dateNowHou}.{dateNowMin}.{dateNowSec}.{dateNowMil}_err.txt"
    os.makedirs(os.path.dirname(fileName), exist_ok=True)
    err = f"{str(exceptErr)}\n\n"
    with open(fileName, "a", encoding="utf-8") as file:
        file.write(err)


# NOTIFICAÇÃO WINDOWS
def notifyAndConsole(message):
    console(message)
    # PROXY: DESATIVAR | ENCERRAR PROCESSOS
    os.startfile(f"{fileProjetos}/Sniffer_Python/src/z_OUTROS_server/OFF.vbs")
    # ENCERRAR SCRIPT
    os._exit(1)


try:
    # REGEX DE URL
    def rgxMat(a, b):
        c = re.escape(b).replace(r"\*", ".*")
        return re.match(f"^{c}$", a) is not None

    # CONEXÃO DO SOCKET
    def tryConnectSocket(sock, port):
        attempts, maxAttempts = 0, 12
        while attempts < maxAttempts:
            try:
                sock.connect(("127.0.0.1", port))
                return sock
            except Exception:
                attempts += 1
                console(f"SOCKET: TENTATIVA [{attempts}/{maxAttempts}]")
                if attempts >= maxAttempts:
                    notifyAndConsole("SOCKET: ERRO | MÁXIMO DE TENTATIVAS")
                time.sleep(0.2)

    # SERVER
    async def serverRun():
        global bufferSocket, sockReq, sockRes, arrUrl
        # LER O CONFIG E DEFINIR AS VARIÁVEI
        fullPathJson = os.path.abspath(f"{fileChrome_Extension}/src/config.json")
        config = ""
        with open(fullPathJson, "r", encoding="utf-8") as file:
            config = json.load(file)
        portSocket = config["sniffer"]["portSocket"]
        portMitm = 8088
        bufferSocket = config["sniffer"]["bufferSocket"] * 1000
        # arrUrl = config["sniffer"]["arrUrl"]
        # MANTER APENAS URLS QUE COMEÇAM COM 'http'
        arrUrl = [url for url in config["sniffer"]["arrUrl"] if url.startswith("http")]

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
            console(f"MITMPROXY RODANDO NA PORTA: {portMitm}")
            await m.run()
        except KeyboardInterrupt:
            m.shutdown()

    # MITMPROXY: REQ [SEND]
    class URLLogger:
        def request(self, flow: http.HTTPFlow) -> None:
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
                    "getSend": "send",
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
                                        "getSend": retReq.get("res", {}).get("getSend"),
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

        # MITMPROXY: RES [GET]
        def response(self, flow: http.HTTPFlow) -> None:
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
                    "getSend": "get",
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
                                        "getSend": retRes.get("res", {}).get("getSend"),
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

    # #### INICIAR SERVIDOR
    if __name__ == "__main__":
        asyncio.run(serverRun())

# CHECAR ERROS
except Exception as exceptErr:
    errAll(exceptErr)
    notifyAndConsole("CÓDIGO INTEIRO")
    os._exit(1)
