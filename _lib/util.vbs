' NOTE: Text encoding utf-16le
' NOTE: Need: HTA Application IE=10 docment mode.
'       ex) <meta http-equiv="X-UA-Compatible" content="IE=10">

'MsgBoxStyle(style定数)
dim vbOKOnly           : vbOKOnly           = 0    ' [OK] ボタンのみを表示します。
dim vbApplicationModal : vbApplicationModal = 0    ' アプリケーション モーダルに設定します。メッセージ ボックスに応答するまで、現在選択中のアプリケーションの実行を継続できません。
dim vbOKCancel         : vbOKCancel         = 1    ' [OK] ボタンと [キャンセル] ボタンを表示します。
dim vbAbortRetryIgnore : vbAbortRetryIgnore = 2    ' [中止]、[再試行]、および [無視] の 3 つのボタンを表示します。
dim vbYesNoCancel      : vbYesNoCancel      = 3    ' [はい]、[いいえ]、および [キャンセル] の 3 つのボタンを表示します。
dim vbYesNo            : vbYesNo            = 4    ' [はい] ボタンと [いいえ] ボタンを表示します。
dim vbRetryCancel      : vbRetryCancel      = 5    ' [再試行] ボタンと [キャンセル] ボタンを表示します。
dim vbCritical         : vbCritical         = 16   ' 警告メッセージ アイコンを表示します。
dim vbQuestion         : vbQuestion         = 32   ' 問い合わせメッセージ アイコンを表示します。
dim vbExclamation      : vbExclamation      = 48   ' 注意メッセージ アイコンを表示します。
dim vbInformation      : vbInformation      = 64   ' 情報メッセージ アイコンを表示します。
dim vbDefaultButton1   : vbDefaultButton1   = 0    ' 第 1 ボタンを標準ボタンにします。
dim vbDefaultButton2   : vbDefaultButton2   = 256  ' 第 2 ボタンを標準ボタンにします。
dim vbDefaultButton3   : vbDefaultButton3   = 512  ' 第 3 ボタンを標準ボタンにします。
dim vbDefaultButton4   : vbDefaultButton4   = 768  ' 第 4 ボタンを標準ボタンにします。
dim vbSystemModal      : vbSystemModal      = 4096 ' システム モーダルに設定します。メッセージ ボックスに応答するまで、すべてのアプリケーションが中断されます。

'MsgBoxResult
dim vbOk    : vbOk     = 1 ' [OK]
dim vbCancel: vbCancel = 2 ' [キャンセル]
dim vbAbort : vbAbort  = 3 ' [中止]
dim vbRetry : vbRetry  = 4 ' [再試行]
dim vbIgnore: vbIgnore = 5 ' [無視]
dim vbYes   : vbYes    = 6 ' [はい]
dim vbNo    : vbNo     = 7 ' [いいえ]

'//////////////////////////////////////////////////////////////////
' ShowMessageBox(msgbox関数のラッパー for JScript
' @param {prompt} メッセージ
' @param {style} スタイル
' @param {title} タイトル
' @return MsgBoxResult
'//////////////////////////////////////////////////////////////////
public function ShowMessageBox(prompt, style, title)
    ShowMessageBox = msgbox(prompt, style, title)
end function

' Question template
public function ShowMessageBoxQuestion(prompt, title)
    ShowMessageBoxQuestion = ShowMessageBox(prompt, vbYesNo + vbQuestion + vbDefaultButton2, title)
end function

' Usage(JScript)
'var ret = ShowMessageBoxQuestion('yes / no', '森鷗外');
'if (ret === vbYes) {
'    WScript.echo('yes');
'} else {
'    WScript.echo('no');
'}

' Information template
public sub ShowMessageBoxInfo(prompt, title)
    Call ShowMessageBox(prompt, vbInformation, title)
end sub
' Information template
public sub ShowMessageBoxError(prompt, title)
    Call ShowMessageBox(prompt, vbCritical, title)
end sub
' Warning template
public sub ShowMessageBoxWarning(prompt, title)
    Call ShowMessageBox(prompt, vbExclamation, title)
end sub
