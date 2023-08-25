# with open("D:/parametros.txt", "w") as file: # 'a' adiciona, 'w' limpa
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

script_dir = os.path.dirname(os.path.abspath(__file__))
full_path = os.path.abspath(os.path.join(script_dir, ''))
full_pathJson = os.path.abspath(os.path.join(script_dir, '../../../Chrome_Extension/src/config.json'))
config = ''
with open(full_pathJson, 'r') as file:
    config = json.load(file)
portMitm = config['sniffer']['portMitm'] 
arrUrl = config['sniffer']['arrUrl']
arrHost = [urlparse(url).hostname for url in arrUrl if urlparse(url).scheme in ('http', 'https')]
arrHost = ' '.join([f'--allow-hosts "{hostname}"' for hostname in list(set(arrHost))])
command = f'mitmdump --quiet --anticache -s "{full_path}\\sniffer.py" --mode regular@{portMitm} {arrHost}'
os.system('cls' if os.name == 'nt' else 'clear')

def api(inf1):
    securityPass = config['webSocket']['securityPass'] 
    wsHost = config['webSocket']['ws1'] 
    portWebSocket = config['webSocket']['portWebSocket'] 
    device1 = config['webSocket']['device1']['name']
    url = "http://" + str(wsHost) + ":" + str(portWebSocket) + "/" + str(device1)
    payload = {
    "fun": {
        "securityPass": securityPass,
        "funRet": {
            "ret": False,
            "url": "ws://xx.xxx.xxx.xx:xx/######_RET",
            "inf": "ID DO RETORNO"
        },
        "funRun": {
            "name": "chromeActions",
            "par": { 
                "action": "badge", 
                "inf": { "text": inf1 }
                }
            }
        }
    }
    response = requests.post(url, json=payload)

def checkProcess2():
    api('PYTH')
    key = winreg.OpenKey(winreg.HKEY_CURRENT_USER,
                         "Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings", 0, winreg.KEY_WRITE)
    winreg.SetValueEx(key, "ProxyEnable", 0, winreg.REG_DWORD, 1)
    winreg.SetValueEx(key, "ProxyServer", 0, winreg.REG_SZ,
                      "127.0.0.1:" + str(portMitm))
    winreg.CloseKey(key)
    subprocess.Popen(command)
    #print('PROCESSO INICIADO 2')
    time.sleep(3)
    while True:
        processos = psutil.process_iter(['cmdline'])
        indiceArr = -1 
        for indice, proc in enumerate(processos):
            cmdline = proc.info['cmdline']
            if cmdline is not None:
                cmdline_str = ' '.join(cmdline)
                if 'sniffer.js' in cmdline_str:
                    indiceArr = indice
                    #print(f"ID→ {proc.pid} | COMMAND LINE→ {cmdline_str}")
                    break
        if indiceArr == -1:
            #print('NAO 2')
            api('')
            key = winreg.OpenKey(winreg.HKEY_CURRENT_USER,
                                "Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings", 0, winreg.KEY_WRITE)
            winreg.SetValueEx(key, "ProxyServer", 0, winreg.REG_SZ,"")
            winreg.SetValueEx(key, "ProxyEnable", 0, winreg.REG_DWORD, 0)
            winreg.CloseKey(key)
            processos = psutil.process_iter(['cmdline'])
            for indice, proc in enumerate(processos):
                cmdline = proc.info['cmdline']
                if cmdline is not None:
                    cmdline_str = ' '.join(cmdline)
                    if 'sniffer.py' in cmdline_str:
                        #print(f"ID→ {proc.pid} | COMMAND LINE→ {cmdline_str}")
                        #print('PROCESSO ENCERRADO 2')                     
                        proc.terminate()
                        break
            break
        time.sleep(3)

def checkProcess1():
    processos = psutil.process_iter(['cmdline'])
    indiceArr = -1 
    for indice, proc in enumerate(processos):
        cmdline = proc.info['cmdline']
        if cmdline is not None:
            cmdline_str = ' '.join(cmdline)
            if 'sniffer.py' in cmdline_str:
                indiceArr = indice
                #print(f"ID→ {proc.pid} | COMMAND LINE→ {cmdline_str}")
                proc.terminate()
                #print('PROCESSO ENCERRADO 1')
                checkProcess2()
                break
    if indiceArr == -1:
        #print('NAO 1')
        checkProcess2()
checkProcess1()


