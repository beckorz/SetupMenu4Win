@echo off

echo ���F�؊m�F
echo.

cd %~dp0

wscript %windir%\system32\slmgr.vbs /dlv

pause
