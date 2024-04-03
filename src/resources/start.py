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


def run():
    """IGNORE"""
    try:
        # PEGAR DADOS DO config.json
        script_dir = os.path.dirname(os.path.abspath(__file__)).replace("\\", "/")
        full_path = os.path.abspath(os.path.join(script_dir, "")).replace("\\", "/")
        full_pathJson = os.path.abspath(
            os.path.join(
                script_dir,
                f"{letter}:/ARQUIVOS/PROJETOS/Chrome_ExtensionOld/src/config.json",
            )
        ).replace("\\", "/")
        config = ""
        with open(full_pathJson, "r", encoding="utf-8") as file:
            config = json.load(file)

        # DEFINIR VARIÁVEIS
        portMitm = config["sniffer"]["portMitm"]
        arrUrl = config["sniffer"]["arrUrl"]
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
        command = f'"{letter}:/ARQUIVOS/WINDOWS/PORTABLE_Python/python/Scripts/mitmdump.exe" --quiet --anticache --ssl-insecure -s "{full_path}\\sniffer.py" --mode regular@{portMitm} {arrHost}'
        os.system("cls" if os.name == "nt" else "clear")
        securityPass = config["webSocket"]["securityPass"]

        def api(inf):
            server = config["webSocket"]["server"]["2"]
            wsHostLocal = server["host"]
            wsPort = server["port"]
            devices = config["webSocket"]["devices"]
            devSend = devices[1]["name"]
            url = "http://" + str(wsHostLocal) + ":" + str(wsPort) + "/" + str(devSend)
            payload = inf
            requests.post(url, json=payload, timeout=10)

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
                key, "ProxyServer", 0, winreg.REG_SZ, "127.0.0.1:" + str(portMitm)
            )
            # ignorar hosts → → 'Servidor WebSocket Web', 'Servidor WebSocket Local', 'Facebook', 'WhatsApp Desktop'
            server = config["webSocket"]["server"]["1"]
            wsHostWeb = server["host"]
            server = config["webSocket"]["server"]["2"]
            wsHostLocal = server["host"]
            ignoreHosts = f"{wsHostWeb};{wsHostLocal};*fb*;*whatsapp*"
            winreg.SetValueEx(key, "ProxyOverride", 0, winreg.REG_SZ, f"{ignoreHosts}")
            winreg.SetValueEx(key, "ProxyEnable", 0, winreg.REG_DWORD, 1)
            winreg.CloseKey(key)
            subprocess.Popen(command)
            processo_1 = subprocess.Popen("taskkill /IM Stopwatch.exe /F")
            processo_1.wait()
            subprocess.Popen(
                f'"{letter}:/ARQUIVOS/WINDOWS/PORTABLE_Stopwatch/Stopwatch.exe"'
            )
            # console('PROCESSO INICIADO 2')
            time.sleep(3)
            while True:
                processos = psutil.process_iter(["cmdline"])
                indiceArr = -1
                for indice, proc in enumerate(processos):
                    cmdline = proc.info["cmdline"]
                    if cmdline is not None:
                        cmdline_str = " ".join(cmdline)
                        if "nodeSniffer_Python_server.exe" in cmdline_str:
                            indiceArr = indice
                            # err = f"ID→ {proc.pid} | COMMAND LINE→ {cmdline_str}"
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
                            cmdline_str = " ".join(cmdline)
                            if "sniffer.py" in cmdline_str:
                                # err = f"ID→ {proc.pid} | COMMAND LINE→ {cmdline_str}"
                                # console(err)
                                # console('PROCESSO ENCERRADO 2')
                                proc.terminate()
                                break
                    break
                time.sleep(3)

        def checkProcess1():
            processos = psutil.process_iter(["cmdline"])
            indiceArr = -1
            for indice, proc in enumerate(processos):
                cmdline = proc.info["cmdline"]
                if cmdline is not None:
                    cmdline_str = " ".join(cmdline)
                    if "sniffer.py" in cmdline_str:
                        indiceArr = indice
                        # err = f"ID→ {proc.pid} | COMMAND LINE→ {cmdline_str}"
                        # console(err)
                        proc.terminate()
                        # console('PROCESSO ENCERRADO 1')
                        checkProcess2()
                        break
            if indiceArr == -1:
                # console('NAO 1')
                checkProcess2()

        checkProcess1()
    except Exception as e:
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
        err = f"{current_datetimeHou}.{current_datetimeMin}.{current_datetimeSec}.{current_datetimeMil}\n{err}\n{str(e)}\n\n"
        with open(file_name, "a", encoding="utf-8") as file:
            file.write(err)
        # ENCERRAR SCRIPT PYTHON
        sys.exit()


run()
