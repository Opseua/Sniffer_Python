import winreg
import subprocess

def disable_proxy():
    # Chave do Registro onde estão armazenadas as configurações do proxy no Windows
    key = winreg.OpenKey(winreg.HKEY_CURRENT_USER, "Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings", 0, winreg.KEY_WRITE)

    # Definir o endereço e a porta do proxy
    winreg.SetValueEx(key, "ProxyServer", 0, winreg.REG_SZ, "")

    # Desabilitar o proxy
    winreg.SetValueEx(key, "ProxyEnable", 0, winreg.REG_DWORD, 0)

    # Fechar a chave do Registro
    winreg.CloseKey(key)

    # Encerrar o processo do server.py
    subprocess.run(["taskkill", "/f", "/im", "python.exe", "/t"])

if __name__ == '__main__':
    # Desabilitar o proxy e encerrar o server.py
    disable_proxy()
