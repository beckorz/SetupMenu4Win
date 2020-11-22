/**********************************************************
 *
 *  Utility
 *
 * *******************************************************/

/* Common global object*/
var fs = new ActiveXObject("Scripting.FileSystemObject");
var fso = new ActiveXObject("Scripting.FileSystemObject");

var isWsh = false;
var isHta = false;

try { if (WScript) isWsh = true; } catch(e) {}
try { if (window)  isHta = true; } catch(e) {}

/** trim系 */
String.prototype.trim  = function() { return this.replace(/^\s+|\s+$/g, ""); };
String.prototype.ltrim = function() { return this.replace(/^\s+/, ""); };
String.prototype.rtrim = function() { return this.replace(/\s+$/, ""); };
Number.prototype.toHex = function() { return this.toString(16).toUpperCase(); };

/**
 * 日付取得
 * @return 現在の日付(yyyy/mm/dd)
 */
function getDateString() {
    var timeStamp = new Date();
    var y  = timeStamp.getFullYear();
    var m  = ('0'+(timeStamp.getMonth()+1)).slice(-2);
    var d  = ('0'+(timeStamp.getDate())).slice(-2);
    return (''+y+'/'+m+'/'+d);
}

/**
 * 日付取得
 * @return 現在の日付(yyyy-mm-dd)
 */
function getDateStringEscaped() {
    var timeStamp = new Date();
    var y  = timeStamp.getFullYear();
    var m  = ('0'+(timeStamp.getMonth()+1)).slice(-2);
    var d  = ('0'+(timeStamp.getDate())).slice(-2);
    return (''+y+'-'+m+'-'+d);
}

/**
 * タイムスタンプ取得
 * @return 現在の日時スタンプ(yyyy/mm/dd hh:mm:ss.000)
 */
function getTimeStamp() {
    var timeStamp = new Date();
    var y  = timeStamp.getFullYear();
    var m  = ('0'+(timeStamp.getMonth()+1)).slice(-2);
    var d  = ('0'+(timeStamp.getDate())).slice(-2);
    var h  = ('0'+timeStamp.getHours()).slice(-2);
    var mi = ('0'+timeStamp.getMinutes()).slice(-2);
    var s  = ('0'+timeStamp.getSeconds()).slice(-2);
    var ms = getMilliseconds();
    return (''+y+'/'+m+'/'+d+' '+h+':'+mi+':'+s+'.'+ms);
}

/**
 * タイムスタンプ取得
 * @return 現在の日時スタンプ(yyyy-mm-dd_hh-mm-ss)
 */
