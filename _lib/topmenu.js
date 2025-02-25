function compareVersions(v1, operator, v2) {
    function parseVersion(ver) {
        var parts = String(ver).split('.');
        var numbers = [
            parseInt(parts[0], 10) || 0,
            parseInt(parts[1], 10) || 0,
            parseInt(parts[2], 10) || 0,
            parseInt(parts[3], 10) || 0
        ];
        return numbers;
    }
    
    var ver1 = parseVersion(v1);
    var ver2 = parseVersion(v2);
    
    for (var i = 0; i < 4; i++) {
        if (ver1[i] < ver2[i]) return operator === '<' || operator === '<=' || operator === '!=';
        if (ver1[i] > ver2[i]) return operator === '>' || operator === '>=' || operator === '!=';
    }
    return operator === '==' || operator === '<=' || operator === '>=';
}

function splitVersionString(versionString) {
    var match = versionString.match(/(>=|<=|>|<|==|!=)?\s*(\d+(?:\.\d+)*)/);
    return match ? { operator: match[1] || '', version: match[2] } : null;
}

/* メニュー生成 */
function LoadTopMenu() {
	var x_path = "/Toolmenu/menu[@id='top']";
	var NON_IMAGE_URL = "./images/items/non.jpg";
	var node_topmenu, nodes_category, nodes_item;
	var category_number, item_number;
	var category_name, category_id, item_desc, item_label, item_icon, item_cmd, item_img;
	var i, j;
	var menulist;
	var navlist;
	var osVer;

	osVer = GetOSVersion();
	if (IsDebug) { 
      showMessageBoxInfo(osVer, "ver");
	}

	// topメニュー用ノード取得
	node_topmenu = ObjXml.selectSingleNode(x_path);
	nodes_category = node_topmenu.selectNodes("category");

	category_number = nodes_category.length;

	// 初期化
	menulist = "";
	navlist = "";

	// カテゴリのループ
	menulist += "<div class='main'>\n";
	for (i = 0; i < category_number; i++) {

		// カテゴリ名表示
		category_name = nodes_category.item(i).getAttribute("name");	// カテゴリ名称
		category_id = nodes_category.item(i).getAttribute("id");		// カテゴリID
		navlist  += "\t\t<li><a href='#" + category_id + "'>" + category_name + "</a></li>"	// ナビ用リスト作成
//		menulist += "    <div class='puWidgetHeadingLink text' />\n"; // add
		menulist += "    <a name=\"#" + category_id + "\" />\n";

		// 
		menulist += "    <div class='category' id='" + category_id + "'>\n";
		menulist += "        <div class='category_line' onclick='javascript:ToggleDisplay(\"" + category_id + "_menu\");' >";
		menulist += "            <img class='category_left' src='images/left.png' />\n";
		menulist += "            <span class='category_title'>" + category_name + "</span>\n";
		menulist += "            <img class='category_right' src='images/right.png' />\n";
		menulist += "            <img id='" + category_id + "_menu_expand' class='category_expand' src='images/shrink.png' />\n";
		menulist += "            <img class='category_gradiation' src='images/gradiation.png' />\n";
		menulist += "        </div>\n";

//		menulist += "    </div>\n";	// add

		menulist += "        <div id='" + category_id + "_menu'>\n";

		nodes_item = nodes_category.item(i).selectNodes("item");
		item_number = nodes_item.length;

		// 各アプリケーションのループ
		for (j = 0; j < item_number; j++) {
			var item_id;
			item_id = "itemid_" + i + "_" + j;												// IDインクリメント
			item_desc = nodes_item.item(j).selectSingleNode("description").text;			// 詳細
			item_cmd = nodes_item.item(j).selectSingleNode("cmd").text;						// コマンド
			item_label = nodes_item.item(j).selectSingleNode("cmd").getAttribute("label");	// コマンドのラベル
			visibleItem = true; // 項目の表示フラグ

			// アイコン
			if ((nodes_item.item(j).selectSingleNode("image/url") != null)) {
				item_img = nodes_item.item(j).selectSingleNode("image/url").text;
			} else {
				item_img = NON_IMAGE_URL;
			}
			item_img = "<img src=\"" + item_img + "\" width=\"16\" height=\"16\" />";

			// 必要環境の条件
			if ((nodes_item.item(j).selectSingleNode("requirements") != null)) {
				// 必要OS
				if ((nodes_item.item(j).selectSingleNode("requirements/osver") != null)) {
					requireOsver = nodes_item.item(j).selectSingleNode("requirements/osver").text;
				}
				// 条件判定
                var require = splitVersionString(requireOsver);
                var res = compareVersions(osVer, String(require.operator), String(require.version))
				visibleItem = res;
			}

			if (IsDebug == true) {
				alert("desc : " + item_desc + "\n" + "id : " + item_id + "\nlabel ： " + item_label + "\n" + "command ： " + item_cmd);
			}

			// アイテム出力
			if ((item_cmd != "") && (visibleItem)) {
				menulist += "            <div class=\"item\">\n";
				menulist += "                <div class=\"item_label\">"+item_img+"<a id=\"" + item_id + "\" class='item_cmd' onclick='javascript:RunCmd(\"" + item_cmd.replace(/\\/g,"\\\\").replace(/\\\\\"/g, "\\\"") + "\");' onmouseover='javascript:FontColor(\"" + item_id + "\", \"red\");' onmouseout='javascript:FontColor(\"" + item_id + "\", \"#6b96f7\");' >";
				menulist += item_label;	// ラベル
				menulist += "                </a></div>\n";
				menulist += "                <div class='item_desc'>";
				menulist += item_desc;	// 詳細
				menulist += "                </div>\n";
				menulist += "            </div>\n";
			}

		}
		menulist += "        </div>\n";
		menulist += "    </div>\n";
		menulist += "    <br />\n";

	}
	menulist += "  </div>\n";

	document.getElementById('nav').innerHTML = "\t<ul>\n" + navlist + "\t</ul>\n";	// ナビ用
	document.getElementById('main').innerHTML = menulist;	// メニュー

	if (IsDebug == true) {
		alert(menulist);
	}

}
