# arrHost = ['google.com','ntfy.sh']
# arrUrl = ['https://www.bing.com/search?q=casa&oq=','https://www.google.com/search?q=casa&oq=']
# arrMatch = ['amazon.com/ola/teste','americanas.com/casa/carro']

# link = 'google.coma'

# if link in arrHost or link in arrUrl or any(link in s for s in arrMatch):
#     print('igual sim')
# else:
#     print('igual nao')

# if any(link in s for s in arrMatch):
#     print('parte sim')
# else:
#     print('parte nao')


import re

rgx = ['htww.google.com/search?q=casa&oq=*', 'https://www.google.com/search?q=casa&oq=']
url = 'https://www.google.com/search?q=casa&oq='

regex = ''
try:
    rgx = [re.escape(p).replace(r'\*', '.*') for p in rgx]
    regex = any(re.match(f"^{r}$", url) for r in rgx)
except Exception as error:
    regex = 'ERRO'

if regex is True:
    print('SIM')
elif regex is False:
    print('NAO')
else:
    print('ERRO')
