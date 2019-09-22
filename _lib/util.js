// initialize

var isWsh = false;
var isHta = false;

try {
    if (WScript) isWsh = true;
} catch(e) {}
try {
    if (window) isHta = true;
} catch(e) {}

/**
 * ネイティブブートしているか確認
 */
function isNativeBoot() {   
    return (WScript.FullName.toLowerCase().indexOf('syswow64') == -1);
}

/**
 * ネイティブブートする
 */
function doNativeBoot() {
    try{
        // WScriptからの実行の場合のみ対応の為
        var test = WScript.FullName;
        if (!(isNativeBoot())) {
            if (IsDebug) {
                alert('Native起動します');
            }
            var nativeProcessName = WScript.FullName.toLowerCase().replace(/syswow64/g, "sysnative");   // ネイティブプロセスを指定
            new ActiveXObject("WScript.Shell").Run('"' + nativeProcessName + '" "' + WScript.ScriptFullName + '"'); // 自己スクリプトをsysnative側のプロセスで起動する。
            WScript.Quit(); //  ' 今のプロセス側は終了
        }
    } catch (e) {
    }

}

doNativeBoot();

/** 汎用echo関数 */
function echo(str) {
    if (isWsh) {
        WScript.echo(str);
    } else if (isHta) {
        ShowMessageBox_Info(str, 'echo');
    }
}

/** trim系(prototypeで拡張) */
String.prototype.trim  = function() { return this.replace(/^\s+|\s+$/g, ""); };
String.prototype.ltrim = function() { return this.replace(/^\s+/, ""); };
String.prototype.rtrim = function() { return this.replace(/\s+$/, ""); };

/**
 * タイムスタンプ取得
 * @return 現在の日時スタンプ(yyyy-mm-dd_hh-mm-ss)
 */
function getTimeStamp() {
    var timeStamp = new Date();
    var y  = timeStamp.getFullYear();
    var m  = ('0'+(timeStamp.getMonth()+1)).slice(-2);
    var d  = ('0'+(timeStamp.getDate())).slice(-2);
    var h  = ('0'+timeStamp.getHours()).slice(-2);
    var mi = ('0'+timeStamp.getMinutes()).slice(-2);
    var s  = ('0'+timeStamp.getSeconds()).slice(-2);
    return (''+y+'-'+m+'-'+d+'_'+h+'-'+mi+'-'+s);
}

/**
 * 日付取得
 * @return 現在の日付(yyyy-mm-dd)
 */
function getDate() {
    var timeStamp = new Date();
    var y  = timeStamp.getFullYear();
    var m  = ('0'+(timeStamp.getMonth()+1)).slice(-2);
    var d  = ('0'+(timeStamp.getDate())).slice(-2);
    return (''+y+'-'+m+'-'+d);
}
