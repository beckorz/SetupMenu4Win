Set w = CreateObject("Wscript.Shell")
w.Run w.ExpandEnvironmentStrings("%windir%\system32\mshta.exe") & " """ & w.CurrentDirectory & "\" & replace(WScript.ScriptName,"vbs","hta") & """", 0, false 
