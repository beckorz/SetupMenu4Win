/* メニュー生成 */
function LoadTopMenu() {
	var x_path = "/Toolmenu/menu[@id='top']";
	var node_topmenu, nodes_category, nodes_item;
	var category_number, item_number;
	var category_name, category_id, item_desc, item_label, item_icon, item_cmd;
	var i, j;
	var menulist;

	// topメニュー用ノード取得
	node_topmenu = ObjXml.selectSingleNode(x_path);
	nodes_category = node_topmenu.selectNodes("category");

	category_number = nodes_category.length;

	// 初期化
	menulist = "";

	// カテゴリのループ
	menulist += "<div class='main'>\n";
	for (i = 0; i < category_number; i++) {

		//カテゴリ名表示
		category_name = nodes_category.item(i).getAttribute("name");
		category_id = nodes_category.item(i).getAttribute("id");
		menulist += "    <div class='category' id='" + category_id + "'>\n";
		menulist += "        <div class='category_line' onclick='javascript:ToggleDisplay(\"" + category_id + "_menu\");' >";
//		menulist += "        <div class='puWidgetHeadingLink text'>";
		menulist += "            <img class='category_left' src='images/left.png' />\n";
		menulist += "            <span class='category_title'>" + category_name + "</span>\n";
		menulist += "            <img class='category_right' src='images/right.png' />\n";
		menulist += "            <img id='" + category_id + "_menu_expand' class='category_expand' src='images/shrink.png' />\n";
		menulist += "            <img class='category_gradiation' src='images/gradiation.png' />\n";
		menulist += "        </div>\n";
//		menulist += "    </div>\n";

		menulist += "        <div id='" + category_id + "_menu'>\n";

		nodes_item = nodes_category.item(i).selectNodes("item");
		item_number = nodes_item.length;

		// 各アプリケーションのループ
		for (j = 0; j < item_number; j++) {
			var item_id;
			item_id = "itemid_" + i + "_" + j;
			item_desc = nodes_item.item(j).selectSingleNode("description").text;
			item_cmd = nodes_item.item(j).selectSingleNode("cmd").text;
			item_label = nodes_item.item(j).selectSingleNode("cmd").getAttribute("label");

			if (IsDebug == true) {
				alert("desc : " + item_desc + "\n" + "id : " + item_id + "\nlabel ： " + item_label + "\n" + "command ： " + item_cmd);
			}


			if (item_cmd != "") {

			menulist += "            <div class='item'>\n";
			menulist += "                <div class='item_label'><a id=\"" + item_id + "\" class='item_cmd' onclick='javascript:RunCmd(\"" + item_cmd.replace(/\\/g,"\\\\").replace(/\\\\\"/g, "\\\"") + "\");' onmouseover='javascript:FontColor(\"" + item_id + "\", \"red\");' onmouseout='javascript:FontColor(\"" + item_id + "\", \"#6b96f7\");' >";
			menulist += item_label;
			menulist += "                </a></div>\n";
			menulist += "                <div class='item_desc'>";
			menulist += item_desc;
			menulist += "                </div>\n";
			menulist += "            </div>\n";
			}

		}
		menulist += "        </div>\n";
		menulist += "    </div>\n"; // 上に移動
		menulist += "    <br />\n";

	}
	menulist += "  </div>\n";

	document.getElementById('main').innerHTML = menulist;

	if (IsDebug == true) {
		alert(menulist);
	}

}
