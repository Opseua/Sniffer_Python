# BIBLIOTECAS: NATIVAS
import json, os, sys, re, locale
from datetime import datetime
import http.client as http_client

# LIMPAR CONSOLE (MANTER NO INÍCIO) | IGNORAR ERROS DO CTRL + C
os.system("cls")
sys.stderr = open(os.devnull, "w")

# ------------------------------------------------------------------------------------
# [PADRÃO EM TODOS OS PROJETOS]
fileChrome_Extension = os.getenv("fileChrome_Extension").replace("\\", "/")
fileProjetos = os.getenv("fileProjetos").replace("\\", "/")
projectName = os.path.abspath(__file__).split("PROJETOS\\")[1].split("\\src")[0]
projectPath = f"{fileProjetos}/{projectName}".replace("\\", "/")
# ------------------------------------------------------------------------------------

# BIBLIOTECAS: NECESSÁRIO INSTALAR (MODO LEGACY) → pip install asyncio brotli mitmproxy | DESINSTALAR pip uninstall -y asyncio brotli mitmproxy
# BIBLIOTECAS: NECESSÁRIO INSTALAR (MODO CERTO)  → ADICIONAR NO 'requirements.txt' LINHA A LINHA AS BIBLIOTECAS → pip install -r requirements.txt

import requests
import asyncio
from mitmproxy import http
from mitmproxy.options import Options
from mitmproxy.tools.dump import DumpMaster
from threading import Thread

# FORMATAR DATA E HORA NO PADRÃO BRASILEIRO
locale.setlocale(locale.LC_TIME, "pt_BR")

# PATHS DE ARQUIVOS '.py'
sys.path.append(f"{projectPath}/src/scripts")
from stopwatch import stopwatch


# DATEHOUR
def dateHour():
    now = datetime.now()
    return {
        "day": f"{now.strftime('%d')}",
        "mon": f"{now.strftime('%m')}",
        "hou": f"{now.strftime('%H')}",
        "min": f"{now.strftime('%M')}",
        "sec": f"{now.strftime('%S')}",
        "mil": f"{now.microsecond // 1000:03d}",
        "monNam": f"{now.strftime('%b').upper()}",
    }


# LOGCONSOLE
def logConsole(inf):
    retDateHour = dateHour()
    day, hou = f"DIA_{retDateHour['day']}", f"{retDateHour['hou']}"
    min_, sec = f"{retDateHour['min']}", f"{retDateHour['sec']}"
    mil = f"{retDateHour['mil']}"
    fileName = f"logs/Python/MES_{retDateHour['mon']}_{retDateHour['monNam']}/{day}/{hou}.00-{hou}.59_log.txt"
    os.makedirs(os.path.dirname(fileName), exist_ok=True)
    with open(fileName, "a", encoding="utf-8") as file:
        file.write(f"→ {hou}:{min_}:{sec}.{mil}\n{str(inf)}\n\n")


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
    retDateHour = dateHour()
    day, hou = f"DIA_{retDateHour['day']}", f"{retDateHour['hou']}"
    min_, sec = f"{retDateHour['min']}", f"{retDateHour['sec']}"
    mil = f"{retDateHour['mil']}"
    fileName = f"logs/Python/MES_{retDateHour['mon']}_{retDateHour['monNam']}/{day}/{hou}.{min_}.{sec}.{mil}_err.txt"
    os.makedirs(os.path.dirname(fileName), exist_ok=True)
    with open(fileName, "a", encoding="utf-8") as file:
        file.write(f"{str(exceptErr)}\n\n")


# NOTIFICAÇÃO WINDOWS
def notifyAndConsole(message):
    console(message)
    # PROXY: DESATIVAR | ENCERRAR PROCESSOS
    os.startfile(f"{projectPath}/src/z_OUTROS/server.vbs")
    os._exit(1)  # ENCERRAR SCRIPT


################################################################################################
def chunksSendNode(inf):
    global portSocket, bufferSocket
    chunks, body = [], inf["body"]
    for i in range(0, len(body), bufferSocket):
        chunks.append(body[i : i + bufferSocket])
    # CONECTAR AO SERVIDOR | ENVIAR HEADERS | ENVIAR CHUNKS | RESPOSTA
    conn = http_client.HTTPConnection("localhost", portSocket)
    headers = {
        "Content-Type": "application/octet-stream",
        "Transfer-Encoding": "chunked",
        "x-getSend": inf["getSend"],
        "x-method": inf["method"],
        "x-url": inf["url"],
        "x-headers": inf["headers"],
    }
    conn.putrequest("POST", "/")
    for k, v in headers.items():
        conn.putheader(k, v)
    conn.endheaders()
    for chunk in chunks:
        conn.send((hex(len(chunk))[2:] + "\r\n").encode() + chunk + b"\r\n")
    conn.send(b"0\r\n\r\n")
    res, headers = conn.getresponse(), {}
    dheaders, body = dict(res.getheaders()), res.read() or None
    for k in ["x-action", "x-method", "x-url", "x-headers"]:
        val = dheaders.get(k)
        if k == "x-headers" and val:
            headers["headers"] = json.loads(val)
        else:
            headers[k[2:]] = val or None
    conn.close()
    return {"headers": headers, "body": body}


