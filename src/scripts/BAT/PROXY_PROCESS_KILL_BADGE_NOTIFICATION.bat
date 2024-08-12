@chcp 65001 & @echo off & setlocal enabledelayedexpansion
set "letra=%~d0" & set "local=%~dp0"
set "letra=%letra:~0,1%" & set "local=%local:~0,-1%" & set "arquivo=%~nx0" & set "argString=%*"
set "usuario=%USERNAME%" & set "argTUDO=%~1 %~2 %~3 %~4 %~5" & set "arg1=%~1" & set "arg2=%~2" & set "arg3=%~3" & set "arg4=%~4"

rem AVISO PARA USAR O ATALHO COM PARAMENTROS
if "!arg1!" equ "" !fileMsg! "[!local!\!arquivo!]\n\nNao usar o BAT/BACKGROUND" & exit

rem set "start=ERRO" & set "adm=ERRO" & NET SESSION >nul 2>&1 & if !errorlevel! neq 0 ( set "adm=NAO" ) else ( set "adm=SIM" )

rem echo WScript.Echo(new Date().getTime()); > !temp!\time.js & for /f "delims=" %%a in ('cscript //nologo !temp!\time.js') do set "timeNow=%%a"
rem set "timeNow=!timeNow:~0,-3!" & set "dia=!DATE:~0,2!" & set "mes=!DATE:~3,2!"

cd\ & !letra!: & cd ARQUIVOS\PROJETOS

rem ********************************************************************************************************************************************************

rem ENCERRAR PROCESSO [ONLY Python]
if not "!arg1!"=="!arg1:PROCESS_KILL_ONLY_PYTHON=!" (
	!2_BACKGROUND! taskkill /IM pythonSniffer_Python_server.exe /F
)

rem ENCERRAR PROCESSO [ONLY NodeJS]
if not "!arg1!"=="!arg1:PROCESS_KILL_ONLY_NODE=!" (
	!2_BACKGROUND! taskkill /IM nodeSniffer_Python_server.exe /F
)

rem ENCERRAR PROCESSO [Python e NodeJS]
if not "!arg1!"=="!arg1:PROCESS_KILL_ALL=!" (
	!2_BACKGROUND! taskkill /IM pythonSniffer_Python_server.exe /F
	!2_BACKGROUND! taskkill /IM nodeSniffer_Python_server.exe /F

)

rem ENCERRAR PROCESSO [Stopwatch]
if not "!arg1!"=="!arg1:PROCESS_KILL=!" (
	!2_BACKGROUND! taskkill /IM stopwatch.exe /F
)

rem PROXY → ON
if not "!arg1!"=="!arg1:PROXY_ON=!" (
	rem → PROXY MANUAL
	rem reg ADD "HKCU\Software\Microsoft\Windows\CurrentVersion\Internet Settings" /v ProxyServer /t REG_SZ /d "127.0.0.1:8088" /F
	rem reg ADD "HKCU\Software\Microsoft\Windows\CurrentVersion\Internet Settings" /v ProxyOverride /t REG_SZ /d "127.0.0.1;!confHost!;*fb*;*facebook*;*whatsapp*;*chatgpt*" /F
	rem reg ADD "HKCU\Software\Microsoft\Windows\CurrentVersion\Internet Settings" /v ProxyEnable /t REG_DWORD /d 1 /F
	
	rem → SCRIPT DE INSTALACAO
	reg ADD "HKCU\Software\Microsoft\Windows\CurrentVersion\Internet Settings" /v AutoConfigURL /t REG_SZ /d "http://127.0.0.1:8087/src/scripts/BAT/proxy.pac" /F
)

rem PROXY → OFF
if not "!arg1!"=="!arg1:PROXY_OFF=!" (
	rem → PROXY MANUAL
	rem reg ADD "HKCU\Software\Microsoft\Windows\CurrentVersion\Internet Settings" /v ProxyEnable /t REG_DWORD /d 0 /F
	rem reg ADD "HKCU\Software\Microsoft\Windows\CurrentVersion\Internet Settings" /v ProxyServer /t REG_SZ /d "" /F
	rem reg ADD "HKCU\Software\Microsoft\Windows\CurrentVersion\Internet Settings" /v ProxyOverride /t REG_SZ /d "" /F
	
	rem → SCRIPT DE INSTALACAO
	reg ADD "HKCU\Software\Microsoft\Windows\CurrentVersion\Internet Settings" /v AutoConfigURL /t REG_SZ /d "" /F
)

rem NOTIFICATION → SNIFFER ON
if not "!arg1!"=="!arg1:BADGE_NOTIFICATION_ON=!" (
	!2_BACKGROUND! taskkill /IM stopwatch.exe /F
	set "url=http://127.0.0.1:!confPort!/?roo=OPSEUA-NODEJS-WEBSOCKET-SERVER"
	set "headers=--header=Content-Type:application/json --header=chave1:valor1 --header=chave2:valor2"
	set "body={"fun":[  {"securityPass":"!confSecurityPass!","name":"notification","par":{"duration": 2,"icon":"./src/scripts/media/notification_1.png","title":"SNIFFER","text":"Ativado"}},  {"securityPass":"!confSecurityPass!","name":"chromeActions","par":{"action":"badge","color":[25, 255, 71, 255]}},  {"securityPass":"!confSecurityPass!","name":"chromeActions","par":{"action":"badge","text":"PYTH"}}  ]}"
	set "pathRes=!local!\z_BODY_RES.txt" & set "pathReq=!local!\z_BODY_REQ.txt" & echo !body! > "!pathReq!" & "!wget!" "--post-file=!pathReq!" "!headers!" --quiet -O "!pathRes!" "!url!"
	del /F /Q "!pathRes!" & del /F /Q "!pathReq!"
	!2_BACKGROUND! !letra!:\ARQUIVOS\WINDOWS\PORTABLE_Stopwatch\stopwatch.exe
)

rem NOTIFICATION → SNIFFER OFF
if not "!arg1!"=="!arg1:BADGE_NOTIFICATION_OFF=!" (
	set "url=http://127.0.0.1:!confPort!/?roo=OPSEUA-NODEJS-WEBSOCKET-SERVER"
	set "headers=--header=Content-Type:application/json --header=chave1:valor1 --header=chave2:valor2"
	set "body={"fun":[  {"securityPass":"!confSecurityPass!","name":"notification","par":{"duration": 2,"icon":"./src/scripts/media/notification_2.png","title":"SNIFFER","text":"Desativado"}},  {"securityPass":"!confSecurityPass!","name":"chromeActions","par":{"action":"badge","text":""}}  ]}"
	set "pathRes=!local!\z_BODY_RES.txt" & set "pathReq=!local!\z_BODY_REQ.txt" & echo !body! > "!pathReq!" & "!wget!" "--post-file=!pathReq!" "!headers!" --quiet -O "!pathRes!" "!url!"
	del /F /Q "!pathRes!" & del /F /Q "!pathReq!"
)




