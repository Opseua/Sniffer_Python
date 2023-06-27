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

arrIgual = ['www.bing.com', 'https://www.google.com/search?q=casa&oq=']
str = 'https://ww*.google.com/search?q=casa&*'

def filterBy(str):
    pattern = '^' + str.replace('*', '.*') + '$'
    regex = re.compile(pattern)
    return any(regex.match(a) for a in arrIgual)

if filterBy(re.escape(str).replace('\\*', '.*')):
    print('SIM')
else:
    print('NAO')