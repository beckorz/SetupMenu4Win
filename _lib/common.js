// Global Valiables
var IsDebug = false;
var ObjWshShell = new ActiveXObject("WScript.Shell");
var ObjFileSys = new ActiveXObject("Scripting.FileSystemObject");
var StrCurrentDir = ObjFileSys.GetFolder(".").Path;
var StrXmlFilePath = StrCurrentDir + "\\data\\menu.xml"; // menuのデータ

// Load XML
var ObjXml = new ActiveXObject("Microsoft.XMLDom");
ObjXml.async = false;
ObjXml.load(StrXmlFilePath);


/* 表示/非表示の切り替え */
function ToggleDisplay(elm_id) {
	var current;
	current = document.getElementById(elm_id).style.display;

	if (current == "none") {
		document.getElementById(elm_id).style.display = "";
		document.getElementById(elm_id + '_expand').src = "images/shrink.png";
	} else {
		document.getElementById(elm_id).style.display = "none";
		document.getElementById(elm_id + '_expand').src = "images/expand.png";
	}

	if (IsDebug) {
		alert("Current display Style ： " + current);
	}

}

/* コマンド実行 */
function RunCmd(cmd) {
	var result;

//	result = ObjWshShell.Run("%COMSPEC% /C \"" + cmd + "\"", 1, true);
//	result = ObjWshShell.Run("\"" + cmd + "\"", 1, true);
	result = ObjWshShell.Run(cmd, 1, true);

	if (IsDebug == true) {
		alert(cmd + " , " + result);
	}
	
}

function FontColor(id, color){
	if(id){
		if(document.getElementById){
			document.getElementById(id).style.color = color;
		}
	}
}
