import sys
import psutil
import os
import winreg
import argparse
import subprocess

proxyPort = 8088
arg = sys.argv[1] if len(sys.argv) > 1 else None
path = os.getcwd().replace("\\", "/")
command = f'mitmdump --anticache -s {path}/src/sniffer.py --mode regular@{proxyPort} --quiet'

key = winreg.OpenKey(winreg.HKEY_CURRENT_USER,
                     "Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings", 0, winreg.KEY_WRITE)
winreg.SetValueEx(key, "ProxyEnable", 0, winreg.REG_DWORD, 1)
winreg.SetValueEx(key, "ProxyServer", 0, winreg.REG_SZ,
                  "127.0.0.1:" + str(proxyPort))
winreg.CloseKey(key)

for proc in psutil.process_iter(['name', 'cmdline']):
    if proc.info['name'] == 'python.exe' and 'sniffer.py' in ' '.join(proc.info['cmdline']):
        proc.terminate()
        print('Processo encerrado')
        os.system(command)
        #print('Processo iniciado')
        os.system('exit')
        break
    else:
        os.system(command)
        #print('Processo iniciado')
        os.system('exit')
        break

pass
