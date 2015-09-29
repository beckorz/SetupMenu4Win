@echo off

echo ■Excel 2010のSDI化設定
echo.
echo 宜しい場合は、そのまま何かキーを入力して下さい。
echo 中断する場合は、Ctrl+C で中断して下さい。
echo.

@pause
echo.

cscript //NOLOGO %~dp0/ConfigurationExcel2010SDI.wsf

echo.
echo.  確認して下さい。
echo    (Excelを二個以上開いて、MDIで開かないこと)
echo.


@pause
echo.

