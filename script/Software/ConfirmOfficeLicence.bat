@echo off

echo Å°îFèÿämîF
echo.

cd %~dp0

REM cscript //nologo "%ProgramFiles%\Microsoft Office\Office14\ospp.vbs" /dstatus
for /f "usebackq tokens=*" %%i IN (`call cscript //nologo getOfficePath.wsf`) DO @set OFFICE_INSTALL_DIR=%%i

cscript //nologo "%OFFICE_INSTALL_DIR%\ospp.vbs" /dstatus

pause
