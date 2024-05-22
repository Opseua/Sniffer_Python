"""IGNORE"""

# pylint: disable=W0718
# pylint: disable=R0914
# pylint: disable=R0915
# pylint: disable=R1732
# pylint: disable=C0103
# pylint: disable=C0301

# with open("./parametros.txt", "w") as file: # 'a' adiciona, 'w' limpa
#     file.write(f"AAA")
#     print('OK')

# 'start.py' e 'sniffer.py'
from urllib.parse import urlparse
import json
import os
import time
import datetime
import locale

# 'start.py'
import winreg
import subprocess
import sys
import psutil
import requests

# LETRA DO TERMINAL
letter = os.path.dirname(os.path.realpath(__file__))[0]
# FORMATAR DATA E HORA NO PADRÃO BRASILEIRO
locale.setlocale(locale.LC_TIME, "pt_BR")


def console(*args):
    """IGNORE"""
    msg = " ".join(str(arg) for arg in args)
    print(msg)
    if (console.counter + 1) % 100 == 0:
        os.system("cls" if os.name == "nt" else "clear")
        print("CONSOLE LIMPO!\n")
    console.counter += 1


console.counter = 0
engName = "PYTHON"


def run():
    """IGNORE"""
    try:
        # PEGAR DADOS DO config.json
        scriptDir = os.path.dirname(os.path.abspath(__file__)).replace("\\", "/")
        fullPath = os.path.abspath(os.path.join(scriptDir, "")).replace("\\", "/")
        fullPathJson = os.path.abspath(
            os.path.join(
                scriptDir,
                f"{letter}:/ARQUIVOS/PROJETOS/Chrome_Extension/src/config.json",
            )
        ).replace("\\", "/")
        config = ""
        with open(fullPathJson, "r", encoding="utf-8") as file:
            config = json.load(file)

        # DEFINIR VARIÁVEIS
        configWebSocket = config["webSocket"]
        serverLoc = configWebSocket["server"]["1"]
        hostLoc = serverLoc["host"]
        portLoc = serverLoc["port"]
        hostPortLoc = f"{hostLoc}:{portLoc}"
        serverWeb = configWebSocket["server"]["2"]
        hostWeb = serverWeb["host"]

        # DEVICES
        devicesObjSend = configWebSocket["devices"][
            configWebSocket["devices"]["is"][engName]["sendTo"]
        ]
        devicesValuesSend = list(devicesObjSend.values())
        devicesKeysSend = {key: index for index, key in enumerate(devicesObjSend)}
        devicesObjGet = configWebSocket["devices"][engName]
        devicesValuesGet = list(devicesObjGet.values())
        devicesKeysGet = {key: index for index, key in enumerate(devicesObjGet)}
        devMaster = configWebSocket["master"]
        devices = [
            [
                configWebSocket["devices"]["is"][engName]["sendTo"],
                devicesKeysSend,
                devicesValuesSend,
            ],
            [engName, devicesKeysGet, devicesValuesGet],
        ]
        devSend = f"{hostPortLoc}/?roo={devMaster}-{devices[0][0]}"
        devSend = f"{devSend}-{devices[0][2][0]}"

        # SNIFFER
        configSniffer = config["sniffer"]
        portMitm = configSniffer["portMitm"]
        arrUrl = configSniffer["arrUrl"]
        arrHost = [
            urlparse(url).hostname
            for url in arrUrl
            if urlparse(url).scheme in ("http", "https")
        ]
        # ARRAY COM URLS PARA SEREM INTERCEPTADOS
        arrHost = " ".join(
            [f'--allow-hosts "{hostname}"' for hostname in list(set(arrHost))]
        )
        # COMANDO DE LINHA PARA INICIAR O MITMPROXY
        # command = f'"{letter}:/ARQUIVOS/WINDOWS/PORTABLE_Python/python/Scripts/mitmdump.exe" --quiet --anticache --ssl-insecure -s "{fullPath}\\sniffer.py" --mode regular@{portMitm} {arrHost}'
        command = f'"{letter}:/ARQUIVOS/WINDOWS/PORTABLE_Python/python/pythonSniffer_Python_server.exe" "{letter}:/ARQUIVOS/WINDOWS/PORTABLE_Python/python/Scripts/mitmdump.exe" --quiet --anticache --ssl-insecure -s "{fullPath}\\sniffer.py" --mode regular@{portMitm} {arrHost}'

        os.system("cls" if os.name == "nt" else "clear")
        securityPass = configWebSocket["securityPass"]

        def api(inf):
            url = f"http://{devSend}"
            payload = inf
            requests.post(url, json=payload, timeout=5)

        def checkProcess2():
            api(
                {
                    "fun": [
                        {
                            "securityPass": securityPass,
                            "retInf": False,
                            "name": "notification",
                            "par": {
                                "duration": 3,
                                "icon": "./src/scripts/media/notification_1.png",
                                "title": "SNIFFER",
                                "text": "Ativado",
                            },
                        },
                        {
                            "securityPass": securityPass,
                            "retInf": False,
                            "name": "chromeActions",
                            "par": {"action": "badge", "color": [25, 255, 71, 255]},
                        },
                        {
                            "securityPass": securityPass,
                            "retInf": False,
                            "name": "chromeActions",
                            "par": {"action": "badge", "text": "PYTH"},
                        },
                    ]
                }
            )
            # ATIVAR PROXY DO WINDOWS
            key = winreg.OpenKey(
                winreg.HKEY_CURRENT_USER,
                "Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings",
                0,
                winreg.KEY_WRITE,
            )
            winreg.SetValueEx(
                key, "ProxyServer", 0, winreg.REG_SZ, f"127.0.0.1:{portMitm}"
            )
            # ignorar hosts → → 'Servidor WebSocket Web', 'Servidor WebSocket Loc', 'Facebook', 'WhatsApp Desktop'
            ignoreHosts = f"{hostLoc};{hostWeb};*fb*;*whatsapp*"
            winreg.SetValueEx(key, "ProxyOverride", 0, winreg.REG_SZ, f"{ignoreHosts}")
            winreg.SetValueEx(key, "ProxyEnable", 0, winreg.REG_DWORD, 1)
            winreg.CloseKey(key)
            subprocess.Popen(command)
            processo1 = subprocess.Popen("taskkill /IM Stopwatch.exe /F")
            processo1.wait()
            subprocess.Popen(
                f'"{letter}:/ARQUIVOS/WINDOWS/PORTABLE_Stopwatch/Stopwatch.exe"'
            )
            # console('PROCESSO INICIADO 2')
            # time.sleep(3)
            while True:
                processos = psutil.process_iter(["cmdline"])
                indiceArr = -1
                for indice, proc in enumerate(processos):
                    cmdline = proc.info["cmdline"]
                    if cmdline is not None:
                        cmdlineStr = " ".join(cmdline)
                        if "nodeSniffer_Python_server.exe" in cmdlineStr:
                            indiceArr = indice
                            # err = f"ID→ {proc.pid} | COMMAND LINE→ {cmdlineStr}"
                            # console(err)
                            break
                if indiceArr == -1:
                    # console('NAO 2')
                    api(
                        {
                            "fun": [
                                {
                                    "securityPass": securityPass,
                                    "retInf": False,
                                    "name": "notification",
                                    "par": {
                                        "duration": 3,
                                        "icon": "./src/scripts/media/notification_2.png",
                                        "title": "SNIFFER",
                                        "text": "Desativado",
                                    },
                                },
                                {
                                    "securityPass": securityPass,
                                    "retInf": False,
                                    "name": "chromeActions",
                                    "par": {"action": "badge", "text": ""},
                                },
                            ]
                        }
                    )
                    # DESATIVAR O PROXY DO WINDOWS
                    key = winreg.OpenKey(
                        winreg.HKEY_CURRENT_USER,
                        "Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings",
                        0,
                        winreg.KEY_WRITE,
                    )
                    winreg.SetValueEx(key, "ProxyEnable", 0, winreg.REG_DWORD, 0)
                    winreg.SetValueEx(key, "ProxyServer", 0, winreg.REG_SZ, "")
                    winreg.SetValueEx(key, "ProxyOverride", 0, winreg.REG_SZ, "")
                    winreg.CloseKey(key)
                    subprocess.Popen("taskkill /IM Stopwatch.exe /F")
                    processos = psutil.process_iter(["cmdline"])
                    for indice, proc in enumerate(processos):
                        cmdline = proc.info["cmdline"]
                        if cmdline is not None:
                            cmdlineStr = " ".join(cmdline)
                            if "sniffer.py" in cmdlineStr:
                                # err = f"ID→ {proc.pid} | COMMAND LINE→ {cmdlineStr}"
                                # console(err)
                                # console('PROCESSO ENCERRADO 2')
                                proc.terminate()
                                break
                    break
                time.sleep(1)

        def checkProcess1():
            processos = psutil.process_iter(["cmdline"])
            indiceArr = -1
            for indice, proc in enumerate(processos):
                cmdline = proc.info["cmdline"]
                if cmdline is not None:
                    cmdlineStr = " ".join(cmdline)
                    if "sniffer.py" in cmdlineStr:
                        indiceArr = indice
                        # err = f"ID→ {proc.pid} | COMMAND LINE→ {cmdlineStr}"
                        # console(err)
                        proc.terminate()
                        # console('PROCESSO ENCERRADO 1')
                        checkProcess2()
                        break
            if indiceArr == -1:
                # console('NAO 1')
                checkProcess2()

        checkProcess1()
    except Exception as exceptErr:
        # DESATIVAR O PROXY DO WINDOWS
        key = winreg.OpenKey(
            winreg.HKEY_CURRENT_USER,
            "Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings",
            0,
            winreg.KEY_WRITE,
        )
        winreg.SetValueEx(key, "ProxyEnable", 0, winreg.REG_DWORD, 0)
        winreg.SetValueEx(key, "ProxyServer", 0, winreg.REG_SZ, "")
        winreg.SetValueEx(key, "ProxyOverride", 0, winreg.REG_SZ, "")
        winreg.CloseKey(key)
        subprocess.Popen("taskkill /IM Stopwatch.exe /F")
        err = '"ALERTA: PYTHON start.py" "Ocorreu um erro [DESATIVADO]"'
        console(err)
        subprocess.Popen(f'"{letter}:/ARQUIVOS/WINDOWS/BAT/notify-send.exe" {err}')
        subprocess.Popen("taskkill /IM nodeSniffer_Python_server.exe /F")
        api(
            {
                "fun": [
                    {
                        "securityPass": securityPass,
                        "retInf": False,
                        "name": "notification",
                        "par": {
                            "duration": 3,
                            "icon": "./src/scripts/media/notification_3.png",
                            "title": "ALERTA: PYTHON start.py",
                            "text": "Ocorreu um erro [DESATIVADO]",
                        },
                    }
                ]
            }
        )

        # DATA E HORA ATUAL
        currentDatetime = datetime.datetime.now()
        currentDatetimeMon = f"MES_{currentDatetime.strftime('%m')}_{currentDatetime.strftime('%b').upper()}"
        currentDatetimeDay = f"DIA_{currentDatetime.strftime('%d')}"
        currentDatetimeHou = f"{currentDatetime.strftime('%H')}"
        currentDatetimeMin = f"{currentDatetime.strftime('%M')}"
        currentDatetimeSec = f"{currentDatetime.strftime('%S')}"
        currentDatetimeMil = f"{currentDatetime.microsecond // 1000:03d}"
        fileName = f"log/Python/{currentDatetimeMon}/{currentDatetimeDay}_err.txt"
        os.makedirs(os.path.dirname(fileName), exist_ok=True)
        # SALVAR ERRO NO TXT
        err = f"{currentDatetimeHou}.{currentDatetimeMin}.{currentDatetimeSec}.{currentDatetimeMil}\n{err}\n{str(exceptErr)}\n\n"
        with open(fileName, "a", encoding="utf-8") as file:
            file.write(err)
        # ENCERRAR SCRIPT PYTHON
        sys.exit()


run()
