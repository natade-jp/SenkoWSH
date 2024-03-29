//@ts-check
/// <reference path="../build/SenkoWSH.d.ts" />
System.executeOnCScript();
System.initializeCurrentDirectory();

System.println("ファイル名の一括変更バッチ");

/**
 * @param {string[]} files
 * @returns {SFile[]}
 */
var getFileList = function(files) {
	/**
	 * @type {SFile[]}
	 */
	var file_data = [];
	for(var i = 0; i < files.length; i++) {
		var file = new SFile(files[i]);
		if(!file.exists()) {
			continue;
		}
		if(file.isDirectory()) {
			var allfilse = file.getAllFiles();
			for(var j = 0; j < allfilse.length; j++) {
				var target = new SFile(allfilse[j]);
				if(target.isFile()) {
					file_data.push(target);
				}
			}
		}
		else {
			file_data.push(file);
		}
	}
	return file_data;
};

/**
 * @type {SFile[]}
 */
var input_files = getFileList(System.getArguments());

/**
 * @type {SFile[]}
 */
var output_files = [];
var format_text = "{id%03d}-{name%s}.{ext%s}";

var createOutputFile = function() {
	output_files = [];
	for(var i = 0; i < input_files.length; i++) {
		var parent = input_files[i].getParent();
		var ext = input_files[i].getExtensionName();
		var filename = input_files[i].getName();
		filename = filename.substr(0, filename.length - ext.length - 1);

		var new_filename = format_text.replace(/\{[^}]+\}/g, function(text) {
			var nakami = text.substr(1, text.length - 2);
			var type = nakami.split("%")[0].toLocaleLowerCase();
			var format = nakami.substr(type.length);
			if(type === "id") {
				return Format.textf(format, i + 1);
			}
			else if(type === "name") {
				return filename;
			}
			else if(type === "ext") {
				return ext;
			}
			else {
				return "";
			}
		});

		var new_file = new SFile(parent + "\\" + new_filename);
		output_files.push(new_file);
	}
};

createOutputFile();

var showFileList = function() {
	for(var i = 0; i < input_files.length; i++) {
		var date_text = Format.datef("YYYY-MM-DD hh:mm:ss", input_files[i].lastModified());
		System.printf("%-24s\t->\t%-24s\t%1.0fKB\t%s", input_files[i].getName(), output_files[i].getName(), input_files[i].length() / 1024, date_text);
	}
};

var renameFileList = function() {
	for(var i = 0; i < input_files.length; i++) {
		input_files[i].renameTo(output_files[i]);
	}
};

var sortFileList = function(sort_type) {

	/**
	 * @type {function(SFile, SFile): number}
	 */
	var sort_function = null;

	// ファイル名の昇順
	if(sort_type === 1) {
		sort_function = function(a, b) {
			return StringComparator.DEFAULT(a.getName(), b.getName());
		};
	}
	else if(sort_type === 2) {
		sort_function = function(a, b) {
			return StringComparator.NATURAL(a.getName(), b.getName());
		};
	}
	else if(sort_type === 3) {
		sort_function = function(a, b) {
			return StringComparator.DEFAULT(a.lastModified().getTime(), b.lastModified().getTime());
		};
	}

	input_files.sort(sort_function);
	
	createOutputFile();
};

while(true) {

	showFileList();

	System.println("コマンドを選んでください。");
	System.println("[1] 名前を変更する。");
	System.println("[2] ソートする。");
	
	var read = System.readLine() | 0;
	System.println(read);
	if(read === 1) {
		renameFileList();
	}
	else if(read === 2) {
		System.println("[1] タイトルの文字列ソート");
		System.println("[2] タイトルの自然順ソート");
		System.println("[3] ファイルの更新日時ソート");
		read = System.readLine() | 0;
		sortFileList(read);
	}
}
