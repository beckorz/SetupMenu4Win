'_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_
'
' ユーティリティ用関数
'
'_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_

'事前にオブジェクト生成しておく(Singletonっぽく)
'set fs = CreateObject("Scripting.FileSystemObject")
'set fso = CreateObject("Scripting.FileSystemObject")
set wshell = CreateObject("WScript.Shell")
'set wNetwork = CreateObject("WScript.Network")
'set vbRegExp = CreateObject("VBScript.RegExp")

public Const HKEY_CLASSES_ROOT = &H80000000
public Const HKEY_CURRENT_USER = &H80000001
public Const HKCU = &H80000001
public Const HKEY_LOCAL_MACHINE = &H80000002
public Const HKLM = &H80000002
public Const HKEY_USERS = &H80000003
public Const HKEY_CURRENT_CONFIG = &H80000005
public Const HKEY_DYN_DATA = &H80000006

'//////////////////////////////////////////////////////////////////
'	対象のファイルバージョン取得
'//////////////////////////////////////////////////////////////////
public function GetFileVersion(path)
	GetFileVersion = fs.GetFileVersion(path)
end function

'//////////////////////////////////////////////////////////////////
'	Shell実行
'	@param cmd 実行するファイル、コマンド
'//////////////////////////////////////////////////////////////////
public function executeShell(cmd)
    wshell.Run "%comspec% /c " & cmd, vbNormalFocus, true
end function

'//////////////////////////////////////////////////////////////////
'   64bit環境か?
'//////////////////////////////////////////////////////////////////
Public Function Isx64()
Dim colItems
Dim itm
Dim ret
  
    Isx64 = false
    Set colItems = CreateObject("WbemScripting.SWbemLocator").ConnectServer.ExecQuery("Select * From Win32_OperatingSystem")
    For Each itm In colItems
        If InStr(itm.OSArchitecture, "64") Then
            Isx64= True
            exit function
        End If
    Next
End Function

'//////////////////////////////////////////////////////////////////
'   0埋め(optional引数使えない?)
'//////////////////////////////////////////////////////////////////
public function padding_zero(ival, digit)
    paddingString = "0"
    padding_zero = right(string(digit, paddingString) & ival, digit)
end function

'//////////////////////////////////////////////////////////////////
'   カレントディレクトリ取得
'   @return カレントディレクトリ
'//////////////////////////////////////////////////////////////////
public function GetCurrentDirectory()
    GetCurrentDirectory = wshell.CurrentDirectory
end function

'//////////////////////////////////////////////////////////////////
'   PC名取得
'   @return PC名
'//////////////////////////////////////////////////////////////////
public function GetComputerName()
    GetComputerName = wNetwork.ComputerName
end function

'//////////////////////////////////////////////////////////////////
'   ユーザー名取得
'   @return ユーザー名
'//////////////////////////////////////////////////////////////////
public function GetUserName()
    GetUserName = wNetwork.UserName
end function

'//////////////////////////////////////////////////////////////////
'   ドメイン名
'   @return ユーザー名
'//////////////////////////////////////////////////////////////////
public function GetUserDomain()
    GetUserDomain = wNetwork.UserDomain
end function

'//////////////////////////////////////////////////////////////////
'   環境変数文字列
'   @param 環境変数文字列
'   @return ユーザー名
'//////////////////////////////////////////////////////////////////
public function GetEnvironmentString(iStr)
    GetEnvironmentString = wshell.ExpandEnvironmentStrings(iStr)
end function

'//////////////////////////////////////////////////////////////////
'   CPUのアーキテクチャー取得(32bit or 64bit等)
'   @return アーキテクチャー文字列(AMD64,IA64,x86)
'//////////////////////////////////////////////////////////////////
public function GetProcessorArchitecture()
    GetProcessorArchitecture = wshell.Environment("Process").Item("PROCESSOR_ARCHITECTURE")
end function

'//////////////////////////////////////////////////////////////////
'   CPUのアーキテクチャー取得(32bit or 64bit等)
'   @return アーキテクチャー文字列(AMD64,IA64,x86)
'//////////////////////////////////////////////////////////////////
public function IsRunningOn64bit()
    IsRunningOn64bit = (not (UCASE(GetProcessorArchitecture) = "X86"))
end function

'//////////////////////////////////////////////////////////////////
'   Dictionaryオブジェクト作成
'   @return カレントディレクトリ
'//////////////////////////////////////////////////////////////////
public function CreateDictionary()
   set CreateDictionary = CreateObject("Scripting.Dictionary")
