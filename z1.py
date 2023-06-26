import socket
import base64

sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
sock.connect(('localhost', 8888))

sendSockRes  = 'teste'
base64Res = base64.b64encode(sendSockRes.encode('utf-8'))
buffer = 1
for i in range(0, len(base64Res), buffer):
    part = base64Res[i:i+buffer]
    sent = sock.send(part)
sock.send('#fim#'.encode('utf-8'))
print('fim')


 
getSockRes = ''
buffer
while True:
    chunk = sock.recv(buffer)
    getSockRes += chunk.decode()
    if '#fim#' in getSockRes:
        getSockRes = getSockRes.split('#fim#')[0].rstrip()
        break

print(getSockRes)