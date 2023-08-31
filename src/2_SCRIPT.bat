@chcp 65001
@echo off
NET SESSION >nul 2>&1
if %errorlevel% neq 0 (
	IF "%*"=="" (
		powershell -command "Start-Process '%0' -windowstyle hidden -Verb RunAs" && exit
	) else (
		powershell -command "Start-Process '%0' '%*' -windowstyle hidden -Verb RunAs" && exit
	)
)
set "letra=%~dp0"
set "letra=%letra:~0,1%"
set "local=%~dp0"
set "fixPath=%local:~0,-1%"
set "file=%~nx0"
set "usuario=%USERNAME%"
set "argTUDO=%~1 %~2 %~3 %~4 %~5"
set "arg1=%~1"
set "arg2=%~2"
set "arg3=%~3"
set "arg4=%~4"
set "arg5=%~5"
cd\ && %letra%:

cd ARQUIVOS\PROJETOS\Sniffer_Python
"%letra%:\ARQUIVOS\WINDOWS\PORTABLE_NodeJS\nodeSniffer.exe" "%letra%:\ARQUIVOS\PROJETOS\Sniffer_Python\src\sniffer.js"
exit
exit

