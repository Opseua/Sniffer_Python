@chcp 65001 & @echo off & setlocal enabledelayedexpansion
set "letra=%~d0" & set "local=%~dp0"
set "letra=%letra:~0,1%" & set "local=%local:~0,-1%" & set "arquivo=%~nx0" & set "argString=%*"
set "usuario=%USERNAME%" & set "argTUDO=%~1 %~2 %~3 %~4 %~5" & set "arg1=%~1" & set "arg2=%~2" & set "arg3=%~3" & set "arg4=%~4"

rem AVISO PARA USAR O ATALHO COM PARAMENTROS
rem if "!arg1!" equ "" !fileMsg! "[!local!\!arquivo!]\n\nNao usar o BAT/BACKGROUND" & exit

rem set "start=ERRO" & set "adm=ERRO" & NET SESSION >nul 2>&1 & if !errorlevel! neq 0 ( set "adm=NAO" ) else ( set "adm=SIM" )

rem echo WScript.Echo(new Date().getTime()); > !temp!\time.js & for /f "delims=" %%a in ('cscript //nologo !temp!\time.js') do set "timeNow=%%a"
rem set "timeNow=!timeNow:~0,-3!" & set "dia=!DATE:~0,2!" & set "mes=!DATE:~3,2!"

cd\ & !letra!: & cd !fileProjetos!\Sniffer_Python

rem ********************************************************************************************************************************************************

set "ret=!arg2!" & set "action=ERRO"

rem OFF
if "!arg1!"=="OFF" ( if not "!ret!"=="FALSE" ( set "action=OFF" ) )

rem ON_HIDE
if "!arg1!"=="ON_HIDE" ( if "!ret!"=="FALSE" ( set "action=ON_HIDE" ) )

rem ON_VIEW
if "!arg1!"=="ON_VIEW" ( if "!ret!"=="FALSE" ( set "action=ON_VIEW" ) )

rem TOGGLE_HIDE
if "!arg1!"=="TOGGLE_HIDE" ( if "!ret!"=="FALSE" ( set "action=ON_HIDE" ) else ( set "action=OFF" ) )

rem TOGGLE_VIEW
if "!arg1!"=="TOGGLE_VIEW" ( if "!ret!"=="FALSE" ( set "action=ON_VIEW" ) else ( set "action=OFF" ) )

rem ### OFF
if not "!action!"=="!action:OFF=!" (
	!2_BACKGROUND! "taskkill /IM pythonSniffer_Python_server.exe /F"
	
	rem → SCRIPT DE INSTALACAO | PROXY MANUAL
	!2_BACKGROUND! "reg ADD #1#HKCU\Software\Microsoft\Windows\CurrentVersion\Internet Settings#1# /v AutoConfigURL /t REG_SZ /d #1##1# /F & reg ADD #1#HKCU\Software\Microsoft\Windows\CurrentVersion\Internet Settings#1# /v ProxyEnable /t REG_DWORD /d 0 /F & reg ADD #1#HKCU\Software\Microsoft\Windows\CurrentVersion\Internet Settings#1# /v ProxyServer /t REG_SZ /d #1##1# /F & reg ADD #1#HKCU\Software\Microsoft\Windows\CurrentVersion\Internet Settings#1# /v ProxyOverride /t REG_SZ /d #1##1# /F"
)

rem ### ON
if not "!action!"=="!action:ON=!" (
	rem NAO USAR O '2_BACKGROUND' PARA ENCERRAR O PROCESSO!!!
	taskkill /IM pythonSniffer_Python_server.exe /F

	rem → SCRIPT DE INSTALACAO
	!2_BACKGROUND! "reg ADD #1#HKCU\Software\Microsoft\Windows\CurrentVersion\Internet Settings#1# /v AutoConfigURL /t REG_SZ /d #1#http://127.0.0.1:8889/?act=getFilePac&roo=&mes=#1# /F"
	
	if "!action!"=="ON_HIDE" (
		rem * HIDE
		!2_BACKGROUND! !fileWindows!\PORTABLE_Python\pythonSniffer_Python_server.exe src\sniffer.py
	) else (
		rem * VIEW
		start "pythonSniffer_Python_server_sniffer.py" !fileWindows!\PORTABLE_Python\pythonSniffer_Python_server.exe src\sniffer.py
		rem JANELA DO LOG POSICIONAR
		!2_BACKGROUND! "timeout 3 > nul & !fileNircmdSetSize! pythonSniffer_Python_server_sniffer.py WINTP3"
	)
)

rem NOTIFICATION → SNIFFER OFF
if not "!action!"=="!action:OFF=!" (
	!2_BACKGROUND! "taskkill /IM stopwatch.exe /F"
	set "url=http://127.0.0.1:!confPort!/?roo=OPSEUA-NODEJS-WEBSOCKET-SERVER"
	set "headers=--header=Content-Type:application/json --header=chave1:valor1 --header=chave2:valor2"
	set "body={"fun":[  {"securityPass":"!confSecurityPass!","name":"notification","par":{"duration": 2,"icon":"notification_2.png","title":"SNIFFER","text":"Desativado"}},  {"securityPass":"!confSecurityPass!","name":"chromeActions","par":{"action":"badge","text":""}}  ]}"
	set "pathRes=!local!\z_BODY_RES.txt" & set "pathReq=!local!\z_BODY_REQ.txt" & echo !body! > "!pathReq!" & "!wget!" "--post-file=!pathReq!" "!headers!" --quiet -O "!pathRes!" "!url!"
	del /F /Q "!pathRes!" & del /F /Q "!pathReq!"
)

rem NOTIFICATION → SNIFFER ON
if not "!action!"=="!action:ON=!" (
	!2_BACKGROUND! "taskkill /IM stopwatch.exe /F & !fileWindows!\PORTABLE_Stopwatch\stopwatch.exe"
	set "url=http://127.0.0.1:!confPort!/?roo=OPSEUA-NODEJS-WEBSOCKET-SERVER"
	set "headers=--header=Content-Type:application/json --header=chave1:valor1 --header=chave2:valor2"
	set "body={"fun":[  {"securityPass":"!confSecurityPass!","name":"notification","par":{"duration": 2,"icon":"notification_1.png","title":"SNIFFER","text":"Ativado"}},  {"securityPass":"!confSecurityPass!","name":"chromeActions","par":{"action":"badge","text":"ON","color":"#19ff47"}}  ]}"
	set "pathRes=!local!\z_BODY_RES.txt" & set "pathReq=!local!\z_BODY_REQ.txt" & echo !body! > "!pathReq!" & "!wget!" "--post-file=!pathReq!" "!headers!" --quiet -O "!pathRes!" "!url!"
	del /F /Q "!pathRes!" & del /F /Q "!pathReq!"
)





