def escreverEmArquivo(texto, caminho_arquivo, modo):
    f = open(caminho_arquivo, modo)
    f.write(texto)
    f.close()