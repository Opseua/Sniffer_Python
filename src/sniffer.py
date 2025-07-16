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
# ERRO DE IMPORT NAO IDENTIFICADO
# pylint: disable=E0611
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
import json, os, sys, time, re, locale, base64, socket, requests

# LIMPAR CONSOLE (MANTER NO INÍCIO)
os.system("cls")

# IGNORAR ERROS DO CTRL + C
sys.stderr = open(os.devnull, "w")

# BIBLIOTECAS: NECESSÁRIO INSTALAR → pip install asyncio brotli mitmproxy | DESINSTALAR pip uninstall -y asyncio brotli mitmproxy
import asyncio
from mitmproxy import http
from mitmproxy.options import Options
from mitmproxy.tools.dump import DumpMaster
from threading import Thread

# VARIÁVEIS
bufferSocket = sockReq = sockRes = arrUrl = portSocket = None
fileChrome_Extension = os.getenv("fileChrome_Extension").replace(r"\\", "/")
fileProjetos = os.getenv("fileProjetos").replace(r"\\", "/")
project = os.path.abspath(__file__).split("PROJETOS\\")[1].split("\\src")[0]
# FORMATAR DATA E HORA NO PADRÃO BRASILEIRO
locale.setlocale(locale.LC_TIME, "pt_BR")

# FUNCOES ADICIONAIS
from stopwatch import stopwatchRun


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
    os.startfile(f"{fileProjetos}/{project}/src/z_OUTROS_server/OFF.vbs")
    os._exit(1)  # ENCERRAR SCRIPT


def socketSendReceive(port, obj):
    global bufferSocket
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.connect(("127.0.0.1", port))
        sendB64 = base64.b64encode(json.dumps(obj).encode("utf-8"))
        for i in range(0, len(sendB64), bufferSocket):
            sock.send(sendB64[i : i + bufferSocket])
        sock.send("#fim#".encode("utf-8"))
        received = ""
        while True:
            chunk = sock.recv(bufferSocket)
            if not chunk:
                break
            received += chunk.decode()
            if "#fim#" in received:
                received = received.split("#fim#")[0].rstrip()
                break
        sock.close()
        data = json.loads(base64.b64decode(received).decode("utf-8"))
        return data
    except Exception as e:
        errAll(e)
        notifyAndConsole(f"Socket send/receive error on port {port}")
        raise