################################################################################################

try:
    # REGEX DE URL
    def rgxMat(a, b):
        return re.match(f"^{re.escape(b).replace(r"\*", ".*")}$", a) is not None

    # SERVER
    async def serverRun():
        global arrUrl, portSocket, bufferSocket
        # LER O CONFIG E DEFINIR AS VARIÁVEL
        fullPathJson = os.path.abspath(f"{fileChrome_Extension}/src/config.json")
        config = ""
        with open(fullPathJson, "r", encoding="utf-8") as file:
            config = json.load(file)
        objWebSocket, objSniffer = config["webSocket"], config["sniffer"]
        securityPass = objWebSocket["securityPass"]
        portWebSocket = objWebSocket["server"]["1"]["port"]
        portMitm, portSocket = objSniffer["portMitm"], objSniffer["portSocket"]
        bufferSocket, arrUrl = objSniffer["bufferSocket"] * 1024, objSniffer["arrUrl"]
        # MANTER APENAS URLS QUE CONTENHAM MAIS DE 7 CARACTERES
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
                        "icon": "iconGreen",
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
            global arrUrl
            url = flow.request.url
            regex = next((m for m in arrUrl if rgxMat(url, m)), None)
            if regex is not None:
                try:
                    # ENVIAR INFORMAÇÕES PARA O NODE
                    resNode = chunksSendNode(
                        {
                            "getSend": "send",
                            "method": flow.request.method.upper(),
                            "url": url,
                            "headers": json.dumps(dict(flow.request.headers)),
                            "body": flow.request.content,
                        }
                    )
                    resNodeHeaders = resNode["headers"]
                    action = resNodeHeaders.get("action")
                    if action == "0":
                        # CANCELAR
                        console("REQ [SEND] CANCELADA")
                        flow.kill()
                    elif action == "1":
                        # ALTERAR
                        console("REQ [SEND] ALTERADA")
                        method = (resNodeHeaders.get("method") or "").upper() or None
                        url = resNodeHeaders.get("url")
                        headers = resNodeHeaders.get("headers")
                        body = resNode.get("body")
                        if method:
                            flow.request.method = method
                        if url:
                            flow.request.url = url
                        if headers:
                            flow.request.headers.clear()
                            flow.request.headers.update(headers)
                        if body and method != "GET":
                            flow.request.content = body
                except Exception as exceptErr:
                    errAll(exceptErr)
                    notifyAndConsole("REQ [SEND]")
                    flow.kill()
                    raise

        #################################################################################################################################################################

        # MITMPROXY: RES [GET]
        def response(self, flow: http.HTTPFlow) -> None:
            global arrUrl
            url = flow.request.url
            regex = next((m for m in arrUrl if rgxMat(url, m)), None)
            if regex is not None:
                flow.response.headers["Cache-Control"] = "no-store, max-age=0"
                try:
                    # ENVIAR INFORMAÇÕES PARA O NODE
                    resNode = chunksSendNode(
                        {
                            "getSend": "get",
                            "method": flow.request.method.upper(),
                            "url": url,
                            "headers": json.dumps(dict(flow.response.headers)),
                            "body": flow.response.content,
                        },
                    )
                    resNodeHeaders = resNode["headers"]
                    action = resNodeHeaders.get("action")
                    if action == "0":
                        # CANCELAR
                        console("RES [GET] CANCELADA")
                        flow.kill()
                    elif action == "1":
                        # ALTERAR
                        console("RES [GET] ALTERADA")
                        headers = resNodeHeaders.get("headers")
                        body = resNode.get("body")
                        if headers:
                            flow.response.headers.clear()
                            flow.response.headers.update(headers)
                        if body:
                            flow.response.content = body
                except Exception as exceptErr:
                    errAll(exceptErr)
                    notifyAndConsole("RES [GET]")
                    flow.kill()
                    raise

    #################################################################################################################################################################

    addons = [URLLogger()]

    # #### INICIAR CRONOMETRO E SERVIDOR (CRONOMETRO PRECISAR SER PRIMEIRO!!!)
    if __name__ == "__main__":
        Thread(target=stopwatch).start()
        asyncio.run(serverRun())

# CHECAR ERROS
except Exception as exceptErr:
    errAll(exceptErr)
    notifyAndConsole("CÓDIGO INTEIRO")
    os._exit(1)