end function

'//////////////////////////////////////////////////////////////////
'   パスのドライブ名を取得する
'   @return カレントディレクトリ
'//////////////////////////////////////////////////////////////////
public function GetDriveName(path)
    GetDriveName = fs.GetDriveName(path)
end function

'//////////////////////////////////////////////////////////////////
'   パスのファイル名を取得する
'   @return カレントディレクトリ
'//////////////////////////////////////////////////////////////////
public function GetFileName(path)
    GetFileName = fs.GetFileName(path)
end function

'//////////////////////////////////////////////////////////////////
'   パスの拡張子を除いた名前を取得する
'   @return カレントディレクトリ
'//////////////////////////////////////////////////////////////////
public function GetBaseName(path)
    GetBaseName = fs.GetBaseName(path)
end function

'//////////////////////////////////////////////////////////////////
'   パスの拡張子を取得する
'   @return カレントディレクトリ
'//////////////////////////////////////////////////////////////////
public function GetExtensionName(path)
    GetExtensionName = fs.GetExtensionName(path)
end function

'//////////////////////////////////////////////////////////////////
'   パスの親フォルダのパスを取得する
'   @return カレントディレクトリ
'//////////////////////////////////////////////////////////////////
public function GetParentFolderName(path)
    GetParentFolderName = fs.GetParentFolderName(path)
end function

'//////////////////////////////////////////////////////////////////
'   相対パスを絶対パスに変換する
'   @return カレントディレクトリ
'//////////////////////////////////////////////////////////////////
public function GetAbsolutePathName(path)
    GetAbsolutePathName = fs.GetAbsolutePathName(path)
end function

'//////////////////////////////////////////////////////////////////
'   パスとファイル名を結合する
'   @return カレントディレクトリ
'//////////////////////////////////////////////////////////////////
public function BuildPath(path1, path2)
    BuildPath = fs.BuildPath(path1, path2)
end function

'//////////////////////////////////////////////////////////////////
'   短いファイル名から、長いファイル名に変換したファイル名を取得
'   @return ファイルパス
'//////////////////////////////////////////////////////////////////
function GetLongFileName(ShortFileName)
    Set app = CreateObject("Shell.Application")
    Folder = fs.GetParentFolderName(ShortFileName)
    FileName = fs.GetFileName(ShortFileName)
    FilePath = app.Namespace(Folder).Items().Item(FileName).Path
    Set app = Nothing
    GetLongFileName = FilePath
end function

'//////////////////////////////////////////////////////////////////
'   メッセージボックス表示(msgbox関数のラッパー(JScript用でVBSは直接msgbox関数呼べば良いじゃない
' ■buttons : 定数
'0    : vbOKOnly [OK] ボタンのみを表示します。
'0    : vbApplicationModal アプリケーション モーダルに設定します。メッセージ ボックスに応答するまで、現在選択中のアプリケーションの実行を継続できません。
'1    : vbOKCancel [OK] ボタンと [キャンセル] ボタンを表示します。
'2    : vbAbortRetryIgnore [中止]、[再試行]、および [無視] の 3 つのボタンを表示します。
'3    : vbYesNoCancel [はい]、[いいえ]、および [キャンセル] の 3 つのボタンを表示します。
'4    : vbYesNo [はい] ボタンと [いいえ] ボタンを表示します。
'5    : vbRetryCancel [再試行] ボタンと [キャンセル] ボタンを表示します。
'16   : vbCritical 警告メッセージ アイコンを表示します。
'32   : vbQuestion 問い合わせメッセージ アイコンを表示します。
'48   : vbExclamation 注意メッセージ アイコンを表示します。
'64   : vbInformation 情報メッセージ アイコンを表示します。
'0    : vbDefaultButton1 第 1 ボタンを標準ボタンにします。
'256  : vbDefaultButton2 第 2 ボタンを標準ボタンにします。
'512  : vbDefaultButton3 第 3 ボタンを標準ボタンにします。
'768  : vbDefaultButton4 第 4 ボタンを標準ボタンにします。
'4096 : vbSystemModal システム モーダルに設定します。メッセージ ボックスに応答するまで、すべてのアプリケーションが中断されます。
' ■戻り値 : 定数
'1 : vbOK [OK]
'2 : vbCancel [キャンセル]
'3 : vbAbort [中止]
'4 : vbRetry [再試行]
'5 : vbIgnore [無視]
'6 : vbYes [はい]
'7 : vbNo [いいえ]
'   @return 
'//////////////////////////////////////////////////////////////////