function getTimeStampEscaped() {
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
 * Tiny string format method
 * @param {}
 */
if (String.prototype.format === undefined) {
    String.prototype.format = function(arg) {
        var repFunc = undefined;

        if (typeof arg === "object") {
            repFunc = function(m, k) { return arg[k]; };
        } else {
            var args = arguments;
            repFunc = function(m, k) { return args[parseInt(k)]; };
        }
        return this.replace(/\{(\w+)\}/g, repFunc);
    };
}

/**
 * JSONデータをパース
 * @param {string} json string
 * @return {object} json object
 */
function parseJson(data) {
    return eval("(" + data +")");
}

/**
 * Output echo
 * @param {string} string
 */
function echo(str) {
    WScript.echo(str);
}

var Base64 = {
    encode: function(str) {
        var stm = new ActiveXObject("ADODB.Stream");
        var dom = new ActiveXObject("MSXML2.DOMDocument.6.0");
        var elm;

        stm.Type = 2; // adTypeText = 2
        stm.Charset = "UTF-8";
        stm.Open();
        stm.WriteText(str);
        stm.Position = 0;
        stm.Type = 1; // adTypeBinary = 1
        stm.Position = 3;   // BOM skip
        
        elm = dom.createElement("element");
        elm.dataType = "bin.base64";
        elm.nodeTypeValue = stm.Read();

        stm.Close();
        return elm.text.replace(/\n/, "");
    },
    decode: function(str) {
        return decodeURIComponent(escape(atob(str)));
    }
};

/**
 * ForEach for collection
 * @param {collection} collection
 * @param {function} callback function
 */
var foreachEnum = function(collection, callback) {
    for(var xs = new Enumerator(collection), x = xs.item(), i = 0;
          !xs.atEnd();
          xs.moveNext(), x = xs.item(), i++
        ) {
        if (!!callback(x, i)) break;
    }
};

/**
 * Hex string to byte array.
 * @param {hexText} Hex string
 * @return {byte[]} byte array
 */
function hex2bytes(hexText) {
    var dom = new ActiveXObject("Microsoft.XMLDOM").createElement("tmp");
    var bytes = null;
    dom.dataType = "bin.hex";
    dom.text = hexText;
    bytes = dom.nodeTypedValue;
    dom = null;
    return bytes;
}

/**
 * Byte array to hex string
 * @param {bytes} byte array
 * @return {string} Hex string
 */
function bytes2hex(bytes) {
    var hex = null;
    var doc = new ActiveXObject("Msxml2.DOMDocument").createElement("hex");
    doc.dataType = "bin.hex";
    doc.nodeTypedValue = bytes;
    hex = doc.text;
    doc = null;
    return hex;
}

/**
 * 権限昇格されているか？
 * @return {boolean}
 */
function isElevated() {
    // 特定レジストリ値を取得できるか確認
    var locator = new ActiveXObject("WbemScripting.SWbemLocator");
    var service = locator.ConnectServer(".", "root\\default");
    var regProv = service.Get("StdRegProv");

    var inParam = regProv.Methods_.Item("GetStringValue").InParameters.SpawnInstance_();
    inParam.hDefKey = 0x80000003; // HKEY_USERS
    inParam.sSubKeyName = "S-1-5-19\\Console";
    inParam.sValueName = "FaceName";

    var outParam = regProv.ExecMethod_("GetStringValue", inParam);
    return (outParam.ReturnValue === 0);
}

// HTA向けCurrentDirectory変更
if (isHta) {
    new ActiveXObject("WScript.Shell").CurrentDirectory = new ActiveXObject("Scripting.FileSystemObject").GetParentFolderName(location.pathname);
} else {
    new ActiveXObject("WScript.Shell").CurrentDirectory = fs.getParentFolderName(WScript.ScriptFullName);
}

/**
 * log4js
 * require config
 * require log4js
 * require FileSystemObject
 * @param {config} config
 * @return {log4js.logger}
 */
function settingLoggingConfig(config) {
    var logDirectory = "";
    var logFilePath = "";
    var log = new Log4js.getLogger();
    if (config) {
        // Setting by config
        logDirectory = config.LogDirectory;
        logFilePath = fs.BuildPath(logDirectory, getDateStringEscaped() + ".log");
        log.setLevel(config.LogLevel);
    } else {
        // Setting by default
        logDirectory = "./logs";
        logFilePath = fs.BuildPath(logDirectory, "app.log");
        log.setLevel(Log4js.Level.ALL);
    }
    // Create log directory
    if (!fs.FolderExists(logDirectory)) { fs.CreateFolder(logDirectory); }
    var oLayout = new Log4js.BasicLayout();
    oLayout.LINE_SEP = '\n';
    var oAppender = new Log4js.FileAppender(logFilePath);
    oAppender.setLayout(oLayout);
    log.addAppender(oAppender);
    return log;
}

/**
 * Get arguments array
 * @return {array} arguments array
 */
var args = (function() {
    if (typeof(WScript) !== "undefined") {
        var a = new Array(WScript.Arguments.length);
        for (var i = 0; i < a.length; i++) a[i] = WScript.Arguments.item(i);
        return a;
    }
    // TODO: HTA application id hta.commandLine
}());

/**
 * Get resource for WSF
 * @return {object}
 */
var getResource = function(str) {
    return scriptlet.getResource(str).replace(/^\s+|\s+$/g, "");
};
