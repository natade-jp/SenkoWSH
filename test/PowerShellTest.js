/// <reference path="../build/SenkoWSH.d.ts" />
System.executeOnCScript();
System.initializeCurrentDirectory();

console.log("PowerShell のテストです");
System.sleep(3.0);

var src = "";
src += "Add-Type -AssemblyName System.Windows.Forms;" + "\n";
src += "$dialog = New-Object System.Windows.Forms.SaveFileDialog;" + "\n";
src += "$dialog.Title = \"ファイルを指定して下さい。\";" + "\n";
src += "$dialog.ShowHelp = $FALSE;" + "\n";
src += "$dialog.OverwritePrompt = $TRUE;" + "\n";
src += "if($dialog.ShowDialog() -eq [System.Windows.Forms.DialogResult]::OK){" + "\n";
src += "    $dialog.FileName;" + "\n";
src += "}" + "\n";

console.log(System.PowerShell(src));

console.log("自動的に終了します。");
System.sleep(60.0);
