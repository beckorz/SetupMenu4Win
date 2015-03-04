@echo off

echo ¡”FØŠm”F
echo.

cd %~dp0

wscript %windir%\system32\slmgr.vbs /dlv

pause