'Public const vbOK = 1
'Public const vbCancel = 2
'Public const vbAbort = 3
'Public const vbRetry = 4
'Public const vbIgnore = 5
'Public const vbYes = 6
'Public const vbNo = 7

public function ShowMessageBox(prompt, buttons, title)
    ShowMessageBox = msgbox(prompt, buttons, title)
end function
' Question雛形
public function ShowMessageBox_Question(prompt, title)
    ShowMessageBox_Question = ShowMessageBox(prompt, vbYesNo + vbQuestion + vbDefaultButton2, title)
end function
' Information雛形
public sub ShowMessageBox_Info(prompt, title)
    Call ShowMessageBox(prompt, vbInformation, title)
end sub
public sub ShowMessageBox_Information(prompt, title)
    Call ShowMessageBox(prompt, vbInformation, title)
end sub
' Error雛形
public sub ShowMessageBox_Err(prompt, title)
    Call ShowMessageBox(prompt, vbCritical, title)
end sub
public sub ShowMessageBox_Error(prompt, title)
    Call ShowMessageBox(prompt, vbCritical, title)
end sub
' Warning'
public function ShowMessageBox_Warn(prompt, title)
    Call ShowMessageBox(prompt, vbExclamation, title)
end function
public function ShowMessageBox_Warning(prompt, title)
    Call ShowMessageBox(prompt, vbExclamation, title)
end function

' ***********************************************************
' ini読み出し ( 無ければ Empty を返す )
' ***********************************************************
Function GetProfileString( strPath, strSection, strEntry )
    Dim objHandle,aData,bFound,strWork,aWork,I

    Set objHandle = Fso.OpenTextFile( strPath, 1 )
    aData = Split( objHandle.ReadAll, vbCrLf )
    objHandle.Close

    GetProfileString = Empty

    bFound = False
    For I = 0 to Ubound( aData )-1
        if bFound then
            if Left( aData( I ), 1 ) = "[" then
                Exit For
            end if

            strWork = LTrim( aData( I ) )
            if Left( strWork, Len(strEntry)) = strEntry then
                aWork = Split( strWork, "=" )
                if Trim(aWork(0)) = strEntry then
                    if Ubound( aWork ) = 1 then
                        GetProfileString = Trim( aWork( 1 ) )
                        Exit For
                    end if
                end if
            end if
        end if

        if aData(I) = "[" & strSection & "]" then
            bFound = True
        end if

    Next

End Function


' ***********************************************************
' ini書き込み
' ***********************************************************
Function WriteProfileString( strPath, strSection, strEntry, strValue )
    Dim objHandle,aData,bFound,strWork,aWork,I,nSection,bReplace

    Set objHandle = Fso.OpenTextFile( strPath, 1 )
    aData = Split( objHandle.ReadAll, vbCrLf )
    objHandle.Close

    bReplace = False

    bFound = False
    For I = 0 to Ubound( aData )-1
        if bFound then
            if Left( aData( I ), 1 ) = "[" then
                Exit For
            end if

            strWork = LTrim( aData( I ) )
            if Left( strWork, Len(strEntry)) = strEntry then
              aWork = Split( strWork, "=" )
                if Trim(aWork(0)) = strEntry then
                  if Ubound( aWork ) = 1 then
                    strWork = Trim( aWork( 1 ) )
                    aData( I ) = Replace( aData( I ), strWork, strValue )

                    strWork = Join( aData, vbCrLf )
                    Set objHandle = Fso.OpenTextFile( strPath, 2, True )
                    objHandle.Write strWork
                    objHandle.Close

                    bReplace = True
                  Exit For
                end if
              end if
            end if
        end if

        if aData(I) = "[" & strSection & "]" then
            nSection = I
            bFound = True
        end if

    Next

    if not bReplace then
        ' セクションはあったが、エントリは無かった
        if bFound then
            aData(nSection) = aData(nSection) & _
                vbCrLf & strEntry & "=" & strValue
            strWork = Join( aData, vbCrLf )
            Set objHandle = Fso.OpenTextFile( strPath, 2, True )
            objHandle.Write strWork
            objHandle.Close

        else
        ' セクションも、エントリも無かった
            aData(Ubound( aData )-1) = aData(Ubound( aData )-1) & _
                vbCrLf & "[" & strSection & "]" & _
                vbCrLf & strEntry & "=" & strValue
            strWork = Join( aData, vbCrLf )
            Set objHandle = Fso.OpenTextFile( strPath, 2, True )
            objHandle.Write strWork
            objHandle.Close

        end if
    end if

