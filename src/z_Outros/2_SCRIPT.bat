@chcp 65001 && @echo off && setlocal enabledelayedexpansion
set "letra=%cd:~0,1%" && set "local=%CD%" && set "arquivo=%~nx0"
set "usuario=%USERNAME%" && set "argTUDO=%~1 %~2 %~3 %~4 %~5"
set "arg1=%~1" && set "arg2=%~2" && set "arg3=%~3" && set "arg4=%~4" && set "arg5=%~5"

set "start=SIM"
set "adm=#" && NET SESSION >nul 2>&1
if !errorlevel! neq 0 ( set "adm=NAO" ) else ( set "adm=SIM" )

echo WScript.Echo(new Date().getTime()); > !temp!\time.js && for /f "delims=" %%a in ('cscript //nologo !temp!\time.js') do set "timeNow=%%a"
set "timeNow=!timeNow:~0,-3!" && set "dia=!DATE:~0,2!" && set "mes=!DATE:~3,2!" && set "fileAll=log\MES_!mes!_DIA_!dia!.txt"

if "%arg1%"=="" ( msg * "Usar o atalho e nao o executavel" && exit )

rem PASTA DO PROJETO
cd\ && !letra!:
cd ARQUIVOS\PROJETOS\Sniffer_Python

rem NODE EXE | NODE PATH
set "nodeExe=nodeSniffer_Python.exe"
set "nodePath=!letra!:\ARQUIVOS\WINDOWS\PORTABLE_NodeJS\!nodeExe!"

rem SCRIPT
set "nodeScr=!letra!:\ARQUIVOS\PROJETOS\Sniffer_Python\src\server.js"

rem CHECK PM2
set "checkPm2List=!letra!:\ARQUIVOS\WINDOWS\BAT\checkPm2List.bat"

rem WGET
set "wget=!letra!:\ARQUIVOS\WINDOWS\BAT\wget.exe"

rem NIRCMD
set "nircmd=!letra!:\ARQUIVOS\WINDOWS\BAT\nircmd.exe"

rem NOME PM2
rem SUBSTITUIR dois ponto, barra e espaço
set "replace=-" && set "result=!nodeScr::=%replace%!"
set "replace=-" && set "result=!result:\=%replace%!"
set "replace=-" && set "result=!result:_=%replace%!"
set "nodeScrPm2=!result!"

set "winTP=48 16 80 320"
set "winTP=48 16 500 300"
set "ret="
if "%arg1%"=="%arg1:keep=%" (
	rem 'keep' [NÃO] (NodeJS)
	
	rem PROCURAR SE O PROCESSO ESTÁ RODANDO
	tasklist | find /i "!nodeExe!" >nul
	if !errorlevel! equ 0 (
		rem ENCONTROU [SIM]
		taskkill /IM !nodeExe! /F
		goto ENCONTROU_[SIM]
	) else (
		rem ENCONTROU [NÃO]
		if not "%arg1%"=="%arg1:view=%" (
		rem 'view' [SIM]
		start "!nodeScrPm2!" "!nodePath!" "!nodeScr!"
		) else (
		rem 'view' [NÃO]
		!1_BACKGROUND! "!nodePath!" "!nodeScr!"
		)
		goto ENCONTROU_[NAO]
	)
		
) else (
	rem 'keep' [SIM] (pm2)
	
	call "!checkPm2List!" "!nodeScrPm2!" "!nodeScr!" "!nodeExe!"
	set "ret=!ret2!"
	if "!ret!"=="true" (
		rem list [SIM]
		goto ENCONTROU_[SIM]
	) else (
		rem list [NÃO]
		if not "%arg1%"=="%arg1:view=%" (
			rem 'view' [SIM]
			rem "!CD!\src\z_Outros\z_pm2 logs --no-daemon.lnk"
			"!CD!\src\z_Outros\z_pm2 logs.lnk"
		)
		goto ENCONTROU_[NAO]
	)
	
)


exit
exit
:ENCONTROU_[SIM]
rem EXPLORER É A API 'Script parado'
rem !1_BACKGROUND! "explorer"
!1_BACKGROUND! "!nircmd! win close ititle !nodeScrPm2!"
rem sendData [status]
set "url=http://18.191.205.200:8888/EC2_NODEJS"
set "method=POST"
set "headers=--header=Content-Type:application/json --header=chave1:valor1 --header=chave2:valor2"
set "body={"fun":[{"securityPass":"Password@2023WebSocketRet","retInf":false,"name":"sendData","par":{"stop":false,"status1":"$ Script parado","id":"1UzSX3jUbmGxVT4UbrVIB70na3jJ5qYhsypUeDQsXmjc","tab":"INDICAR_AUTOMATICO_[TELEIN]","range":"A32"}}]}"
set "bodyPath=!TEMP!\wgetBody.txt"
echo !body! > !bodyPath!
rem "!wget!" --post-file=!bodyPath! !headers! --quiet -O- !url!	


exit
exit
:ENCONTROU_[NAO]
rem NOTEPAD É A API 'Iniciando Script'
rem !1_BACKGROUND! "notepad"
!1_BACKGROUND! "ping 127.0.0.1 -n 3 > nul && !nircmd! win setsize ititle !nodeScrPm2! !winTP!"
rem sendData [status]
set "url=http://18.191.205.200:8888/EC2_NODEJS"
set "method=POST"
set "headers=--header=Content-Type:application/json --header=chave1:valor1 --header=chave2:valor2"
set "body={"fun":[{"securityPass":"Password@2023WebSocketRet","retInf":false,"name":"sendData","par":{"stop":false,"status1":"# Aguarde......","id":"1UzSX3jUbmGxVT4UbrVIB70na3jJ5qYhsypUeDQsXmjc","tab":"INDICAR_AUTOMATICO_[TELEIN]","range":"A32"}}]}"
set "bodyPath=!TEMP!\wgetBody.txt"
echo !body! > !bodyPath!
rem "!wget!" --post-file=!bodyPath! !headers! --quiet -O- !url!	


exit
exit


