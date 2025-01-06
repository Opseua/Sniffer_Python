@chcp 65001 & @echo off & setlocal enabledelayedexpansion
set "letra=%~d0" & set "local=%~dp0"
set "letra=%letra:~0,1%" & set "local=%local:~0,-1%" & set "arquivo=%~nx0" & set "argString=%*"
set "usuario=%USERNAME%" & set "argTUDO=%~1 %~2 %~3 %~4 %~5" & set "arg1=%~1" & set "arg2=%~2"

rem AVISO PARA USAR O ATALHO COM PARAMENTROS
if "!arg1!" == "" ( !fileMsg! "[!local!\!arquivo!]\\n\\nNao usar o BAT/BACKGROUND" & exit )

rem set "start=ERRO" & set "adm=ERRO" & NET SESSION > nul 2>&1 & if !errorlevel! neq 0 ( set "adm=NAO" ) else ( set "adm=SIM" )

rem echo WScript.Echo(new Date().getTime()); > !temp!\time.js & for /f "delims=" %%a in ('cscript //nologo !temp!\time.js') do set "timeNow=%%a"
rem set "timeNow=!timeNow:~0,-3!" & set "dia=!DATE:~0,2!" & set "mes=!DATE:~3,2!"

rem ********************************************************************************************************************************************************

set "action=ERRO"
if "!arg1!"=="OFF" (
	set "action=OFF"
) else (
	if not "!arg2!"=="!arg2:E=!" (
		if not "!arg2!"=="FALSE" (
			rem OFF
			set "action=OFF"
		) else (
			rem ON_VIEW | ON_HIDE
			if not "!arg1!"=="!arg1:_VIEW=!" ( set "action=ON_VIEW" ) else ( set "action=ON_HIDE" )
		)
	)
)

set "project=Sniffer_Python"

rem ### ON
if not "!action!"=="!action:ON=!" (
	rem ENCERRAR PYTHON (NAO USAR O BACKGROUND!!! DO CONTRARIO ELE ENCERRA O PYTHON QUE SERA INICIADO)
	taskkill /IM python!project!_server.exe /F

	rem MUDAR LOCAL DO TERMINAL
	cd /d !fileProjetos!\!project!
	
	if "!action!"=="ON_HIDE" (
		rem [HIDE]
		!3_BACKGROUND! /NOCONSOLE "!fileWindows!\PORTABLE_Python\python!project!_server.exe !fileProjetos!\!project!\src\sniffer.py"
	) else (
		rem [VIEW] OBRIGATORIO O '/RUNAS'!!! | JANELA DO LOG POSICIONAR
		!3_BACKGROUND! /NOCONSOLE /RUNAS "cmd.exe /c title CMD_python!project!_server_sniffer.py& start "python!project!_server_sniffer.py" !fileWindows!\PORTABLE_Python\python!project!_server.exe !fileProjetos!\!project!\src\sniffer.py" "cmd.exe /c ping -n 4 -w 1000 127.0.0.1 > nul & !fileNircmdSetSize! python!project!_server_sniffer.py WINTP3"
	)
	
	rem → PROXY [ON] - SCRIPT DE INSTALACAO | ENCERRAR E INICIAR stopwatch
	!3_BACKGROUND! /NOCONSOLE "reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Internet Settings" /v ProxyEnable /t REG_DWORD /d 0 /F" "reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Internet Settings" /v AutoConfigURL /t REG_SZ /d "http://127.0.0.1:8889/?act=getFilePac" /F" "cmd.exe /c taskkill /IM stopwatch.exe /F & !fileWindows!\PORTABLE_Stopwatch\Stopwatch.lnk"

	ping -n 1 -w 1000 127.0.0.1 > nul

	rem NOTIFICATION → SNIFFER ON
	set "headers=--header=Content-Type:application/json --header=chave1:valor1 --header=chave2:valor2"
	set "body={"fun":[  {"securityPass":"!confSecurityPass!","name":"notification","par":{"duration": 2,"icon":"notification_1.png","title":"SNIFFER","text":"Ativado"}},  {"securityPass":"!confSecurityPass!","name":"chromeActions","par":{"action":"badge","text":"ON","color":"#19ff47"}}  ]}"
	set "pathRes=!local!\z_BODY_RES_!outrosAdd!.txt" & set "pathReq=!local!\z_BODY_REQ_!outrosAdd!.txt" & echo !body! > "!pathReq!" & "!wget!" "--post-file=!pathReq!" "!headers!" --quiet -O "!pathRes!" "http://127.0.0.1:!confPort!/?roo=OPSEUA-CHROME-CHROME_EXTENSION-USUARIO_0"
	del /F /Q "!pathRes!" & del /F /Q "!pathReq!"
)

rem ### OFF
if not "!action!"=="!action:OFF=!" (
	rem → PROXY [OFF] - SCRIPT DE INSTALACAO | PROXY MANUAL	| ENCERRAR E INICIAR stopwatch/python
	!3_BACKGROUND! /NOCONSOLE "reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Internet Settings" /v ProxyEnable /t REG_DWORD /d 0 /F" "reg delete "HKCU\Software\Microsoft\Windows\CurrentVersion\Internet Settings" /v AutoConfigURL /f" "cmd.exe /c taskkill /IM stopwatch.exe /F & taskkill /IM python!project!_server.exe /F"
	
	rem NOTIFICATION → SNIFFER OFF
	set "headers=--header=Content-Type:application/json --header=chave1:valor1 --header=chave2:valor2"
	set "body={"fun":[  {"securityPass":"!confSecurityPass!","name":"notification","par":{"duration": 2,"icon":"notification_2.png","title":"SNIFFER","text":"Desativado"}},  {"securityPass":"!confSecurityPass!","name":"chromeActions","par":{"action":"badge","text":""}}  ]}"
	set "pathRes=!local!\z_BODY_RES_!outrosAdd!.txt" & set "pathReq=!local!\z_BODY_REQ_!outrosAdd!.txt" & echo !body! > "!pathReq!" & "!wget!" "--post-file=!pathReq!" "!headers!" --quiet -O "!pathRes!" "http://127.0.0.1:!confPort!/?roo=OPSEUA-CHROME-CHROME_EXTENSION-USUARIO_0"
	del /F /Q "!pathRes!" & del /F /Q "!pathReq!"
)