End Function

'//////////////////////////////////////////////////////////////////
' レジストリ書き込み(32bit/64bitのキーに注意)
' @key キー
' @entryName エントリー名
' @val
' @typeName
'[TypeName]
'  REG_DWORD
'  REG_SZ
'//////////////////////////////////////////////////////////////////
public function regWriteEx(key, entryName, val, typeName)
    wshell.RegWrite key & "\" & entryName, val, typeName
end function
'//////////////////////////////////////////////////////////////////
' レジストリ読み込み
' @key キー
' @entryName エントリー名
'//////////////////////////////////////////////////////////////////
public function regReadEx(key, entryName)
    regReadEx = wshell.RegRead(key & "\" & entryName)
end function
'//////////////////////////////////////////////////////////////////
' レジストリ削除
' @key キー
' @entryName エントリー名
'//////////////////////////////////////////////////////////////////
public function regDeleteEx(key, entryName)
    wshell.RegDelete key & "\" & entryName
end function

public function regExistsKey(key, entryName)

    hostName = "."
    
    Set objRegistry = GetObject("winmgmts:\\" & hostName & "\root\default:StdRegProv")
    
    strKeyPath = "SOFTWARE\Microsoft\Windows NT\CurrentVersion"
    strValueName = "Test Value"
    objRegistry.GetStringValue HKEY_LOCAL_MACHINE, key, entryName, strValue
    
    regExistsKey = not IsNull(strValue) 
    
end function

'////////////////////////////////////////////////////////////////////////////////
'   取得
'////////////////////////////////////////////////////////////////////////////////
public function regGetStringValue(root, key, entryName)
    hostName = "."
    Set objRegistry = GetObject("winmgmts:\\" & hostName & "\root\default:StdRegProv")
    call objRegistry.GetStringValue(root, key, entryName, regGetStringValue)
end function
public function regGetDWORDValue(root, key, entryName)
    hostName = "."
    Set objRegistry = GetObject("winmgmts:\\" & hostName & "\root\default:StdRegProv")
    call objRegistry.GetDWORDValue(root, key, entryName, regGetDWORDValue)
end function
public function regGetBinaryValue(root, key, entryName)
    hostName = "."
    Set objRegistry = GetObject("winmgmts:\\" & hostName & "\root\default:StdRegProv")
    call objRegistry.GetBinaryValue(root, key, entryName, regGetBinaryValue)
end function
public function regGetMultiStringValue(root, key, entryName)
    hostName = "."
    Set objRegistry = GetObject("winmgmts:\\" & hostName & "\root\default:StdRegProv")
    call objRegistry.GetMultiStringValue(root, key, entryName, regGetMultiStringValue)
end function
public function regGetExpandedStringValue(root, key, entryName)
    hostName = "."
    Set objRegistry = GetObject("winmgmts:\\" & hostName & "\root\default:StdRegProv")
    call objRegistry.GetExpandedStringValue(root, key, entryName, regGetExpandedStringValue)
end function
'////////////////////////////////////////////////////////////////////////////////
'   セット
'////////////////////////////////////////////////////////////////////////////////
public function regSetStringValue(root, key, entryName, v)
    hostName = "."
    Set objRegistry = GetObject("winmgmts:\\" & hostName & "\root\default:StdRegProv")
    ret = objRegistry.SetStringValue(root, key, entryName, v)
    if ret = 0 then
    else
        '
    end if
end function
public function regSetDWORDValue(root, key, entryName, v)
    hostName = "."
    Set objRegistry = GetObject("winmgmts:\\" & hostName & "\root\default:StdRegProv")
    ret = objRegistry.SetDWORDValue(root, key, entryName, v)
    if ret = 0 then
    else
    end if
end function
public function regSetBinaryValue(root, key, entryName, v)
    hostName = "."
    Set objRegistry = GetObject("winmgmts:\\" & hostName & "\root\default:StdRegProv")
    lRet = objRegistry.SetBinaryValue(root, key, entryName, v)
    if lRet = 0 then
    else
    end if
end function
public function regSetMultiStringValue(root, key, entryName, v)
    hostName = "."
    Set objRegistry = GetObject("winmgmts:\\" & hostName & "\root\default:StdRegProv")
    lRet = objRegistry.SetMultiStringValue(root, key, entryName, array(v))
    if lRet = 0 then
    else
    end if
end function
public function regSetExpandedStringValue(root, key, entryName, v)
    hostName = "."
    Set objRegistry = GetObject("winmgmts:\\" & hostName & "\root\default:StdRegProv")
    lRet = objRegistry.SetExpandedStringValue(root, key, entryName, v)
    if lRet = 0 then
    else
    end if
end function
'////////////////////////////////////////////////////////////////////////////////
'   作成
'////////////////////////////////////////////////////////////////////////////////
public function regCreateKey(root, key)
    hostName = "."
    Set objRegistry = GetObject("winmgmts:\\" & hostName & "\root\default:StdRegProv")
    
    ret = objRegistry.CreateKey(root, key)
    if ret = 0 then
        'success
    else
        'error
    end if
    
end function
'////////////////////////////////////////////////////////////////////////////////
'   削除
'////////////////////////////////////////////////////////////////////////////////
public function regDeleteKey(root, key)
    hostName = "."
    Set objRegistry = GetObject("winmgmts:\\" & hostName & "\root\default:StdRegProv")
    
    ret = objRegistry.DeleteKey(root, key)
    if ret = 0 then
        'success
    else
        'error
    end if
    
end function
public function regDeleteValue(root, key, entryName)
    hostName = "."
    Set objRegistry = GetObject("winmgmts:\\" & hostName & "\root\default:StdRegProv")
    
    ret = objRegistry.DeleteValue(root, key, entryName)
    if ret = 0 then
        'success
    else
        'error
    end if
    
end function
'////////////////////////////////////////////////////////////////////////////////
'   存在
'////////////////////////////////////////////////////////////////////////////////
public function regExistsStringValue(root, key, entryName)
    hostName = "."
    Set objRegistry = GetObject("winmgmts:\\" & hostName & "\root\default:StdRegProv")
    
    objRegistry.GetStringValue root, key, entryName, v
    
    regExistsStringValue = not IsNull(v)
end function
public function regExistsDWORDValue(root, key, entryName)
    hostName = "."
    Set objRegistry = GetObject("winmgmts:\\" & hostName & "\root\default:StdRegProv")
    
    objRegistry.GetDWORDValue root, key, entryName, v
    
    regExistsDWORDValue = not IsNull(v)
end function
public function regExistsBinaryValue(root, key, entryName)
    hostName = "."
    Set objRegistry = GetObject("winmgmts:\\" & hostName & "\root\default:StdRegProv")
    
    objRegistry.GetBinaryValue root, key, entryName,v 
    
    regExistsBinaryValue = not IsNull(v)
end function
public function regExistsMultiStringValue(root, key, entryName)
    hostName = "."
    Set objRegistry = GetObject("winmgmts:\\" & hostName & "\root\default:StdRegProv")
    
    objRegistry.GetMultiStringValue root, key, entryName, v 
    
    regExistsMultiStringValue = not IsNull(v)
end function
public function regExistsExpandedStringValue(root, key, entryName)
    hostName = "."
    Set objRegistry = GetObject("winmgmts:\\" & hostName & "\root\default:StdRegProv")
    
    objRegistry.GetExpandedStringValue root, key, entryName,v 
    
    regExistsExpandedStringValue = not IsNull(v)
end function

'////////////////////////////////////////////////////////////////////////////////
'   16進数→10進数
'////////////////////////////////////////////////////////////////////////////////
public Function H2D(iValue)
    H2D = CLng("&H" & iValue)
End Function

'////////////////////////////////////////////////////////////////////////////////
'   16進数→8進数
'////////////////////////////////////////////////////////////////////////////////
public Function H2O(iValue)
    H2O = Oct(H2D(iValue))
End Function

'////////////////////////////////////////////////////////////////////////////////
'   処理内容：OS情報の取得
'   戻り値：OS情報(SP含む)
'////////////////////////////////////////////////////////////////////////////////
Function GetOSType()
    On error resume next
    Err.Clear
    Dim objWMIService
    Dim objComputer
    Dim colComputers
    Dim OsVal
    Dim szTmp
    Dim strRet
    Dim strOSAr
    szTmp=""
    strRet=""
    strOSAr=""
    
    Set objWMIService = GetObject("winmgmts:{impersonationLevel=impersonate}!\\.\root\cimv2")
    Set colComputers = objWMIService.ExecQuery("Select * from Win32_OperatingSystem")
    For Each objComputer in colComputers
        szTmp = objComputer.Version
        'msgbox szTmp
        'msgbox objComputer.Caption
        OsVal = Mid(szTmp,1,3)
        IF OsVal = "5.0" Then
            strRet = "Windows 2000 "
        ElseIf OsVal = "5.1" Then
            strRet = "Windows XP "
        ElseIf OsVal = "5.2" Then
            strRet = "Windows Server 2003 "
        ElseIf OsVal = "6.0" Then
            IF InStr(UCase(objComputer.Caption),"SERVER") > 1 Then
                strRet = "Windows Server 2008 "
            Else
                strRet = "Windows Vista "
            End IF
        ElseIf OsVal = "6.1" Then
            IF InStr(UCase(objComputer.Caption),"SERVER") > 1 Then
                strRet = "Windows Server 2008 R2 "
            Else
                strRet = "Windows 7 a "
            End IF
        ElseIf OsVal = "6.2" Then
            IF InStr(UCase(objComputer.Caption),"SERVER") > 1 Then
                strRet = "Windows Server 2012 "
            Else
                strRet = "Windows 8 "
            End IF
        Else
            strRet = "Windows " & "(" & szTmp & ") "
        End If
        strRet = strRet & "SP" & objComputer.ServicePackMajorVersion & "." & objComputer.ServicePackMinorVersion
        strOSAr = ""
        strOSAr = objComputer.OSArchitecture
        IF strOSAr = "" Or IsNull(strOSAr) Then
            strOSAr = "32ビット"
        End If
        strRet = strRet & " " &strOSAr
    Next
    GetOSType = strRet
    Err.Clear
End Function

'////////////////////////////////////////////////////////////////////////////////
'   OSのバージョン
'   戻り値:
'       3.0  = NT 3
'       3.1  = NT 3.1
'       3.5  = NT 3.5
'       3.51 = NT 3.51
'       4.0  = NT 4.0
'       5.0  = 2000
'       5.1  = XP
'       5.2  = Windows Server 2003
'       6.0  = Vista or Windows Server 2008
'       6.1  = 7 or Windows Server 2008 R2
'       6.2  = 8
'////////////////////////////////////////////////////////////////////////////////
public function GetOSVersion()
Dim strComputer
Dim Wmi 
Dim colTarget 
Dim strWork 
Dim objRow
Dim aData

    strComputer = "."
    Set Wmi = GetObject("winmgmts:{impersonationLevel=impersonate}!\\" & strComputer & "\root\cimv2")
    
    Set colTarget = Wmi.ExecQuery("SELECT VERSION FROM Win32_OperatingSystem")
    For Each objRow in colTarget
        strWork = objRow.Version
    Next

    aData = Split(strWork, "." )
    strWork = aData(0) & "." & aData(1)

    GetOSVersion = CDbl(strWork)

End Function


'////////////////////////////////////////////////////////////////////////////////
'   デフォルトプリンター設定
'   引数 : プリンター名
'////////////////////////////////////////////////////////////////////////////////
public Sub SetDefaultPrinter(v)
    Call wshell.run("rundll32 printui.dll,PrintUIEntry /y /n """ & v & """")
end sub

'////////////////////////////////////////////////////////////////////////////////
'   プリンターがインストールされているか?
'   引数 : true or false
'////////////////////////////////////////////////////////////////////////////////
public function InstalledPrinter(printerName)
    
    InstalledPrinter = false
    Set oLocator = CreateObject("WbemScripting.SWbemLocator")   ' ローカルコンピュータに接続する。
    Set oService = oLocator.ConnectServer
    Set oClassSet = oService.ExecQuery("Select * From Win32_Printer")   ' クエリー条件をWQLにて指定する。

    'コレクションを解析する。
    for each oClass in oClassSet
        
        if (oClass.Caption = printerName) then
            ' 同名のプリンターがインストール済み
            InstalledPrinter = true
            exit for
        end if
        
    next

end function

'////////////////////////////////////////////////////////////////////////////////
'   指定秒スリープ
'////////////////////////////////////////////////////////////////////////////////
public function WaitFor(s)
    WScript.Sleep s * 1000
end function

