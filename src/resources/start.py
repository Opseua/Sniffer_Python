import sys
import psutil
import os
import winreg
import argparse
import subprocess
import time
import subprocess
proxyPort = 8088
arg = sys.argv[1] if len(sys.argv) > 1 else None
path = os.getcwd().replace("\\", "/")
command = f'mitmdump --anticache -s {path}/src/resources/sniffer.py --mode regular@{proxyPort} --quiet'
os.system('cls' if os.name == 'nt' else 'clear')

def checkProcess2():
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
            key = winreg.OpenKey(winreg.HKEY_CURRENT_USER,
                                "Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings", 0, winreg.KEY_WRITE)
            winreg.SetValueEx(key, "ProxyServer", 0, winreg.REG_SZ,"")
            winreg.SetValueEx(key, "ProxyEnable", 0, winreg.REG_DWORD, 0)
            winreg.CloseKey(key)
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




