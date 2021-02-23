Option Explicit
Const ForReading = 1
Const ForWriting = 2 


Dim objArgs, strArg

Function FixCharset(filename, sFind)
   Dim fso, folder, f1, fc, contents
   Set fso = CreateObject("Scripting.FileSystemObject")
   Set f1 = fso.OpenTextFile(filename, ForReading)
   contents = f1.ReadAll()
   f1.Close
   contents = sFind & Replace( contents, sFind, "" ) 
   Set f1 = fso.OpenTextFile(filename, ForWriting, True)
   f1.Write contents
   f1.Close
End Function

FixCharset "components.css", "@charset ""windows-1251"";"

