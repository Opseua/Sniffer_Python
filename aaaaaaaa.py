import re

rgx = 'oogle.com*'
rgxArr = ['https://www.google.com/search?q=casa&oq*']
url = 'https://www.google.com/search?q=casa&oq='

def rgxMat(a, b):
    c = re.escape(b).replace(r'\*', '.*')
    return re.match(f"^{c}$", a) is not None

found = next((m for m in rgxArr if rgxMat(url, m)), None)
if found is not None:
    print(True)
else:
    print('nao')