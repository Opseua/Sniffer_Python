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

# with open("./stateaaaaaaaa.txt", 'w') as file:
#     file.write('1')
# if os.path.exists("./stateaaaaaaaa.txt"):
#     os.remove("./stateaaaaaaaa.txt")




letter = os.path.dirname(os.path.realpath(__file__))[0]
script_dir = os.path.dirname(os.path.abspath(__file__)).replace("\\", "/")
full_path = os.path.abspath(os.path.join(script_dir, '')).replace("\\", "/")
full_pathJson = os.path.abspath(os.path.join(script_dir, f'{letter}:/ARQUIVOS/PROJETOS/Chrome_Extension/src/config.json')).replace("\\", "/")
config = ''
with open(full_pathJson, 'r') as file:
    config = json.load(file)
with open("./stateaaaaaaaaeeeeeeeeeee.txt", 'w') as file:
    file.write("aaa")    