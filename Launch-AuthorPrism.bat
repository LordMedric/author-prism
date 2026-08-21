@echo off
title Author Prism
cd /d "%~dp0"
set PATH=C:\Program Files\nodejs;%PATH%
echo Starting Author Prism Desktop App...
start "" "%~dp0node_modules\.bin\concurrently.cmd" -k "npm run dev" "wait-on http://localhost:3000 && electron ."
exit
