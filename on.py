import winreg
import argparse
import subprocess

def enable_proxy(port):
    # Chave do Registro onde estão armazenadas as configurações do proxy no Windows
    key = winreg.OpenKey(winreg.HKEY_CURRENT_USER, "Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings", 0, winreg.KEY_WRITE)

    # Habilitar o proxy
    winreg.SetValueEx(key, "ProxyEnable", 0, winreg.REG_DWORD, 1)

    # Definir o endereço e a porta do proxy
    winreg.SetValueEx(key, "ProxyServer", 0, winreg.REG_SZ, "127.0.0.1:" + str(port))

    # Fechar a chave do Registro
    winreg.CloseKey(key)

    # Executar o server.py em um processo separado
    subprocess.run(["python", "server.py", "-p", str(port)])

if __name__ == '__main__':
    # Configurar o parser de argumentos
    parser = argparse.ArgumentParser()
    parser.add_argument('-p', '--port', type=int, default=8887, help='Número da porta do proxy')
    args = parser.parse_args()

    # Habilitar o proxy e executar o server.py com a porta especificada
    enable_proxy(args.port)
