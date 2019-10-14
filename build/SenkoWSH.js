/*!
 * SenkoWSH.js
 * https://github.com/natade-jp/SenkoWSH
 * Copyright 2013-2019 natade < https://github.com/natade-jp >
 *
 * The MIT license.
 * https://opensource.org/licenses/MIT
 */
!function(t){"function"==typeof define&&define.amd?define(t):t()}(function(){"use strict";function f(t){if(this.element=[],void 0!==t)for(var e=0;e<t.element.length;e++)this.element[e]=t.element[e]}f.prototype.getArray=function(){return this.clone().element},f.prototype.each=function(t){for(var e=!0,r=0;r<this.element.length;r++){var i=this.element[r];if(!1===t.call(i,r,i)){e=!1;break}}return e},f.prototype.toString=function(){return this.join(", ")},f.prototype.isEmpty=function(){return 0===this.element.length},f.prototype.contains=function(t){for(var e=0;e<this.element.length;e++)if(this.element[e]===t)return!0;return!1},f.prototype.size=function(){return this.element.length},f.prototype.clear=function(){this.element.length=0},f.prototype.join=function(t){var e=void 0===t?",":t;return this.element.join(e)},f.prototype.clone=function(){for(var t=new f,e=0;e<this.element.length;e++)t.element[e]=this.element[e];return t},f.prototype.indexOf=function(t){for(var e=0;e<this.element.length;e++)if(this.element[e]===t)return e;return-1},f.prototype.length=function(){return this.element.length},f.prototype.lastIndexOf=function(t){for(var e=this.element.length-1;-1!==e;e--)if(this.element[e]===t)return e;return-1},f.prototype.get=function(t){return this.element[t]},f.prototype.add=function(t,e){1===arguments.length?this.element.push(t):2===arguments.length&&this.element.splice(t,0,e)},f.prototype.addAll=function(t,e){if(1===arguments.length){var r;t instanceof f?r=t.element:"number"!=typeof t&&(r=t);for(var i=this.element.length,n=0;n<r.length;n++)this.element[i++]=r[n]}else if(2===arguments.length&&"number"==typeof t){var o,s=t;(o=e instanceof f?e.element:e)===this.element&&(o=this.element.slice(0));for(var a=this.element.length-s,h=this.element.length+o.length-1,l=this.element.length-1,u=0;u<a;u++)this.element[h--]=this.element[l--];a=o.length;for(var p=0;p<a;p++)this.element[s++]=o[p]}},f.prototype.set=function(t,e){this.element[t]=e},f.prototype.remove=function(t){this.element.splice(t,1)},f.prototype.removeRange=function(t,e){this.element.splice(t,e-t)},f.prototype.sort=function(t){var e;e=0===arguments.length?f.COMPARE_DEFAULT:t;var l=[],u=function(t,e,r,i){if(e<r){var n=Math.floor((e+r)/2);u(t,e,n,i),u(t,n+1,r,i);var o,s,a,h=0;for(o=e;o<=n;o++)l[h++]=t[o];for(o=n+1,s=0,a=e;o<=r&&s<h;)0<=i(t[o],l[s])?t[a++]=l[s++]:t[a++]=t[o++];for(;s<h;)t[a++]=l[s++]}return!0};u(this.element,0,this.element.length-1,e)},f.COMPARE_DEFAULT=function(t,e){return t===e?0:typeof t==typeof e?t<e?-1:1:typeof t<typeof e?-1:1};function t(){}t.parse=function(t,e){for(var r=void 0===e?",":e,i=t.replace(/\r\n?|\n/g,"\n"),n=r.charCodeAt(0),o=[],s=i.length,a="",h=0,l=0,u=!1,p=!1,f=0;f<s;f++){var c=i.charCodeAt(f);if(34===c&&0===a.length)for(f++;f<s;f++)if(34===(c=i.charCodeAt(f))){if(f+1===s-1)break;if(34!==i.charCodeAt(f+1))break;f++,a+='"'}else a+=i.charAt(f);else{switch(c){case n:u=!0;break;case 13:case 10:p=!0}u?(u=!1,void 0===o[h]&&(o[h]=[]),o[h][l]=a,a="",l+=1):p?(p=!1,""===a&&0===l||(void 0===o[h]&&(o[h]=[]),o[h][l]=a,a="",h+=1,l=0)):a+=i.charAt(f)}f===s-1&&0!==l&&(o[h][l]=a)}return o},t.create=function(t,e,r){var i=void 0===e?",":e,n=void 0===r?"\r\n":r,o="",s=/["\r\n,\t]/;if(void 0!==t)for(var a=0;a<t.length;a++){if(void 0!==t[a])for(var h=0;h<t[a].length;h++){var l=t[a][h];s.test(l)&&(l='"'+(l=l.replace(/"/g,'""'))+'"'),o+=l,h!==t[a].length-1&&(o+=i)}o+=n}return o},t.toJSONArrayFromCSVArray=function(t){for(var e=t[0],r=[],i=0;i<e.length;i++)r.push(e[i]);for(var n=[],o=1;o<t.length;o++){for(var s=t[o],a={},h=0;h<s.length;h++)a[r[h]]=s[h];n.push(a)}return n},t.toCSVArrayFromJSONArray=function(t,e){var r=[],i=null;if(void 0===e)for(var n in i=[],t[0])i.push(n);else i=e;r.push(i);for(var o=0;o<t.length;o++){for(var s=t[o],a=[],h=0;h<i.length;h++)a.push(s[i[h]]);r.push(a)}return r};function e(){}e.popup=function(t){for(var e=arguments,r=0,i="",n=0,o=!1,s=1;s<arguments.length;s++)"string"==typeof e[s]?i=e[s]:o?(r=n,n=e[s]):(n=e[s],o=!0);return WScript.CreateObject("WScript.Shell").Popup(t,r,i,n)},e.MB_OK=0,e.MB_OKCANCEL=1,e.MB_ABORTRETRYIGNORE=2,e.MB_YESNOCANCEL=3,e.MB_YESNO=4,e.MB_RETRYCANCEL=5,e.MB_ICONSTOP=16,e.MB_ICONQUESTION=32,e.MB_ICONWARNING=48,e.MB_ICONINFORMATION=64,e.MB_DEFBUTTON1=0,e.MB_DEFBUTTON2=256,e.MB_DEFBUTTON3=512,e.MB_DEFBUTTON4=768,e.IDTIMEOUT=-1,e.IDOK=1,e.IDCANCEL=2,e.IDABORT=3,e.IDRETRY=4,e.IDIGNORE=5,e.IDYES=6,e.IDNO=7;function u(t){if(1!==arguments.length)throw"IllegalArgumentException";if(this.pathname="","string"==typeof t||t instanceof String)this.pathname=t.replace(/\\/g,"/");else{if(!(t instanceof u))throw"IllegalArgumentException";this.pathname=t.getAbsolutePath()}this.is_http=/^htt/.test(this.pathname),this.fso=new ActiveXObject("Scripting.FileSystemObject")}u.prototype.remove=function(){if(this.is_http)throw"IllegalMethod";return this.isFile()?this.fso.DeleteFile(this.pathname):this.isDirectory()?this.fso.DeleteFolder(this.pathname):void 0},u.prototype.exists=function(){if(this.is_http)throw"IllegalMethod";var t=this.isFile();return!1===t&&(t=this.isDirectory()),t},u.prototype.copy=function(t){if(this.is_http)throw"IllegalMethod";var e=new u(t);return this.isFile()?this.fso.CopyFile(this.pathname,e.getAbsolutePath(),!0):!!this.isDirectory()&&this.fso.CopyFolder(this.pathname,e.getAbsolutePath(),!0)},u.prototype.move=function(t){if(this.is_http)throw"IllegalMethod";var e=new u(t);return this.isFile()?(this.fso.MoveFile(this.pathname,e.getAbsolutePath()),this.pathname=e.getAbsolutePath(),!0):!!this.isDirectory()&&(this.fso.MoveFolder(this.pathname,e.getAbsolutePath()),this.pathname=e.getAbsolutePath(),!0)},u.prototype.renameTo=function(t){if(this.is_http)throw"IllegalMethod";var e=new u(t);if(this.isFile()){var r=this.fso.getFile(this.pathname),i=(2147483647*Math.random()&2147483647).toString(16);return r.Name=e.getName()+i,r.Name=e.getName(),this.pathname=e.getAbsolutePath(),!0}if(this.isDirectory()){var n=this.fso.getFolder(this.pathname),o=(2147483647*Math.random()&2147483647).toString(16);return n.Name=e.getName()+o,n.Name=e.getName(),this.pathname=e.getAbsolutePath(),!0}return!1},u.prototype.toString=function(){return this.getAbsolutePath()},u.prototype.getName=function(){if(this.is_http){if(this.isDirectory())return"";var t=this.pathname.split("/");return t[t.length-1]}return this.fso.GetFileName(this.pathname)},u.prototype.getParent=function(){var t=this.getAbsolutePath().match(/.*[/\\]/)[0];return t.substring(0,t.length-1)},u.prototype.getParentFile=function(){return new u(this.getParent())},u.prototype.getExtensionName=function(){if(this.is_http){var t=this.getName().split(".");return t[t.length-1]}return this.fso.GetExtensionName(this.pathname)},u.prototype.isAbsolute=function(){if(this.is_http)return this.getAbsolutePath()===this.pathname;var t=this.pathname.replace("/","\\");return this.fso.GetAbsolutePathName(this.pathname)===t},u.prototype.isDirectory=function(){return this.is_http?/\/$/.test(this.pathname):this.fso.FolderExists(this.pathname)},u.prototype.isFile=function(){return this.is_http?/[^/]$/.test(this.pathname):this.fso.FileExists(this.pathname)},u.prototype.isHidden=function(){if(this.is_http)throw"IllegalMethod";return this.isFile()?0!=(2&this.fso.getFile(this.pathname).Attributes):!!this.isDirectory()&&0!=(2&this.fso.getFolder(this.pathname).Attributes)},u.prototype.lastModified=function(){if(this.is_http)throw"IllegalMethod";return this.isFile()?new Date(this.fso.getFile(this.pathname).DateLastModified):this.isDirectory()?new Date(this.fso.getFolder(this.pathname).DateLastModified):null},u.prototype.setLastModified=function(t){if(this.is_http)throw"IllegalMethod";if(this.isFile()){var e=new ActiveXObject("Shell.Application").NameSpace(this.getParent()).ParseName(this.getName()),r=t.getFullYear()+"/"+(t.getMonth()+1)+"/"+t.getDate()+" "+t.getHours()+":"+t.getMinutes()+":"+t.getSeconds();return e.ModifyDate=r,!0}if(this.isDirectory())return!1},u.prototype.length=function(){if(this.is_http)throw"IllegalMethod";return this.isFile()?this.fso.getFile(this.pathname).Size:this.isDirectory()?this.fso.getFolder(this.pathname).Size:-1},u.prototype.getFiles=function(){if(this.is_http)throw"IllegalMethod";if(!this.isDirectory)return null;for(var t=[],e=new Enumerator(this.fso.getFolder(this.pathname).Files),r=0;!e.atEnd();e.moveNext())t[r++]=e.item().Name;return t},u.prototype.getSubFolders=function(){if(this.is_http)throw"IllegalMethod";if(!this.isDirectory)return null;for(var t=[],e=new Enumerator(this.fso.getFolder(this.pathname).SubFolders),r=0;!e.atEnd();e.moveNext())t[r++]=e.item().Name;return t},u.prototype.getNormalizedPathName=function(){if(""===this.pathname)return".\\";var t=this.pathname.replace(/\//g,"\\");return"\\"!==t.slice(-1)&&(t+="\\"),t},u.prototype.getAllFiles=function(){if(this.is_http)throw"IllegalMethod";if(!this.isDirectory)return null;var t,e,r=[],i=[],n=[],o=0;for(i[o]=this.getNormalizedPathName(),e=this.fso.getFolder(i[o]),t=new Enumerator(this.fso.getFolder(e).Files);!t.atEnd();t.moveNext())r.push(i[o]+t.item().Name);if(0===e.SubFolders.Count)return r;for(n[o]=new Enumerator(e.SubFolders),o++;;){for(i[o]=i[o-1]+n[o-1].item().Name,r.push(i[o]),i[o]+="\\",e=this.fso.getFolder(i[o]),t=new Enumerator(e.Files);!t.atEnd();t.moveNext())r.push(i[o]+t.item().Name);if(0===e.SubFolders.Count){for(;0!==o&&(n[o-1].moveNext(),n[o-1].atEnd());)o--;if(0===o)break}else n[o]=new Enumerator(e.SubFolders),o++}return r},u.prototype.list=function(){if(this.is_http)throw"IllegalMethod";if(!this.isDirectory)return null;for(var t=this.getFiles(),e=this.getSubFolders(),r=[],i=0;i<e.length;)r.push(e[i++]);for(var n=0;n<t.length;)r.push(t[n++]);return r},u.prototype.getAbsolutePath=function(){if(this.is_http){var t,e=this.pathname.match(/^http[^/]+\/\/[^/]+\//)[0],r=e,i=this.pathname.substr(e.length).split("/");for(t=0;t<i.length;t++)""!==i[t]&&"."!==i[t]&&(".."!==i[t]?(r+=i[t],t!==i.length-1&&(r+="/")):r=r.substring(0,r.length-1).match(/.*\//)[0]);return r}return this.fso.GetAbsolutePathName(this.pathname)},u.prototype.mkdir=function(){if(this.is_http)throw"IllegalMethod";var t=this.getAbsolutePath();if(this.fso.FileExists(t))return!1;if(this.fso.FolderExists(t))return!0;this.fso.CreateFolder(t);for(var e=0;e<200;e++){if(this.fso.FolderExists(t))return!0;WScript.Sleep(50)}return!1},u.prototype.mkdirs=function(){if(this.is_http)throw"IllegalMethod";for(var t=this.pathname.replace("/","\\").split("\\"),e="",r=0;r<t.length;r++){if(e+=t[r],!new u(e).mkdir())return!1;e+="\\"}return!0},u.prototype.run=function(t,e){if(this.is_http)throw"IllegalMethod";var r=void 0!==t?t:1,i=void 0!==e&&e;new ActiveXObject("WScript.Shell").Run(this.getAbsolutePath(),r,i)},u.prototype.writeLine=function(t){if(this.is_http)throw"IllegalMethod";var e;if(this.isFile()){e=this.fso.OpenTextFile(this.pathname,8)}else{if(this.isDirectory())return!1;e=this.fso.CreateTextFile(this.pathname,!0)}return e.WriteLine(t),e.Close(),!0},u.prototype.getTextFile=function(t){var e=void 0!==t?t:"_autodetect_all",r=null;if(/^htt/.test(this.pathname)){var i=u.createXMLHttpRequest();if(null===i)return null;i.open("GET",this.pathname,!1);try{i.send(null),r=i.responseText}catch(t){r="error"}}else if(/shift_jis|sjis|ascii|unicode|utf-16le/i.test(e)){var n=0;n=/ascii/i.test(e)?0:/shift_jis|sjis/i.test(e)?-2:-1;var o=this.fso.OpenTextFile(this.pathname,1,!0,n);r=o.ReadAll(),o.Close()}else{var s=new ActiveXObject("ADODB.Stream");if(s.type=2,s.charset=e,s.open(),s.loadFromFile(this.pathname),r=s.readText(-1),s.close(),"_autodetect_all"===e||"_autodetect"===e){var a="";if(1<r.length&&(65279===r.charCodeAt(0)?a="unicode":65534===r.charCodeAt(0)&&(a="unicodeFFFE")),2<r.length&&12539===r.charCodeAt(0)&&65407===r.charCodeAt(1)&&(a="utf-8"),3<r.length&&239===r.charCodeAt(0)&&187===r.charCodeAt(1)&&191===r.charCodeAt(2)&&(a="utf-8"),""!==a){var h=new ActiveXObject("ADODB.Stream");h.type=2,h.charset=a,h.open(),h.loadFromFile(this.pathname),r=h.readText(-1),h.close()}if(1<r.length&&48111===r.charCodeAt(0)){var l=new ActiveXObject("ADODB.Stream");l.type=2,l.charset="utf-8",l.open(),l.loadFromFile(this.pathname),r=l.readText(-1),l.close()}}}return null!==r?r.replace(/\r\n?|\n/g,"\n"):null},u.prototype.setTextFile=function(t,e,r,i){if(this.is_http)throw"IllegalMethod";var n=void 0!==e?e:"utf-8",o=void 0!==r?r:"\n",s=void 0===i||i;if(/shift_jis|sjis|ascii|unicode|utf-16le/i.test(n)){var a=0;a=/ascii/i.test(n)?0:/shift_jis|sjis/i.test(n)?-2:-1;var h=this.fso.OpenTextFile(this.pathname,2,!0,a);h.Write(t.replace(/\r\n?|\n/g,o)),h.Close()}else{var l;if((l=new ActiveXObject("ADODB.Stream")).type=2,l.charset=n,l.open(),l.writeText(t.replace(/\r\n?|\n/g,o)),/utf-8/.test(n.toLowerCase())&&!s){l.position=0,l.type=1,l.position=3;var u=l.read();l.close(),(l=new ActiveXObject("ADODB.Stream")).type=1,l.open(),l.write(u)}l.saveToFile(this.pathname,2),l.close()}return!0},u.prototype.getBinaryFile=function(){if(this.is_http)throw"IllegalMethod";var t={8364:128,8218:130,402:131,8222:132,8230:133,8224:134,8225:135,710:136,8240:137,352:138,8249:139,338:140,381:142,8216:145,8217:146,8220:147,8221:148,8226:149,8211:150,8212:151,732:152,8482:153,353:154,8250:155,339:156,382:158,376:159},e=new ActiveXObject("ADODB.Stream");e.type=2,e.charset="iso-8859-1",e.open(),e.loadFromFile(this.pathname);var r=e.readText(-1);e.close();for(var i=new Array(r.length),n=0;n<r.length;n++){var o=r.charCodeAt(n);i[n]=255<o?t[o]:o}return i},u.prototype.setBinaryFile=function(t){if(this.is_http)throw"IllegalMethod";var e=new ActiveXObject("ADODB.Stream");e.type=2,e.charset="iso-8859-1",e.open();for(var r=0;r<t.length;){for(var i=[],n=0;n<512&&r<t.length;n++,r++)i[n]=String.fromCharCode(t[r]);e.writeText(i.join(""))}e.saveToFile(this.pathname,2),e.close()},u.createXMLHttpRequest=function(){try{return new XMLHttpRequest}catch(t){var e,r=["WinHttp.WinHttpRequest.5.1","WinHttp.WinHttpRequest.5","WinHttp.WinHttpRequest","Msxml2.ServerXMLHTTP.6.0","Msxml2.ServerXMLHTTP.5.0","Msxml2.ServerXMLHTTP.4.0","Msxml2.ServerXMLHTTP.3.0","Msxml2.ServerXMLHTTP","Microsoft.ServerXMLHTTP","Msxml2.XMLHTTP.6.0","Msxml2.XMLHTTP.5.0","Msxml2.XMLHTTP.4.0","Msxml2.XMLHTTP.3.0","Msxml2.XMLHTTP","Microsoft.XMLHTTP"];for(e=0;e<r.length;e++)try{return new ActiveXObject(r[e])}catch(t){continue}return null}},u.createTempFile=function(){var t=new ActiveXObject("Scripting.FileSystemObject");return new u(t.GetSpecialFolder(2)+"\\"+t.GetTempName())},u.getCurrentDirectory=function(){var t=new ActiveXObject("WScript.Shell");return new u(t.CurrentDirectory)},u.setCurrentDirectory=function(t){var e=new u(t),r=WScript.CreateObject("WScript.Shell"),i=new ActiveXObject("Scripting.FileSystemObject");r.CurrentDirectory=i.getFolder(e.getAbsolutePath()).Name},u.searchFile=function(t){var e,r,i,n=new ActiveXObject("Scripting.FileSystemObject"),o=[],s=[],a=0;if("function"!=typeof t){var h=new u(t).getName();i=function(t,e){return t===h}}else i=t;for(o[a]=u.getCurrentDirectory().getNormalizedPathName(),r=n.getFolder(o[a]),e=new Enumerator(n.getFolder(r).Files);!e.atEnd();e.moveNext())if(i(e.item().Name,o[a]+e.item().Name))return new u(o[a]+e.item().Name);if(0===r.SubFolders.Count)return null;for(s[a]=new Enumerator(r.SubFolders),a++;;){for(o[a]=o[a-1]+s[a-1].item().Name+"\\",r=n.getFolder(o[a]),e=new Enumerator(r.Files);!e.atEnd();e.moveNext())if(i(e.item().Name,o[a]+e.item().Name))return new u(o[a]+e.item().Name);if(0===r.SubFolders.Count){for(;0!==a&&(s[a-1].moveNext(),s[a-1].atEnd());)a--;if(0===a)break}else s[a]=new Enumerator(r.SubFolders),a++}return null};function i(){}i.textf=function(){function N(t){if(0<=t)return t;var e=-t,r=~e>>16&65535;return(r*=65536)+(65535&~e)+1}var C=1,w=arguments;return w[0].replace(/%[^diubBoxXeEfFgGaAcspn%]*[diubBoxXeEfFgGaAcspn%]/g,function(t){var e,r=t.substring(1,t.length),i=(e=r.match(/.$/))[0];if("%"===i)return"%";null!==(e=r.match(/^[0-9]+\$/))&&(e=e[0],r=r.substring(e.length,r.length),e=e.substring(0,e.length-1),C=parseInt(e,10));var n=w[C];"string"!=typeof n&&"number"!=typeof n&&(n=n.toString()),C+=1;var o=!1,s=!1,a=!1,h="";null!==(e=r.match(/^[-+ #0]+/))&&(e=e[0],r=r.substring(e.length,r.length),-1!==e.indexOf("#")&&(o=!0),-1!==e.indexOf("-")&&(s=!0),-1!==e.indexOf(" ")&&(h=" "),-1!==e.indexOf("+")&&(h="+"),-1!==e.indexOf("0")&&(a=!0));var l=0;null!==(e=r.match(/^([0-9]+|\*)/))&&(e=e[0],r=r.substring(e.length,r.length),-1!==e.indexOf("*")?(l=n,n=w[C],C+=1):l=parseInt(e,10));var u=!1,p=0;null!==(e=r.match(/^(\.((-?[0-9]+)|\*)|\.)/))&&(e=e[0],r=r.substring(e.length,r.length),u=!0,-1!==e.indexOf("*")?(p=n,n=w[C],C+=1):p=1===e.length?0:(e=e.substring(1,e.length),parseInt(e,10))),null!==(e=r.match(/^hh|h|ll|l|L|z|j|t/))&&(r=r.substring(e.length,r.length));var f="",c=!1;switch(i.toLowerCase()){case"d":case"i":case"u":case"b":case"o":case"x":c=!0;case"e":case"f":case"g":var g,m="";switch(c?(isNaN(n)&&(n=parseInt(n,10)),n="d"===i||"i"===i?(n<0&&(h="-",n=-n),Math.floor(n)):0<=n?Math.floor(n):Math.ceil(n)):(isNaN(n)&&(n=parseFloat(n)),n<0&&(h="-",n=-n),u||(p=6)),i.toLowerCase()){case"d":case"i":f+=n.toString(10);break;case"u":f+=N(n).toString(10);break;case"b":f+=N(n).toString(2),o&&(m="0b");break;case"o":f+=N(n).toString(8),o&&(m="0");break;case"x":case"X":f+=N(n).toString(16),o&&(m="0x");break;case"e":f+=n.toExponential(p);break;case"f":f+=n.toFixed(p);break;case"g":0===p&&(p=1),f+=n.toPrecision(p),o||-1===f.indexOf(".")||(f=(f=f.replace(/\.?0+$/,"")).replace(/\.?0+e/,"e"))}if(c){if(u){g=p-f.length;for(var d=0;d<g;d++)f="0"+f}}else o&&-1===f.indexOf(".")&&(-1!==f.indexOf("e")?f=f.replace("e",".e"):f+=".");if(-1!==f.indexOf("e")){f=f.replace(/e[+-][0-9]{1,2}$/,function(t){var e=t.length;return 3===t.length?t.substring(0,e-1)+"00"+t.substring(e-1,e):t.substring(0,e-2)+"0"+t.substring(e-2,e)})}if(g=l-(f.length+m.length+h.length),s)for(var v=0;v<g;v++)f+=" ";if(a)for(var y=0;y<g;y++)f="0"+f;if(f=h+(f=m+f),!a&&!s)for(var S=0;S<g;S++)f=" "+f;i.toUpperCase()===i&&(f=f.toUpperCase());break;case"c":isNaN(n)||(n=String.fromCharCode(n));case"s":isNaN(n)||(n=n.toString(10)),f=n,u&&f.length>p&&(f=f.substring(0,p));var A=l-f.length;if(s)for(var x=0;x<A;x++)f+=" ";else for(var F=a?"0":" ",b=0;b<A;b++)f=F+f;break;case"%":f="%";break;case"p":case"n":f="(unsupported)"}return f})};function n(t){if(this.map={},void(this._size=0)!==t)if(t.map&&t._size){for(var e in t.map)this.map[e]=t.map[e];this._size=t._size}else if("object"==typeof t)for(var r in t)"string"==typeof r&&(this.map[r]=t[r])}n.prototype.getArray=function(){return this.clone().map},n.prototype.each=function(t){var e=!0;for(var r in this.map){var i=this.map[r];if(!1===t.call(i,r,i)){e=!1;break}}return e},n.prototype.toString=function(){var t="",e=0;for(var r in this.map)t+=r+"=>"+this.map[r],++e!==this._size&&(t+="\n");return t},n.prototype.containsKey=function(t){return void 0!==this.map[t]},n.prototype.containsValue=function(t){for(var e in this.map)if(this.map[e]===t)return!0;return!1},n.prototype.isEmpty=function(){return 0===this._size},n.prototype.clear=function(){this.map=[],this._size=0},n.prototype.clone=function(){var t=new n;for(var e in this.map)t.map[e]=this.map[e];return t._size=this._size,t},n.prototype.size=function(){return this._size},n.prototype.get=function(t){return this.map[t]},n.prototype.put=function(t,e){if(!1===this.containsKey(t))return this.map[t]=e,this._size=this._size+1,null;var r=this.map[t];return this.map[t]=e,r},n.prototype.putAll=function(t){var e;for(var r in e=t instanceof n?t.map:t)void 0===this.map[r]&&(this.map[r]=e[r],this._size=this._size+1)},n.prototype.remove=function(t){if(!1===this.containsKey(t))return null;var e=this.map[t];return delete this.map[t],this._size=this._size-1,e};function h(){}h.unsigned32=function(t){return t<0?2147483648+(2147483647&t):t},h.multiplication32=function(t,e){var r=(65535&t)*(65535&e),i=h.unsigned32(r);return i=h.unsigned32(i+((65535&(r=(65535&t)*(e>>>16)))<<16)),4294967295&(i=h.unsigned32(i+((65535&(r=(t>>>16)*(65535&e)))<<16)))};function o(t){this.x=[];for(var e=0;e<521;e++)this.x[e]=0;if(1<=arguments.length)this.setSeed(t);else{var r=(new Date).getTime()+o.seedUniquifier&4294967295;o.seedUniquifier=o.seedUniquifier+1&4294967295,this.setSeed(r)}}o.prototype._rnd521=function(){for(var t=this.x,e=0;e<32;e++)t[e]^=t[e+489];for(var r=32;r<521;r++)t[r]^=t[r-32]},o.prototype.setSeed=function(t){for(var e=0,r=this.x,i=t,n=0;n<=16;n++){for(var o=0;o<32;o++)e=(e>>>1)+((i=h.multiplication32(i,1566083941)+1)<0?2147483648:0);r[n]=e}for(var s=16;s<521;s++)e=16===s?s:s-17,r[s]=r[e]<<23&4294967295^r[s-16]>>>9^r[s-1];for(var a=0;a<4;a++)this._rnd521();this.xi=0,this.haveNextNextGaussian=!1,this.nextNextGaussian=0},o.prototype.genrand_int32=function(){521===this.xi&&(this._rnd521(),this.xi=0);var t=h.unsigned32(this.x[this.xi]);return this.xi=this.xi+1,t},o.prototype.next=function(t){return 0===t?0:32===t?this.genrand_int32():t<32?this.genrand_int32()>>>32-t:63===t?2147483648*this.next(32)+this.next(32):64===t?4294967296*this.next(32)+this.next(32):t<64?this.genrand_int32()*(1<<t-32)+(this.genrand_int32()>>>64-t):void 0},o.prototype.nextBytes=function(t){for(var e=new Array(t),r=0;r<e.length;r++)e[r]=this.next(8);return e},o.prototype.nextShort=function(){return this.next(16)},o.prototype.nextInt=function(t){if(void 0===t||"number"!=typeof t)return 4294967295&this.next(32);for(var e,r;r=(e=h.unsigned32(this.genrand_int32()))%t,4294967296<e-r+t;);return r},o.prototype.nextLong=function(){return this.next(64)},o.prototype.nextBoolean=function(){return 0!==this.next(1)},o.prototype.nextFloat=function(){return this.next(24)/16777216},o.prototype.nextDouble=function(){return(134217728*this.next(26)+this.next(27))/9007199254740992},o.prototype.nextGaussian=function(){if(this.haveNextNextGaussian)return this.haveNextNextGaussian=!1,this.nextNextGaussian;var t=Math.sqrt(-2*Math.log(this.nextDouble())),e=2*Math.PI*this.nextDouble(),r=t*Math.sin(e);return this.nextNextGaussian=t*Math.cos(e),this.haveNextNextGaussian=!0,r},o.seedUniquifier=2271560481;function a(){}var s=/wscript\.exe$/i.test(WSH.FullName),l=/cscript\.exe$/i.test(WSH.FullName),p={out:{print:function(t){var e=t.toString();l?WSH.StdOut.Write(e):WScript.Echo(e)},println:function(t){var e=t.toString();l?WSH.StdOut.Write(e+"\n"):WScript.Echo(e)},printf:function(){for(var t=arguments,e=[],r=0;r<arguments.length;r++)e[r]=t[r],0===r&&(e[r]=e[r].toString());p.out.println(i.textf.apply(this,e))}},readLine:function(){return WScript.StdIn.ReadLine()},currentTimeMillis:function(){return(new Date).getTime()},sleep:function(t){WScript.Sleep(1e3*t|0)},stop:function(){for(;;)WScript.Sleep(1e3)},executeOnCScript:function(t){var e=void 0!==t&&t;if(s){var r=WScript.CreateObject("WScript.Shell"),i=[],n=WScript.Arguments;i.push('"C:\\Windows\\System32\\cscript.exe"'),i.push("//NoLogo"),e&&i.push("//E:{16d51579-a30b-4c8b-a276-0ff4dc41e755}"),i.push('"'+WSH.ScriptFullName+'"');for(var o=0;o<n.length;o++)i.push('"'+n(o)+'"');r.Run(i.join(" ")),WSH.Quit()}},executeOnWScript:function(){if(l){var t=WScript.CreateObject("WScript.Shell"),e=[],r=WScript.Arguments;e.push('"C:\\Windows\\System32\\wscript.exe"'),e.push('"'+WSH.ScriptFullName+'"');for(var i=0;i<r.length;i++)e.push('"'+r(i)+'"');t.Run(e.join(" ")),WSH.Quit()}},getArguments:function(){for(var t=[],e=0;e<WScript.Arguments.length;e++)t[e]=WScript.Arguments(e);return t},setCurrentDirectory:function(t){new ActiveXObject("WScript.Shell").CurrentDirectory=t.toString()},getCurrentDirectory:function(){return new ActiveXObject("WScript.Shell").CurrentDirectory},getScriptDirectory:function(){var t=WSH.ScriptFullName.match(/.*\\/)[0];return t.substring(0,t.length-1)},initializeCurrentDirectory:function(){new ActiveXObject("WScript.Shell").CurrentDirectory=p.getScriptDirectory()}};a.replaceAll=function(t,e,r){var i=new RegExp(e.replace(/([\\/*+.?{}()[\]^$\-|])/g,"\\$1"),"g"),n=r.replace(/\$/g,"$$$$");return t.replace(i,n)},a.trim=function(t){return t.replace(/^\s+|\s+$/g,"")},a.each=function(t,e){for(var r=!0,i=this.length,n=0;n<i;n=a.offsetByCodePoints(t,n,1)){var o=a.codePointAt(t,n),s=a.fromCodePoint(o);if(!1===e.call(e,n,s,o)){r=!1;break}}return r},a.isHighSurrogateAt=function(t,e){var r=t.charCodeAt(e);return 55296<=r&&r<=56319},a.isLowSurrogateAt=function(t,e){var r=t.charCodeAt(e);return 56320<=r&&r<=57343},a.isSurrogatePairAt=function(t,e){var r=t.charCodeAt(e);return 55296<=r&&r<=57343},a.codePointAt=function(t,e){var r=void 0!==e?e:0;return a.isHighSurrogateAt(t,r)?65536+(t.charCodeAt(r)-55296<<10|t.charCodeAt(r+1)-56320):t.charCodeAt(r)},a.codePointBefore=function(t,e){return a.isLowSurrogateAt(t,e-1)?t.codePointAt(e-2):t.charCodeAt(e-1)},a.codePointCount=function(t,e,r){for(var i=void 0!==r?r:t.length,n=0;e<i;0)n++,a.isSurrogatePairAt(t,e)&&i++;return n},a.offsetByCodePoints=function(t,e,r){var i=0,n=r,o=e;if(0===n)return o;if(0<n){for(;o<t.length;o++)if(i++,a.isHighSurrogateAt(t,o)&&o++,i===n)return o+1}else for(n=-n;0<=o;o--)if(i++,a.isLowSurrogateAt(t,o-1)&&o--,i===n)return o-1;throw"error offsetByCodePoints"},a.toUTF16ArrayfromCodePoint=function(t){var e=arguments,r=[],i=[];if(t.length)i=t;else for(var n=0;n<arguments.length;n++)i[n]=e[n];for(var o=0;o<i.length;o++){var s=i[o];if(65536<=s){var a=55296+(s-65536>>10),h=56320+(1023&s);r.push(a),r.push(h)}else r.push(s)}return r},a.fromCodePoint=function(t){var e=arguments,r=null;if(t instanceof Array)r=a.toUTF16ArrayfromCodePoint(t);else{for(var i=[],n=0;n<arguments.length;n++)i[n]=e[n];r=a.toUTF16ArrayfromCodePoint(i)}for(var o=[],s=0;s<r.length;s++)o[o.length]=String.fromCharCode(r[s]);return o.join("")},a.startsWith=function(t,e){return 0===t.indexOf(e)},a.endsWith=function(t,e){return!(t.length<e.length)&&t.indexOf(e)===t.length-e.length},ArrayList=f,CSV=t,Dialog=e,SFile=u,Format=i,HashMap=n,Random=o,System=p,console={log:function(t){System.out.println(t)}},String.prototype.replaceAll=function(t,e){return a.replaceAll(this,t,e)},String.prototype.trim=function(){return a.trim(this)},String.prototype.each=function(t){return a.each(this,t)},String.prototype.isHighSurrogateAt=function(t){return a.isHighSurrogateAt(this,t)},String.prototype.isLowSurrogateAt=function(t){return a.isLowSurrogateAt(this,t)},String.prototype.isSurrogatePairAt=function(t){return a.isSurrogatePairAt(this,t)},String.prototype.codePointAt=function(t){return a.codePointAt(this,t)},String.prototype.codePointBefore=function(t){return a.codePointBefore(this,t)},String.prototype.codePointCount=function(t,e){return a.codePointCount(this,t,e)},String.prototype.offsetByCodePoints=function(t,e){return a.codePointoffsetByCodePointsCount(this,t,e)},String.fromCodePoint=function(t){return a.fromCodePoint(t)},String.prototype.startsWith=function(t){return a.startsWith(this,t)},String.prototype.endsWith=function(t){return a.endsWith(this,t)}});
