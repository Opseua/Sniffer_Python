# This is a super **SIMPLE** example of how to create a very basic powershell Web server
# 2019-05-18 UPDATE — Created by me and and evalued by @jakobii and the comunity.
# https://gist.github.com/19WAS85/5424431

# Http Server
$http = New-Object System.Net.HttpListener

# Hostname and port to listen on
$http.Prefixes.Add("http://localhost:8089/")

# Start the Http Server 
$http.Start()

# Log ready message to terminal 
if ($http.IsListening) {
    write-host "Servidor HTTP rodando em $($http.Prefixes)" -f 'black' -b 'gre'
	Start-Process reg -ArgumentList 'ADD "HKCU\Software\Microsoft\Windows\CurrentVersion\Internet Settings" /v AutoConfigURL /t REG_SZ /d "http://localhost:8089/files/proxy.pac" /F' -NoNewWindow -Wait
	write-host "Proxy ativado" -f 'y'
}

# INFINTE LOOP
# Used to listen for requests
while ($http.IsListening) {

	[string]$html = "<html><head><title>Powershell Website</title></head><body>"

    # Get Request Url
    # When a request is made in a web browser the GetContext() method will return a request object
    # Our route examples below will use the request object properties to decide how to respond
    $context = $http.GetContext()

	if ($context.Request.HttpMethod -eq 'GET') {
		$relativePath = $context.Request.RawUrl -replace '/files', ''
		$requestedPath = "D:\ARQUIVOS\PROJETOS\Sniffer_Python\src\scripts\BAT$relativePath"

		if (Test-Path $requestedPath) {
			$item = Get-Item $requestedPath
			if ($item.PSIsContainer) {
				# O pedido é uma pasta
				write-host "$($context.Request.UserHostAddress)  =>  $($context.Request.Url) at $(Get-Date -Format 'dd-MM HH:mm:ss.fff')" -f 'mag'

				# Listar arquivos na pasta
				$files = (Get-ChildItem -Path $requestedPath).Name
				[string]$html = "<h1>A Powershell Web server</h1><p>Files in $requestedPath</p><ul>"
				foreach ($file in $files) {
					[string]$html += "<li><a href='/files$relativePath/$file'>$file</a></li>"
				}
				[string]$html += "</ul>"

				# Enviar resposta HTML
				$buffer = [System.Text.Encoding]::UTF8.GetBytes($html)
				$context.Response.ContentLength64 = $buffer.Length
				$context.Response.OutputStream.Write($buffer, 0, $buffer.Length)
				$context.Response.OutputStream.Close() # close the response
			} else {
				# O pedido é um arquivo
				write-host "$($context.Request.UserHostAddress)  =>  Downloading $requestedPath at $(Get-Date -Format 'dd-MM HH:mm:ss.fff')" -f 'magenta'

				# Definir cabeçalhos para download
				$context.Response.ContentType = "application/octet-stream"
				$context.Response.AddHeader("Content-Disposition", "attachment; filename=`"$([System.IO.Path]::GetFileName($requestedPath))`"")

				# Ler o arquivo e enviar os bytes
				$buffer = [System.IO.File]::ReadAllBytes($requestedPath)
				$context.Response.ContentLength64 = $buffer.Length
				$context.Response.OutputStream.Write($buffer, 0, $buffer.Length)
				$context.Response.OutputStream.Close() # close the response
			}
		} else {
			# Arquivo ou pasta não encontrado
			$context.Response.StatusCode = 404
			$context.Response.StatusDescription = "Not Found"
			$context.Response.OutputStream.Write([System.Text.Encoding]::UTF8.GetBytes("404 Not Found"), 0, 13)
			$context.Response.OutputStream.Close() # close the response
		}
	}

    if ($context.Request.HttpMethod -eq 'GET' -and $context.Request.RawUrl -eq '/exit') {

        # We can log the request to the terminal
        write-host "$($context.Request.UserHostAddress)  =>  $($context.Request.Url) at $(Get-Date -Format 'dd-MM HH:mm:ss.fff')" -f 'mag'

        # the html/data you want to send to the browser
        # you could replace this with: [string]$html = Get-Content "C:\some\path\index.html" -Raw
        [string]$html += "Stopped Powershell web server"
        
        #resposed to the request
        $buffer = [System.Text.Encoding]::UTF8.GetBytes($html) # convert html to bytes
        $context.Response.ContentLength64 = $buffer.Length
        $context.Response.OutputStream.Write($buffer, 0, $buffer.Length) #stream to browser
        $context.Response.OutputStream.Close() # close the response
        $http.Stop()
        $http.Close()
        break
    }

    # powershell will continue looping and listen for new requests...

} 

# Note:
# To end the loop you have to kill the powershell terminal. ctrl-c wont work :/
# or go to the /exit endpoint