try:
    # REGEX DE URL
    def rgxMat(a, b):
        return re.match(f"^{re.escape(b).replace(r"\*", ".*")}$", a) is not None

    def tryConnectSocket(sock, port):  # CONEXÃO DO SOCKET
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
        global bufferSocket, arrUrl, portSocket
        # LER O CONFIG E DEFINIR AS VARIÁVEL
        fullPathJson = os.path.abspath(f"{fileChrome_Extension}/src/config.json")
        config = ""
        with open(fullPathJson, "r", encoding="utf-8") as file:
            config = json.load(file)
        objWebSocket = config["webSocket"]
        objSniffer = config["sniffer"]
        securityPass = objWebSocket["securityPass"]
        portWebSocket = objWebSocket["server"]["1"]["port"]
        portMitm = objSniffer["portMitm"]
        portSocket = objSniffer["portSocket"]
        bufferSocket = objSniffer["bufferSocket"] * 1000
        # MANTER APENAS URLS QUE CONTENHAM MAIS DE 7 CARACTERES
        arrUrl = objSniffer["arrUrl"]
        arrUrl = [v for val in arrUrl.values() if val for v in val if len(v) > 7]
        # MITMPROXY: INICIAR
        options = Options(
            listen_host="127.0.0.1",
            listen_port=portMitm,
            # allow_hosts=[ "host1.com", "host2.com", "www.host3.com.br", ], # INTERCEPTAR APENAS ESSES HOSTS
            ssl_insecure=True,
        )
        m = DumpMaster(options, with_termlog=False, with_dumper=False)
        m.addons.add(*addons)
        # NOTIFICAÇÃO SNIFFER: ON
        urlReq = f"http://127.0.0.1:{portWebSocket}/?roo=OPSEUA-CHROME-CHROME_EXTENSION-USUARIO_0"
        payload = {
            "fun": [
                {
                    "securityPass": securityPass,
                    "name": "notification",
                    "par": {
                        "duration": 2,
                        "icon": "notification_1.png",
                        "title": "SNIFFER",
                        "text": "Ativado",
                        "ntfy": False,
                    },
                },
                {
                    "securityPass": securityPass,
                    "name": "chromeActions",
                    "par": {"action": "badge", "text": "ON", "color": "#19ff47"},
                },
            ]
        }
        headers = {"Content-Type": "application/json"}
        requests.post(urlReq, json=payload, headers=headers, timeout=1)
        try:
            console(f"MITMPROXY RODANDO NA PORTA: {portMitm}")
            await m.run()
        except KeyboardInterrupt:
            m.shutdown()

    class URLLogger:

        #################################################################################################################################################################

        # MITMPROXY: REQ [SEND]
        def request(self, flow: http.HTTPFlow) -> None:
            global arrUrl, portSocket
            regex = next((m for m in arrUrl if rgxMat(flow.request.url, m)), None)
            if regex is not None:
                objReq = {
                    "getSend": "send",
                    "method": flow.request.method,
                    "host": urlparse(flow.request.url).hostname,
                    "url": flow.request.url,
                    "headers": dict(flow.request.headers),
                    "body": base64.b64encode(flow.request.content).decode("ascii"),
                }
                try:
                    dataReq = socketSendReceive(portSocket, objReq)
                    if dataReq:
                        retReq = None
                        try:
                            retReq = dataReq
                            if retReq.get("complete", True):
                                if len(retReq["res"]) > 1:
                                    newReq = {
                                        "getSend": retReq.get("res", {}).get("getSend"),
                                        "method": retReq.get("res", {}).get("method"),
                                        "host": retReq.get("res", {}).get("host"),
                                        "url": retReq.get("res", {}).get("url"),
                                        "headers": retReq.get("res", {}).get("headers"),
                                        "body": retReq.get("res", {}).get("body"),
                                    }
                                    if newReq["headers"]:
                                        for key in newReq["headers"]:
                                            flow.request.headers[key] = newReq[
                                                "headers"
                                            ][key]
                                    if newReq["body"]:
                                        flow.request.content = base64.b64decode(
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

        #################################################################################################################################################################

        # MITMPROXY: RES [GET]
        def response(self, flow: http.HTTPFlow) -> None:
            global arrUrl, portSocket
            regex = next((m for m in arrUrl if rgxMat(flow.request.url, m)), None)
            if regex is not None:
                flow.response.headers["Cache-Control"] = "no-store, max-age=0"
                objRes = {
                    "getSend": "get",
                    "method": flow.request.method,
                    "host": urlparse(flow.request.url).hostname,
                    "url": flow.request.url,
                    "headers": dict(flow.response.headers),
                    "body": base64.b64encode(flow.response.content).decode("ascii"),
                    "status": flow.response.status_code,
                }
                # SOCKET RES [SEND] e [GET]
                try:
                    dataRes = socketSendReceive(portSocket + 1, objRes)
                    if dataRes:
                        retRes = None
                        try:
                            retRes = dataRes
                            if retRes.get("complete", True):
                                if len(retRes["res"]) > 1:
                                    newRes = {
                                        "getSend": retRes.get("res", {}).get("getSend"),
                                        "method": retRes.get("res", {}).get("method"),
                                        "host": retRes.get("res", {}).get("host"),
                                        "url": retRes.get("res", {}).get("url"),
                                        "headers": retRes.get("res", {}).get("headers"),
                                        "body": retRes.get("res", {}).get("body"),
                                        "status": retRes.get("res", {}).get("status"),
                                    }
                                    if newRes["headers"]:
                                        for key in newRes["headers"]:
                                            flow.response.headers[key] = newRes[
                                                "headers"
                                            ][key]
                                    if newRes["body"]:
                                        flow.response.content = base64.b64decode(
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

    #################################################################################################################################################################

    addons = [URLLogger()]

    # #### INICIAR CRONOMETRO E SERVIDOR (CRONOMETRO PRECISAR SER PRIMEIRO!!!)
    if __name__ == "__main__":
        Thread(target=stopwatchRun).start()
        asyncio.run(serverRun())

# CHECAR ERROS
except Exception as exceptErr:
    errAll(exceptErr)
    notifyAndConsole("CÓDIGO INTEIRO")
    os._exit(1)
