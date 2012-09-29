
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
	if (!(isNativeBoot())) {
		var nativeProcessName = WScript.FullName.toLowerCase().replace(/syswow64/g, "sysnative");	// ネイティブプロセスを指定
		new ActiveXObject("WScript.Shell").Run('"' + nativeProcessName + '" "' + WScript.ScriptFullName + '"'); // 自己スクリプトをsysnative側のプロセスで起動する。
		WScript.Quit(); //	' 今のプロセス側は終了
	}
}
