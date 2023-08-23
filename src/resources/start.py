import sys
import psutil
import os
import winreg
import argparse
import subprocess
import time
import subprocess
import json
import requests
proxyPort = 8088
arg = sys.argv[1] if len(sys.argv) > 1 else None
script_dir = os.path.dirname(os.path.abspath(__file__))
full_path = os.path.abspath(os.path.join(script_dir, ''))

path = os.getcwd().replace("\\", "/")
command = f'mitmdump --anticache -s {full_path}/sniffer.py --mode regular@{proxyPort} --quiet'
os.system('cls' if os.name == 'nt' else 'clear')

def api(inf1):
    full_pathJson = os.path.abspath(os.path.join(script_dir, '../../../Chrome_Extension/src/config.json'))
    with open(full_pathJson, 'r') as file:
        config = json.load(file)
        url = "http://" + str(config['webSocketRet']['ws1']) + ":" + str(config['webSocketRet']['port']) + "/" + str(config['webSocketRet']['device1']['name'])
        payload = {
        "fun": {
            "securityPass": config['webSocketRet']['securityPass'],
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
    api('PYT')
    key = winreg.OpenKey(winreg.HKEY_CURRENT_USER,
                         "Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings", 0, winreg.KEY_WRITE)
    winreg.SetValueEx(key, "ProxyEnable", 0, winreg.REG_DWORD, 1)
    winreg.SetValueEx(key, "ProxyServer", 0, winreg.REG_SZ,
                      "127.0.0.1:" + str(proxyPort))
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


