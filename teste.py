def escreverEmArquivo(texto, caminho_arquivo, modo):
    f = open(caminho_arquivo, modo)
    f.write(texto)
    f.close()

texto = "aaaaaaaaaa"
caminho = "arquivo3.txt"
modo = "a"

escreverEmArquivo(texto, caminho, modo)