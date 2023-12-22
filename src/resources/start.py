# with open("./parametros.txt", "w") as file: # 'a' adiciona, 'w' limpa
#     file.write(f"AAA")
#     print('OK')

# 'start.py' e 'sniffer.py'
from urllib.parse import urlparse
import json
import os
import time
import re

# 'start.py'
import psutil
import winreg
import subprocess
import requests
import sys


letter = os.path.dirname(os.path.realpath(__file__))[0]


def run():
    try:
        script_dir = os.path.dirname(os.path.abspath(__file__)).replace("\\", "/")
        full_path = os.path.abspath(os.path.join(script_dir, "")).replace("\\", "/")
        full_pathJson = os.path.abspath(
            os.path.join(
                script_dir,
                f"{letter}:/ARQUIVOS/PROJETOS/Chrome_Extension/src/config.json",
            )
        ).replace("\\", "/")
        config = ""
        with open(full_pathJson, "r") as file:
            config = json.load(file)
        portMitm = config["sniffer"]["portMitm"]
        arrUrl = config["sniffer"]["arrUrl"]
        arrHost = [
            urlparse(url).hostname
            for url in arrUrl
            if urlparse(url).scheme in ("http", "https")
        ]
        arrHost = " ".join(
            [f'--allow-hosts "{hostname}"' for hostname in list(set(arrHost))]
        )
        command = f'"{letter}:/ARQUIVOS/WINDOWS/PORTABLE_mitmproxy/mitmdump.exe" --quiet --anticache --ssl-insecure -s "{full_path}\\sniffer.py" --mode regular@{portMitm} {arrHost}'
        os.system("cls" if os.name == "nt" else "clear")
        securityPass = config["webSocket"]["securityPass"]

        def api(inf):
            server = config["webSocket"]["server"]["2"]
            wsHost = server["host"]
            wsPort = server["port"]
            devices = config["webSocket"]["devices"]
            devSendl = devices[1]["name"]
            url = "http://" + str(wsHost) + ":" + str(wsPort) + "/" + str(devSend)
            payload = inf
            response = requests.post(url, json=payload)

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
            # ignorar hosts → → 'Servidor WebSocket EC2', 'WhatsApp Desktop'
            server = config["webSocket"]["server"]["2"]
            wsHost = server["host"]
            ignoreHosts = f"{wsHost};*fb*;*whatsapp*"
            winreg.SetValueEx(key, "ProxyOverride", 0, winreg.REG_SZ, f"{ignoreHosts}")
            winreg.SetValueEx(key, "ProxyEnable", 0, winreg.REG_DWORD, 1)
            winreg.CloseKey(key)
            subprocess.Popen(command)
            processo_1 = subprocess.Popen("taskkill /IM Stopwatch.exe /F")
            processo_1.wait()
            subprocess.Popen(
                f'"{letter}:/ARQUIVOS/WINDOWS/PORTABLE_Stopwatch/Stopwatch.exe"'
            )
            # print('PROCESSO INICIADO 2')
            time.sleep(3)
            while True:
                processos = psutil.process_iter(["cmdline"])
                indiceArr = -1
                for indice, proc in enumerate(processos):
                    cmdline = proc.info["cmdline"]
                    if cmdline is not None:
                        cmdline_str = " ".join(cmdline)
                        if "nodeSniffer_Python.exe" in cmdline_str:
                            indiceArr = indice
                            # print(f"ID→ {proc.pid} | COMMAND LINE→ {cmdline_str}")
                            break
                if indiceArr == -1:
                    # print('NAO 2')
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
                                # print(f"ID→ {proc.pid} | COMMAND LINE→ {cmdline_str}")
                                # print('PROCESSO ENCERRADO 2')
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
                        # print(f"ID→ {proc.pid} | COMMAND LINE→ {cmdline_str}")
                        proc.terminate()
                        # print('PROCESSO ENCERRADO 1')
                        checkProcess2()
                        break
            if indiceArr == -1:
                # print('NAO 1')
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
        subprocess.Popen(
            f'"{letter}:/ARQUIVOS/WINDOWS/BAT/notify-send.exe" "ALERTA: PYTHON start.py" "Ocorreu um erro [DESATIVADO]"'
        )
        subprocess.Popen("taskkill /IM nodeSniffer_Python.exe /F")
        # ENCERRAR SCRIPT PYTHON
        sys.exit()


run()
