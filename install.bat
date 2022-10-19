@echo off
setlocal EnableDelayedExpansion
:: test and acquire admin rights
cd /d %~dp0 & echo/
if not "%1"=="UAC" (
    >nul 2>&1 net file && echo Got admin rights || (echo No admin rights & ^
MSHTA "javascript: var shell = new ActiveXObject('shell.application'); shell.ShellExecute("%~snx0", 'UAC', '', 'runas', 1);close();"))
:: re-test admin rights
echo/ & >nul 2>&1 net file && (echo Got admin rights & echo/) || (echo No admin rights. Exiting... & goto :end)

:usercode
deno compile -A gm2.js
copy gm2.exe C:\Windows\System32\gm2.exe

:end
exit /b    
