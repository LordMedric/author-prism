@echo off
title Install Author Prism Desktop Shortcut
setlocal
cd /d "%~dp0"

echo Creating Desktop Shortcut for Author Prism...

powershell -NoProfile -ExecutionPolicy Bypass -Command "$ws = New-Object -ComObject WScript.Shell; $s = $ws.CreateShortcut([System.IO.Path]::Combine([Environment]::GetFolderPath('Desktop'), 'Author Prism.lnk')); $s.TargetPath = '%~dp0Launch-AuthorPrism.bat'; $s.WorkingDirectory = '%~dp0'; $s.Description = 'Author Prism Academic & Strategic Writing Studio'; $s.Save()"

echo.
echo =======================================================
echo   Author Prism Desktop Shortcut created successfully!
echo   You can now launch Author Prism directly from your
echo   Windows Desktop by double-clicking the icon.
echo =======================================================
echo.
pause
