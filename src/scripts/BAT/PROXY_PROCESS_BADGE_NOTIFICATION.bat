@chcp 65001 & @echo off & setlocal enabledelayedexpansion
set "local=%~dp0" & set "local=!local:~0,-1!" & set "letra=!local:~0,1!" & set "arquivo=%~nx0" & set "argString=%*" & set "arg1=%~1" & set "arg2=%~2" & set "arg3=%~3" & set "arg4=%~4"

rem AVISO PARA USAR O ATALHO COM PARAMENTROS
if "!arg1!" == "" ( !3_BACKGROUND! /NOCONSOLE "cmd.exe /c !fileMsg! "[!local!\!arquivo!]\\n\\nNENHUM PARAMETRO PASSADO"" & exit )
rem NET SESSION > nul 2>&1 & if !errorlevel! neq 0 ( set "adm=NAO" ) else ( set "adm=SIM" )
rem echo WScript.Echo(new Date().getTime()); > !temp!\time.js & for /f "delims=" %%a in ('cscript //nologo !temp!\time.js') do set "tNow=%%a" & set "tNow=!tNow:~0,-3!" & set "dia=!DATE:~0,2!" & set "mes=!DATE:~3,2!"
rem ********************************************************************************************************************************************************

set "project=!arg1!" & set "serverFile=!arg2!" & set "action=!arg3!" & set "ret=!arg4!"

set "actionRun=ERRO"
set "programExe=python-!project!-!serverFile!"

if not "!action!" == "!action:OFF=!" ( 
	set "actionRun=OFF"
) else (
	if not "!ret!" == "!ret:E=!" (
		if not "!ret!" == "FALSE" (
			rem OFF
			set "actionRun=OFF"
		) else (
			rem ON_VIEW | ON_HIDE
			if not "!action!" == "!action:_VIEW=!" ( set "actionRun=ON_VIEW" ) else ( set "actionRun=ON_HIDE" )
		)
	)
)

rem ### ON
if not "!actionRun!" == "!actionRun:ON=!" (

	rem ENCERRAR PYTHON (NAO USAR O BACKGROUND!!! DO CONTRARIO ELE ENCERRA O PYTHON QUE SERA INICIADO)
	taskkill /IM !programExe!.exe /F

	rem MUDAR LOCAL DO TERMINAL
	cd /d !fileProjetos!\!project!

	rem EXECUTAR O PYTON DO venv
	set "venvAndRun=!fileProjetos!\!project!\.venv\Scripts\!programExe!.exe !fileProjetos!\!project!\src\!serverFile!.py"

	if "!actionRun!" == "ON_HIDE" (
		rem [HIDE]
		!3_BACKGROUND! /NOCONSOLE "!venvAndRun!"
	) else (
		rem [VIEW] OBRIGATORIO O '/RUNAS'!!! | JANELA DO LOG POSICIONAR
		!3_BACKGROUND! /NOCONSOLE /RUNAS "cmd.exe /c title !programExe!-CMD& start "!programExe!-WIND" !venvAndRun!" "cmd.exe /c ping -n 4 -w 1000 127.0.0.1 > nul & !fileSetSize! !programExe!-WIND _WINTP3_ EXATO"
	)
	
	rem → PROXY [ON] - SCRIPT DE INSTALACAO
	set "eComercial=&"
	!3_BACKGROUND! /NOCONSOLE "reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Internet Settings" /v ProxyEnable /t REG_DWORD /d 0 /F" "reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Internet Settings" /v AutoConfigURL /t REG_SZ /d "http://127.0.0.1:!confPort!/?act=!confSecurityPass!-webfile!eComercial!roo=OPSEUA-NODE-WEBSOCKET-SERVER!eComercial!mes=!fileProjetos!\Sniffer_Python\src\scripts\BAT\proxy.pac!eComercial!mode=dow" /F"
	
)

rem ### OFF
if not "!actionRun!" == "!actionRun:OFF=!" (

	rem → PROXY [OFF] - SCRIPT DE INSTALACAO | PROXY MANUAL
	!3_BACKGROUND! /NOCONSOLE "reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Internet Settings" /v ProxyEnable /t REG_DWORD /d 0 /F" "reg delete "HKCU\Software\Microsoft\Windows\CurrentVersion\Internet Settings" /v AutoConfigURL /f" "cmd.exe /c taskkill /IM !programExe!.exe /F"
	
	rem NOTIFICATION → SNIFFER OFF [CHROME_0]
	set "headers=--header=Content-Type:application/json --header=chave1:valor1 --header=chave2:valor2"
	set "body={"fun":[  {"securityPass":"!confSecurityPass!","name":"notification","par":{"duration": 2,"icon":"iconBlue","title":"SNIFFER","text":"Desativado","ntfy":false}},  {"securityPass":"!confSecurityPass!","name":"chromeActions","par":{"action":"badge","text":""}}  ]}"
	set "pathRes=!local!\z_BODY_RES_!outrosAdd!.txt" & set "pathReq=!local!\z_BODY_REQ_!outrosAdd!.txt" & echo !body! > "!pathReq!" & "!wget!" "--post-file=!pathReq!" "!headers!" --quiet -O "!pathRes!" "http://127.0.0.1:!confPort!/?roo=OPSEUA-CHROME-CHROME_EXTENSION-USUARIO_0"
	del /F /Q "!pathRes!" & del /F /Q "!pathReq!"

	rem RESETAR BADGE [CHROME_3]
	set "body={"fun":[  {"securityPass":"!confSecurityPass!","name":"chromeActions","par":{"action":"badge","text":""}}  ]}"
	set "pathRes=!local!\z_BODY_RES_!outrosAdd!.txt" & set "pathReq=!local!\z_BODY_REQ_!outrosAdd!.txt" & echo !body! > "!pathReq!" & "!wget!" "--post-file=!pathReq!" "!headers!" --quiet -O "!pathRes!" "http://127.0.0.1:!confPort!/?roo=OPSEUA-CHROME-CHROME_EXTENSION-USUARIO_3"
	del /F /Q "!pathRes!" & del /F /Q "!pathReq!"
	
)


