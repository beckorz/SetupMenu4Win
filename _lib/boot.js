/**
 * Windows Script Host向け起動スクリプト
 *
 * wsfファイルの関連付けは、32bit版の起動の為、64bit版に切り替えして起動する為のスクリプト
 *
 */

/**
 * ネイティブブートしているか確認
 */
function isNativeBoot() {
    return (WScript.FullName.toLowerCase().indexOf('syswow64') === -1);
}

/**
 * ネイティブブート実行
 */
function doNativeBoot() {
    try{
        // WScriptからの実行の場合のみ対応の為
        var test = WScript.FullName;
        if (!isNativeBoot()) {
            var nativeProcessName = WScript.FullName.toLowerCase().replace(/syswow64/g, "sysnative");   // ネイティブプロセスを指定
            // 引数も渡しなおす
            var args = [];
            for( var i = 0; i < WScript.Arguments.Count(); i++ ) {
                args.push(WScript.Arguments.Item(i));
            }
            new ActiveXObject("WScript.Shell").Run('"' + nativeProcessName + '" "' + WScript.ScriptFullName + '" \"' + args.join(' ') + '\"'); // 自己スクリプトをsysnative側のプロセスで起動する。
            WScript.Quit(); //  ' 今のプロセス側は終了
        }
    } catch (e) {
        // WScript非対応(HTA等の場合)
    }

}

doNativeBoot();
